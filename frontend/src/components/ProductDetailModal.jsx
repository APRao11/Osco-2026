import { X, Feather, Sparkles, Compass, Clock, Package } from 'lucide-react';

const fallbackImage =
  'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80';

// the four small story cards: which field to show, its title, icon and default text
const storyCards = [
  { key: 'technique', title: 'Technique & Process', icon: Feather, fallback: 'Ancestral handcrafting.' },
  { key: 'materials', title: 'Materials Used', icon: Sparkles, fallback: 'Natural coastal materials.' },
  { key: 'culturalSignificance', title: 'Cultural Heritage', icon: Compass, fallback: 'Traditional coastal heritage.' },
  { key: 'makingTime', title: 'Making Duration', icon: Clock, fallback: 'Crafted in small batches.' },
];

export function ProductDetailModal({ product, artisan, isOpen, onClose, onEdit }) {
  // nothing to render when closed or when there's no product yet
  if (!isOpen || !product) return null;

  const story = product.craftStory || {};
  const isPublished = product.status === 'published';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2F2924]/60 backdrop-blur-xs overflow-y-auto">
      <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border-2 border-[#D8C7B2] bg-[#FFF9F0] my-auto">
        {/* sticky header so the close button is always reachable */}
        <div className="p-4 sm:p-5 border-b border-[#D8C7B2] bg-[#F5EBDD] flex items-center justify-between sticky top-0 z-10">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8A6248]">
              Product & Craft Story View
            </span>
            <h3 className="text-lg font-serif font-bold text-[#6B4632]">{product.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#756A60] hover:text-[#2F2924] hover:bg-[#EFE4D3] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* photo on the left, details on the right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="rounded-xl overflow-hidden border border-[#D8C7B2] bg-[#EFE4D3]/40 aspect-[4/3]">
              <img src={product.image || fallbackImage} alt={product.name} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EFE4D3] text-[#6B4632] border border-[#D8C7B2]">
                  {product.category}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    isPublished
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  {isPublished ? 'Published' : 'Draft'}
                </span>
              </div>

              <div>
                <div className="text-2xl font-serif font-bold text-[#6B4632]">${Number(product.price).toFixed(2)}</div>
                {product.stock !== undefined && (
                  <p className="text-xs text-[#756A60] mt-0.5 flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" /> Stock: {product.stock} units
                  </p>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#756A60]">Description</h4>
                <p className="text-xs text-[#2F2924] mt-1 leading-relaxed">{product.description}</p>
              </div>

              {/* maker info, only if we know who made it */}
              {artisan && (
                <div className="pt-3 border-t border-[#D8C7B2]/70 flex items-center gap-3">
                  <img
                    src={artisan.photo}
                    alt={artisan.name}
                    className="w-9 h-9 rounded-full object-cover border border-[#D8C7B2]"
                  />
                  <div>
                    <p className="text-xs font-semibold text-[#2F2924]">{artisan.name}</p>
                    <p className="text-[11px] text-[#756A60]">{artisan.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* craft story of this piece */}
          <div className="rounded-xl border border-[#D8C7B2] bg-[#F5EBDD]/60 p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#D8C7B2]/80 pb-3">
              <Sparkles className="w-4 h-4 text-[#6B4632]" />
              <h4 className="text-base font-serif font-bold text-[#6B4632]">Craft Story of This Individual Piece</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {storyCards.map(({ key, title, icon: Icon, fallback }) => (
                <div key={key} className="bg-[#FFF9F0] p-3 rounded-lg border border-[#D8C7B2]/80 space-y-1">
                  <span className="text-[11px] font-bold text-[#8A6248] uppercase tracking-wider flex items-center gap-1">
                    <Icon className="w-3 h-3" /> {title}
                  </span>
                  <p className="text-xs text-[#2F2924] leading-relaxed">{story[key] || fallback}</p>
                </div>
              ))}
            </div>

            {/* skip this box entirely if the maker hasn't written a story */}
            {story.storyBehindCraft && (
              <div className="bg-[#FFF9F0] p-3.5 rounded-lg border border-[#D8C7B2]/80 space-y-1">
                <span className="text-[11px] font-bold text-[#6B4632] uppercase tracking-wider block">
                  The Story Behind The Craft
                </span>
                <p className="text-xs text-[#2F2924] leading-relaxed italic">&ldquo;{story.storyBehindCraft}&rdquo;</p>
              </div>
            )}
          </div>
        </div>

        {/* footer actions */}
        <div className="p-4 bg-[#F5EBDD] border-t border-[#D8C7B2] flex items-center justify-end gap-3">
          {onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit(product);
              }}
              className="btn-secondary text-xs"
            >
              Edit Product
            </button>
          )}
          <button onClick={onClose} className="btn-primary text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}