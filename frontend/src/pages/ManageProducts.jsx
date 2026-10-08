import React, { useState, useMemo } from 'react';
import { craftCategories } from '../data/mockData.jsx';
import { ArtisanProductCard } from '../components/ArtisanProductCard.jsx';
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

const SELECT_CLASS = 'artisan-filter-select';

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
    <div className="artisan-manage-products">
      {/* Header */}
      <div className="artisan-manage-heading">
        <div>
          <h1 className="artisan-page-title">
            Manage Products & Craft Inventory
          </h1>
          <p className="artisan-muted artisan-small-text">
            Oversee your coastal handcrafted catalogue, status, pricing, and craft stories.
          </p>
        </div>

        <button onClick={onAddProduct} className="btn-primary artisan-small-button">
          <PlusCircle className="artisan-icon" />
          Add New Product
        </button>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="card artisan-product-filters">
        <div className="artisan-filter-toolbar">
          {/* Search Input */}
          <div className="artisan-search-wrap">
            <span className="artisan-search-icon">
              <Search className="artisan-icon" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by craft name, materials, or technique..."
              className="artisan-search-input"
            />
          </div>

          {/* Filter Controls */}
          <div className="artisan-filter-controls">
            {/* Category Filter */}
            <div className="artisan-filter-group">
              <span className="artisan-filter-label">Category:</span>
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
            <div className="artisan-filter-group">
              <span className="artisan-filter-label">Status:</span>
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
            <div className="artisan-view-toggle">
              {VIEW_MODES.map(({ id, title, Icon }) => (
                <button
                  key={id}
                  onClick={() => setViewMode(id)}
                  className={`artisan-view-toggle-button ${viewMode === id ? 'is-active' : ''}`}
                  title={title}
                >
                  <Icon className="artisan-icon" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results summary */}
        <div className="artisan-results-summary">
          <span>
            Showing <strong className="artisan-text-strong">{filteredProducts.length}</strong> of{' '}
            <strong className="artisan-text-strong">{products.length}</strong> pieces in catalog
          </span>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="artisan-text-link"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Listing View */}
      {filteredProducts.length === 0 ? (
        <div className="card artisan-empty-products">
          <Package className="artisan-empty-icon" />
          <div className="artisan-empty-copy">
            <h3 className="artisan-empty-title">
              No products found
            </h3>
            <p className="artisan-muted artisan-small-text artisan-empty-description">
              No coastal crafts matched your current search or filter criteria.
            </p>
          </div>
          <button onClick={resetFilters} className="btn-secondary artisan-small-button">
            Clear Active Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="artisan-product-grid">
          {filteredProducts.map((product) => (
            <ArtisanProductCard
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
        <div className="card artisan-product-table-card">
          <div className="artisan-table-scroll">
            <table className="artisan-product-table">
              <thead>
                <tr className="artisan-product-table-heading">
                  <th>Craft Piece</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Craft Technique & Story</th>
                  <th>Status</th>
                  <th className="artisan-table-actions-heading">Actions</th>
                </tr>
              </thead>
              <tbody className="artisan-product-table-body">
                {filteredProducts.map((product) => {
                  const isPublished = product.status === 'published';
                  return (
                    <tr
                      key={product.id}
                      className="artisan-product-table-row"
                    >
                      <td className="artisan-table-cell">
                        <div className="artisan-table-product">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="artisan-table-product-image"
                          />
                          <div>
                            <span
                              className="artisan-table-product-name"
                              onClick={() => setViewingProduct(product)}
                            >
                              {product.name}
                            </span>
                            <span className="artisan-table-product-description">
                              {product.description}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="artisan-table-cell artisan-muted">
                        <span className="artisan-table-category">
                          {product.category}
                        </span>
                      </td>

                      <td className="artisan-table-cell artisan-table-price">
                        ${Number(product.price).toFixed(2)}
                      </td>

                      <td className="artisan-table-cell artisan-table-story-cell">
                        <p className="artisan-table-technique">
                          {product.craftStory?.technique || 'Handcrafted'}
                        </p>
                        <p className="artisan-table-materials">
                          {product.craftStory?.materials || ''}
                        </p>
                      </td>

                      <td className="artisan-table-cell">
                        <span
                          className={`artisan-status-badge ${isPublished ? 'is-published' : 'is-draft'}`}
                        >
                          {isPublished ? '● Published' : '○ Draft'}
                        </span>
                      </td>

                      <td className="artisan-table-cell artisan-table-action-cell">
                        <div className="artisan-table-actions">
                          <button
                            onClick={() => setViewingProduct(product)}
                            className="artisan-table-icon-button"
                            title="View Story & Details"
                          >
                            <Eye className="artisan-icon" />
                          </button>
                          <button
                            onClick={() => onEditProduct(product)}
                            className="artisan-table-icon-button artisan-table-edit-button"
                            title="Edit Product"
                          >
                            <Edit2 className="artisan-icon" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(product)}
                            className="artisan-table-icon-button artisan-table-delete-button"
                            title="Delete Product"
                          >
                            <Trash2 className="artisan-icon" />
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
        <div className="artisan-confirm-backdrop">
          <div className="card artisan-confirm-dialog">
            <div className="artisan-confirm-message">
              <div className="artisan-confirm-icon-wrap">
                <AlertTriangle className="artisan-icon artisan-icon-large" />
              </div>
              <div className="artisan-confirm-copy">
                <h3 className="artisan-confirm-title">
                  Delete Craft Product?
                </h3>
                <p className="artisan-muted artisan-small-text artisan-confirm-description">
                  Are you sure you want to remove &ldquo;{productToDelete.name}&rdquo;? Its individual craft story and imagery will be deleted from your catalog.
                </p>
              </div>
            </div>

            <div className="artisan-confirm-actions">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="btn-secondary artisan-small-button"
              >
                Keep Product
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="artisan-button artisan-button-danger"
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