import os
import re
import sys
import asyncio
from typing import List, Dict, Any, Optional
from concurrent.futures import ThreadPoolExecutor

import pandas as pd
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from apify_client import ApifyClient

# ------------------------------------------------------------------------------
# 1. Configuration & Client
# ------------------------------------------------------------------------------
APIFY_TOKEN = os.getenv("APIFY_TOKEN", "")
client = ApifyClient(APIFY_TOKEN)


# ------------------------------------------------------------------------------
# 2. Pydantic Schemas
# ------------------------------------------------------------------------------
class ProductCard(BaseModel):
    id: str
    title: str
    image_url: Optional[str] = None
    product_url: str
    price: Optional[str] = "N/A"
    rating: float
    platform: str


class UnifiedReview(BaseModel):
    id: str
    platform: str
    author: str
    rating: float
    title: Optional[str] = ""
    text: str
    date: Optional[str] = ""
    verified: bool = False
    helpful_count: int = 0
    sentiment_label: str = "Neutral"
    product_url: Optional[str] = None
    image_url: Optional[str] = None


class ChatRequest(BaseModel):
    session_id: str = Field(..., description="Unique ID to track conversation history")
    message: str = Field(..., description="User message or search query")
    platforms: Optional[List[str]] = Field(
        default=None, 
        description="Optional platform filter: e.g. ['amazon'], ['google'], or ['trustpilot']."
    )


class ChatResponse(BaseModel):
    session_id: str
    chatbot_message: str
    products: List[ProductCard]
    total_reviews: int
    reviews: List[UnifiedReview]


class AnalysisRequest(BaseModel):
    session_id: str
    product_id_or_title: str = Field(..., description="The specific product selected by user")


class ProductAnalysisReport(BaseModel):
    product_title: str
    image_url: Optional[str] = None
    overall_verdict: str
    average_rating: float
    total_reviews_analyzed: int
    sentiment_breakdown: Dict[str, int]
    pros: List[str]
    cons: List[str]
    platform_breakdown: Dict[str, int]
    detailed_summary: str
    reviews_included: List[UnifiedReview]


# ------------------------------------------------------------------------------
# 3. Session Memory Service
# ------------------------------------------------------------------------------
class SessionMemory:
    def __init__(self):
        self.sessions: Dict[str, Dict[str, Any]] = {}

    def get_or_create_session(self, session_id: str) -> Dict[str, Any]:
        if session_id not in self.sessions:
            self.sessions[session_id] = {
                "history": [],
                "products": [],
                "reviews": [],
                "excluded_product_ids": set(),
                "last_query": ""
            }
        return self.sessions[session_id]

    def add_message(self, session_id: str, sender: str, text: str):
        session = self.get_or_create_session(session_id)
        session["history"].append({"sender": sender, "text": text})

    def exclude_current_products(self, session_id: str):
        session = self.get_or_create_session(session_id)
        for prod in session["products"]:
            session["excluded_product_ids"].add(prod.id)
        session["products"] = []

    def update_session_data(self, session_id: str, new_products: List[ProductCard], new_reviews: List[UnifiedReview]):
        session = self.get_or_create_session(session_id)
        
        filtered_new_products = [
            p for p in new_products 
            if p.id not in session["excluded_product_ids"]
        ]

        existing_p_ids = {p.id for p in session["products"]}
        for p in filtered_new_products:
            if p.id not in existing_p_ids:
                session["products"].append(p)
                existing_p_ids.add(p.id)

        existing_r_fps = {r.text[:100].lower() for r in session["reviews"] if r.text}
        for r in new_reviews:
            if not r.text:
                continue
            fp = r.text[:100].lower()
            if fp not in existing_r_fps:
                session["reviews"].append(r)
                existing_r_fps.add(fp)

    def get_product_by_identifier(self, session_id: str, identifier: str) -> Optional[ProductCard]:
        session = self.get_or_create_session(session_id)
        identifier_lower = identifier.lower().strip()

        for p in session["products"]:
            if p.id.lower() == identifier_lower:
                return p
        
        for p in session["products"]:
            if identifier_lower in p.title.lower():
                return p

        return None


memory_manager = SessionMemory()


# ------------------------------------------------------------------------------
# 4. Scraper & Logic Utilities
# ------------------------------------------------------------------------------
def is_rejection_query(text: str) -> bool:
    triggers = [
        "not anyone of these", "none of these", "different", "other options",
        "show more", "something else", "don't like these", "next set", "reject"
    ]
    lowered = text.lower()
    return any(t in lowered for t in triggers)


def extract_dataset_id(run: Any) -> Optional[str]:
    if hasattr(run, "default_dataset_id") and getattr(run, "default_dataset_id"):
        return getattr(run, "default_dataset_id")
    if hasattr(run, "defaultDatasetId") and getattr(run, "defaultDatasetId"):
        return getattr(run, "defaultDatasetId")
    if isinstance(run, dict):
        return run.get("default_dataset_id") or run.get("defaultDatasetId")
    return None


def derive_sentiment(rating: float, text: str) -> str:
    if rating >= 4.0:
        return "Positive"
    elif 0.0 < rating <= 2.0:
        return "Negative"
    
    text_lower = text.lower()
    pos_words = ["great", "excellent", "amazing", "love", "best", "good", "awesome", "perfect"]
    neg_words = ["bad", "terrible", "worst", "horrible", "avoid", "poor", "waste", "broken"]
    
    pos_count = sum(1 for w in pos_words if w in text_lower)
    neg_count = sum(1 for w in neg_words if w in text_lower)
    
    if pos_count > neg_count:
        return "Positive"
    elif neg_count > pos_count:
        return "Negative"
    return "Neutral"


def fetch_amazon_products(query: str, page_offset: int = 1) -> List[Dict[str, Any]]:
    actor_id = "simpleapi/amazon-product-scraper"
    search_url = f"https://www.amazon.com/s?k={query.strip().replace(' ', '+')}&page={page_offset}"
    actor_input = {"searchUrls": [search_url], "maxResultsPerKeyword": 10}
    products = []
    
    try:
        run = client.actor(actor_id).call(run_input=actor_input)
        if run:
            dataset_id = extract_dataset_id(run)
            if dataset_id:
                items = client.dataset(dataset_id).list_items().items
                for idx, item in enumerate(items):
                    img = item.get("imageUrl") or item.get("thumbnail") or item.get("image")
                    if isinstance(img, list) and len(img) > 0:
                        img = img[0]

                    url = item.get("url") or item.get("productUrl")
                    asin = item.get("asin")
                    if not url and asin:
                        url = f"https://www.amazon.com/dp/{asin}"

                    if url and item.get("title"):
                        products.append({
                            "id": str(asin or f"amz-prod-p{page_offset}-{idx}"),
                            "title": item.get("title"),
                            "image_url": img,
                            "product_url": url,
                            "price": str(item.get("price") or "N/A"),
                            "rating": float(item.get("stars") or 0.0),
                            "platform": "Amazon"
                        })
    except Exception as e:
        print(f"[-] Amazon product scrape error: {e}")

    return products


def execute_and_normalize(platform: str, actor_id: str, actor_input: dict, default_url: str = None, default_img: str = None) -> List[UnifiedReview]:
    try:
        run = client.actor(actor_id).call(run_input=actor_input)
        if not run:
            return []
        dataset_id = extract_dataset_id(run)
        if not dataset_id:
            return []

        raw_items = client.dataset(dataset_id).list_items().items
        unwrapped = []
        for item in raw_items:
            if isinstance(item, dict):
                nested = item.get("reviews") or item.get("userReviews")
                if isinstance(nested, list) and len(nested) > 0:
                    unwrapped.extend([r for r in nested if isinstance(r, dict)])
                else:
                    unwrapped.append(item)

        reviews = []
        for i, item in enumerate(unwrapped):
            text = (item.get("text") or item.get("reviewDescription") or item.get("body") or "").strip()
            rating = float(item.get("rating") or item.get("stars") or 0.0)

            if not text and rating == 0.0:
                continue

            author = item.get("author") or item.get("name") or "Anonymous"
            if isinstance(author, dict):
                author = author.get("name", "Anonymous")

            p_names = {"google": "Google Maps", "amazon": "Amazon", "trustpilot": "Trustpilot"}
            p_url = item.get("productUrl") or item.get("url") or default_url
            img_url = item.get("imageUrl") or item.get("thumbnail") or default_img

            reviews.append(
                UnifiedReview(
                    id=str(item.get("reviewId") or item.get("id") or f"{platform}-{i}"),
                    platform=p_names.get(platform, platform.title()),
                    author=str(author),
                    rating=rating,
                    title=(item.get("title") or item.get("reviewTitle") or "").strip(),
                    text=text,
                    date=str(item.get("publishedAtDate") or item.get("date") or ""),
                    verified=bool(item.get("isVerified") or platform == "google"),
                    helpful_count=int(item.get("helpfulVotesCount") or 0),
                    sentiment_label=derive_sentiment(rating, text),
                    product_url=str(p_url) if p_url else None,
                    image_url=str(img_url) if img_url else None
                )
            )
        return reviews
    except Exception as e:
        print(f"[-] Execution error on {platform}: {e}")
        return []


def fetch_google_reviews(query: str, limit: int = 5) -> List[UnifiedReview]:
    actor_id = "compass/crawler-google-places"
    actor_input = {
        "searchStringsArray": [f"{query} store", f"{query} location"],
        "maxCrawledPlacesPerSearch": 1,
        "maxReviews": limit,
        "language": "en"
    }
    return execute_and_normalize("google", actor_id, actor_input)


def fetch_amazon_reviews(products: List[Dict[str, Any]], query: str, limit: int = 5) -> List[UnifiedReview]:
    if not products:
        return []

    actor_id = "junglee/amazon-reviews-scraper"
    actor_input = {
        "productUrls": [{"url": p["product_url"]} for p in products[:3]],
        "maxReviews": limit,
        "sort": "helpful"
    }
    return execute_and_normalize("amazon", actor_id, actor_input, default_url=products[0]["product_url"], default_img=products[0].get("image_url"))


def fetch_trustpilot_reviews(query: str, limit: int = 5) -> List[UnifiedReview]:
    actor_id = "moxymotion/trustpilot-scraper"
    clean_domain = re.sub(r'[^a-zA-Z0-9]', '', query).lower()
    if not clean_domain.endswith(".com"):
        clean_domain = f"{clean_domain}.com"

    target_url = f"https://www.trustpilot.com/review/{clean_domain}"
    actor_input = {
        "searchQuery": query,
        "startUrls": [{"url": target_url}],
        "maxItems": limit
    }
    return execute_and_normalize("trustpilot", actor_id, actor_input, default_url=target_url)


def generate_deep_product_analysis(product: ProductCard, all_reviews: List[UnifiedReview]) -> ProductAnalysisReport:
    product_reviews = [
        r for r in all_reviews 
        if (r.product_url and product.product_url and product.product_url in r.product_url)
        or (product.title.lower()[:15] in r.text.lower())
    ]

    if not product_reviews:
        product_reviews = all_reviews

    total_count = len(product_reviews)
    avg_rating = round(sum(r.rating for r in product_reviews) / max(total_count, 1), 2) if total_count > 0 else product.rating

    sentiment_counts = {"Positive": 0, "Neutral": 0, "Negative": 0}
    platform_counts = {}

    for r in product_reviews:
        sentiment_counts[r.sentiment_label] = sentiment_counts.get(r.sentiment_label, 0) + 1
        platform_counts[r.platform] = platform_counts.get(r.platform, 0) + 1

    pos_reviews = [r for r in product_reviews if r.sentiment_label == "Positive"]
    neg_reviews = [r for r in product_reviews if r.sentiment_label == "Negative"]

    pros = [r.title if r.title else r.text[:80] + "..." for r in pos_reviews[:3]]
    cons = [r.title if r.title else r.text[:80] + "..." for r in neg_reviews[:3]]

    if avg_rating >= 4.3 and sentiment_counts["Positive"] >= sentiment_counts["Negative"]:
        verdict = "BUY - Highly Recommended"
    elif avg_rating >= 3.5:
        verdict = "RECOMMENDED WITH CAVEATS"
    else:
        verdict = "CAUTION - High ratio of negative feedback"

    detailed_summary = (
        f"Analyzed {total_count} user reviews for '{product.title}'. "
        f"Average score is {avg_rating}/5. "
        f"{round((sentiment_counts['Positive']/max(total_count,1))*100)}% of feedback is positive."
    )

    return ProductAnalysisReport(
        product_title=product.title,
        image_url=product.image_url,
        overall_verdict=verdict,
        average_rating=avg_rating,
        total_reviews_analyzed=total_count,
        sentiment_breakdown=sentiment_counts,
        pros=pros,
        cons=cons,
        platform_breakdown=platform_counts,
        detailed_summary=detailed_summary,
        reviews_included=product_reviews
    )


# ------------------------------------------------------------------------------
# 5. FastAPI Engine
# ------------------------------------------------------------------------------
app = FastAPI(title="Unified Review Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "online"}

@app.post("/api/chat", response_model=ChatResponse)
async def continue_chat(req: ChatRequest):
    if not APIFY_TOKEN:
        raise HTTPException(
            status_code=503,
            detail="APIFY_TOKEN is not configured. Set it in the backend environment before searching live data."
        )

    session_id = req.session_id
    user_msg = req.message.strip()

    session = memory_manager.get_or_create_session(session_id)
    supported_platforms = {"amazon", "google", "trustpilot"}
    platform_aliases = {"google maps": "google", "trust pilot": "trustpilot"}
    requested_platforms = [
        platform_aliases.get(p.lower().strip(), p.lower().strip())
        for p in req.platforms
    ] if req.platforms else []
    target_platforms = [p for p in requested_platforms if p in supported_platforms] or ["amazon", "google", "trustpilot"]

    if is_rejection_query(user_msg):
        memory_manager.exclude_current_products(session_id)
        search_query = session.get("last_query") or user_msg
        page_offset = 2
    else:
        search_query = user_msg
        session["last_query"] = user_msg
        page_offset = 1

    memory_manager.add_message(session_id, "user", user_msg)

    product_cards: List[ProductCard] = []
    amazon_products_raw: List[Dict[str, Any]] = []

    if "amazon" in target_platforms:
        amazon_products_raw = fetch_amazon_products(search_query, page_offset=page_offset)
        product_cards = [
            ProductCard(
                id=p["id"],
                title=p["title"],
                image_url=p["image_url"],
                product_url=p["product_url"],
                price=p["price"],
                rating=p["rating"],
                platform=p["platform"]
            )
            for p in amazon_products_raw
        ]

    loop = asyncio.get_event_loop()
    tasks = []

    with ThreadPoolExecutor(max_workers=3) as pool:
        if "google" in target_platforms:
            tasks.append(("google", loop.run_in_executor(pool, fetch_google_reviews, search_query, 5)))
        if "amazon" in target_platforms:
            tasks.append(("amazon", loop.run_in_executor(pool, fetch_amazon_reviews, amazon_products_raw, search_query, 5)))
        if "trustpilot" in target_platforms:
            tasks.append(("trustpilot", loop.run_in_executor(pool, fetch_trustpilot_reviews, search_query, 5)))

        fetched_reviews: List[UnifiedReview] = []
        if tasks:
            results = await asyncio.gather(*[t[1] for t in tasks], return_exceptions=True)
            for res in results:
                if isinstance(res, list):
                    fetched_reviews.extend(res)

    memory_manager.update_session_data(session_id, product_cards, fetched_reviews)
    session_data = memory_manager.get_or_create_session(session_id)

    platforms_searched_str = ", ".join([p.capitalize() for p in target_platforms])
    if not product_cards and not fetched_reviews:
        bot_msg = (
            f"No live results were returned for '{search_query}'. "
            f"The connected scrapers returned no data across ({platforms_searched_str}); "
            "check the backend terminal and your APIFY_TOKEN."
        )
    else:
        bot_msg = f"Fetched live results for '{search_query}' across ({platforms_searched_str})."
    memory_manager.add_message(session_id, "assistant", bot_msg)

    return ChatResponse(
        session_id=session_id,
        chatbot_message=bot_msg,
        products=session_data["products"],
        total_reviews=len(session_data["reviews"]),
        reviews=session_data["reviews"]
    )


@app.post("/api/analyze", response_model=ProductAnalysisReport)
async def analyze_product(req: AnalysisRequest):
    session_data = memory_manager.get_or_create_session(req.session_id)
    target_product = memory_manager.get_product_by_identifier(req.session_id, req.product_id_or_title)

    if not target_product:
        raise HTTPException(
            status_code=404, 
            detail=f"Product '{req.product_id_or_title}' not found. Perform a search first."
        )

    return generate_deep_product_analysis(target_product, session_data["reviews"])


# ------------------------------------------------------------------------------
# 6. Streamlit Frontend Engine
# ------------------------------------------------------------------------------
def run_streamlit_app():
    import streamlit as st
    import plotly.express as px

    st.set_page_config(page_title="Product & Review Intelligence Dashboard", layout="wide")

    API_BASE_URL = "http://127.0.0.1:8000"

    # Persistent Session State
    if "session_id" not in st.session_state:
        st.session_state.session_id = f"st-session-{os.urandom(4).hex()}"
    if "products" not in st.session_state:
        st.session_state.products = []
    if "reviews" not in st.session_state:
        st.session_state.reviews = []
    if "selected_product_id" not in st.session_state:
        st.session_state.selected_product_id = None
    if "analysis_report" not in st.session_state:
        st.session_state.analysis_report = None

    st.title("🛒 Product Review Intelligence & Analytics Hub")

    # --- Sidebar Filters & Controls ---
    st.sidebar.header("Search & Scraper Settings")
    
    selected_platforms = st.sidebar.multiselect(
        "Target Platforms",
        options=["amazon", "google", "trustpilot"],
        default=["amazon", "google", "trustpilot"]
    )

    query_input = st.sidebar.text_input("Product Search Query", placeholder="e.g. Wireless Noise Cancelling Headphones")
    
    col_search, col_reject = st.sidebar.columns(2)
    
    search_clicked = col_search.button("🔍 Search")
    reject_clicked = col_reject.button("🔄 Show Others")

    if search_clicked and query_input:
        with st.spinner("Scraping live product and review data..."):
            try:
                resp = requests.post(
                    f"{API_BASE_URL}/api/chat",
                    json={
                        "session_id": st.session_state.session_id,
                        "message": query_input,
                        "platforms": selected_platforms
                    }
                )
                if resp.status_code == 200:
                    data = resp.json()
                    st.session_state.products = data.get("products", [])
                    st.session_state.reviews = data.get("reviews", [])
                    st.session_state.analysis_report = None
                    st.success(f"Found {len(st.session_state.products)} products & {data.get('total_reviews')} reviews!")
                else:
                    st.error("Failed to retrieve search data.")
            except Exception as e:
                st.error(f"Backend offline or unreachable. Ensure API is running. Error: {e}")

    if reject_clicked:
        with st.spinner("Filtering out current options & finding fresh alternatives..."):
            try:
                resp = requests.post(
                    f"{API_BASE_URL}/api/chat",
                    json={
                        "session_id": st.session_state.session_id,
                        "message": "not anyone of these",
                        "platforms": selected_platforms
                    }
                )
                if resp.status_code == 200:
                    data = resp.json()
                    st.session_state.products = data.get("products", [])
                    st.session_state.reviews = data.get("reviews", [])
                    st.session_state.analysis_report = None
                    st.success("Loaded new non-overlapping product alternatives!")
            except Exception as e:
                st.error(f"Connection error: {e}")

    # --- Main Content Area ---
    if not st.session_state.products:
        st.info("👈 Enter a search term in the sidebar to retrieve products and live analytics.")
        return

    st.subheader("1. Discovered Products")
    
    # Display products in responsive grid
    cols = st.columns(min(len(st.session_state.products), 3))
    for idx, prod in enumerate(st.session_state.products):
        with cols[idx % 3]:
            st.markdown(f"### {prod['title'][:40]}...")
            if prod.get("image_url"):
                st.image(prod["image_url"], use_container_width=True)
            st.write(f"**Price:** {prod.get('price', 'N/A')}")
            st.write(f"**Rating:** {prod.get('rating')} ⭐ ({prod.get('platform')})")
            
            if st.button(f"📊 Analyze This Item", key=f"btn_{prod['id']}"):
                st.session_state.selected_product_id = prod["id"]
                with st.spinner("Generating sentiment analysis & metric report..."):
                    resp = requests.post(
                        f"{API_BASE_URL}/api/analyze",
                        json={
                            "session_id": st.session_state.session_id,
                            "product_id_or_title": prod["id"]
                        }
                    )
                    if resp.status_code == 200:
                        st.session_state.analysis_report = resp.json()

    # --- Deep Product Analysis Section ---
    if st.session_state.analysis_report:
        report = st.session_state.analysis_report
        st.divider()
        st.header(f"📈 Analytics Report: {report['product_title']}")

        # Metric Cards Top Row
        m1, m2, m3, m4 = st.columns(4)
        m1.metric("Overall Verdict", report["overall_verdict"])
        m2.metric("Average Score", f"{report['average_rating']} / 5.0")
        m3.metric("Total Reviews Analyzed", report["total_reviews_analyzed"])
        m4.metric("Positive Ratio", f"{report['sentiment_breakdown'].get('Positive', 0)} Positives")

        st.markdown(f"> **Summary:** {report['detailed_summary']}")

        # Charts Section
        c1, c2 = st.columns(2)

        # Sentiment Breakdown Donut Chart
        with c1:
            st.subheader("Sentiment Distribution")
            sent_df = pd.DataFrame(
                list(report["sentiment_breakdown"].items()), 
                columns=["Sentiment", "Count"]
            )
            fig_sent = px.pie(
                sent_df, 
                names="Sentiment", 
                values="Count", 
                hole=0.4,
                color="Sentiment",
                color_discrete_map={"Positive": "#2ecc71", "Neutral": "#f1c40f", "Negative": "#e74c3c"}
            )
            st.plotly_chart(fig_sent, use_container_width=True)

        # Platform Source Distribution Bar Chart
        with c2:
            st.subheader("Reviews by Platform")
            plat_df = pd.DataFrame(
                list(report["platform_breakdown"].items()), 
                columns=["Platform", "Review Count"]
            )
            fig_plat = px.bar(
                plat_df, 
                x="Platform", 
                y="Review Count", 
                color="Platform",
                text_auto=True
            )
            st.plotly_chart(fig_plat, use_container_width=True)

        # Pros and Cons
        p_col, c_col = st.columns(2)
        with p_col:
            st.success("### Pros Identified")
            for pro in report.get("pros", []):
                st.write(f"✓ {pro}")
        with c_col:
            st.error("### Cons Identified")
            for con in report.get("cons", []):
                st.write(f"✗ {con}")

        # Full Filterable Review Table
        st.subheader("Raw Review Records")
        raw_revs = report.get("reviews_included", [])
        if raw_revs:
            df_revs = pd.DataFrame(raw_revs)
            st.dataframe(
                df_revs[["platform", "author", "rating", "sentiment_label", "title", "text"]],
                use_container_width=True
            )


# Entry point logic
if __name__ == "__main__":
    if "streamlit" in sys.modules or os.environ.get("STREAMLIT_RUNNING") == "1":
        run_streamlit_app()
    else:
        import uvicorn
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)