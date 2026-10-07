import React, { useState, useMemo } from 'react';
import { craftCategories } from '../data/mockData.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { ProductDetailModal } from '../components/ProductDetailModal.jsx';
import {
  PlusCircle,
  Search,
  Grid,
  List,
  Trash2,
  Edit2,
  Eye,
  AlertTriangle,
  Package,
} from 'lucide-react';

const SELECT_CLASS =
  'text-xs py-2 px-3 rounded-lg border border-[#D8C7B2] bg-white text-[#2F2924] focus:outline-none focus:ring-1 focus:ring-[#6B4632]';

const VIEW_MODES = [
  { id: 'grid', title: 'Grid Card View', Icon: Grid },
  { id: 'table', title: 'Table List View', Icon: List },
];

export function ManageProducts({
  products,
  artisan,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('grid');

  const [viewingProduct, setViewingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return products.filter((prod) => {
      const matchesSearch =
        prod.name.toLowerCase().includes(query) ||
        prod.category.toLowerCase().includes(query) ||
        (prod.craftStory?.technique || '').toLowerCase().includes(query) ||
        (prod.craftStory?.materials || '').toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === 'All' || prod.category === selectedCategory;

      const matchesStatus =
        selectedStatus === 'All' || prod.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  const hasActiveFilters =
    searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('All');
  };

  const confirmDelete = () => {
    if (productToDelete) {
      onDeleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D8C7B2] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#6B4632]">
            Manage Products & Craft Inventory
          </h1>
          <p className="text-xs text-[#756A60] mt-0.5">
            Oversee your coastal handcrafted catalogue, status, pricing, and craft stories.
          </p>
        </div>

        <button onClick={onAddProduct} className="btn-primary text-xs shrink-0 shadow-xs">
          <PlusCircle className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="card p-4 sm:p-5 bg-[#FFF9F0] border-[#D8C7B2] space-y-4 shadow-xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-3 text-[#756A60]">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by craft name, materials, or technique..."
              className="w-full text-xs pl-9 pr-4 py-2.5 rounded-lg border border-[#D8C7B2] bg-white focus:outline-none focus:ring-1 focus:ring-[#6B4632] text-[#2F2924]"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#756A60] font-semibold hidden sm:inline">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={SELECT_CLASS}
              >
                <option value="All">All Categories</option>
                {craftCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#756A60] font-semibold hidden sm:inline">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={SELECT_CLASS}
              >
                <option value="All">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-[#D8C7B2] rounded-lg overflow-hidden bg-white">
              {VIEW_MODES.map(({ id, title, Icon }) => (
                <button
                  key={id}
                  onClick={() => setViewMode(id)}
                  className={`p-2 transition-colors ${
                    viewMode === id
                      ? 'bg-[#6B4632] text-white'
                      : 'text-[#756A60] hover:bg-[#EFE4D3]'
                  }`}
                  title={title}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results summary */}
        <div className="flex items-center justify-between text-xs text-[#756A60] pt-1">
          <span>
            Showing <strong className="text-[#2F2924]">{filteredProducts.length}</strong> of{' '}
            <strong className="text-[#2F2924]">{products.length}</strong> pieces in catalog
          </span>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-[#6B4632] font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Listing View */}
      {filteredProducts.length === 0 ? (
        <div className="card p-12 text-center bg-[#FFF9F0] border-[#D8C7B2] space-y-3">
          <Package className="w-12 h-12 text-[#6B4632]/40 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-base text-[#2F2924]">
              No products found
            </h3>
            <p className="text-xs text-[#756A60] max-w-sm mx-auto">
              No coastal crafts matched your current search or filter criteria.
            </p>
          </div>
          <button onClick={resetFilters} className="btn-secondary text-xs">
            Clear Active Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={onEditProduct}
              onDelete={() => setProductToDelete(product)}
              onViewDetails={setViewingProduct}
            />
          ))}
        </div>
      ) : (
        /* Table / List View */
        <div className="card overflow-hidden border-[#D8C7B2] bg-[#FFF9F0] shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5EBDD] border-b border-[#D8C7B2] text-[#6B4632] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Craft Piece</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Craft Technique & Story</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8C7B2]/70 text-[#2F2924]">
                {filteredProducts.map((product) => {
                  const isPublished = product.status === 'published';
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-[#EFE4D3]/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover border border-[#D8C7B2] shrink-0"
                          />
                          <div>
                            <span
                              className="font-serif font-bold text-xs text-[#2F2924] block hover:text-[#6B4632] cursor-pointer"
                              onClick={() => setViewingProduct(product)}
                            >
                              {product.name}
                            </span>
                            <span className="text-[11px] text-[#756A60] line-clamp-1 max-w-xs">
                              {product.description}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-[#756A60]">
                        <span className="inline-flex items-center gap-1 bg-[#F5EBDD] px-2 py-0.5 rounded text-[11px]">
                          {product.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-serif font-bold text-[#6B4632] text-sm whitespace-nowrap">
                        ${Number(product.price).toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 text-[#756A60] max-w-xs">
                        <p className="line-clamp-1 italic text-[11px]">
                          {product.craftStory?.technique || 'Handcrafted'}
                        </p>
                        <p className="text-[10px] text-[#A68A64] truncate">
                          {product.craftStory?.materials || ''}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            isPublished
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-amber-100 text-amber-900 border-amber-300'
                          }`}
                        >
                          {isPublished ? '● Published' : '○ Draft'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingProduct(product)}
                            className="p-1.5 rounded hover:bg-[#EFE4D3] text-[#6B4632]"
                            title="View Story & Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditProduct(product)}
                            className="p-1.5 rounded hover:bg-[#EFE4D3] text-[#2F2924]"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(product)}
                            className="p-1.5 rounded hover:bg-rose-100 text-rose-700"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={viewingProduct}
        artisan={artisan}
        isOpen={!!viewingProduct}
        onClose={() => setViewingProduct(null)}
        onEdit={(prod) => {
          setViewingProduct(null);
          onEditProduct(prod);
        }}
      />

      {/* Delete Confirmation Dialog */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2F2924]/60 backdrop-blur-xs">
          <div className="card max-w-md w-full p-6 bg-[#FFF9F0] border-2 border-[#D8C7B2] shadow-xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-serif font-bold text-[#6B4632]">
                  Delete Craft Product?
                </h3>
                <p className="text-xs text-[#756A60] leading-relaxed">
                  Are you sure you want to remove &ldquo;{productToDelete.name}&rdquo;? Its individual craft story and imagery will be deleted from your catalog.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="btn-secondary text-xs"
              >
                Keep Product
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2.5 rounded-lg bg-rose-800 text-white hover:bg-rose-700 text-xs font-semibold shadow-xs transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}