import { motion } from 'framer-motion';
import { 
  Layers, 
  Share2, 
  Star,
  Search,
  CheckCircle
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: 'landing' | 'app') => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  // Motion System Timing Tokens (Consistent timing variables)
  const motionSystem = {
    transitionSpringSnappy: { type: "spring" as const, stiffness: 220, damping: 18 },
    transitionSpringSmooth: { type: "spring" as const, stiffness: 80, damping: 14 },
    transitionEasePremium: { ease: [0.16, 1, 0.3, 1] as const, duration: 0.8 }
  };

  // Split title into words for staggered hero reveal
  const titleWords = "Review intelligence, synthesized.".split(" ");

  const wordContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.08
      }
    }
  };

  const wordItem = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: motionSystem.transitionSpringSmooth
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A] selection:bg-[#E8402B]/10 selection:text-[#E8402B] font-sans antialiased overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-[#FAFAF8]/80 backdrop-blur-md border-b border-[#E5E5E5] transition-all">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <span className="font-serif text-xl font-bold tracking-tight-title text-[#1A1A1A] flex items-center gap-1.5">
              <span>Signal</span>
              <span className="w-2 h-2 rounded-full bg-[#E8402B]"></span>
            </span>
            <div className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B]">
              <a href="#features" className="hover:text-[#1A1A1A] transition-colors">Features</a>
              <a href="#pipeline" className="hover:text-[#1A1A1A] transition-colors">AI Pipeline</a>
              <a href="#how-it-works" className="hover:text-[#1A1A1A] transition-colors">How it Works</a>
              <a href="#stats" className="hover:text-[#1A1A1A] transition-colors">Performance</a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('app')} 
              className="bg-[#E8402B] text-[#FAFAF8] hover:bg-[#D03420] text-xs font-bold uppercase tracking-wider py-2.5 px-5 rounded-lg shadow-sm border border-[#E8402B] transition-all cursor-pointer"
            >
              Launch Platform
            </motion.button>
          </div>
        </div>
      </nav>

      {/* 1. ASYMMETRICAL HERO SECTION */}
      <section className="relative py-20 lg:py-28 px-8 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column (60% Width): Staggered word display headline */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <motion.h1 
              variants={wordContainer}
              initial="hidden"
              animate="visible"
              className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight-title text-[#1A1A1A] leading-[0.95] flex flex-wrap gap-x-3 gap-y-1"
            >
              {titleWords.map((word, idx) => (
                <motion.span key={idx} variants={wordItem} className="inline-block">
                  {word}
                </motion.span>
              ))}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...motionSystem.transitionEasePremium, delay: 0.35 }}
              className="text-[14px] text-[#6B6B6B] leading-relaxed max-w-xl font-normal"
            >
              Signal aggregates feedback streams from Amazon, G2, Trustpilot, and Shopify—automatically extracting and ranking product issues by frequency and severity.
            </motion.p>
            
            {/* Primary Visual Action Box (Search input) */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...motionSystem.transitionEasePremium, delay: 0.45 }}
              className="w-full max-w-lg bg-white border border-[#E5E5E5] p-2 rounded-xl shadow-premium flex items-center gap-2"
            >
              <div className="pl-3 text-[#6B6B6B]">
                <Search className="w-4 h-4" />
              </div>
              <input 
                type="text" 
                placeholder="Enter your product/business name... (e.g. Aura Sleep Mask)" 
                className="flex-grow bg-transparent border-0 text-xs text-[#1A1A1A] placeholder-[#6B6B6B]/60 focus:outline-none py-2"
                onClick={() => onNavigate('app')}
                readOnly
              />
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('app')}
                className="bg-[#E8402B] text-[#FAFAF8] hover:bg-[#D03420] px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer border border-[#E8402B] transition-colors"
              >
                Analyze
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column (40% Width): Custom Layered Stack Visual */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="w-full max-w-[340px] h-[340px] relative select-none">
              
              {/* Back Card: Trustpilot ratings */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
                animate={{ opacity: 0.75, scale: 1, rotate: -4 }}
                transition={{ ...motionSystem.transitionSpringSmooth, delay: 0.3 }}
                whileHover={{ rotate: 0, scale: 1.02, opacity: 1, zIndex: 30 }}
                className="absolute top-0 left-4 w-full bg-white border border-[#E5E5E5] p-4 rounded-xl shadow-sm cursor-pointer transition-shadow"
              >
                <div className="flex justify-between items-center text-[8px] font-bold text-[#6B6B6B]">
                  <span>TRUSTPILOT STREAM</span>
                  <span className="text-[#1A1A1A]">★★★★★</span>
                </div>
                <div className="text-[11px] font-semibold mt-1 text-[#1A1A1A]">Silk mask comfort</div>
                <p className="text-[9px] text-[#6B6B6B] leading-normal mt-0.5">
                  "The premium mulberry silk is cooling and does not irritate skin."
                </p>
              </motion.div>

              {/* Middle Card: Amazon negative spike (Signal Red accent) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: 6 }}
                animate={{ opacity: 1, scale: 1, rotate: 2 }}
                transition={{ ...motionSystem.transitionSpringSmooth, delay: 0.4 }}
                whileHover={{ rotate: 0, scale: 1.02, zIndex: 30 }}
                className="absolute top-16 left-0 w-full bg-white border-2 border-[#E8402B]/30 p-4 rounded-xl shadow-md cursor-pointer"
              >
                <div className="flex justify-between items-center text-[8px] font-extrabold text-[#E8402B]">
                  <span>AMAZON INGESTION</span>
                  <span className="bg-[#E8402B]/10 px-1.5 py-0.5 rounded text-[7.5px] font-bold uppercase">Spike Alert</span>
                </div>
                <div className="text-[11px] font-bold text-[#1A1A1A] mt-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8402B]"></span>
                  <span>Bluetooth pairing dropoffs</span>
                </div>
                
                {/* Growing progress bar mockup in Signal Red */}
                <div className="w-full bg-zinc-150 h-1.5 rounded-full overflow-hidden mt-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "78%" }}
                    transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-[#E8402B] rounded-full"
                  ></motion.div>
                </div>
              </motion.div>

              {/* Front Card: AI Priorities output (Dark Charcoal + Signal Red) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ ...motionSystem.transitionSpringSmooth, delay: 0.5 }}
                whileHover={{ scale: 1.03, rotate: 0, zIndex: 30 }}
                className="absolute top-36 left-6 w-full bg-[#1A1A1A] text-[#FAFAF8] p-4 rounded-xl shadow-lg cursor-pointer border border-[#333333]"
              >
                <div className="flex justify-between items-center text-[8px] font-bold text-[#A3A3A3]">
                  <span>SIGNAL PRIORITIES</span>
                  <span className="font-mono text-[#E8402B]">P0 CRITICAL</span>
                </div>
                
                {/* Drawing line chart path animation in Signal Red */}
                <div className="h-8 w-full relative my-2">
                  <svg className="w-full h-full text-[#E8402B]" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
                    <motion.path 
                      d="M 0 25 Q 20 5 40 22 T 80 5 T 100 12" 
                      initial={{ strokeDashoffset: 120, strokeDasharray: 120 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 1.6, delay: 0.8, ease: "easeOut" }}
                    />
                  </svg>
                </div>

                <div className="flex justify-between items-center pt-2.5 border-t border-[#333333] text-[9px] text-[#A3A3A3]">
                  <span className="bg-[#E8402B]/20 text-[#E8402B] px-1.5 py-0.5 rounded text-[8px] font-bold border border-[#E8402B]/40 uppercase">High Severity</span>
                  <span className="font-mono text-[#FAFAF8]">Firmware Team</span>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. ON-BRAND PROCESSING PIPELINE (True Charcoal #1A1A1A Section) */}
      <section id="pipeline" className="py-24 bg-[#1A1A1A] text-[#FAFAF8] border-y border-black px-8 relative overflow-hidden">
        
        {/* Subtle red background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E8402B]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto space-y-16 relative z-10">
          
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#E8402B]">Synthesizer Core</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-white leading-tight">
              Ingestion to roadmap priority mapping
            </h2>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              We process hundreds of qualitative review paragraphs and convert them into prioritized roadmaps.
            </p>
          </div>

          {/* Sequential scroll-triggered build grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Step 1: Raw review stack (Slides in first) */}
            <motion.div 
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={motionSystem.transitionEasePremium}
              className="lg:col-span-4 bg-[#262626] border border-[#333333] p-6 rounded-xl space-y-6 text-left flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[8.5px] font-bold text-[#A3A3A3] uppercase tracking-widest block">Input channel Ingestion</span>
                <h4 className="text-sm font-semibold text-white">1. Aggregated Feedback Stream</h4>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  Raw reviews from online platforms are continuously polled and matched against brand metadata rules.
                </p>
              </div>

              {/* Ingestion cards */}
              <div className="space-y-3">
                <div className="bg-[#1A1A1A] border border-[#333333] p-3 rounded-lg flex items-center justify-between text-[10px]">
                  <span className="text-[#FAFAF8] font-medium">Amazon ASIN</span>
                  <span className="text-[#A3A3A3] font-mono">1,820 rows</span>
                </div>
                <div className="bg-[#1A1A1A] border border-[#333333] p-3 rounded-lg flex items-center justify-between text-[10px]">
                  <span className="text-[#FAFAF8] font-medium">Shopify Webhook</span>
                  <span className="text-[#A3A3A3] font-mono">450 rows</span>
                </div>
              </div>
            </motion.div>

            {/* Step 2: Signal Synthesis Node (Scale-reveals next) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ ...motionSystem.transitionEasePremium, delay: 0.25 }}
              className="lg:col-span-4 bg-[#E8402B]/10 border border-[#E8402B]/40 p-6 rounded-xl space-y-6 text-left flex flex-col justify-between relative"
            >
              <div className="space-y-2">
                <span className="text-[8.5px] font-bold text-[#E8402B] uppercase tracking-widest block">Signal AI Classifier</span>
                <h4 className="text-sm font-semibold text-white">2. Natural Language Parsing</h4>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  Our system aggregates duplicate terms, filters noise, and groups customer concerns by sentiment.
                </p>
              </div>

              {/* Parser visual with Signal Red glowing pulse */}
              <div className="bg-[#1A1A1A] border border-[#333333] p-4 rounded-lg flex flex-col items-center justify-center space-y-3 min-h-[100px]">
                <div className="flex gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E8402B] animate-pulse"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F2A399] animate-pulse"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6B6B6B] animate-pulse"></span>
                </div>
                <span className="text-[8.5px] font-mono text-[#A3A3A3] uppercase tracking-widest">Parsing sentiment logs...</span>
              </div>
            </motion.div>

            {/* Step 3: Prioritized output (Slides in last) */}
            <motion.div 
              initial={{ opacity: 0, x: 35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ ...motionSystem.transitionEasePremium, delay: 0.45 }}
              className="lg:col-span-4 bg-[#262626] border border-[#333333] p-6 rounded-xl space-y-6 text-left flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[8.5px] font-bold text-[#A3A3A3] uppercase tracking-widest block">Engineering Output</span>
                <h4 className="text-sm font-semibold text-white">3. Priority Action Index</h4>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  Identified issues are pushed as Slack alerts or auto-converted into active Jira engineering tickets.
                </p>
              </div>

              {/* Mock tickets in red tints */}
              <div className="space-y-2.5">
                <div className="border border-[#333333] bg-[#1A1A1A] p-2.5 rounded-lg text-[9.5px] flex justify-between items-center">
                  <span className="text-[#E8402B] font-bold">Bluetooth dropoffs</span>
                  <span className="text-[8px] bg-[#E8402B]/20 text-[#E8402B] border border-[#E8402B]/30 px-2 py-0.5 rounded">JIRA TICKET CREATED</span>
                </div>
                <div className="border border-[#333333] bg-[#1A1A1A] p-2.5 rounded-lg text-[9.5px] flex justify-between items-center">
                  <span className="text-[#FAFAF8] font-bold">Silk texture positive</span>
                  <span className="text-[8px] bg-zinc-800 text-[#A3A3A3] border border-zinc-700 px-2 py-0.5 rounded">AUTO-TAGGED</span>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 3. BENTO FEATURES GRID WITH VARIED CARD LAYOUTS (Cleared Padding overlapping bug) */}
      <section id="features" className="py-24 bg-[#FAFAF8] border-b border-[#E5E5E5] px-8 pb-48">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Header block (visual anchor) */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={motionSystem.transitionEasePremium}
            className="text-left space-y-3 max-w-xl"
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#E8402B]">Product Capabilities</div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A]">
              Everything you need to debug user complaints
            </h2>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              Consolidate review parameters to prioritize bugs, measure sentiments, and integrate tickets.
            </p>
          </motion.div>

          {/* Varied Bento Grid (Snappy spring magnetic hover states) */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            
            {/* Card A: Text-heavy / Platform Integration volume (Spans 4 columns) */}
            <motion.div 
              whileHover={{ y: -4, scale: 1.01, boxShadow: "0 20px 40px rgba(0,0,0,0.03)" }}
              transition={motionSystem.transitionSpringSnappy}
              className="md:col-span-4 bg-white border border-[#E5E5E5] rounded-xl p-6 text-left flex flex-col justify-between shadow-premium cursor-pointer"
            >
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-lg bg-[#E8402B]/10 flex items-center justify-center text-[#E8402B] border border-[#E8402B]/20">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#1A1A1A]">Aggregate client reviews</h3>
                <p className="text-xs text-[#6B6B6B] max-w-md leading-relaxed">
                  Consolidate review channels from Amazon, Trustpilot, G2, Yelp, and Shopify into one unified database. Filter by platform metadata.
                </p>
              </div>

              {/* Horizontal custom bar distribution visual */}
              <div className="space-y-3 pt-6 border-t border-[#E5E5E5] mt-6">
                <div className="text-[9px] font-bold uppercase text-[#6B6B6B]">Review Ingestion Ratio</div>
                <div className="space-y-2">
                  {[
                    { name: 'Amazon Store', val: '64%', color: 'bg-[#E8402B]' },
                    { name: 'Trustpilot API', val: '22%', color: 'bg-[#F2A399]' },
                    { name: 'G2 Reviews', val: '14%', color: 'bg-zinc-400' }
                  ].map((ratio, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-[10px]">
                      <span className="w-24 text-[#6B6B6B] font-semibold">{ratio.name}</span>
                      <div className="flex-grow bg-zinc-100 h-2 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: ratio.val }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.1 * idx, ease: "easeOut" }}
                          className={`h-full rounded-full ${ratio.color}`}
                        ></motion.div>
                      </div>
                      <span className="font-mono text-[#6B6B6B] w-8 text-right">{ratio.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Card B: Single Metric Focal Highlight (Spans 2 columns - Dark Charcoal + Signal Red) */}
            <motion.div 
              whileHover={{ y: -4, scale: 1.01, boxShadow: "0 20px 40px rgba(0,0,0,0.03)" }}
              transition={motionSystem.transitionSpringSnappy}
              className="md:col-span-2 bg-[#1A1A1A] text-[#FAFAF8] border border-[#333333] rounded-xl p-6 text-left flex flex-col justify-between shadow-premium cursor-pointer"
            >
              <div className="space-y-1">
                <span className="text-[8.5px] font-bold text-[#E8402B] uppercase tracking-wider block">Scale</span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Aggregations Limit</h4>
              </div>

              {/* Huge typography focal point */}
              <div className="py-6">
                <div className="text-5xl font-extrabold font-mono tracking-tight text-[#FAFAF8] leading-none">10k+</div>
                <p className="text-[10px] text-[#A3A3A3] leading-relaxed mt-2">
                  Customer comments processed and cataloged per workspace stream daily.
                </p>
              </div>

              <div className="border-t border-[#333333] pt-4 text-[9px] font-semibold text-[#E8402B] flex items-center gap-1.5 uppercase">
                <CheckCircle className="w-3.5 h-3.5 text-[#E8402B]" />
                <span>Infinite database storage</span>
              </div>
            </motion.div>

            {/* Card C: Sentiment visual tracker with SVG dial (Spans 2 columns) */}
            <motion.div 
              whileHover={{ y: -4, scale: 1.01, boxShadow: "0 20px 40px rgba(0,0,0,0.03)" }}
              transition={motionSystem.transitionSpringSnappy}
              className="md:col-span-2 bg-white border border-[#E5E5E5] rounded-xl p-6 text-left flex flex-col justify-between shadow-premium cursor-pointer"
            >
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-lg bg-[#E8402B]/10 flex items-center justify-center text-[#E8402B] border border-[#E8402B]/20">
                  <Star className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#1A1A1A]">AI Sentiment index</h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  Real-time ratio metrics indicating overall customer satisfaction indices.
                </p>
              </div>

              {/* SVG circular dial visual with Signal Red */}
              <div className="flex justify-center items-center py-4">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-zinc-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <motion.path 
                      initial={{ strokeDasharray: "0, 100" }}
                      whileInView={{ strokeDasharray: "92, 100" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="text-[#E8402B]" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      stroke="currentColor" 
                      fill="none" 
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold font-mono text-[#1A1A1A]">92%</div>
                </div>
              </div>
            </motion.div>

            {/* Card D: Ticket & Sync Integrations (Spans 4 columns - Dark Charcoal) */}
            <motion.div 
              whileHover={{ y: -4, scale: 1.01, boxShadow: "0 20px 40px rgba(0,0,0,0.03)" }}
              transition={motionSystem.transitionSpringSnappy}
              className="md:col-span-4 bg-[#1A1A1A] text-[#FAFAF8] rounded-xl p-6 text-left flex flex-col justify-between border border-[#333333] shadow-premium cursor-pointer"
            >
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-lg bg-[#E8402B]/10 flex items-center justify-center text-[#E8402B] border border-[#E8402B]/30">
                  <Share2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Developer Integration Synced</h3>
                <p className="text-xs text-[#A3A3A3] max-w-md leading-relaxed">
                  Send insights straight to Slack channels or generate pre-populated Jira engineering tickets with a single click.
                </p>
              </div>

              {/* Side-by-side mock tickets */}
              <div className="grid sm:grid-cols-2 gap-4 pt-6 border-t border-[#333333] mt-6">
                <div className="bg-[#262626] border border-[#333333] p-3 rounded-lg space-y-2">
                  <div className="text-[9px] font-bold text-[#E8402B] bg-[#E8402B]/20 px-2 py-0.5 rounded border border-[#E8402B]/30 w-fit">SLACK ALERT</div>
                  <div className="text-[10px] text-[#FAFAF8] italic font-mono truncate">#prod_alerts: bluetooth drop spike</div>
                </div>
                <div className="bg-[#262626] border border-[#333333] p-3 rounded-lg space-y-2">
                  <div className="text-[9px] font-bold text-[#E8402B] bg-[#E8402B]/20 px-2 py-0.5 rounded border border-[#E8402B]/30 w-fit">JIRA TASK</div>
                  <div className="text-[10px] text-[#FAFAF8] italic font-mono truncate">AURA-230: reconnect bluetooth</div>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 4. WORKFLOW TIMELINE */}
      <section id="how-it-works" className="py-24 bg-[#1A1A1A] text-[#FAFAF8] border-y border-black px-8">
        <div className="max-w-6xl mx-auto space-y-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={motionSystem.transitionEasePremium}
            className="text-center space-y-3 max-w-xl mx-auto"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E8402B]">Workflow Sequence</span>
            <h2 className="font-serif text-3xl font-bold text-white tracking-tight">
              Three steps to absolute review clarity
            </h2>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Our analysis model processes your product review data in real time, identifying repeating words, sentiment markers, and priority bugs.
            </p>
          </motion.div>

          {/* Timeline steps */}
          <div className="grid md:grid-cols-3 gap-8 relative border-t border-[#333333] pt-12">
            {[
              { num: '01', title: 'Enter a product name', desc: 'Input your brand name, ASIN, Shopify store link, or local coordinates. Signal immediately finds all registered reviews.' },
              { num: '02', title: 'AI processes reviews', desc: 'Our model aggregates keywords, clusters complaints, checks ratings over time, and generates a prose sentiment summary.' },
              { num: '03', title: 'Get ranked insights', desc: 'Browse positive and negative keyword groupings, track priority thresholds, and start debugging your product.' }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...motionSystem.transitionEasePremium, delay: idx * 0.1 }}
                className="space-y-4 text-left"
              >
                <div className="font-serif text-5xl font-light text-[#E8402B]/40">{step.num}</div>
                <h3 className="font-semibold text-white text-xs uppercase tracking-wide">{step.title}</h3>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS & STATS */}
      <section id="stats" className="py-24 bg-[#1A1A1A] text-[#FAFAF8] px-8 border-t border-[#333333]">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="grid sm:grid-cols-3 gap-12 border-b border-[#333333] pb-16 text-left">
            {[
              { val: '10,000+', lbl: 'reviews analyzed daily' },
              { val: '6', lbl: 'major platforms supported' },
              { val: 'Minutes', lbl: 'instead of hours of work' }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="space-y-2"
              >
                <div className="text-4xl font-bold font-mono tracking-tight text-[#E8402B]">
                  {stat.val}
                </div>
                <div className="text-[10px] text-[#A3A3A3] uppercase tracking-widest font-bold">
                  {stat.lbl}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-8 text-left">
            <h3 className="font-serif text-xl font-bold text-white">Trust by Operations Teams</h3>
            <div className="grid md:grid-cols-2 gap-8">
              
              <motion.div 
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={motionSystem.transitionEasePremium}
                className="bg-[#262626] border border-[#333333] p-6 rounded-xl space-y-4 shadow-sm"
              >
                <p className="text-xs text-[#A3A3A3] leading-relaxed italic">
                  "Signal has completely changed how we handle customer returns. We identified the faulty USB charging module on our mask within 48 hours of product delivery spikes."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center font-bold text-xs text-[#E8402B] border border-[#333333]">A</div>
                  <div className="text-[11px]">
                    <div className="font-bold text-white">Alex Mercer</div>
                    <div className="text-[#A3A3A3] font-medium">Head of QA, Aura Labs</div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ ...motionSystem.transitionEasePremium, delay: 0.15 }}
                className="bg-[#262626] border border-[#333333] p-6 rounded-xl space-y-4 shadow-sm"
              >
                <p className="text-xs text-[#A3A3A3] leading-relaxed italic">
                  "Instead of having our engineers scroll through Shopify and Trustpilot forums, we just check Signal's slack notification integrations every Monday. Unmatched developer time saver."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center font-bold text-xs text-[#E8402B] border border-[#333333]">S</div>
                  <div className="text-[11px]">
                    <div className="font-bold text-white">Sarah Connor</div>
                    <div className="text-[#A3A3A3] font-medium">Operations Lead, ByteCRM</div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </section>

      {/* 6. DISTINCTIVE CTA BLOCK */}
      <section className="py-16 px-8 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.99 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={motionSystem.transitionEasePremium}
          className="bg-[#1A1A1A] text-[#FAFAF8] border border-[#333333] rounded-2xl p-12 text-center space-y-6 shadow-premium relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#E8402B]/10 to-transparent rounded-2xl pointer-events-none"></div>
          
          <div className="relative z-10 space-y-6 max-w-lg mx-auto">
            <h2 className="font-serif text-3xl font-bold tracking-tight-title text-white">
              Start extracting customer intelligence today
            </h2>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Analyze reviews, map client sentiments, and classify priority flaws within minutes. Free trial included. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 items-center pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('app')}
                className="bg-[#E8402B] hover:bg-[#D03420] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded-lg shadow-sm border border-[#E8402B] transition-all cursor-pointer"
              >
                Launch Workspace
              </motion.button>
            </div>
          </div>

        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#E5E5E5] py-12 px-8 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B]">
          <div className="flex items-center gap-2 lowercase normal-case">
            <span className="font-serif text-base font-semibold text-[#1A1A1A]">Signal</span>
            <span className="text-xs text-[#6B6B6B]">• © {new Date().getFullYear()} Signal Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-[#1A1A1A] transition-colors">Features</a>
            <a href="#pipeline" className="hover:text-[#1A1A1A] transition-colors">AI Pipeline</a>
            <a href="#how-it-works" className="hover:text-[#1A1A1A] transition-colors">How it Works</a>
            <a href="#stats" className="hover:text-[#1A1A1A] transition-colors">Performance</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
