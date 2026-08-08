export interface ReviewSnippet {
  id: string;
  platform: 'Amazon' | 'Trustpilot' | 'Google Maps' | 'Shopify' | 'Yelp' | 'G2';
  rating: number;
  text: string;
  date: string;
  author: string;
}

export interface PlatformStat {
  platform: 'Amazon' | 'Trustpilot' | 'Google Maps' | 'Shopify' | 'Yelp' | 'G2';
  reviewCount: number;
  averageRating: number;
}

export interface SentimentTrend {
  date: string; // e.g. "Jan 26", "Feb 26"
  positive: number; // percentage
  neutral: number;
  negative: number;
  rating: number; // average rating in this period
}

export interface RankedIssue {
  id: string;
  keyword: string;
  frequency: number;
  priority: 'high' | 'medium' | 'positive';
  status: 'Investigating' | 'Fixed' | 'Ignored';
  description: string;
  samples: ReviewSnippet[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  averageRating: number;
  totalReviews: number;
  dateRange: string;
  summary: string;
  platforms: PlatformStat[];
  rankedIssues: RankedIssue[];
  sentimentTrends: SentimentTrend[];
  reviews: ReviewSnippet[];
  sharedWithTeam: { name: string; avatar: string }[];
  isPinned: boolean;
}

export interface SearchHistoryItem {
  id: string;
  productId: string;
  productName: string;
  timestamp: string;
  platforms: ('Amazon' | 'Trustpilot' | 'Google Maps' | 'Shopify' | 'Yelp' | 'G2')[];
}

export const mockProducts: Product[] = [
  {
    id: "aura-sleep-mask",
    name: "Aura Smart Sleep Mask",
    description: "Premium smart sleep mask with heating, cooling, and integrated ambient soundscapes.",
    averageRating: 4.6,
    totalReviews: 1842,
    dateRange: "Jul 10, 2026 - Aug 08, 2026",
    summary: "Customers consistently praise the Aura Sleep Mask for its exceptional comfort, effective light blocking, and high-quality fabric texture. However, a significant portion of reviews highlight issues with bluetooth connectivity dropping during the night and charging port reliability. Some users also report the strap stretching out over several months of usage, while the premium packaging and carrying pouch received unanimous praise.",
    isPinned: true,
    sharedWithTeam: [
      { name: "Sarah Connor", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
      { name: "Alex Mercer", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }
    ],
    platforms: [
      { platform: "Amazon", reviewCount: 1250, averageRating: 4.5 },
      { platform: "Shopify", reviewCount: 420, averageRating: 4.8 },
      { platform: "Trustpilot", reviewCount: 172, averageRating: 4.4 }
    ],
    sentimentTrends: [
      { date: "Mar 26", positive: 75, neutral: 15, negative: 10, rating: 4.3 },
      { date: "Apr 26", positive: 78, neutral: 14, negative: 8, rating: 4.4 },
      { date: "May 26", positive: 80, neutral: 13, negative: 7, rating: 4.5 },
      { date: "Jun 26", positive: 82, neutral: 11, negative: 7, rating: 4.5 },
      { date: "Jul 26", positive: 85, neutral: 9, negative: 6, rating: 4.6 },
      { date: "Aug 26", positive: 86, neutral: 9, negative: 5, rating: 4.6 }
    ],
    rankedIssues: [
      {
        id: "issue-1-1",
        keyword: "Bluetooth disconnects",
        frequency: 48,
        priority: "high",
        status: "Investigating",
        description: "Bluetooth audio disconnects mid-sleep, causing ambient sounds or white noise to shut off suddenly.",
        samples: [
          {
            id: "s-1-1-1",
            platform: "Amazon",
            rating: 2,
            text: "Love the feel of this mask but the Bluetooth disconnects randomly during the night. I wake up because my white noise cuts off. Really disappointing for a premium price.",
            date: "2026-08-05",
            author: "John D."
          },
          {
            id: "s-1-1-2",
            platform: "Trustpilot",
            rating: 3,
            text: "Comfort is 5/5, but connectivity is a massive issue. It loses connection to my iPhone 15 at least twice a week. Firmware update did not solve this.",
            date: "2026-07-28",
            author: "Elena R."
          },
          {
            id: "s-1-1-3",
            platform: "Amazon",
            rating: 2,
            text: "Constant Bluetooth drops. It pairs fine initially, but after 3-4 hours of sleep, it goes completely silent and the app says it is disconnected.",
            date: "2026-07-24",
            author: "Marcus K."
          }
        ]
      },
      {
        id: "issue-1-2",
        keyword: "Faulty USB-C charging port",
        frequency: 24,
        priority: "high",
        status: "Investigating",
        description: "USB-C port is loose, failing to charge properly or requiring the cable to be angled in a specific position.",
        samples: [
          {
            id: "s-1-2-1",
            platform: "Shopify",
            rating: 1,
            text: "After just three weeks, the charging port became loose. I have to prop the cable up on a book to get it to charge. Sent email to customer service but no reply yet.",
            date: "2026-08-02",
            author: "David L."
          },
          {
            id: "s-1-2-2",
            platform: "Amazon",
            rating: 2,
            text: "Poor hardware quality on the charging module. The USB-C cable doesn't click into place anymore. It charges intermittently. Very frustrating.",
            date: "2026-07-29",
            author: "Clarissa M."
          }
        ]
      },
      {
        id: "issue-1-3",
        keyword: "Elastic strap stretches out",
        frequency: 32,
        priority: "medium",
        status: "Fixed",
        description: "The adjustable elastic band loses its tension and grip after a few months, causing the mask to slip off during sleep.",
        samples: [
          {
            id: "s-1-3-1",
            platform: "Amazon",
            rating: 3,
            text: "Initially fit perfectly, but after 3 months, the strap has stretched out quite a bit. I have to tighten it to the maximum limit now and it still feels loose.",
            date: "2026-07-15",
            author: "Robert B."
          },
          {
            id: "s-1-3-2",
            platform: "Shopify",
            rating: 3,
            text: "Strap stretching is definitely real. The elastic seems a bit cheap compared to the gorgeous silk of the mask. Hope they release an upgraded strap.",
            date: "2026-07-08",
            author: "Teresa P."
          }
        ]
      },
      {
        id: "issue-1-4",
        keyword: "Premium fabric comfort",
        frequency: 120,
        priority: "positive",
        status: "Ignored",
        description: "Unanimous praise for the soft, organic bamboo silk fabric texture which feels cool on the eyes.",
        samples: [
          {
            id: "s-1-4-1",
            platform: "Shopify",
            rating: 5,
            text: "This is like sleeping on a cloud. The silk is incredibly premium and doesn't get hot during the night. Totally worth the investment just for the material.",
            date: "2026-08-07",
            author: "Sofia G."
          },
          {
            id: "s-1-4-2",
            platform: "Amazon",
            rating: 5,
            text: "Extremely comfortable. No pressure on the eyeballs at all, and the fabric is incredibly soft. I am a side-sleeper and it doesn't bother me.",
            date: "2026-08-01",
            author: "Liam H."
          }
        ]
      },
      {
        id: "issue-1-5",
        keyword: "Flawless light blocking",
        frequency: 94,
        priority: "positive",
        status: "Fixed",
        description: "The contoured nose bridge design effectively blocks 100% of light even in bright environments.",
        samples: [
          {
            id: "s-1-5-1",
            platform: "Amazon",
            rating: 5,
            text: "Total blackout! I work night shifts and sleep during the day. This mask blocks out every single photon of light. Best purchase I've made this year.",
            date: "2026-08-04",
            author: "Diana V."
          },
          {
            id: "s-1-5-2",
            platform: "Trustpilot",
            rating: 5,
            text: "The seal around the nose is brilliant. No light leaks whatsoever. Highly recommended for travelers and light sleepers.",
            date: "2026-07-22",
            author: "Gavin T."
          }
        ]
      }
    ],
    reviews: [
      { id: "r-1", platform: "Amazon", rating: 5, text: "Total blackout! I work night shifts and sleep during the day. This mask blocks out every single photon of light. Best purchase I've made this year.", date: "2026-08-04", author: "Diana V." },
      { id: "r-2", platform: "Amazon", rating: 2, text: "Love the feel of this mask but the Bluetooth disconnects randomly during the night. I wake up because my white noise cuts off. Really disappointing for a premium price.", date: "2026-08-05", author: "John D." },
      { id: "r-3", platform: "Shopify", rating: 5, text: "This is like sleeping on a cloud. The silk is incredibly premium and doesn't get hot during the night. Totally worth the investment just for the material.", date: "2026-08-07", author: "Sofia G." },
      { id: "r-4", platform: "Trustpilot", rating: 3, text: "Comfort is 5/5, but connectivity is a massive issue. It loses connection to my iPhone 15 at least twice a week. Firmware update did not solve this.", date: "2026-07-28", author: "Elena R." },
      { id: "r-5", platform: "Shopify", rating: 1, text: "After just three weeks, the charging port became loose. I have to prop the cable up on a book to get it to charge. Sent email to customer service but no reply yet.", date: "2026-08-02", author: "David L." },
      { id: "r-6", platform: "Amazon", rating: 5, text: "Extremely comfortable. No pressure on the eyeballs at all, and the fabric is incredibly soft. I am a side-sleeper and it doesn't bother me.", date: "2026-08-01", author: "Liam H." },
      { id: "r-7", platform: "Amazon", rating: 2, text: "Poor hardware quality on the charging module. The USB-C cable doesn't click into place anymore. It charges intermittently. Very frustrating.", date: "2026-07-29", author: "Clarissa M." },
      { id: "r-8", platform: "Amazon", rating: 2, text: "Constant Bluetooth drops. It pairs fine initially, but after 3-4 hours of sleep, it goes completely silent and the app says it is disconnected.", date: "2026-07-24", author: "Marcus K." },
      { id: "r-9", platform: "Amazon", rating: 3, text: "Initially fit perfectly, but after 3 months, the strap has stretched out quite a bit. I have to tighten it to the maximum limit now and it still feels loose.", date: "2026-07-15", author: "Robert B." },
      { id: "r-10", platform: "Shopify", rating: 3, text: "Strap stretching is definitely real. The elastic seems a bit cheap compared to the gorgeous silk of the mask. Hope they release an upgraded strap.", date: "2026-07-08", author: "Teresa P." },
      { id: "r-11", platform: "Trustpilot", rating: 5, text: "The seal around the nose is brilliant. No light leaks whatsoever. Highly recommended for travelers and light sleepers.", date: "2026-07-22", author: "Gavin T." },
      { id: "r-12", platform: "Shopify", rating: 5, text: "Amazing purchase. Packaging was like unboxing a high-end designer item. Mask works perfectly. Soundscapes are highly relaxing.", date: "2026-08-03", author: "Rachel W." }
    ]
  },
  {
    id: "nova-blender-pro",
    name: "Nova Quiet Blender Pro",
    description: "High-speed multi-function kitchen blender engineered with noise-reduction technology.",
    averageRating: 4.3,
    totalReviews: 924,
    dateRange: "Jul 15, 2026 - Aug 08, 2026",
    summary: "The Nova Quiet Blender Pro is highly regarded for its low noise levels compared to standard blenders, and its motor is powerful enough for tough ingredients. However, the blending jar lid is frequently reported as difficult to clean and prone to trapping food residue. Several customers experienced issues with the plastic gear coupling wearing down prematurely. Shipping delays and damaged outer boxes were also reported repeatedly over the past month.",
    isPinned: false,
    sharedWithTeam: [
      { name: "Sarah Connor", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }
    ],
    platforms: [
      { platform: "Amazon", reviewCount: 610, averageRating: 4.2 },
      { platform: "Shopify", reviewCount: 224, averageRating: 4.5 },
      { platform: "Google Maps", reviewCount: 90, averageRating: 4.1 }
    ],
    sentimentTrends: [
      { date: "Mar 26", positive: 65, neutral: 20, negative: 15, rating: 3.9 },
      { date: "Apr 26", positive: 70, neutral: 18, negative: 12, rating: 4.1 },
      { date: "May 26", positive: 72, neutral: 18, negative: 10, rating: 4.2 },
      { date: "Jun 26", positive: 75, neutral: 15, negative: 10, rating: 4.2 },
      { date: "Jul 26", positive: 77, neutral: 15, negative: 8, rating: 4.3 },
      { date: "Aug 26", positive: 78, neutral: 14, negative: 8, rating: 4.3 }
    ],
    rankedIssues: [
      {
        id: "issue-2-1",
        keyword: "Hard-to-clean lid",
        frequency: 54,
        priority: "medium",
        status: "Investigating",
        description: "The rubber gasket and crevices in the main lid trap food residue and are extremely difficult to scrub or sanitize.",
        samples: [
          {
            id: "s-2-1-1",
            platform: "Amazon",
            rating: 3,
            text: "It blends beautifully and is very quiet, but cleaning the lid is a nightmare. Food gets caught inside the rubber seal and it is impossible to remove without a toothpick.",
            date: "2026-08-04",
            author: "Aria N."
          },
          {
            id: "s-2-1-2",
            platform: "Shopify",
            rating: 2,
            text: "The lid smells like old smoothies because of the deep rubber folds. Dishwasher doesn't clean it well either. Design could be much better.",
            date: "2026-07-30",
            author: "Benjamin S."
          }
        ]
      },
      {
        id: "issue-2-2",
        keyword: "Worn plastic gear coupling",
        frequency: 38,
        priority: "high",
        status: "Investigating",
        description: "The gear interface connecting the motor base to the blade assembly is made of plastic and strips under heavy loads.",
        samples: [
          {
            id: "s-2-2-1",
            platform: "Amazon",
            rating: 1,
            text: "Complete failure after 2 months. The plastic gear coupling on the base stripped completely while blending frozen strawberries. Metal parts should have been used here.",
            date: "2026-08-01",
            author: "Clara G."
          },
          {
            id: "s-2-2-2",
            platform: "Amazon",
            rating: 2,
            text: "The motor runs, but the blades don't spin because the plastic teeth on the coupling have ground down to nothing. Underbuilt design.",
            date: "2026-07-25",
            author: "Nathan F."
          }
        ]
      },
      {
        id: "issue-2-3",
        keyword: "Whisper-quiet blending",
        frequency: 142,
        priority: "positive",
        status: "Fixed",
        description: "Praise for the sound enclosure hood which effectively muffles high-decibel motor noise.",
        samples: [
          {
            id: "s-2-3-1",
            platform: "Shopify",
            rating: 5,
            text: "I can finally make morning shakes without waking up the kids. The clear plastic cover is a genius addition. Unbelievably quiet!",
            date: "2026-08-05",
            author: "Ethan P."
          },
          {
            id: "s-2-3-2",
            platform: "Google Maps",
            rating: 5,
            text: "We use it in our small bakery, and it is a lifesaver. Customers don't have to shout when we are blending. Very quiet.",
            date: "2026-07-29",
            author: "Laura M."
          }
        ]
      },
      {
        id: "issue-2-4",
        keyword: "Cracked jar on delivery",
        frequency: 15,
        priority: "high",
        status: "Fixed",
        description: "Shipping/delivery reports where the outer cardboard was damaged and the glass/tritan blending jar arrived cracked.",
        samples: [
          {
            id: "s-2-4-1",
            platform: "Amazon",
            rating: 1,
            text: "Arrived with a massive crack straight down the front of the Tritan jar. The shipping box had zero bubble wrap. Had to request a replacement.",
            date: "2026-08-03",
            author: "Gregory K."
          }
        ]
      }
    ],
    reviews: [
      { id: "r-2-1", platform: "Amazon", rating: 3, text: "It blends beautifully and is very quiet, but cleaning the lid is a nightmare. Food gets caught inside the rubber seal and it is impossible to remove without a toothpick.", date: "2026-08-04", author: "Aria N." },
      { id: "r-2-2", platform: "Shopify", rating: 2, text: "The lid smells like old smoothies because of the deep rubber folds. Dishwasher doesn't clean it well either. Design could be much better.", date: "2026-07-30", author: "Benjamin S." },
      { id: "r-2-3", platform: "Amazon", rating: 1, text: "Complete failure after 2 months. The plastic gear coupling on the base stripped completely while blending frozen strawberries. Metal parts should have been used here.", date: "2026-08-01", author: "Clara G." },
      { id: "r-2-4", platform: "Amazon", rating: 2, text: "The motor runs, but the blades don't spin because the plastic teeth on the coupling have ground down to nothing. Underbuilt design.", date: "2026-07-25", author: "Nathan F." },
      { id: "r-2-5", platform: "Shopify", rating: 5, text: "I can finally make morning shakes without waking up the kids. The clear plastic cover is a genius addition. Unbelievably quiet!", date: "2026-08-05", author: "Ethan P." },
      { id: "r-2-6", platform: "Google Maps", rating: 5, text: "We use it in our small bakery, and it is a lifesaver. Customers don't have to shout when we are blending. Very quiet.", date: "2026-07-29", author: "Laura M." },
      { id: "r-2-7", platform: "Amazon", rating: 1, text: "Arrived with a massive crack straight down the front of the Tritan jar. The shipping box had zero bubble wrap. Had to request a replacement.", date: "2026-08-03", author: "Gregory K." }
    ]
  },
  {
    id: "bytecrm",
    name: "ByteCRM",
    description: "Cloud-based visual CRM tailored for high-growth small to medium business sales teams.",
    averageRating: 4.1,
    totalReviews: 456,
    dateRange: "Jun 01, 2026 - Aug 08, 2026",
    summary: "ByteCRM users appreciate the simplicity of its pipeline builder and the visual interface, which helps small teams get onboarded quickly. However, the reporting dashboard is criticized for lacking advanced filtering and customization options. Mobile app performance is slow, with pages taking several seconds to load. Customer support is generally helpful, though response times during peak hours can exceed 24 hours.",
    isPinned: true,
    sharedWithTeam: [
      { name: "Sarah Connor", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
      { name: "John Doe", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }
    ],
    platforms: [
      { platform: "G2", reviewCount: 310, averageRating: 4.2 },
      { platform: "Trustpilot", reviewCount: 146, averageRating: 3.9 }
    ],
    sentimentTrends: [
      { date: "Mar 26", positive: 60, neutral: 25, negative: 15, rating: 3.8 },
      { date: "Apr 26", positive: 62, neutral: 24, negative: 14, rating: 3.9 },
      { date: "May 26", positive: 65, neutral: 23, negative: 12, rating: 4.0 },
      { date: "Jun 26", positive: 68, neutral: 22, negative: 10, rating: 4.1 },
      { date: "Jul 26", positive: 70, neutral: 20, negative: 10, rating: 4.1 },
      { date: "Aug 26", positive: 70, neutral: 20, negative: 10, rating: 4.1 }
    ],
    rankedIssues: [
      {
        id: "issue-3-1",
        keyword: "Lacks advanced filters",
        frequency: 38,
        priority: "medium",
        status: "Investigating",
        description: "The reporting panel doesn't support complex logical operators (AND/OR) or custom-date range grouping.",
        samples: [
          {
            id: "s-3-1-1",
            platform: "G2",
            rating: 3,
            text: "Great layout, but the reports are far too basic. I cannot create a report showing leads grouped by source AND owner at the same time. We have to export everything to Excel.",
            date: "2026-08-02",
            author: "Vanessa F."
          },
          {
            id: "s-3-1-2",
            platform: "G2",
            rating: 3,
            text: "I wish the pipeline statistics had custom tags filters. It limits our capability to analyze sales performance.",
            date: "2026-07-28",
            author: "Tom H."
          }
        ]
      },
      {
        id: "issue-3-2",
        keyword: "Slow mobile app speed",
        frequency: 29,
        priority: "high",
        status: "Investigating",
        description: "Android and iOS applications take substantial time to load and sync offline deal updates.",
        samples: [
          {
            id: "s-3-2-1",
            platform: "Trustpilot",
            rating: 2,
            text: "The mobile app is practically unusable. Loading a lead profile takes 5-10 seconds on cellular data. Please optimize the speed.",
            date: "2026-08-04",
            author: "Michael W."
          },
          {
            id: "s-3-2-2",
            platform: "G2",
            rating: 2,
            text: "Syncing doesn't work well on mobile. I updated a deal stage on my phone and my manager didn't see it until the next day.",
            date: "2026-07-19",
            author: "Kaitlyn T."
          }
        ]
      },
      {
        id: "issue-3-3",
        keyword: "Easy visual pipeline",
        frequency: 78,
        priority: "positive",
        status: "Ignored",
        description: "High satisfaction with the drag-and-drop Kanban style deal progress boards.",
        samples: [
          {
            id: "s-3-3-1",
            platform: "G2",
            rating: 5,
            text: "Onboarding our sales team took less than two hours. The visual board is extremely intuitive. Moving deals is smooth.",
            date: "2026-08-01",
            author: "Jared C."
          },
          {
            id: "s-3-3-2",
            platform: "Trustpilot",
            rating: 5,
            text: "Clean interface, uncluttered layout. It's much simpler than Salesforce or HubSpot. Perfect for our 15-person company.",
            date: "2026-07-26",
            author: "Samantha K."
          }
        ]
      }
    ],
    reviews: [
      { id: "r-3-1", platform: "G2", rating: 3, text: "Great layout, but the reports are far too basic. I cannot create a report showing leads grouped by source AND owner at the same time. We have to export everything to Excel.", date: "2026-08-02", author: "Vanessa F." },
      { id: "r-3-2", platform: "G2", rating: 3, text: "I wish the pipeline statistics had custom tags filters. It limits our capability to analyze sales performance.", date: "2026-07-28", author: "Tom H." },
      { id: "r-3-3", platform: "Trustpilot", rating: 2, text: "The mobile app is practically unusable. Loading a lead profile takes 5-10 seconds on cellular data. Please optimize the speed.", date: "2026-08-04", author: "Michael W." },
      { id: "r-3-4", platform: "G2", rating: 2, text: "Syncing doesn't work well on mobile. I updated a deal stage on my phone and my manager didn't see it until the next day.", date: "2026-07-19", author: "Kaitlyn T." },
      { id: "r-3-5", platform: "G2", rating: 5, text: "Onboarding our sales team took less than two hours. The visual board is extremely intuitive. Moving deals is smooth.", date: "2026-08-01", author: "Jared C." },
      { id: "r-3-6", platform: "Trustpilot", rating: 5, text: "Clean interface, uncluttered layout. It's much simpler than Salesforce or HubSpot. Perfect for our 15-person company.", date: "2026-07-26", author: "Samantha K." }
    ]
  },
  {
    id: "apex-chair",
    name: "Apex Ergonomic Chair",
    description: "High-end ergonomic desk chair featuring adaptive lumbar support and reinforced steel frame.",
    averageRating: 4.7,
    totalReviews: 2410,
    dateRange: "Jun 10, 2026 - Aug 08, 2026",
    summary: "The Apex Ergonomic Chair is widely celebrated for its lumbar support and adjustable armrests, which have helped many users alleviate lower back pain. Despite these strengths, a common complaint is that the seat cushion is too firm for extended seating sessions. The assembly instructions are also described as confusing, with small diagrams that are hard to follow. Customers also praised the premium metal frame durability.",
    isPinned: false,
    sharedWithTeam: [],
    platforms: [
      { platform: "Amazon", reviewCount: 1680, averageRating: 4.6 },
      { platform: "Shopify", reviewCount: 520, averageRating: 4.8 },
      { platform: "Trustpilot", reviewCount: 210, averageRating: 4.7 }
    ],
    sentimentTrends: [
      { date: "Mar 26", positive: 88, neutral: 8, negative: 4, rating: 4.6 },
      { date: "Apr 26", positive: 89, neutral: 7, negative: 4, rating: 4.7 },
      { date: "May 26", positive: 90, neutral: 6, negative: 4, rating: 4.7 },
      { date: "Jun 26", positive: 91, neutral: 5, negative: 4, rating: 4.7 },
      { date: "Jul 26", positive: 92, neutral: 5, negative: 3, rating: 4.8 },
      { date: "Aug 26", positive: 92, neutral: 5, negative: 3, rating: 4.8 }
    ],
    rankedIssues: [
      {
        id: "issue-4-1",
        keyword: "Seat cushion too firm",
        frequency: 68,
        priority: "medium",
        status: "Investigating",
        description: "The seat's high-density foam padding is too hard for some users, causing discomfort after 4+ hours of work.",
        samples: [
          {
            id: "s-4-1-1",
            platform: "Amazon",
            rating: 3,
            text: "Back support is amazing, but the seat itself is like sitting on a bench. Extremely hard. I had to buy an external purple gel pad to put on top of it.",
            date: "2026-08-03",
            author: "Frank P."
          },
          {
            id: "s-4-1-2",
            platform: "Shopify",
            rating: 4,
            text: "Very sturdy chair, but be warned that the padding takes a long time to break in. It feels quite stiff for the first few weeks.",
            date: "2026-07-27",
            author: "Melissa D."
          }
        ]
      },
      {
        id: "issue-4-2",
        keyword: "Confusing assembly manual",
        frequency: 52,
        priority: "medium",
        status: "Fixed",
        description: "Instructions feature print with tiny diagrams that mislabel screw types and lack text guidelines.",
        samples: [
          {
            id: "s-4-2-1",
            platform: "Amazon",
            rating: 3,
            text: "The instructions are terrible. The pictures are tiny and the screws labeled 'A' and 'B' looked identical but had slightly different threads. Took me 1.5 hours to assemble.",
            date: "2026-08-01",
            author: "Zachary L."
          },
          {
            id: "s-4-2-2",
            platform: "Trustpilot",
            rating: 4,
            text: "Chair itself is absolute luxury, but the manual is pure frustration. Diagrams are hard to read. They should just post a YouTube setup video.",
            date: "2026-07-20",
            author: "Oscar Y."
          }
        ]
      },
      {
        id: "issue-4-3",
        keyword: "Superb lumbar support",
        frequency: 220,
        priority: "positive",
        status: "Ignored",
        description: "Excellent ratings from customers experiencing immediate back pain relief from the active pressure mesh.",
        samples: [
          {
            id: "s-4-3-1",
            platform: "Shopify",
            rating: 5,
            text: "My chronic back pain has vanished. The lumbar system moves dynamically as you shift weight. Hands down the best office chair ever.",
            date: "2026-08-06",
            author: "Gabriel R."
          },
          {
            id: "s-4-3-2",
            platform: "Amazon",
            rating: 5,
            text: "Best chair I've owned. Better support than my Herman Miller Aeron at half the price. Back strain is gone.",
            date: "2026-07-31",
            author: "Rachel F."
          }
        ]
      }
    ],
    reviews: [
      { id: "r-4-1", platform: "Amazon", rating: 3, text: "Back support is amazing, but the seat itself is like sitting on a bench. Extremely hard. I had to buy an external purple gel pad to put on top of it.", date: "2026-08-03", author: "Frank P." },
      { id: "r-4-2", platform: "Shopify", rating: 4, text: "Very sturdy chair, but be warned that the padding takes a long time to break in. It feels quite stiff for the first few weeks.", date: "2026-07-27", author: "Melissa D." },
      { id: "r-4-3", platform: "Amazon", rating: 3, text: "The instructions are terrible. The pictures are tiny and the screws labeled 'A' and 'B' looked identical but had slightly different threads. Took me 1.5 hours to assemble.", date: "2026-08-01", author: "Zachary L." },
      { id: "r-4-4", platform: "Trustpilot", rating: 4, text: "Chair itself is absolute luxury, but the manual is pure frustration. Diagrams are hard to read. They should just post a YouTube setup video.", date: "2026-07-20", author: "Oscar Y." },
      { id: "r-4-5", platform: "Shopify", rating: 5, text: "My chronic back pain has vanished. The lumbar system moves dynamically as you shift weight. Hands down the best office chair ever.", date: "2026-08-06", author: "Gabriel R." },
      { id: "r-4-6", platform: "Amazon", rating: 5, text: "Best chair I've owned. Better support than my Herman Miller Aeron at half the price. Back strain is gone.", date: "2026-07-31", author: "Rachel F." }
    ]
  },
  {
    id: "solkitchen-cafe",
    name: "SolKitchen Cafe",
    description: "Organic D2C cafe and local bistro located in San Francisco's Mission district.",
    averageRating: 4.5,
    totalReviews: 780,
    dateRange: "Jun 15, 2026 - Aug 08, 2026",
    summary: "SolKitchen Cafe receives glowing reviews for its artisanal sourdough toast, specialty matcha lattes, and cozy outdoor seating. The main operational bottleneck is the long wait time on weekend mornings, often reaching 45 minutes for a table. A few customers noted that the indoor seating is cramped and noisy, making it difficult to hold conversations. Staff friendliness is frequently cited as a major positive highlight.",
    isPinned: false,
    sharedWithTeam: [],
    platforms: [
      { platform: "Yelp", reviewCount: 430, averageRating: 4.4 },
      { platform: "Google Maps", reviewCount: 350, averageRating: 4.6 }
    ],
    sentimentTrends: [
      { date: "Mar 26", positive: 72, neutral: 18, negative: 10, rating: 4.3 },
      { date: "Apr 26", positive: 74, neutral: 17, negative: 9, rating: 4.4 },
      { date: "May 26", positive: 75, neutral: 17, negative: 8, rating: 4.4 },
      { date: "Jun 26", positive: 78, neutral: 15, negative: 7, rating: 4.5 },
      { date: "Jul 26", positive: 80, neutral: 14, negative: 6, rating: 4.5 },
      { date: "Aug 26", positive: 80, neutral: 14, negative: 6, rating: 4.5 }
    ],
    rankedIssues: [
      {
        id: "issue-5-1",
        keyword: "Long weekend wait times",
        frequency: 92,
        priority: "medium",
        status: "Investigating",
        description: "Customers complain of 30-50 minute wait times on Saturdays and Sundays between 9 AM and 1 PM.",
        samples: [
          {
            id: "s-5-1-1",
            platform: "Yelp",
            rating: 3,
            text: "Food is absolute heaven but the line is insane. We waited 50 minutes for two coffees and toast on Sunday. Go during the week if you can.",
            date: "2026-08-02",
            author: "Hillary Q."
          },
          {
            id: "s-5-1-2",
            platform: "Google Maps",
            rating: 4,
            text: "Brunch was fantastic, but prepare to wait. There's no reservation system, it is first-come-first-serve and extremely busy.",
            date: "2026-07-25",
            author: "Derek N."
          }
        ]
      },
      {
        id: "issue-5-2",
        keyword: "Cramped indoor seating",
        frequency: 45,
        priority: "medium",
        status: "Investigating",
        description: "Indoor space has tightly packed tables, resulting in loud echo noise levels and drafty corridors.",
        samples: [
          {
            id: "s-5-2-1",
            platform: "Yelp",
            rating: 3,
            text: "The tables inside are so close together I could hear every word of the conversation next to me. Very loud, hard to relax. Patio is much better.",
            date: "2026-07-28",
            author: "Marcus J."
          }
        ]
      },
      {
        id: "issue-5-3",
        keyword: "Artisanal sourdough toast",
        frequency: 164,
        priority: "positive",
        status: "Ignored",
        description: "High praise for freshly baked house sourdough options, avocado toast, and wild mushroom specials.",
        samples: [
          {
            id: "s-5-3-1",
            platform: "Google Maps",
            rating: 5,
            text: "Best avocado toast in San Francisco! The sourdough is crispy, thick-cut, and has the perfect sour flavor. I buy a loaf to go every week.",
            date: "2026-08-06",
            author: "Talia V."
          },
          {
            id: "s-5-3-2",
            platform: "Yelp",
            rating: 5,
            text: "The sourdough with house-made jam is incredible. Soft crumb, crispy crust. A true masterclass in baking.",
            date: "2026-08-01",
            author: "Brian O."
          }
        ]
      }
    ],
    reviews: [
      { id: "r-5-1", platform: "Yelp", rating: 3, text: "Food is absolute heaven but the line is insane. We waited 50 minutes for two coffees and toast on Sunday. Go during the week if you can.", date: "2026-08-02", author: "Hillary Q." },
      { id: "r-5-2", platform: "Google Maps", rating: 4, text: "Brunch was fantastic, but prepare to wait. There's no reservation system, it is first-come-first-serve and extremely busy.", date: "2026-07-25", author: "Derek N." },
      { id: "r-5-3", platform: "Yelp", rating: 3, text: "The tables inside are so close together I could hear every word of the conversation next to me. Very loud, hard to relax. Patio is much better.", date: "2026-07-28", author: "Marcus J." },
      { id: "r-5-4", platform: "Google Maps", rating: 5, text: "Best avocado toast in San Francisco! The sourdough is crispy, thick-cut, and has the perfect sour flavor. I buy a loaf to go every week.", date: "2026-08-06", author: "Talia V." },
      { id: "r-5-5", platform: "Yelp", rating: 5, text: "The sourdough with house-made jam is incredible. Soft crumb, crispy crust. A true masterclass in baking.", date: "2026-08-01", author: "Brian O." }
    ]
  },
  {
    id: "voltcharge-powerbank",
    name: "VoltCharge Magsafe PowerBank",
    description: "Pocket-sized 10,000mAh wireless magsafe powerbank with pass-through fast charging.",
    averageRating: 4.8,
    totalReviews: 3120,
    dateRange: "Jul 10, 2026 - Aug 08, 2026",
    summary: "The VoltCharge PowerBank is highly rated for its ultra-fast charging capabilities and compact size that fits easily in pockets. However, the magsafe magnet strength is reported as slightly weak on bulkier phone cases, causing the powerbank to slide off. Additionally, some units experience high heat generation during simultaneous charging of multiple devices. The included braided cable is well-liked for its premium feel.",
    isPinned: true,
    sharedWithTeam: [
      { name: "John Doe", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }
    ],
    platforms: [
      { platform: "Amazon", reviewCount: 2500, averageRating: 4.8 },
      { platform: "Shopify", reviewCount: 620, averageRating: 4.9 }
    ],
    sentimentTrends: [
      { date: "Mar 26", positive: 90, neutral: 7, negative: 3, rating: 4.7 },
      { date: "Apr 26", positive: 91, neutral: 6, negative: 3, rating: 4.8 },
      { date: "May 26", positive: 91, neutral: 6, negative: 3, rating: 4.8 },
      { date: "Jun 26", positive: 92, neutral: 5, negative: 3, rating: 4.8 },
      { date: "Jul 26", positive: 94, neutral: 4, negative: 2, rating: 4.9 },
      { date: "Aug 26", positive: 94, neutral: 4, negative: 2, rating: 4.9 }
    ],
    rankedIssues: [
      {
        id: "issue-6-1",
        keyword: "Weak magnet on thick cases",
        frequency: 74,
        priority: "medium",
        status: "Fixed",
        description: "The Magsafe attachment slips or falls off when phones are in third-party ruggedized heavy cases.",
        samples: [
          {
            id: "s-6-1-1",
            platform: "Amazon",
            rating: 3,
            text: "It snaps on tightly to a naked phone, but if you have an Otterbox or standard heavy case, the magnet barely holds it. It keeps sliding down. Works great if you use a thin Magsafe case though.",
            date: "2026-08-04",
            author: "Logan W."
          },
          {
            id: "s-6-1-2",
            platform: "Shopify",
            rating: 4,
            text: "Magnetic holds could be stronger. It fell off once when pulling it out of my jeans pocket. Other than that, charging is incredibly fast.",
            date: "2026-07-31",
            author: "Sophia R."
          }
        ]
      },
      {
        id: "issue-6-2",
        keyword: "High heat generation",
        frequency: 41,
        priority: "high",
        status: "Investigating",
        description: "The powerbank battery packs warm up significantly when charging two devices at the same time.",
        samples: [
          {
            id: "s-6-2-1",
            platform: "Amazon",
            rating: 3,
            text: "It charges my watch and phone at the same time, but it gets extremely hot. Almost uncomfortable to hold. I worry about the battery health.",
            date: "2026-08-01",
            author: "Peter G."
          },
          {
            id: "s-6-2-2",
            platform: "Amazon",
            rating: 2,
            text: "Heats up a lot when fast charging wirelessly. It thermal-throttles and slows down the charging speed after 15 minutes of use.",
            date: "2026-07-28",
            author: "Anna P."
          }
        ]
      },
      {
        id: "issue-6-3",
        keyword: "Ultra-fast charging speed",
        frequency: 310,
        priority: "positive",
        status: "Ignored",
        description: "Consistent user reports validating the 22.5W USB-PD fast wire charge speeds.",
        samples: [
          {
            id: "s-6-3-1",
            platform: "Shopify",
            rating: 5,
            text: "Unbelievable speeds! Charges my iPhone from 0 to 50% in under 25 minutes using the USB-C port. Compact format is brilliant.",
            date: "2026-08-06",
            author: "Mason C."
          },
          {
            id: "s-6-3-2",
            platform: "Amazon",
            rating: 5,
            text: "The USB-C cable included is very nice, and the charging power is incredible. I can charge my tablet and phone easily.",
            date: "2026-08-03",
            author: "Clara T."
          }
        ]
      }
    ],
    reviews: [
      { id: "r-6-1", platform: "Amazon", rating: 3, text: "It snaps on tightly to a naked phone, but if you have an Otterbox or standard heavy case, the magnet barely holds it. It keeps sliding down. Works great if you use a thin Magsafe case though.", date: "2026-08-04", author: "Logan W." },
      { id: "r-6-2", platform: "Shopify", rating: 4, text: "Magnetic holds could be stronger. It fell off once when pulling it out of my jeans pocket. Other than that, charging is incredibly fast.", date: "2026-07-31", author: "Sophia R." },
      { id: "r-6-3", platform: "Amazon", rating: 3, text: "It charges my watch and phone at the same time, but it gets extremely hot. Almost uncomfortable to hold. I worry about the battery health.", date: "2026-08-01", author: "Peter G." },
      { id: "r-6-4", platform: "Amazon", rating: 2, text: "Heats up a lot when fast charging wirelessly. It thermal-throttles and slows down the charging speed after 15 minutes of use.", date: "2026-07-28", author: "Anna P." },
      { id: "r-6-5", platform: "Shopify", rating: 5, text: "Unbelievable speeds! Charges my iPhone from 0 to 50% in under 25 minutes using the USB-C port. Compact format is brilliant.", date: "2026-08-06", author: "Mason C." },
      { id: "r-6-6", platform: "Amazon", rating: 5, text: "The USB-C cable included is very nice, and the charging power is incredible. I can charge my tablet and phone easily.", date: "2026-08-03", author: "Clara T." }
    ]
  }
];

export const mockHistory: SearchHistoryItem[] = [
  {
    id: "h-1",
    productId: "aura-sleep-mask",
    productName: "Aura Smart Sleep Mask",
    timestamp: "2 hours ago",
    platforms: ["Amazon", "Shopify", "Trustpilot"]
  },
  {
    id: "h-2",
    productId: "voltcharge-powerbank",
    productName: "VoltCharge Magsafe PowerBank",
    timestamp: "5 hours ago",
    platforms: ["Amazon", "Shopify"]
  },
  {
    id: "h-3",
    productId: "bytecrm",
    productName: "ByteCRM",
    timestamp: "Yesterday",
    platforms: ["G2", "Trustpilot"]
  },
  {
    id: "h-4",
    productId: "nova-blender-pro",
    productName: "Nova Quiet Blender Pro",
    timestamp: "3 days ago",
    platforms: ["Amazon", "Shopify", "Google Maps"]
  },
  {
    id: "h-5",
    productId: "solkitchen-cafe",
    productName: "SolKitchen Cafe",
    timestamp: "1 week ago",
    platforms: ["Yelp", "Google Maps"]
  },
  {
    id: "h-6",
    productId: "apex-chair",
    productName: "Apex Ergonomic Chair",
    timestamp: "2 weeks ago",
    platforms: ["Amazon", "Shopify", "Trustpilot"]
  }
];
