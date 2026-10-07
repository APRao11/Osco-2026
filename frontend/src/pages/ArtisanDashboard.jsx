import React from 'react';
import {
  Package,
  PlusCircle,
  Edit3,
  MapPin,
  ArrowRight,
  CheckCircle2,
  FileText,
  Compass,
} from 'lucide-react';

export function ArtisanDashboard({
  artisan,
  products,
  onNavigate,
  onEditProduct,
  onViewProduct,
}) {
  const publishedProducts = products.filter((p) => p.status === 'published');
  const draftProducts = products.filter((p) => p.status === 'draft');

  let profileCompletion = 100;
  if (!artisan.video) profileCompletion -= 10;
  if (!artisan.phone) profileCompletion -= 5;

  return (
    <div className="space-y-7">
      {/* Artisan Welcome Banner */}
      <div className="card bg-[#FFF9F0] border border-[#D8C7B2] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-[#D8C7B2] bg-[#EFE4D3] shrink-0">
              <img
                src={artisan.photo}
                alt={artisan.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EFE4D3] text-[#6B4632] border border-[#D8C7B2]">
                  Coastal Workshop
                </span>
                <span className="text-xs text-[#756A60] flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#8A6248]" />
                  {artisan.location}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#6B4632]">
                Welcome back, {artisan.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#756A60] leading-relaxed">
                Speciality: <strong className="text-[#2F2924]">{artisan.craftSpeciality}</strong> &bull; {artisan.yearsOfExperience} years of craft mastery.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={() => onNavigate('add-product')}
              className="btn-primary text-xs flex-1 sm:flex-none"
            >
              <PlusCircle className="w-4 h-4" />
              Add Product
            </button>
            <button
              onClick={() => onNavigate('manage-products')}
              className="btn-secondary text-xs flex-1 sm:flex-none"
            >
              <Package className="w-4 h-4" />
              Manage Products
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="text-xs font-semibold text-[#6B4632] bg-[#EFE4D3] hover:bg-[#E2D4BF] px-3.5 py-2.5 rounded-lg border border-[#D8C7B2] flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Practical Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="card p-5 bg-[#FFF9F0] border-[#D8C7B2] space-y-1.5">
          <div className="flex items-center justify-between text-[#756A60]">
            <span className="text-xs font-bold uppercase tracking-wider">Total Products</span>
            <Package className="w-4 h-4 text-[#6B4632]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#6B4632]">
            {products.length}
          </div>
          <p className="text-[11px] text-[#756A60]">
            Craft items in your studio catalog
          </p>
        </div>

        {/* Published Products */}
        <div className="card p-5 bg-[#FFF9F0] border-[#D8C7B2] space-y-1.5">
          <div className="flex items-center justify-between text-[#756A60]">
            <span className="text-xs font-bold uppercase tracking-wider">Published</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-serif font-bold text-emerald-800">
            {publishedProducts.length}
          </div>
          <p className="text-[11px] text-[#756A60]">
            Visible to marketplace buyers
          </p>
        </div>

        {/* Draft Products */}
        <div className="card p-5 bg-[#FFF9F0] border-[#D8C7B2] space-y-1.5">
          <div className="flex items-center justify-between text-[#756A60]">
            <span className="text-xs font-bold uppercase tracking-wider">Draft Products</span>
            <FileText className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-3xl font-serif font-bold text-amber-900">
            {draftProducts.length}
          </div>
          <p className="text-[11px] text-[#756A60]">
            Studio drafts in progress
          </p>
        </div>

        {/* Profile Status */}
        <div className="card p-5 bg-[#FFF9F0] border-[#D8C7B2] space-y-1.5">
          <div className="flex items-center justify-between text-[#756A60]">
            <span className="text-xs font-bold uppercase tracking-wider">Profile Status</span>
            <span className="text-xs text-emerald-700 font-semibold">{profileCompletion}% Complete</span>
          </div>
          <div className="text-3xl font-serif font-bold text-[#6B4632]">
            Active
          </div>
          <div className="w-full bg-[#EFE4D3] h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-[#6B4632] h-full rounded-full"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Artisan Profile Summary */}
        <div className="card p-6 bg-[#FFF9F0] border-[#D8C7B2] space-y-4 h-fit">
          <div className="border-b border-[#D8C7B2]/70 pb-3 flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#6B4632]">
              Artisan Profile Summary
            </h3>
            <button
              onClick={() => onNavigate('profile')}
              className="text-xs text-[#8A6248] hover:text-[#6B4632] font-semibold underline"
            >
              Edit Profile
            </button>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[#2F2924] leading-relaxed italic bg-[#F5EBDD]/60 p-3 rounded-lg border-l-2 border-[#6B4632]">
              &ldquo;{artisan.bio}&rdquo;
            </p>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[11px] text-[#756A60] font-semibold uppercase tracking-wider block">
                  Workshop:
                </span>
                <span className="font-medium text-[#2F2924]">
                  {artisan.workshopName || 'Heritage Workshop'}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-[#756A60] font-semibold uppercase tracking-wider block">
                  Craft Lineage:
                </span>
                <p className="text-[#756A60] line-clamp-3 leading-relaxed mt-0.5">
                  {artisan.craftBackground}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#D8C7B2]/70">
            <button
              onClick={() => onNavigate('profile')}
              className="w-full btn-secondary text-xs justify-center"
            >
              <Compass className="w-3.5 h-3.5" />
              View &quot;Meet the Maker&quot;
            </button>
          </div>
        </div>

        {/* Recent Products */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#6B4632]">
                Your Coastal Craft Catalog
              </h2>
              <p className="text-xs text-[#756A60]">
                Recent items published or drafted in your artisan studio.
              </p>
            </div>
            <button
              onClick={() => onNavigate('manage-products')}
              className="text-xs font-semibold text-[#6B4632] hover:text-[#8A6248] flex items-center gap-1"
            >
              <span>View All ({products.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {products.length === 0 ? (
            <div className="card p-10 text-center bg-[#FFF9F0] border-[#D8C7B2] space-y-3">
              <Package className="w-10 h-10 text-[#6B4632]/50 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-base text-[#2F2924]">
                  No craft pieces added yet
                </h3>
                <p className="text-xs text-[#756A60] max-w-sm mx-auto">
                  Add your first coastal craft item with its authentic craft story.
                </p>
              </div>
              <button
                onClick={() => onNavigate('add-product')}
                className="btn-primary text-xs"
              >
                <PlusCircle className="w-4 h-4" />
                Add First Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.slice(0, 4).map((product) => {
                const isPublished = product.status === 'published';
                return (
                  <div
                    key={product.id}
                    className="card p-3.5 bg-[#FFF9F0] border-[#D8C7B2] flex flex-col justify-between hover:border-[#A68A64] transition-colors"
                  >
                    <div className="flex gap-3">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#EFE4D3] shrink-0 border border-[#D8C7B2]">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] uppercase font-bold text-[#8A6248] truncate">
                            {product.category}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                              isPublished
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-xs text-[#2F2924] truncate">
                          {product.name}
                        </h4>
                        <div className="text-xs font-serif font-bold text-[#6B4632]">
                          ${Number(product.price).toFixed(2)}
                        </div>
                        <p className="text-[10px] text-[#756A60] line-clamp-1 italic">
                          Craft Story: {product.craftStory?.technique || 'Handmade'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#D8C7B2]/70 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onViewProduct(product)}
                        className="text-[11px] font-semibold text-[#6B4632] hover:underline"
                      >
                        View Story
                      </button>
                      <button
                        onClick={() => onEditProduct(product)}
                        className="text-[11px] font-semibold text-[#2F2924] hover:text-[#6B4632] flex items-center gap-1 px-2 py-1 rounded bg-[#EFE4D3]/60 hover:bg-[#EFE4D3]"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}