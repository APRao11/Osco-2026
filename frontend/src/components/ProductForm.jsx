import React from 'react';
import { useState } from 'react';
import { Save, Eye, AlertCircle, DollarSign, Package, Layers, ArrowLeft, CheckCircle } from 'lucide-react';
import { craftCategories } from '../data/mockData.jsx';
import { ImageUpload } from './ImageUpload.jsx';
import { ProductDetailModal } from './ProductDetailModal.jsx';

// shared input look, so we don't repeat this long class string everywhere
const inputStyle = 'artisan-field-input';

const today = () => new Date().toISOString().split('T')[0];

const emptyStory = {
  technique: '',
  materials: '',
  culturalSignificance: '',
  storyBehindCraft: '',
  makingTime: '',
};

// label + input/textarea/select + error message in one reusable piece
function Field({ label, icon: Icon, required, error, prefix, as: Tag = 'input', children, ...props }) {
  return (
    <div className="artisan-product-field">
      <label className="artisan-field-label artisan-field-label-with-icon">
        {Icon && <Icon className="artisan-icon artisan-icon-small artisan-icon-primary" />}
        {label} {required && <span className="artisan-required-mark">*</span>}
      </label>
      <div className={`artisan-product-input-wrap ${prefix ? 'has-prefix' : ''}`}>
        {prefix && <span className="artisan-input-prefix">{prefix}</span>}
        <Tag
          className={`${inputStyle} ${Tag === 'textarea' ? 'artisan-field-textarea' : ''}`}
          {...props}
        >
          {children}
        </Tag>
      </div>
      {error && <p className="artisan-field-error">{error}</p>}
    </div>
  );
}

// story section (previously CraftStory.jsx), only used by ProductForm
function CraftStory({ data, onChange, productName }) {
  return (
    <div className="card craft-story">
      <h3>Craft Story</h3>

      <p className="story-intro">
        Tell buyers how {productName || 'this product'} is made and what makes it special.
      </p>

      {/* How the product is made */}
      <div className="form-group">
        <label>How is it made? *</label>
        <textarea
          rows="3"
          value={data.technique || ''}
          onChange={(e) => onChange('technique', e.target.value)}
          placeholder="Describe the traditional technique or process used."
        />
      </div>

      {/* Materials used for this product */}
      <div className="form-group">
        <label>Materials Used *</label>
        <textarea
          rows="3"
          value={data.materials || ''}
          onChange={(e) => onChange('materials', e.target.value)}
          placeholder="Mention the natural or traditional materials used."
        />
      </div>

      {/* Cultural background of the craft */}
      <div className="form-group">
        <label>Cultural Significance</label>
        <textarea
          rows="3"
          value={data.culturalSignificance || ''}
          onChange={(e) => onChange('culturalSignificance', e.target.value)}
          placeholder="Share the cultural or coastal significance of this craft."
        />
      </div>

      {/* Approximate time needed to make the product */}
      <div className="form-group">
        <label>Making Time</label>
        <input
          type="text"
          value={data.makingTime || ''}
          onChange={(e) => onChange('makingTime', e.target.value)}
          placeholder="e.g. 2 days"
        />
      </div>

      {/* Main story shown with the product */}
      <div className="form-group">
        <label>The Story Behind This Craft *</label>
        <textarea
          rows="4"
          value={data.storyBehindCraft || ''}
          onChange={(e) => onChange('storyBehindCraft', e.target.value)}
          placeholder="Tell the story behind this particular piece."
        />

        <small>{(data.storyBehindCraft || '').length} characters</small>
      </div>
    </div>
  );
}

export function ProductForm({ initialProduct: p, artisan, isEditing = false, onSave, onCancel }) {
  // one state object instead of eight separate useState calls
  const [form, setForm] = useState({
    name: p?.name || '',
    image: p?.image || '',
    category: p?.category || 'Handwoven Crafts',
    price: p?.price ?? '',
    stock: p?.stock ?? 10,
    description: p?.description || '',
    status: p?.status || 'published',
    craftStory: p?.craftStory || emptyStory,
  });
  const [errors, setErrors] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [toast, setToast] = useState(null); // holds the saved status while the toast shows

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const setStory = (field, value) => set('craftStory', { ...form.craftStory, [field]: value });

  // shortcut for plain inputs: value + onChange
  const bind = (field) => ({ value: form[field], onChange: (e) => set(field, e.target.value) });

  const validate = () => {
    const s = form.craftStory;
    const checks = [
      ['name', !form.name.trim(), 'Please provide a product title.'],
      ['image', !form.image.trim(), 'A product photograph is required to showcase your craft.'],
      ['price', !form.price || Number(form.price) <= 0, 'Please enter a valid price.'],
      ['description', !form.description.trim(), 'Please provide a short product description.'],
      ['technique', !s.technique?.trim(), 'Please explain the traditional technique used.'],
      ['materials', !s.materials?.trim(), 'Please list the natural coastal materials.'],
      ['storyBehindCraft', !s.storyBehindCraft?.trim(), 'Please share the story behind this craft piece.'],
    ];

    // keep only the checks that failed
    const found = Object.fromEntries(checks.filter(([, failed]) => failed).map(([key, , msg]) => [key, msg]));
    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const handleSubmit = (targetStatus) => {
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const status = targetStatus || form.status;
    const product = {
      ...form,
      id: p?.id || `prod-${Date.now()}`,
      name: form.name.trim(),
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      description: form.description.trim(),
      status,
      createdAt: p?.createdAt || today(),
    };

    // show the toast for a moment before handing the product back
    setToast(status);
    setTimeout(() => onSave(product), 800);
  };

  // what the preview modal shows, with fallbacks for empty fields
  const previewProduct = {
    ...form,
    id: p?.id || 'preview',
    name: form.name || 'Untitled Craft Item',
    image:
      form.image ||
      'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80',
    price: Number(form.price) || 0,
    stock: Number(form.stock) || 0,
    description:
      form.description || 'Handmade with natural coastal fibers and traditional techniques passed down through generations.',
    createdAt: p?.createdAt || today(),
  };

  const previewBtn = (
    <button type="button" onClick={() => setPreviewOpen(true)} className="btn-secondary artisan-small-button">
      <Eye className="artisan-icon" /> Preview Piece
    </button>
  );
  const publishBtn = (
    <button type="button" onClick={() => handleSubmit('published')} className="btn-primary artisan-small-button">
      <Save className="artisan-icon" /> {isEditing ? 'Save Changes' : 'Publish Product'}
    </button>
  );

  return (
    <div className="artisan-product-form">
      {toast && (
        <div className="artisan-save-toast">
          <CheckCircle className="artisan-icon artisan-icon-success" />
          <div>
            <p className="artisan-small-strong">{isEditing ? 'Product Updated Successfully' : 'Product Saved Successfully'}</p>
            <p className="artisan-toast-caption">
              {toast === 'published' ? 'Now available in your catalog' : 'Saved as draft'}
            </p>
          </div>
        </div>
      )}

      {/* header: back button, title and the main actions */}
      <div className="artisan-product-form-heading">
        <div className="artisan-product-title-group">
          <button
            type="button"
            onClick={onCancel}
            title="Return to products"
            className="artisan-back-button"
          >
            <ArrowLeft className="artisan-icon artisan-icon-large" />
          </button>
          <div>
            <h2 className="artisan-heading-secondary">
              {isEditing ? `Edit: ${p?.name || 'Craft Product'}` : 'Add New Coastal Craft Product'}
            </h2>
            <p className="artisan-muted artisan-small-text">
              {isEditing ? 'Update product details and the craft story.' : 'Document and publish a handmade coastal craft item.'}
            </p>
          </div>
        </div>

        <div className="artisan-form-heading-actions">
          {previewBtn}
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            className="artisan-button artisan-button-draft"
          >
            Save as Draft
          </button>
          {publishBtn}
        </div>
      </div>

      {/* list of everything that failed validation */}
      {Object.keys(errors).length > 0 && (
        <div className="artisan-validation-banner">
          <AlertCircle className="artisan-icon artisan-validation-icon" />
          <div className="artisan-validation-copy">
            <p className="artisan-small-strong">Please complete the required details before publishing:</p>
            <ul className="artisan-validation-list">
              {Object.values(errors).map((msg) => (
                <li key={msg}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* general product info */}
      <div className="card artisan-product-section">
        <div className="artisan-section-heading">
          <h3 className="artisan-section-heading-title">General Product Information</h3>
          <p className="artisan-muted artisan-small-text">Details shown to buyers browsing the catalog.</p>
        </div>

        <Field
          {...bind('name')}
          label="Product Name / Title"
          required
          error={errors.name}
          placeholder="e.g. Handwoven Coconut Palm Harvest Basket"
        />

        <div className="artisan-product-details-grid">
          <Field {...bind('category')} as="select" label="Craft Category" icon={Layers} required>
            {craftCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Field>

          <Field
            {...bind('price')}
            type="number"
            min="1"
            step="0.5"
            label="Price (USD)"
            icon={DollarSign}
            prefix="$"
            required
            error={errors.price}
            placeholder="45.00"
          />

          <Field {...bind('stock')} type="number" min="0" label="Batch Quantity" icon={Package} placeholder="5" />
        </div>

        <Field
          {...bind('description')}
          as="textarea"
          rows={3}
          label="Short Product Description"
          required
          error={errors.description}
          placeholder="Dimensions, uses and look of the piece, for catalog shoppers..."
        />

        <div>
          <ImageUpload
            currentImage={form.image}
            label="Product Craft Photograph"
            onImageChange={(img) => {
              set('image', img);
              setErrors((prev) => ({ ...prev, image: '' })); // clear the error once a photo is added
            }}
          />
          {errors.image && <p className="artisan-field-error artisan-image-error">{errors.image}</p>}
        </div>

        {/* draft / published switch */}
        <div className="artisan-publish-settings">
          <div>
            <p className="artisan-field-label">Publishing State</p>
            <p className="artisan-muted artisan-tiny-text">Publish immediately or keep it as a draft.</p>
          </div>
          <div className="artisan-publish-options">
            {[
              ['draft', 'Draft Only', 'artisan-status-option-draft'],
              ['published', 'Published', 'artisan-status-option-published'],
            ].map(([value, text, activeStyle]) => (
              <button
                key={value}
                type="button"
                onClick={() => set('status', value)}
                className={`artisan-status-option ${activeStyle} ${form.status === value ? 'is-selected' : ''}`}
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* story for this specific product */}
      <CraftStory data={form.craftStory} onChange={setStory} productName={form.name} />

      {/* bottom actions, handy after scrolling a long form */}
      <div className="card artisan-form-footer">
        <button type="button" onClick={onCancel} className="btn-secondary artisan-small-button">
          Cancel
        </button>
        <div className="artisan-action-row">
          {previewBtn}
          {publishBtn}
        </div>
      </div>

      <ProductDetailModal
        product={previewProduct}
        artisan={artisan}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
}