import { useState } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Pin, 
  Search,
  LogOut,
  SlidersHorizontal
} from 'lucide-react';
import type { Product } from '../mock-data';

interface SidebarProps {
  products: Product[];
  selectedProductId: string;
  onSelectProduct: (id: string) => void;
  onNavigate: (page: 'landing' | 'app') => void;
  onOpenCompare: () => void;
  onOpenSettings: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  width: number;
  onResizeStart: (e: React.MouseEvent) => void;
}

export default function Sidebar({
  products,
  selectedProductId,
  onSelectProduct,
  onNavigate,
  onOpenCompare,
  onOpenSettings,
  isCollapsed,
  onToggleCollapse,
  width,
  onResizeStart
}: SidebarProps) {
  const [filterQuery, setFilterQuery] = useState('');

  // Filtered pinned and all products
  const pinnedProducts = products.filter(p => p.isPinned);
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <aside 
      className="flex flex-col h-full bg-[#1A1A1A] text-[#FAFAF8] border-r border-[#333333] select-none relative group"
      style={{ width: isCollapsed ? '64px' : `${width}px` }}
    >
      
      {/* 1. SIDEBAR HEADER LOGO */}
      <div className="h-16 border-b border-[#333333] px-4 flex items-center justify-between shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center justify-between w-full">
            <button 
              onClick={() => onNavigate('landing')}
              className="font-serif text-lg font-bold tracking-tight text-white flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer bg-transparent border-none"
            >
              <span>Signal</span>
              <span className="w-2 h-2 rounded-full bg-[#E8402B]"></span>
            </button>
            <span className="text-[9px] bg-[#262626] text-[#A3A3A3] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[#333333]">
              Pro
            </span>
          </div>
        ) : (
          <button 
            onClick={() => onNavigate('landing')}
            className="w-full flex justify-center cursor-pointer bg-transparent border-none"
          >
            <span className="w-3 h-3 rounded-full bg-[#E8402B]"></span>
          </button>
        )}

        {/* Collapse toggle button */}
        <button 
          onClick={onToggleCollapse}
          className="p-1 hover:bg-[#262626] rounded-md text-[#A3A3A3] hover:text-white transition-colors cursor-pointer ml-1 shrink-0"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. NAVIGATION MENU LINKS */}
      <div className="p-3 space-y-1.5 shrink-0 text-left border-b border-[#333333]">
        <button 
          onClick={() => onNavigate('app')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            !isCollapsed ? 'justify-start' : 'justify-center'
          } bg-[#262626] text-white border border-[#333333]`}
        >
          <LayoutDashboard className="w-4 h-4 text-[#E8402B]" />
          {!isCollapsed && <span>Workspace Overview</span>}
        </button>

        <button 
          onClick={onOpenCompare}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            !isCollapsed ? 'justify-start' : 'justify-center'
          } hover:bg-[#262626] text-[#A3A3A3] hover:text-white`}
        >
          <SlidersHorizontal className="w-4 h-4 text-[#A3A3A3]" />
          {!isCollapsed && <span>Compare Products</span>}
        </button>
      </div>

      {/* 3. WORKSPACES LIST (Middle Scrollable) */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-left">
          
          {/* Quick Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#6B6B6B] absolute left-3 top-2.5" />
            <input 
              type="text" 
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter products..."
              className="w-full bg-[#262626] border border-[#333333] rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-[#FAFAF8] placeholder-[#6B6B6B] focus:outline-none focus:border-[#E8402B]"
            />
          </div>

          {/* Pinned Products Section */}
          {pinnedProducts.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-[#A3A3A3] px-2">
                <Pin className="w-3 h-3 text-[#E8402B]" />
                <span>Pinned Workspaces</span>
              </div>

              <div className="space-y-1">
                {pinnedProducts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => onSelectProduct(p.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                      p.id === selectedProductId 
                        ? 'bg-[#E8402B] text-white font-bold shadow-xs' 
                        : 'hover:bg-[#262626] text-[#A3A3A3] hover:text-white'
                    }`}
                  >
                    <span className="truncate">{p.name}</span>
                    <span className="text-[9px] font-mono opacity-80">{p.averageRating}★</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* All Workspaces Section */}
          <div className="space-y-1.5">
            <div className="text-[9px] font-bold uppercase tracking-wider text-[#6B6B6B] px-2">
              All Products ({filteredProducts.length})
            </div>

            <div className="space-y-1">
              {filteredProducts.map(p => (
                <button
                  key={p.id}
                  onClick={() => onSelectProduct(p.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                    p.id === selectedProductId 
                      ? 'bg-[#E8402B] text-white font-bold shadow-xs' 
                      : 'hover:bg-[#262626] text-[#A3A3A3] hover:text-white'
                  }`}
                >
                  <span className="truncate">{p.name}</span>
                  <span className="text-[9px] font-mono opacity-80">{p.totalReviews}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 4. FOOTER & USER PROFILE */}
      <div className="p-3 border-t border-[#333333] space-y-2 shrink-0 text-left bg-[#1A1A1A]">
        <button 
          onClick={onOpenSettings}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            !isCollapsed ? 'justify-start' : 'justify-center'
          } hover:bg-[#262626] text-[#A3A3A3] hover:text-white`}
        >
          <Settings className="w-4 h-4 text-[#A3A3A3]" />
          {!isCollapsed && <span>Settings</span>}
        </button>

        {!isCollapsed && (
          <div className="pt-2 border-t border-[#333333] flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#262626] text-[#E8402B] font-bold text-xs flex items-center justify-center border border-[#333333]">
                J
              </div>
              <div className="text-[10px]">
                <div className="font-bold text-white">Jane Operations</div>
                <div className="text-[#6B6B6B]">Acme Corp</div>
              </div>
            </div>

            <button 
              onClick={() => onNavigate('landing')}
              className="p-1 hover:bg-[#262626] rounded text-[#6B6B6B] hover:text-white cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* SIDEBAR RESIZE DRAG HANDLE (Desktop) */}
      {!isCollapsed && (
        <div
          onMouseDown={onResizeStart}
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-[#E8402B] transition-colors z-30"
          title="Drag to resize sidebar width"
        ></div>
      )}

    </aside>
  );
}
