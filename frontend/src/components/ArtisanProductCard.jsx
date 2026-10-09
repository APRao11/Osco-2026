import React from 'react';
import { Edit2, Eye, Layers, Trash2 } from 'lucide-react';

const fallbackImage =
  'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80';
const iconButtonClass = 'artisan-small-icon-button';

export function ArtisanProductCard({ product, onEdit, onDelete, onViewDetails }) {
  const isPublished = product.status === 'published';

  return (
    <div className="card artisan-product-card">
      <div className="artisan-product-image-wrap">
        <img
          src={product.image || fallbackImage}
          alt={product.name}
          className="artisan-product-image"
        />
        <span className={`artisan-status-badge ${isPublished ? 'is-published' : 'is-draft'}`}>
          {isPublished ? '● Published' : '○ Draft'}
        </span>
        <span className="artisan-category-badge">
          <Layers className="artisan-icon artisan-icon-small" /> {product.category}
        </span>
        <span className="artisan-price-badge">
          ₹{Number(product.price).toLocaleString('en-IN')}
        </span>
      </div>

      <div className="artisan-product-card-body">
        <div className="artisan-product-card-copy">
          <h3>{product.name}</h3>
          <p className="artisan-product-description">{product.description}</p>
          <div className="artisan-technique-note">
            <span>Craft Technique:</span>
            <p>
              {product.craftStory?.technique || 'Craft stories are not stored by the current backend.'}
            </p>
          </div>
        </div>
        <div className="artisan-product-card-actions">
          <button onClick={() => onViewDetails(product)} className="artisan-view-button">
            <Eye className="artisan-icon" /> View Details
          </button>
          <button onClick={() => onEdit(product)} title="Edit product" className={iconButtonClass}>
            <Edit2 className="artisan-icon" />
          </button>
          <button onClick={() => onDelete(product.id)} title="Delete product" className={`${iconButtonClass} artisan-delete-icon-button`}>
            <Trash2 className="artisan-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}
