import React from 'react';
import { Edit2, Eye, Layers, Trash2 } from 'lucide-react';

const fallbackImage =
  'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80';
const iconButtonClass = 'p-2 rounded-md border border-[#D8C7B2] transition-colors';

export function ArtisanProductCard({ product, onEdit, onDelete, onViewDetails }) {
  const isPublished = product.status === 'published';

  return (
    <div className="card overflow-hidden flex flex-col group transition-all duration-150 hover:border-[#A68A64]">
      <div className="relative aspect-4/3 bg-[#EFE4D3]/50 overflow-hidden">
        <img
          src={product.image || fallbackImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
        />
        <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${isPublished ? 'bg-emerald-800 text-white border-emerald-700' : 'bg-amber-100 text-amber-900 border-amber-300'}`}>
          {isPublished ? '● Published' : '○ Draft'}
        </span>
        <span className="absolute bottom-3 left-3 bg-[#2F2924]/85 text-white text-[11px] font-medium px-2.5 py-0.5 rounded-md flex items-center gap-1">
          <Layers className="w-3 h-3 text-[#A68A64]" /> {product.category}
        </span>
        <span className="absolute top-3 right-3 bg-[#FFF9F0] text-[#6B4632] font-serif font-bold text-sm px-2.5 py-1 rounded-lg border border-[#D8C7B2]">
          ${Number(product.price).toFixed(2)}
        </span>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-base text-[#2F2924] line-clamp-1">{product.name}</h3>
          <p className="text-xs text-[#756A60] line-clamp-2 leading-relaxed">{product.description}</p>
          <div className="bg-[#F5EBDD]/70 p-2.5 rounded-lg border border-[#D8C7B2]/70 space-y-1">
            <span className="text-[11px] text-[#6B4632] font-semibold block">Craft Technique:</span>
            <p className="text-[11px] text-[#2F2924]/85 line-clamp-1 italic">
              {product.craftStory?.technique || 'Traditional handcrafting'}
            </p>
          </div>
        </div>
        <div className="pt-3 border-t border-[#D8C7B2]/70 flex items-center gap-2">
          <button onClick={() => onViewDetails(product)} className="flex-1 text-xs font-semibold text-[#6B4632] bg-[#EFE4D3]/70 py-2 px-2.5 rounded-md flex items-center justify-center gap-1.5 border border-[#D8C7B2]/80">
            <Eye className="w-3.5 h-3.5" /> View Story
          </button>
          <button onClick={() => onEdit(product)} title="Edit product" className={`${iconButtonClass} text-[#2F2924] bg-white`}>
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(product.id)} title="Delete product" className={`${iconButtonClass} text-rose-700 hover:text-white hover:bg-rose-700`}>
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
