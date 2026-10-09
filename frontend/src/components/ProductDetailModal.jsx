import React from 'react';
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
  const hasSavedStory = Object.values(story).some(Boolean);
  const isPublished = product.status === 'published';

  return (
    <div className="artisan-modal-backdrop">
      <div className="card artisan-modal">
        {/* sticky header so the close button is always reachable */}
        <div className="artisan-modal-header">
          <div>
            <span className="artisan-modal-eyebrow">
              Product Details
            </span>
            <h3 className="artisan-modal-title">{product.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="artisan-icon-button"
          >
            <X className="artisan-icon artisan-icon-large" />
          </button>
        </div>

        <div className="artisan-modal-body">
          {/* photo on the left, details on the right */}
          <div className="artisan-modal-product-grid">
            <div className="artisan-modal-photo-wrap">
              <img src={product.image || fallbackImage} alt={product.name} />
            </div>

            <div className="artisan-modal-product-details">
              <div className="artisan-modal-badges">
                <span className="artisan-category-badge-inline">
                  {product.category}
                </span>
                <span
                  className={`artisan-status-badge ${isPublished ? 'is-published-light' : 'is-draft'}`}
                >
                  {isPublished ? 'Published' : 'Draft'}
                </span>
              </div>

              <div>
                <div className="artisan-modal-price">₹{Number(product.price).toLocaleString('en-IN')}</div>
                {product.stock !== undefined && (
                  <p className="artisan-muted artisan-small-text">
                    <Package className="artisan-icon" /> Stock: {product.stock} units
                  </p>
                )}
              </div>

              <div>
                <h4 className="artisan-small-heading">Description</h4>
                <p className="artisan-modal-description">{product.description}</p>
              </div>

              {/* maker info, only if we know who made it */}
              {artisan && (
                <div className="artisan-modal-maker">
                  <img
                    src={artisan.photo}
                    alt={artisan.name}
                    className="artisan-avatar"
                  />
                  <div>
                    <p className="artisan-maker-name">{artisan.name}</p>
                    <p className="artisan-muted artisan-small-text">{artisan.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* craft story of this piece */}
          <div className="artisan-story-panel">
            <div className="artisan-story-heading">
              <Sparkles className="artisan-icon" />
              <h4>Craft Story of This Individual Piece</h4>
            </div>

            {hasSavedStory ? (
              <>
                <div className="artisan-story-grid">
                  {storyCards.map(({ key, title, icon: Icon, fallback }) => (
                    <div key={key} className="artisan-story-card">
                      <span className="artisan-story-card-title">
                        <Icon className="artisan-icon artisan-icon-small" /> {title}
                      </span>
                      <p>{story[key] || fallback}</p>
                    </div>
                  ))}
                </div>
                {story.storyBehindCraft && (
                  <div className="artisan-story-card artisan-story-full">
                    <span className="artisan-story-card-title">The Story Behind The Craft</span>
                    <p className="artisan-story-quote">&ldquo;{story.storyBehindCraft}&rdquo;</p>
                  </div>
                )}
              </>
            ) : (
              <p className="artisan-muted">The current backend does not store product-specific craft stories.</p>
            )}
          </div>
        </div>

        {/* footer actions */}
        <div className="artisan-modal-footer">
          {onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit(product);
              }}
              className="btn-secondary"
            >
              Edit Product
            </button>
          )}
          <button onClick={onClose} className="btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}