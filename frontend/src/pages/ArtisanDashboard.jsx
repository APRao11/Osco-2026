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
import ArtisanOrders from '../components/ArtisanOrders.jsx';

export function ArtisanDashboard({
  artisan,
  artisanId,
  products,
  onNavigate,
  onEditProduct,
  onViewProduct,
}) {
  const publishedProducts = products.filter((p) => p.status === 'published');
  const draftProducts = products.filter((p) => p.status === 'draft');

  const profileCompletion = [artisan.name, artisan.location, artisan.bio, artisan.craftBackground, artisan.makerStory]
    .filter(Boolean).length * 20;

  return (
    <div className="artisan-dashboard">
      {/* Artisan Welcome Banner */}
      <div className="card artisan-dashboard-welcome">
        <div className="artisan-welcome-inner">
          <div className="artisan-welcome-profile">
            <div className="artisan-welcome-photo">
              <img
                src={artisan.photo}
                alt={artisan.name}
                className="artisan-cover-image"
              />
            </div>

            <div className="artisan-welcome-copy">
              <div className="artisan-welcome-meta">
                <span className="artisan-workshop-badge">
                  Coastal Workshop
                </span>
                <span className="artisan-location-label">
                  <MapPin className="artisan-icon artisan-icon-small artisan-icon-primary-light" />
                  {artisan.location}
                </span>
              </div>
              <h1 className="artisan-dashboard-title">
                Welcome back, {artisan.name}
              </h1>
              <p className="artisan-welcome-description">
                Speciality: <strong className="artisan-text-strong">{artisan.craftSpeciality || 'Coastal crafts'}</strong>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="artisan-quick-actions">
            <button
              onClick={() => onNavigate('add-product')}
              className="btn-primary artisan-dashboard-action"
            >
              <PlusCircle className="artisan-icon" />
              Add Product
            </button>
            <button
              onClick={() => onNavigate('manage-products')}
              className="btn-secondary artisan-dashboard-action"
            >
              <Package className="artisan-icon" />
              Manage Products
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="artisan-button artisan-button-draft artisan-dashboard-action"
            >
              <Edit3 className="artisan-icon" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Practical Overview Stat Cards */}
      <div className="artisan-stats-grid">
        {/* Total Products */}
        <div className="card artisan-stat-card">
          <div className="artisan-stat-heading">
            <span className="artisan-eyebrow">Total Products</span>
            <Package className="artisan-icon artisan-icon-primary" />
          </div>
          <div className="artisan-stat-value">
            {products.length}
          </div>
          <p className="artisan-muted artisan-tiny-text">
            Craft items in your studio catalog
          </p>
        </div>

        {/* Published Products */}
        <div className="card artisan-stat-card">
          <div className="artisan-stat-heading">
            <span className="artisan-eyebrow">Published</span>
            <CheckCircle2 className="artisan-icon artisan-icon-success" />
          </div>
          <div className="artisan-stat-value artisan-stat-value-success">
            {publishedProducts.length}
          </div>
          <p className="artisan-muted artisan-tiny-text">
            Visible to marketplace buyers
          </p>
        </div>

        {/* Draft Products */}
        <div className="card artisan-stat-card">
          <div className="artisan-stat-heading">
            <span className="artisan-eyebrow">Draft Products</span>
            <FileText className="artisan-icon artisan-icon-warning" />
          </div>
          <div className="artisan-stat-value artisan-stat-value-warning">
            {draftProducts.length}
          </div>
          <p className="artisan-muted artisan-tiny-text">
            Studio drafts in progress
          </p>
        </div>

        {/* Profile Status */}
        <div className="card artisan-stat-card">
          <div className="artisan-stat-heading">
            <span className="artisan-eyebrow">Profile Status</span>
            <span className="artisan-completion-label">{profileCompletion}% Complete</span>
          </div>
          <div className="artisan-stat-value">
            Active
          </div>
          <div className="artisan-completion-track">
            <div
              className="artisan-completion-fill"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="artisan-dashboard-columns">
        {/* Artisan Profile Summary */}
        <div className="card artisan-profile-summary">
          <div className="artisan-summary-heading">
            <h3 className="artisan-summary-title">
              Artisan Profile Summary
            </h3>
            <button
              onClick={() => onNavigate('profile')}
              className="artisan-text-link"
            >
              Edit Profile
            </button>
          </div>

          <div className="artisan-summary-content">
            <p className="artisan-summary-bio">
              &ldquo;{artisan.bio}&rdquo;
            </p>

            <div className="artisan-summary-details">
              <div>
                <span className="artisan-detail-label">
                  Workshop:
                </span>
                <span className="artisan-text-strong">
                  {artisan.workshopName || 'Heritage Workshop'}
                </span>
              </div>

              <div>
                <span className="artisan-detail-label">
                  Craft Lineage:
                </span>
                <p className="artisan-summary-lineage">
                  {artisan.craftBackground || 'Add your craft background to your maker profile.'}
                </p>
              </div>
            </div>
          </div>

          <div className="artisan-summary-footer">
            <button
              onClick={() => onNavigate('profile')}
              className="btn-secondary artisan-full-button"
            >
              <Compass className="artisan-icon artisan-icon-small" />
              View &quot;Meet the Maker&quot;
            </button>
          </div>
        </div>

        {/* Recent Products */}
        <div className="artisan-recent-products">
          <div className="artisan-recent-heading">
            <div>
              <h2 className="artisan-section-heading-title artisan-recent-title">
                Your Coastal Craft Catalog
              </h2>
              <p className="artisan-muted artisan-small-text">
                Recent items published or drafted in your artisan studio.
              </p>
            </div>
            <button
              onClick={() => onNavigate('manage-products')}
              className="artisan-view-all-link"
            >
              <span>View All ({products.length})</span>
              <ArrowRight className="artisan-icon artisan-icon-small" />
            </button>
          </div>

          {products.length === 0 ? (
            <div className="card artisan-empty-products">
              <Package className="artisan-empty-icon" />
              <div className="artisan-empty-copy">
                <h3 className="artisan-empty-title">
                  No craft pieces added yet
                </h3>
                <p className="artisan-muted artisan-small-text artisan-empty-description">
                  Add your first coastal craft item and product details.
                </p>
              </div>
              <button
                onClick={() => onNavigate('add-product')}
                className="btn-primary artisan-small-button"
              >
                <PlusCircle className="artisan-icon" />
                Add First Product
              </button>
            </div>
          ) : (
            <div className="artisan-recent-grid">
              {products.slice(0, 4).map((product) => {
                const isPublished = product.status === 'published';
                return (
                  <div
                    key={product.id}
                    className="card artisan-recent-product-card"
                  >
                    <div className="artisan-recent-product-main">
                      <div className="artisan-recent-product-image">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="artisan-cover-image"
                        />
                      </div>
                      <div className="artisan-recent-product-copy">
                        <div className="artisan-recent-product-meta">
                          <span className="artisan-product-category-label">
                            {product.category}
                          </span>
                          <span
                            className={`artisan-status-badge ${isPublished ? 'is-published' : 'is-draft'}`}
                          >
                            {isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <h4 className="artisan-recent-product-title">
                          {product.name}
                        </h4>
                        <div className="artisan-recent-product-price">
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </div>
                        <p className="artisan-recent-product-technique">
                          Craft Story: {product.craftStory?.technique || 'Not stored by the current backend'}
                        </p>
                      </div>
                    </div>

                    <div className="artisan-recent-product-actions">
                      <button
                        onClick={() => onViewProduct(product)}
                        className="artisan-text-link artisan-tiny-link"
                      >
                        View Story
                      </button>
                      <button
                        onClick={() => onEditProduct(product)}
                        className="artisan-button artisan-recent-edit-button"
                      >
                        <Edit3 className="artisan-icon artisan-icon-tiny" />
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
      <ArtisanOrders artisanId={artisanId} />
    </div>
  );
}