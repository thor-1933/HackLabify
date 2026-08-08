import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pin, 
  Check, 
  ChevronDown,
  ChevronUp,
  FileText,
  Send,
  Bot,
  User,
  Share2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { Product } from '../mock-data';

interface DashboardProps {
  products: Product[];
  selectedProductId: string;
  onPinProduct: (id: string) => void;
  onUpdateIssueStatus?: (productId: string, issueId: string, newStatus: 'Investigating' | 'Fixed' | 'Ignored') => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  widget?: {
    type: 'summary' | 'issues' | 'trends' | 'platforms' | 'compare';
    productId?: string;
    compareProductIds?: string[];
  };
  liveResults?: {
    products: LiveProduct[];
    reviews: LiveReview[];
    totalReviews: number;
  };
}

interface LiveProduct {
  id: string;
  title: string;
  image_url?: string | null;
  product_url: string;
  price?: string | null;
  rating: number;
  platform: string;
}

interface LiveReview {
  id: string;
  platform: string;
  author: string;
  rating: number;
  title?: string;
  text: string;
  date?: string;
  sentiment_label: string;
}

interface AnalysisReport {
  product_title: string;
  image_url?: string | null;
  overall_verdict: string;
  average_rating: number;
  total_reviews_analyzed: number;
  sentiment_breakdown: Record<string, number>;
  pros: string[];
  cons: string[];
  platform_breakdown: Record<string, number>;
  detailed_summary: string;
  reviews_included: LiveReview[];
}

export default function Dashboard({ 
  products, 
  selectedProductId, 
  onPinProduct
}: DashboardProps) {
  // UI and View States
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  
  // Chatbot State
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(null);
  const [liveResults, setLiveResults] = useState<Message['liveResults'] | null>(null);
  const [analysisReport, setAnalysisReport] = useState<AnalysisReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeProduct = products.find(p => p.id === selectedProductId) || products[0];

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Sync chatbot context when product is selected in the Sidebar
  useEffect(() => {
    setLiveResults(null);
    setAnalysisReport(null);
    setMessages([
      {
        id: 'welcome-' + selectedProductId,
        sender: 'assistant',
        text: `Welcome! I am your AI workspace companion for **${activeProduct.name}**.\n\nYou can ask me to summarize customer sentiment, list the top product issues, map positive sentiment trends over time, compare metrics with another product, or break down reviews by connected store channels.`,
        timestamp: new Date()
      }
    ]);
  }, [selectedProductId, activeProduct.name]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleExportPDF = () => {
    triggerToast(`Generating PDF Report for ${activeProduct.name}...`);
  };

  const handleSendToSlack = (issueKeyword: string) => {
    triggerToast(`Sent issue "${issueKeyword}" summary to Slack channel #engineering-alerts`);
  };
  const handleCreateTicket = (issueKeyword: string, issueId: string) => {
    const ticketId = `SIG-${Math.floor(100 + Math.random() * 900)}`;
    triggerToast(`Created Jira ticket ${ticketId} for "${issueKeyword}" (Ref: ${issueId})`);
  };

  const handleAnalyzeProduct = async (product: LiveProduct) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: `signal-${selectedProductId}`,
          product_id_or_title: product.id,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || `Analysis request failed: ${response.status}`);
      }
      setAnalysisReport(data as AnalysisReport);
    } catch (error) {
      triggerToast(error instanceof Error ? error.message : 'Could not analyze this product.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

  const userMsg: Message = {
    id: Math.random().toString(),
    sender: 'user',
    text: textToSend,
    timestamp: new Date()
  };

  setMessages(prev => [...prev, userMsg]);
  setInputVal('');
  setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: `signal-${selectedProductId}`,
        message: textToSend,
        platforms: activeProduct.platforms
          .map(p => p.platform.toLowerCase() === 'google maps' ? 'google' : p.platform.toLowerCase())
          .filter(platform => ['amazon', 'google', 'trustpilot'].includes(platform)),
      }),
      });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API request failed: ${response.status}`);
    }

    const data = await response.json();

      const liveProducts = Array.isArray(data.products) ? data.products : [];
      const liveReviews = Array.isArray(data.reviews) ? data.reviews : [];
      const currentLiveResults = {
        products: liveProducts,
        reviews: liveReviews,
        totalReviews: Number(data.total_reviews) || liveReviews.length,
      };
      setLiveResults(currentLiveResults);
      setAnalysisReport(null);
      const botMsg: Message = {
        id: Math.random().toString(),
        sender: 'assistant',
        text: data.chatbot_message || data.message || 'I could not generate a response.',
        timestamp: new Date(),
        liveResults: currentLiveResults,
      };

    setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error('Chat API error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown backend error.';
    const errorMsg: Message = {
      id: Math.random().toString(),
      sender: 'assistant',
      text: `Live search failed: ${errorMessage}`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, errorMsg]);

    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col h-full overflow-hidden bg-[#FAFAF8] text-[#1A1A1A] font-sans antialiased selection:bg-[#E8402B]/10 selection:text-[#E8402B]">
      
      {/* EXPORT TOAST BANNER */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#1A1A1A] text-[#FAFAF8] px-4 py-3 rounded-xl border border-[#333333] shadow-xl text-xs font-semibold flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-[#E8402B]" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <header className="bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#E5E5E5] px-6 py-4 shrink-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-[#E8402B]/10 flex items-center justify-center text-[#E8402B] border border-[#E8402B]/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg font-bold tracking-tight text-[#1A1A1A]">
                  {activeProduct.name}
                </h1>
                <button 
                  onClick={() => onPinProduct(activeProduct.id)}
                  className={`p-1 rounded-lg border text-xs transition-colors cursor-pointer ${
                    activeProduct.isPinned 
                      ? 'bg-[#E8402B]/15 text-[#E8402B] border-[#E8402B]/30' 
                      : 'bg-white text-[#6B6B6B] border-[#E5E5E5] hover:text-[#1A1A1A]'
                  }`}
                  title={activeProduct.isPinned ? 'Unpin workspace' : 'Pin workspace to sidebar'}
                >
                  <Pin className={`w-3.5 h-3.5 ${activeProduct.isPinned ? 'fill-[#E8402B]' : ''}`} />
                </button>
              </div>
              <p className="text-[9px] text-[#6B6B6B] font-bold uppercase tracking-wider">Conversational AI Workspace</p>
            </div>
          </div>
          
          <button 
            onClick={handleExportPDF}
            className="bg-white border border-[#E5E5E5] hover:border-zinc-300 text-[#1A1A1A] px-3.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-[#6B6B6B]" />
            <span>Export Chat</span>
          </button>
        </div>
      </header>

      {/* CHAT MESSAGES SCROLL CONTAINER */}
      <div className="flex-grow overflow-y-auto px-4 py-8 bg-zinc-50/50">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map(msg => {
            const isBot = msg.sender === 'assistant';
            const widgetProductId = msg.widget?.productId;
            const widgetProduct = widgetProductId ? products.find(p => p.id === widgetProductId) : activeProduct;

            return (
              <div key={msg.id} className={`flex gap-4 ${isBot ? 'mr-auto text-left' : 'ml-auto flex-row-reverse text-right'} w-full`}>
                
                {/* Avatar Icon */}
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border shadow-3xs ${
                  isBot 
                    ? 'bg-white border-[#E5E5E5] text-[#E8402B]' 
                    : 'bg-[#1A1A1A] border-[#1A1A1A] text-[#FAFAF8]'
                }`}>
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Bubble Container */}
                <div className="flex-1 max-w-[85%] space-y-1.5">
                  <div className={`rounded-2xl p-4 text-xs sm:text-sm border shadow-3xs ${
                    isBot 
                      ? 'bg-white border-[#E5E5E5] text-[#1A1A1A] leading-relaxed' 
                      : 'bg-[#E8402B] border-[#E8402B] text-white font-medium text-left'
                  }`}>
                    
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {isBot && msg.liveResults && (
                      <div className="mt-4 space-y-3 border-t border-[#E5E5E5]/60 pt-4">
                        {msg.liveResults.products.length > 0 ? (
                          <div className="space-y-2">
                            <div className="text-[9px] font-bold uppercase tracking-wider text-[#6B6B6B]">
                              Live Products ({msg.liveResults.products.length})
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2">
                              {msg.liveResults.products.map(product => (
                                <a
                                  key={product.id}
                                  href={product.product_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex gap-3 rounded-lg border border-[#E5E5E5] bg-[#FAFAF8] p-2.5 transition-colors hover:border-[#E8402B]"
                                >
                                  {product.image_url ? (
                                    <img src={product.image_url} alt="" className="h-14 w-14 shrink-0 rounded-md object-contain bg-white" />
                                  ) : (
                                    <div className="h-14 w-14 shrink-0 rounded-md bg-[#E5E5E5]" />
                                  )}
                                  <span className="min-w-0">
                                    <span className="block line-clamp-2 text-[11px] font-semibold text-[#1A1A1A]">{product.title}</span>
                                    <span className="mt-1 block text-[10px] text-[#6B6B6B]">{product.price || 'Price unavailable'} · {product.rating || 'N/A'}★</span>
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-lg border border-[#F2A399]/50 bg-[#FEF2F0] p-3 text-[11px] text-[#991B1B]">
                            No live products were returned. Check the backend terminal for the scraper error and confirm your Apify token is valid.
                          </div>
                        )}

                        {msg.liveResults.reviews.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-[9px] font-bold uppercase tracking-wider text-[#6B6B6B]">
                              Live Reviews ({msg.liveResults.totalReviews})
                            </div>
                            {msg.liveResults.reviews.slice(0, 3).map(review => (
                              <div key={review.id} className="rounded-lg border border-[#E5E5E5] bg-[#FAFAF8] p-3">
                                <div className="flex items-center justify-between gap-2 text-[10px] text-[#6B6B6B]">
                                  <span className="font-semibold text-[#1A1A1A]">{review.author}</span>
                                  <span>{review.platform} · {review.rating}★</span>
                                </div>
                                {review.title && <div className="mt-1 text-[11px] font-semibold">{review.title}</div>}
                                <p className="mt-1 text-[11px] leading-relaxed text-[#525252]">{review.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* DYNAMIC WIDGETS INLINE */}
                    {isBot && msg.widget && (
                      <div className="mt-4 pt-4 border-t border-[#E5E5E5]/60">
                        
                        {/* WIDGET 1: SUMMARY DATA CARD */}
                        {msg.widget.type === 'summary' && widgetProduct && (
                          <div className="bg-[#FAFAF8] border border-[#E5E5E5] rounded-xl p-4 space-y-4 text-[#1A1A1A]">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white border border-[#E5E5E5] rounded-lg p-3">
                                <div className="text-[8px] font-bold text-[#6B6B6B] uppercase tracking-wider">Average Rating</div>
                                <div className="text-xl font-bold font-mono text-[#E8402B] flex items-baseline gap-1 mt-1">
                                  {widgetProduct.averageRating.toFixed(1)}
                                  <span className="text-xs text-[#6B6B6B] font-normal">/ 5★</span>
                                </div>
                              </div>
                              <div className="bg-white border border-[#E5E5E5] rounded-lg p-3">
                                <div className="text-[8px] font-bold text-[#6B6B6B] uppercase tracking-wider">Total Reviews</div>
                                <div className="text-xl font-bold font-mono text-zinc-900 mt-1">
                                  {widgetProduct.totalReviews.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className="text-xs font-semibold bg-[#E8402B]/5 border border-[#E8402B]/10 rounded-lg p-3 text-[#E8402B] flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#E8402B] animate-pulse"></span>
                              <span>Primary Spike Topic: <strong>{widgetProduct.rankedIssues[0]?.keyword || 'None'}</strong> ({widgetProduct.rankedIssues[0]?.frequency || 0} mentions)</span>
                            </div>
                          </div>
                        )}

                        {/* WIDGET 2: RANKED ISSUES ACCORDION LIST */}
                        {msg.widget.type === 'issues' && widgetProduct && (
                          <div className="bg-[#FAFAF8] border border-[#E5E5E5] rounded-xl p-4 space-y-3 text-[#1A1A1A]">
                            <div className="text-[8.5px] font-bold text-[#6B6B6B] uppercase tracking-wider border-b border-[#E5E5E5] pb-2">
                              Customer Insight Analysis ({widgetProduct.rankedIssues.length} issues)
                            </div>
                            <div className="space-y-2">
                              {widgetProduct.rankedIssues.map((issue, idx) => {
                                const isExpanded = expandedIssueId === issue.id;
                                let priorityStyles = '';
                                if (issue.priority === 'high') {
                                  priorityStyles = 'bg-[#E8402B]/10 border-[#E8402B]/20 text-[#E8402B]';
                                } else if (issue.priority === 'medium') {
                                  priorityStyles = 'bg-[#F2A399]/20 border-[#F2A399]/30 text-[#C02B18]';
                                } else {
                                  priorityStyles = 'bg-zinc-100 border-zinc-200 text-[#525252]';
                                }

                                return (
                                  <div 
                                    key={issue.id} 
                                    className={`border rounded-lg p-3 bg-white transition-all ${
                                      isExpanded ? 'border-zinc-400' : 'border-[#E5E5E5] hover:border-zinc-300'
                                    }`}
                                  >
                                    <div 
                                      onClick={() => setExpandedIssueId(isExpanded ? null : issue.id)}
                                      className="flex items-center justify-between cursor-pointer select-none"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="font-serif text-[10px] font-bold text-[#6B6B6B] w-4">#{idx + 1}</span>
                                        <span className="font-bold text-xs text-[#1A1A1A]">{issue.keyword}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className={`text-[7px] font-bold border px-1.5 py-0.5 rounded-full uppercase tracking-wider ${priorityStyles}`}>
                                          {issue.priority}
                                        </span>
                                        <span className="text-[9px] font-mono text-[#6B6B6B]">{issue.frequency} mentions</span>
                                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                      </div>
                                    </div>

                                    {isExpanded && (
                                      <div className="mt-3 pt-3 border-t border-[#E5E5E5] space-y-3">
                                        <p className="text-[11px] text-[#6B6B6B] leading-relaxed">
                                          <strong className="text-[#1A1A1A]">Analysis:</strong> {issue.description}
                                        </p>
                                        <div className="space-y-2">
                                          <span className="text-[8px] font-bold text-[#6B6B6B] uppercase tracking-wider block">Verified Quote</span>
                                          {issue.samples.slice(0, 1).map(quote => (
                                            <div key={quote.id} className="bg-[#FAFAF8] border border-[#E5E5E5] rounded-lg p-2.5 text-[11px] italic">
                                              "{quote.text}"
                                              <span className="block mt-1.5 text-[9px] font-bold font-sans not-italic text-[#6B6B6B]">
                                                — {quote.author} ({quote.platform})
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                        
                                        <div className="flex gap-2 pt-2.5 border-t border-[#E5E5E5]">
                                          <button
                                            type="button"
                                            onClick={() => handleSendToSlack(issue.keyword)}
                                            className="flex-1 bg-white border border-[#E5E5E5] hover:border-[#E8402B] rounded-lg py-1.5 px-2 text-[9px] font-bold text-[#6B6B6B] hover:text-[#E8402B] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                          >
                                            <Share2 className="w-3.5 h-3.5" />
                                            <span>Send to Slack</span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleCreateTicket(issue.keyword, issue.id)}
                                            className="flex-1 bg-white border border-[#E5E5E5] hover:border-[#E8402B] rounded-lg py-1.5 px-2 text-[9px] font-bold text-[#6B6B6B] hover:text-[#E8402B] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                          >
                                            <FileText className="w-3.5 h-3.5" />
                                            <span>Create Ticket</span>
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* WIDGET 3: SENTIMENT TREND AREA CHART */}
                        {msg.widget.type === 'trends' && widgetProduct && (
                          <div className="bg-[#FAFAF8] border border-[#E5E5E5] rounded-xl p-4 space-y-3 text-[#1A1A1A]">
                            <div className="flex justify-between items-center text-[8.5px] font-bold text-[#6B6B6B] uppercase tracking-wider">
                              <span>Positive Sentiment Index (6 Months)</span>
                              <span className="font-mono text-[#E8402B] font-bold">
                                Current: {widgetProduct.sentimentTrends[widgetProduct.sentimentTrends.length - 1].positive}%
                              </span>
                            </div>
                            <div className="h-44 w-full pt-2">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={widgetProduct.sentimentTrends} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                  <defs>
                                    <linearGradient id={`colorSentimentChatFull-${msg.id}`} x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#E8402B" stopOpacity={0.2}/>
                                      <stop offset="95%" stopColor="#E8402B" stopOpacity={0}/>
                                    </linearGradient>
                                  </defs>
                                  <XAxis dataKey="date" stroke="#6B6B6B" fontSize={8.5} tickLine={false} axisLine={false} />
                                  <YAxis stroke="#6B6B6B" fontSize={8.5} tickLine={false} axisLine={false} domain={[0, 100]} />
                                  <Tooltip 
                                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#FAFAF8', borderRadius: '8px', fontSize: '10px' }} 
                                    itemStyle={{ color: '#FAFAF8' }}
                                  />
                                  <Area 
                                    type="monotone" 
                                    dataKey="positive" 
                                    stroke="#E8402B" 
                                    fillOpacity={1}
                                    fill={`url(#colorSentimentChatFull-${msg.id})`}
                                    strokeWidth={2} 
                                    dot={{ fill: '#E8402B', strokeWidth: 1, r: 3 }} 
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        )}

                        {/* WIDGET 4: CHANNEL MATRIX VOLUME */}
                        {msg.widget.type === 'platforms' && widgetProduct && (
                          <div className="bg-[#FAFAF8] border border-[#E5E5E5] rounded-xl p-4 space-y-3 text-[#1A1A1A]">
                            <span className="text-[8px] font-bold text-[#6B6B6B] uppercase tracking-wider block border-b border-[#E5E5E5] pb-2">Connected Feed Volume</span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {widgetProduct.platforms.map((plat, idx) => (
                                <div key={idx} className="bg-white border border-[#E5E5E5] rounded-lg p-3 space-y-2">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-[#1A1A1A]">{plat.platform}</span>
                                    <span className="text-[#E8402B] font-bold font-mono">{plat.averageRating.toFixed(1)} ★</span>
                                  </div>
                                  <div className="w-full bg-[#E5E3DD] h-1.5 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-[#E8402B] rounded-full" 
                                      style={{ width: `${(plat.averageRating / 5) * 100}%` }}
                                    ></div>
                                  </div>
                                  <div className="text-[8px] text-[#6B6B6B] text-right font-mono">
                                    {plat.reviewCount.toLocaleString()} reviews collected
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* WIDGET 5: SIDE-BY-SIDE COMPARE */}
                        {msg.widget.type === 'compare' && msg.widget.compareProductIds && (
                          <div className="bg-[#FAFAF8] border border-[#E5E5E5] rounded-xl p-4 space-y-3 text-[#1A1A1A]">
                            <span className="text-[8px] font-bold text-[#6B6B6B] uppercase tracking-wider block border-b border-[#E5E5E5] pb-2">Comparison Matrix</span>
                            <div className="grid grid-cols-2 gap-3">
                              {msg.widget.compareProductIds.map(pid => {
                                const prod = products.find(p => p.id === pid);
                                if (!prod) return null;
                                return (
                                  <div key={pid} className="bg-white border border-[#E5E5E5] rounded-lg p-3 space-y-2 flex flex-col justify-between">
                                    <div>
                                      <h4 className="font-bold text-xs truncate text-[#1A1A1A] leading-tight">{prod.name}</h4>
                                      <div className="flex justify-between items-center text-[9px] mt-2 border-b border-zinc-100 pb-1">
                                        <span className="text-[#6B6B6B]">Rating</span>
                                        <span className="font-bold text-[#E8402B] font-mono">{prod.averageRating.toFixed(1)}★</span>
                                      </div>
                                      <div className="flex justify-between items-center text-[9px] pt-1">
                                        <span className="text-[#6B6B6B]">Reviews</span>
                                        <span className="font-mono text-[#1A1A1A]">{prod.totalReviews.toLocaleString()}</span>
                                      </div>
                                    </div>
                                    <div className="border-t border-[#E5E5E5] pt-2 text-[10px] text-[#6B6B6B] line-clamp-3 leading-relaxed italic mt-2">
                                      "{prod.summary}"
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                  <span className="text-[8px] font-mono text-[#A3A3A3] block">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}

          {liveResults && liveResults.products.length > 0 && (
            <section className="rounded-2xl border border-[#E5E5E5] bg-white p-4 text-left shadow-3xs">
              <div className="flex items-center justify-between gap-3 border-b border-[#E5E5E5] pb-3">
                <div>
                  <h2 className="text-sm font-bold text-[#1A1A1A]">Live product analysis</h2>
                  <p className="mt-1 text-[10px] text-[#6B6B6B]">{liveResults.products.length} products · {liveResults.totalReviews} reviews collected</p>
                </div>
                <span className="rounded-full bg-[#E8402B]/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#E8402B]">Live API</span>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {liveResults.products.map(product => (
                  <div key={product.id} className="rounded-xl border border-[#E5E5E5] bg-[#FAFAF8] p-3">
                    <div className="flex gap-3">
                      {product.image_url ? (
                        <img src={product.image_url} alt="" className="h-20 w-20 shrink-0 rounded-lg bg-white object-contain" />
                      ) : (
                        <div className="h-20 w-20 shrink-0 rounded-lg bg-[#E5E5E5]" />
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-3 text-xs font-bold text-[#1A1A1A]">{product.title}</h3>
                        <p className="mt-1 text-[10px] text-[#6B6B6B]">{product.price || 'Price unavailable'} · {product.rating || 'N/A'}★ · {product.platform}</p>
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleAnalyzeProduct(product)}
                            disabled={isAnalyzing}
                            className="rounded-lg bg-[#E8402B] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white disabled:cursor-wait disabled:opacity-60"
                          >
                            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                          </button>
                          <a href={product.product_url} target="_blank" rel="noreferrer" className="rounded-lg border border-[#E5E5E5] bg-white px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-[#6B6B6B] hover:text-[#E8402B]">Open listing</a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {analysisReport && (
            <section className="rounded-2xl border border-[#E8402B]/25 bg-white p-4 text-left shadow-3xs">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E5E5E5] pb-3">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#E8402B]">Product analysis report</p>
                  <h2 className="mt-1 text-base font-bold text-[#1A1A1A]">{analysisReport.product_title}</h2>
                </div>
                <span className="rounded-lg bg-[#E8402B] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white">{analysisReport.overall_verdict}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div className="rounded-lg bg-[#FAFAF8] p-3"><span className="block text-[9px] text-[#6B6B6B]">Average rating</span><strong className="text-lg text-[#E8402B]">{analysisReport.average_rating}/5</strong></div>
                <div className="rounded-lg bg-[#FAFAF8] p-3"><span className="block text-[9px] text-[#6B6B6B]">Reviews analyzed</span><strong className="text-lg">{analysisReport.total_reviews_analyzed}</strong></div>
                <div className="rounded-lg bg-[#FAFAF8] p-3"><span className="block text-[9px] text-[#6B6B6B]">Positive</span><strong className="text-lg text-green-600">{analysisReport.sentiment_breakdown.Positive || 0}</strong></div>
                <div className="rounded-lg bg-[#FAFAF8] p-3"><span className="block text-[9px] text-[#6B6B6B]">Negative</span><strong className="text-lg text-red-600">{analysisReport.sentiment_breakdown.Negative || 0}</strong></div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[#525252]">{analysisReport.detailed_summary}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div><h3 className="text-[9px] font-bold uppercase tracking-wider text-green-700">Pros</h3>{analysisReport.pros.length ? analysisReport.pros.map((item, index) => <p key={index} className="mt-1 text-[11px] text-[#525252]">+ {item}</p>) : <p className="mt-1 text-[11px] text-[#6B6B6B]">No positive review themes found.</p>}</div>
                <div><h3 className="text-[9px] font-bold uppercase tracking-wider text-red-700">Cons</h3>{analysisReport.cons.length ? analysisReport.cons.map((item, index) => <p key={index} className="mt-1 text-[11px] text-[#525252]">- {item}</p>) : <p className="mt-1 text-[11px] text-[#6B6B6B]">No negative review themes found.</p>}</div>
              </div>
              <div className="mt-3 border-t border-[#E5E5E5] pt-3"><h3 className="text-[9px] font-bold uppercase tracking-wider text-[#6B6B6B]">Reviews by platform</h3><div className="mt-2 flex flex-wrap gap-2">{Object.entries(analysisReport.platform_breakdown).map(([platform, count]) => <span key={platform} className="rounded-full bg-[#FAFAF8] px-2.5 py-1 text-[10px] text-[#525252]">{platform}: {count}</span>)}</div></div>
              {analysisReport.reviews_included.length > 0 && <div className="mt-3 space-y-2 border-t border-[#E5E5E5] pt-3">{analysisReport.reviews_included.slice(0, 5).map(review => <div key={review.id} className="rounded-lg bg-[#FAFAF8] p-2.5"><div className="flex justify-between text-[10px] text-[#6B6B6B]"><strong className="text-[#1A1A1A]">{review.author}</strong><span>{review.platform} · {review.rating}★ · {review.sentiment_label}</span></div><p className="mt-1 text-[11px] text-[#525252]">{review.text}</p></div>)}</div>}
            </section>
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-4 mr-auto text-left items-center">
              <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center border bg-white border-[#E5E5E5] text-[#E8402B] shadow-3xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-[#E5E5E5] rounded-2xl px-4 py-2.5 text-xs text-[#6B6B6B] flex items-center gap-1.5 shadow-3xs">
                <span>Thinking</span>
                <span className="flex gap-0.5 items-center pt-1.5">
                  <span className="w-1 h-1 bg-[#E8402B] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1 h-1 bg-[#E8402B] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1 h-1 bg-[#E8402B] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* SUGGESTED ACTION CHIPS */}
      <div className="bg-white border-t border-[#E5E5E5] py-3.5 px-4 shrink-0 shadow-sm">
        <div className="max-w-3xl mx-auto flex gap-2 overflow-x-auto scrollbar-none w-full">
          <button 
            onClick={() => handleSendMessage(`Summarize ${activeProduct.name}`)}
            className="px-3 py-1.5 bg-[#FAFAF8] hover:bg-white border border-[#E5E5E5] hover:border-[#E8402B] rounded-full text-[10px] font-semibold text-[#6B6B6B] hover:text-[#E8402B] whitespace-nowrap cursor-pointer transition-colors shadow-3xs shrink-0"
          >
            💡 Summarize Workspace
          </button>
          <button 
            onClick={() => handleSendMessage(`What are the complaints for ${activeProduct.name}?`)}
            className="px-3 py-1.5 bg-[#FAFAF8] hover:bg-white border border-[#E5E5E5] hover:border-[#E8402B] rounded-full text-[10px] font-semibold text-[#6B6B6B] hover:text-[#E8402B] whitespace-nowrap cursor-pointer transition-colors shadow-3xs shrink-0"
          >
            ⚠️ Core Pain Points
          </button>
          <button 
            onClick={() => handleSendMessage(`Show positive sentiment index trend chart`)}
            className="px-3 py-1.5 bg-[#FAFAF8] hover:bg-white border border-[#E5E5E5] hover:border-[#E8402B] rounded-full text-[10px] font-semibold text-[#6B6B6B] hover:text-[#E8402B] whitespace-nowrap cursor-pointer transition-colors shadow-3xs shrink-0"
          >
            📈 Plot Sentiment Trend
          </button>
          <button 
            onClick={() => handleSendMessage(`Compare with other products`)}
            className="px-3 py-1.5 bg-[#FAFAF8] hover:bg-white border border-[#E5E5E5] hover:border-[#E8402B] rounded-full text-[10px] font-semibold text-[#6B6B6B] hover:text-[#E8402B] whitespace-nowrap cursor-pointer transition-colors shadow-3xs shrink-0"
          >
            ⚖️ Side-by-Side Comparison
          </button>
          <button 
            onClick={() => handleSendMessage(`Store channels ratings breakdown`)}
            className="px-3 py-1.5 bg-[#FAFAF8] hover:bg-white border border-[#E5E5E5] hover:border-[#E8402B] rounded-full text-[10px] font-semibold text-[#6B6B6B] hover:text-[#E8402B] whitespace-nowrap cursor-pointer transition-colors shadow-3xs shrink-0"
          >
            🏪 Source Breakdown
          </button>
        </div>
      </div>

      {/* INPUT FORM CONTAINER */}
      <footer className="p-4 bg-white border-t border-[#E5E5E5] shrink-0">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputVal);
          }}
          className="max-w-3xl mx-auto flex gap-2.5 items-center w-full"
        >
          <input 
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={`Ask Signal AI about ${activeProduct.name}... (e.g. show complaints)`}
            className="flex-1 bg-[#FAFAF8] border border-[#E5E5E5] rounded-xl px-4 py-3 text-xs text-[#1A1A1A] placeholder-[#6B6B6B]/70 focus:outline-none focus:border-[#E8402B] transition-colors shadow-3xs"
          />
          <button 
            type="submit"
            className="p-3 bg-[#E8402B] hover:bg-[#D03420] text-white rounded-xl shadow-sm border border-[#E8402B] cursor-pointer transition-colors shrink-0 flex items-center justify-center"
            title="Send Query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </footer>

    </div>
  );
}
