import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthPageProps {
  onNavigate: (page: 'landing' | 'auth' | 'app') => void;
}

export default function AuthPage({ onNavigate }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('demo@signal.ai');
  const [password, setPassword] = useState('••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onNavigate('app');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-[#FAFAF8] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Dynamic Background Signal Red Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#E8402B]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#E8402B]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2 select-none">
          <button 
            onClick={() => onNavigate('landing')}
            className="font-serif text-3xl font-bold tracking-tight text-[#FAFAF8] hover:text-[#E8402B] transition-colors cursor-pointer bg-transparent border-none flex items-center justify-center gap-1.5 mx-auto"
          >
            <span>Signal</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#E8402B]"></span>
          </button>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#A3A3A3]">
            AI Product Review Intelligence
          </p>
        </div>

        {/* Unified Premium Dark Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="p-1 bg-[#262626] border border-[#333333] rounded-2xl shadow-2xl backdrop-blur-md"
        >
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 sm:p-8 space-y-6">
            
            <div className="space-y-1.5 text-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                {isSignUp ? 'Create Account' : 'Workspace Login'}
              </h3>
              <p className="text-xs text-[#A3A3A3]">
                {isSignUp ? 'Initialize a new review analytics workspace' : 'Enter credentials to access active insights'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email */}
              <div className="space-y-1.5 text-left">
                <label htmlFor="email" className="block text-[9px] font-bold uppercase tracking-wider text-[#A3A3A3]">
                  Work Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#6B6B6B] pointer-events-none">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-[#262626] border border-[#333333] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-[#6B6B6B] focus:outline-none focus:border-[#E8402B] transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5 text-left">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-[9px] font-bold uppercase tracking-wider text-[#A3A3A3]">
                    Password
                  </label>
                  {!isSignUp && (
                    <a href="#" className="text-[9.5px] text-[#E8402B] font-semibold hover:underline">
                      Forgot Password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#6B6B6B] pointer-events-none">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#262626] border border-[#333333] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-[#6B6B6B] focus:outline-none focus:border-[#E8402B] transition-colors"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#E8402B] text-white hover:bg-[#D03420] py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5 group cursor-pointer border border-[#E8402B]"
              >
                {isLoading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>{isSignUp ? 'Build Workspace' : 'Enter Workspace'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

            </form>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#333333]"></div>
              <span className="flex-shrink mx-3 text-[8.5px] font-bold uppercase tracking-widest text-[#6B6B6B]">Or SSO</span>
              <div className="flex-grow border-t border-[#333333]"></div>
            </div>

            {/* SSO Mock Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button" 
                onClick={() => onNavigate('app')}
                className="flex items-center justify-center gap-1.5 bg-[#262626] border border-[#333333] hover:bg-[#333333] py-2 px-3 rounded-lg text-[9.5px] font-bold uppercase tracking-wider text-[#FAFAF8] transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-[#E8402B]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042a2.528 2.528 0 0 1-2.522 2.52H8.803a2.528 2.528 0 0 1-2.52-2.52v-5.042zM8.803 5.042a2.528 2.528 0 0 1 2.52-2.52 2.528 2.528 0 0 1 2.522 2.52v2.52h-2.522a2.528 2.528 0 0 1-2.52-2.52zm0 1.261a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.522 2.52H3.761a2.528 2.528 0 0 1-2.522-2.52V8.824a2.528 2.528 0 0 1 2.522-2.52h5.042zm10.155 3.761a2.528 2.528 0 0 1 2.522-2.52 2.528 2.528 0 0 1 2.52 2.52v2.52h-2.52a2.528 2.528 0 0 1-2.522-2.52zm-1.262 0a2.528 2.528 0 0 1-2.52 2.52H10.13a2.528 2.528 0 0 1-2.52-2.52V3.761a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042zm-3.761 10.155a2.528 2.528 0 0 1-2.52 2.522 2.528 2.528 0 0 1-2.522-2.522v-2.52h2.522a2.528 2.528 0 0 1 2.52 2.52zm0-1.262a2.528 2.528 0 0 1-2.52-2.52v-5.043a2.528 2.528 0 0 1 2.52-2.522h5.043a2.528 2.528 0 0 1 2.522 2.522v5.043a2.528 2.528 0 0 1-2.522 2.52h-5.043z" />
                </svg>
                <span>Slack</span>
              </button>
              <button 
                type="button" 
                onClick={() => onNavigate('app')}
                className="flex items-center justify-center gap-1.5 bg-[#262626] border border-[#333333] hover:bg-[#333333] py-2 px-3 rounded-lg text-[9.5px] font-bold uppercase tracking-wider text-[#FAFAF8] transition-colors cursor-pointer"
              >
                <svg className="w-3 h-3 text-[#FAFAF8]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.69c-.29 1.5-.1.14-1.14 2.84l3.11 2.42c1.8-1.67 2.94-4.14 2.94-7.09z" fill="#4285F4"/>
                  <path d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.11-2.42c-.9.6-2.01.97-3.25.97-2.5 0-4.6-1.69-5.35-3.97l-3.2 2.48C7.01 22.06 9.3 24 12 24z" fill="#34A853"/>
                  <path d="M6.65 15.67c-.2-.6-.31-1.25-.31-1.92s.11-1.32.31-1.92l-3.2-2.48C2.69 10.87 2 12.37 2 14s.69 3.13 1.45 4.65l3.2-2.48z" fill="#FBBC05"/>
                  <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0 9.3 0 7.01 1.94 5.25 4.65l3.2 2.48c.75-2.28 2.85-3.97 5.35-3.97z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
              </button>
            </div>

            {/* Toggle Sign Up / In */}
            <div className="text-center pt-2 text-xs text-[#A3A3A3]">
              {isSignUp ? 'Already have an account?' : 'New to Signal?'}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-1 text-[#E8402B] font-bold hover:underline bg-transparent border-none cursor-pointer"
              >
                {isSignUp ? 'Sign In' : 'Create Free Account'}
              </button>
            </div>

          </div>
        </motion.div>

        {/* Security badges footer */}
        <div className="flex justify-center items-center gap-6 text-[10px] text-[#A3A3A3] font-medium tracking-wide">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#E8402B]" />
            <span>SOC2 Compliant</span>
          </div>
          <span>•</span>
          <span>SSL Secure 256-bit</span>
        </div>

      </div>

    </div>
  );
}
