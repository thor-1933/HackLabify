import { useState } from 'react';
import { X, Star } from 'lucide-react';
import type { Product } from '../mock-data';

interface CompareProductsProps {
  products: Product[];
  onClose: () => void;
}

export default function CompareProducts({ products, onClose }: CompareProductsProps) {
  const [productAId, setProductAId] = useState<string>(products[0]?.id || '');
  const [productBId, setProductBId] = useState<string>(products[1]?.id || products[0]?.id || '');

  const productA = products.find(p => p.id === productAId) || products[0];
  const productB = products.find(p => p.id === productBId) || products[1] || products[0];

  return (
    <div className="bg-[#FAFAF8] border border-[#E5E5E5] rounded-2xl p-8 space-y-8 shadow-premium text-left font-sans antialiased text-[#1A1A1A]">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#E5E5E5] pb-4">
        <div className="space-y-1">
          <div className="text-[9px] font-bold uppercase tracking-widest text-[#E8402B]">
            Side-By-Side Benchmark
          </div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#1A1A1A]">
            Compare Review Workspaces
          </h2>
        </div>

        <button 
          onClick={onClose}
          className="p-2 hover:bg-zinc-200 rounded-lg text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Selectors Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Selector Product A */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B]">
            Target Product A
          </label>
          <select
            value={productAId}
            onChange={(e) => setProductAId(e.target.value)}
            className="w-full bg-white border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] font-semibold focus:outline-none focus:border-[#E8402B]"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Selector Product B */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B]">
            Competitor / Product B
          </label>
          <select
            value={productBId}
            onChange={(e) => setProductBId(e.target.value)}
            className="w-full bg-white border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] font-semibold focus:outline-none focus:border-[#E8402B]"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Comparison Grid Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* Product A Panel */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 space-y-6 shadow-sm">
          <div className="flex justify-between items-start border-b border-[#E5E5E5] pb-4">
            <div>
              <span className="text-[8px] bg-[#E8402B]/10 text-[#E8402B] px-2 py-0.5 rounded font-bold uppercase border border-[#E8402B]/20">
                Primary Target
              </span>
              <h3 className="font-serif text-xl font-bold mt-2 text-[#1A1A1A]">{productA.name}</h3>
            </div>
            
            <div className="flex items-center gap-1 font-mono font-bold text-sm text-[#E8402B]">
              <Star className="w-4 h-4 fill-[#E8402B] text-[#E8402B]" />
              <span>{productA.averageRating.toFixed(1)}</span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex justify-between text-[#6B6B6B]">
              <span>Total Reviews:</span>
              <span className="font-mono text-[#1A1A1A] font-semibold">{productA.totalReviews.toLocaleString()}</span>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#E5E5E5]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B] block">Primary Complaint</span>
              <div className="p-3 bg-[#FAFAF8] border border-[#E5E5E5] rounded-lg text-xs font-semibold text-[#E8402B]">
                ⚠️ {productA.rankedIssues[0]?.keyword || 'N/A'} ({productA.rankedIssues[0]?.frequency || 0} mentions)
              </div>
            </div>
          </div>
        </div>

        {/* Product B Panel */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 space-y-6 shadow-sm">
          <div className="flex justify-between items-start border-b border-[#E5E5E5] pb-4">
            <div>
              <span className="text-[8px] bg-zinc-100 text-[#6B6B6B] px-2 py-0.5 rounded font-bold uppercase border border-zinc-200">
                Benchmark Subject
              </span>
              <h3 className="font-serif text-xl font-bold mt-2 text-[#1A1A1A]">{productB.name}</h3>
            </div>
            
            <div className="flex items-center gap-1 font-mono font-bold text-sm text-[#E8402B]">
              <Star className="w-4 h-4 fill-[#E8402B] text-[#E8402B]" />
              <span>{productB.averageRating.toFixed(1)}</span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex justify-between text-[#6B6B6B]">
              <span>Total Reviews:</span>
              <span className="font-mono text-[#1A1A1A] font-semibold">{productB.totalReviews.toLocaleString()}</span>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#E5E5E5]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B] block">Primary Complaint</span>
              <div className="p-3 bg-[#FAFAF8] border border-[#E5E5E5] rounded-lg text-xs font-semibold text-[#1A1A1A]">
                ⚠️ {productB.rankedIssues[0]?.keyword || 'N/A'} ({productB.rankedIssues[0]?.frequency || 0} mentions)
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
