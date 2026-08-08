import { useState, useEffect } from 'react';
import { Menu, X, Settings, Sliders, Mail, UserPlus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CompareProducts from './components/CompareProducts';
import { mockProducts } from './mock-data';
import type { Product } from './mock-data';

export default function App() {
  // Routing State
  const [page, setPage] = useState<'landing' | 'app'>('landing');
  
  // Data State
  const [products, setProducts] = useState<Product[]>(mockProducts);
  
  // Active states
  const [selectedProductId, setSelectedProductId] = useState<string | null>("aura-sleep-mask");
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const startResizing = (mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    const startWidth = sidebarWidth;
    const startX = mouseDownEvent.clientX;

    const doDrag = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      if (newWidth >= 180 && newWidth <= 400) {
        setSidebarWidth(newWidth);
      }
    };

    const stopDrag = () => {
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
    };

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
  };

  // Settings mock inputs
  const [inviteEmail, setInviteEmail] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Close mobile sidebar on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const triggerAppToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Toggle Pinned status
  const handlePinProduct = (productId: string) => {
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === productId ? { ...p, isPinned: !p.isPinned } : p
      )
    );
  };

  // Select a product (exit compare mode)
  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCompareMode(false);
    setIsMobileSidebarOpen(false);
  };

  // Update status dropdown of a keyword issue
  const handleUpdateIssueStatus = (
    productId: string, 
    issueId: string, 
    newStatus: 'Investigating' | 'Fixed' | 'Ignored'
  ) => {
    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id !== productId) return p;
        return {
          ...p,
          rankedIssues: p.rankedIssues.map(issue => 
            issue.id === issueId ? { ...issue, status: newStatus } : issue
          )
        };
      })
    );
    triggerAppToast(`Updated status to ${newStatus}`);
  };

  // Mock team invite submission
  const handleInviteTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail.trim()) {
      triggerAppToast(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFAF8] text-[#1A1A1F] antialiased">
      {/* Toast Alert overlay */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-[#FAFAF8] text-xs font-semibold py-2.5 px-5 rounded-lg shadow-md border border-[#333333] z-50 flex items-center gap-2">
          <Check className="w-4 h-4 text-[#E8402B]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* PAGE 1: LANDING PAGE */}
      {page === 'landing' && (
        <LandingPage onNavigate={setPage} />
      )}

      {/* PAGE 2: DASHBOARD WORKSPACE */}
      {page === 'app' && (
        <div className="flex h-screen overflow-hidden bg-[#FBFAF8]">
          
          {/* SIDEBAR PANEL - Desktop (Static & Resizable) */}
          <div 
            className="hidden md:block transition-[width] duration-75 ease-out flex-shrink-0 relative"
            style={{ width: isSidebarCollapsed ? '64px' : `${sidebarWidth}px` }}
          >
            <Sidebar
              products={products}
              selectedProductId={selectedProductId || products[0].id}
              onSelectProduct={handleSelectProduct}
              onNavigate={setPage}
              onOpenCompare={() => setCompareMode(!compareMode)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              width={sidebarWidth}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              onResizeStart={startResizing}
            />
          </div>

          {/* SIDEBAR PANEL - Mobile Drawer Overlay */}
          <div className={`fixed inset-0 z-40 md:hidden transition-transform ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div 
              className="absolute inset-0 bg-[#1A1A1A]/50 backdrop-blur-xs" 
              onClick={() => setIsMobileSidebarOpen(false)}
            ></div>
            <div className="relative w-64 h-full bg-[#1A1A1A] shadow-xl flex flex-col z-10">
              {/* Close Drawer Button */}
              <div className="p-4 border-b border-[#333333] flex justify-between items-center text-white bg-[#1A1A1A]">
                <span className="font-serif text-lg font-semibold">Signal Menu</span>
                <button 
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 hover:bg-[#262626] rounded text-[#A3A3A3] hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Sidebar
                products={products}
                selectedProductId={selectedProductId || products[0].id}
                onSelectProduct={handleSelectProduct}
                onNavigate={setPage}
                onOpenCompare={() => {
                  setCompareMode(!compareMode);
                  setIsMobileSidebarOpen(false);
                }}
                onOpenSettings={() => {
                  setIsSettingsOpen(true);
                  setIsMobileSidebarOpen(false);
                }}
                width={256}
                isCollapsed={false}
                onToggleCollapse={() => {}}
                onResizeStart={() => {}}
              />
            </div>
          </div>

          {/* MAIN CONTAINER WORKSPACE */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            
            {/* Mobile Header Trigger */}
            <div className="h-14 border-b border-hairline bg-[#FAFAF8] flex items-center justify-between px-6 md:hidden">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-2 border border-hairline hover:bg-white rounded-lg text-zinc-700 cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
              <span className="font-serif text-lg font-semibold tracking-tight">Signal</span>
              <div className="w-9 h-9"></div> {/* spacing placeholder */}
            </div>

            {/* Core Panels Wrapper */}
            <div className={`flex-1 min-w-0 ${compareMode ? 'overflow-y-auto' : 'overflow-hidden flex flex-col'}`}>
              {compareMode ? (
                <div className="p-8">
                  <CompareProducts
                    products={products}
                    onClose={() => setCompareMode(false)}
                  />
                </div>
              ) : (
                <Dashboard
                  products={products}
                  selectedProductId={selectedProductId || products[0].id}
                  onPinProduct={handlePinProduct}
                  onUpdateIssueStatus={handleUpdateIssueStatus}
                />
              )}
            </div>

          </div>

          {/* WORKSPACE SETTINGS MODAL DRAWER */}
          <AnimatePresence>
            {isSettingsOpen && (
              <div className="fixed inset-0 z-50 flex justify-end">
                {/* Backdrop overlay */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-[#14141A]/60 backdrop-blur-xs" 
                  onClick={() => setIsSettingsOpen(false)}
                ></motion.div>

                {/* Sidebar Drawer Panel */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween', duration: 0.25 }}
                  className="relative w-full max-w-md h-full bg-[#FBFAF8] border-l border-[#E5E3DD] shadow-xl p-6 overflow-y-auto text-left z-10 flex flex-col justify-between"
                >
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-hairline pb-4">
                      <div className="flex items-center gap-2 text-[#E8402B]">
                        <Settings className="w-5 h-5" />
                        <h4 className="font-serif text-xl font-semibold tracking-tight text-[#1A1A1A]">
                          Workspace Settings
                        </h4>
                      </div>
                      <button 
                        onClick={() => setIsSettingsOpen(false)}
                        className="p-1 hover:bg-zinc-200 rounded-lg text-[#6B6B6B] hover:text-[#1A1A1A] cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Team Workspace sharing settings */}
                    <div className="space-y-3 bg-white border border-hairline p-4 rounded-xl shadow-2xs text-left">
                      <div className="flex items-center gap-2 text-[#1A1A1A]">
                        <UserPlus className="w-4 h-4 text-[#E8402B]" />
                        <h5 className="text-[10px] font-bold uppercase tracking-wider">Invite Teammates</h5>
                      </div>
                      <p className="text-[11px] text-[#6B6B6B] leading-relaxed">
                        Teammates invited here will share access to product search histories, Slack notifications, and engineering tickets.
                      </p>
                      
                      <form onSubmit={handleInviteTeam} className="flex gap-2">
                        <input
                          type="email"
                          required
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="developer@acme.com"
                          className="flex-1 bg-[#FAFAF8] border border-[#E5E5E5] rounded-lg px-3 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#E8402B]"
                        />
                        <button
                          type="submit"
                          className="bg-[#E8402B] hover:bg-[#D03420] text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg shrink-0 border border-[#E8402B] cursor-pointer"
                        >
                          Invite
                        </button>
                      </form>
                    </div>

                    {/* Email Digest Settings */}
                    <div className="space-y-3 bg-white border border-hairline p-4 rounded-xl shadow-2xs text-left">
                      <div className="flex items-center gap-2 text-[#1A1A1A]">
                        <Mail className="w-4 h-4 text-[#E8402B]" />
                        <h5 className="text-[10px] font-bold uppercase tracking-wider">Email Digest Settings</h5>
                      </div>
                      <p className="text-[11px] text-[#6B6B6B] leading-relaxed">
                        Track product health automatically. Receive a weekly summarized digest of reviews directly to your inbox.
                      </p>
                      <div className="flex items-center justify-between border-t border-[#E5E5E5] pt-3">
                        <span className="text-xs font-medium text-[#1A1A1A]">Send Weekly Review Digest</span>
                        <button
                          onClick={() => triggerAppToast("Weekly digest schedule updated.")}
                          className="text-[9px] uppercase font-bold border border-[#E5E5E5] hover:bg-[#FAFAF8] px-2.5 py-1 rounded-md cursor-pointer transition-colors text-[#1A1A1A]"
                        >
                          Configured (Active)
                        </button>
                      </div>
                    </div>

                    {/* General API access key */}
                    <div className="space-y-3 bg-white border border-hairline p-4 rounded-xl shadow-2xs text-left">
                      <div className="flex items-center gap-2 text-[#1A1A1A]">
                        <Sliders className="w-4 h-4 text-[#E8402B]" />
                        <h5 className="text-[10px] font-bold uppercase tracking-wider">API Integration Token</h5>
                      </div>
                      <p className="text-[11px] text-[#6B6B6B] leading-relaxed">
                        Use this token to query Signal analytics programmatically or hook up custom webhooks.
                      </p>
                      <div className="bg-[#FAFAF8] border border-hairline p-2.5 rounded-lg font-mono text-[9px] break-all select-all text-[#1A1A1A] relative group cursor-pointer" title="Click to select all">
                        sig_live_9fae8b1d2e4f0c78a9c3d
                      </div>
                    </div>

                  </div>

                  {/* Settings footer */}
                  <div className="border-t border-[#E5E5E5] pt-4 mt-6 flex justify-between items-center text-xs text-[#6B6B6B]">
                    <span>Workspace: <strong className="text-[#1A1A1A]">Jane's Acme Team</strong></span>
                    <button 
                      onClick={() => setIsSettingsOpen(false)}
                      className="bg-[#E8402B] hover:bg-[#D03420] text-white py-1.5 px-4 rounded-lg font-bold text-[10px] uppercase tracking-wider border border-[#E8402B] cursor-pointer"
                    >
                      Close Settings
                    </button>
                  </div>

                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      )}

    </div>
  );
}
