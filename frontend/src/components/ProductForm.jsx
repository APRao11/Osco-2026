import React, { useEffect, useState } from 'react';
import { Save, Eye, AlertCircle, IndianRupee, Package, Layers, ArrowLeft } from 'lucide-react';
import { ImageUpload } from './ImageUpload.jsx';
import { ProductDetailModal } from './ProductDetailModal.jsx';

const inputStyle = 'artisan-field-input';
const today = () => new Date().toISOString().split('T')[0];

const emptyStory = {
  technique: '',
  materials: '',
  culturalSignificance: '',
  storyBehindCraft: '',
  makingTime: '',
};

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

function CraftStory({ data, onChange, productName }) {
  return (
    <div className="card craft-story">
      <h3>Craft Story</h3>
      <p className="story-intro">
        Preview story details for {productName || 'this product'}. The current backend does not save product craft stories.
      </p>
      <p className="artisan-muted artisan-tiny-text" role="note">
        These fields are preview-only and will not be stored in SQLite.
      </p>

      <div className="form-group">
        <label>How is it made?</label>
        <textarea
          rows="3"
          value={data.technique || ''}
          onChange={(event) => onChange('technique', event.target.value)}
          placeholder="Describe the traditional technique or process used."
        />
      </div>
      <div className="form-group">
        <label>Materials Used</label>
        <textarea
          rows="3"
          value={data.materials || ''}
          onChange={(event) => onChange('materials', event.target.value)}
          placeholder="Mention the natural or traditional materials used."
        />
      </div>
      <div className="form-group">
        <label>Cultural Significance</label>
        <textarea
          rows="3"
          value={data.culturalSignificance || ''}
          onChange={(event) => onChange('culturalSignificance', event.target.value)}
          placeholder="Share the cultural or coastal significance of this craft."
        />
      </div>
      <div className="form-group">
        <label>Making Time</label>
        <input
          type="text"
          value={data.makingTime || ''}
          onChange={(event) => onChange('makingTime', event.target.value)}
          placeholder="e.g. 2 days"
        />
      </div>
      <div className="form-group">
        <label>The Story Behind This Craft</label>
        <textarea
          rows="4"
          value={data.storyBehindCraft || ''}
          onChange={(event) => onChange('storyBehindCraft', event.target.value)}
          placeholder="Tell the story behind this particular piece."
        />
        <small>{(data.storyBehindCraft || '').length} characters</small>
      </div>
    </div>
  );
}

export function ProductForm({ initialProduct: productRecord, crafts = [], artisan, isEditing = false, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: productRecord?.name || '',
    image: productRecord?.image || '',
    craft_id: productRecord?.craft_id ?? crafts[0]?.id ?? '',
    price: productRecord?.price ?? '',
    stock: productRecord?.stock ?? 10,
    description: productRecord?.description || '',
    status: productRecord?.status || 'published',
    craftStory: productRecord?.craftStory || emptyStory,
  });
  const [errors, setErrors] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (!form.craft_id && crafts.length > 0) {
      setForm((current) => ({ ...current, craft_id: crafts[0].id }));
    }
  }, [crafts, form.craft_id]);

  const set = (field, value) => setForm((previous) => ({ ...previous, [field]: value }));
  const setStory = (field, value) => setForm((previous) => ({
    ...previous,
    craftStory: { ...previous.craftStory, [field]: value },
  }));
  const bind = (field) => ({ value: form[field], onChange: (event) => set(field, event.target.value) });

  const validate = () => {
    const checks = [
      ['name', !form.name.trim(), 'Please provide a product title.'],
      ['image', !form.image.trim(), 'A product photograph is required to showcase your craft.'],
      ['price', !form.price || Number(form.price) <= 0, 'Please enter a valid price.'],
      ['description', !form.description.trim(), 'Please provide a short product description.'],
      ['craft_id', !form.craft_id, 'Please select a craft category.'],
    ];
    const found = Object.fromEntries(checks.filter(([, failed]) => failed).map(([key, , message]) => [key, message]));
    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const handleSubmit = async (targetStatus) => {
    if (isSaving) return;
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const payload = {
      ...(productRecord?.id ? { id: productRecord.id } : {}),
      craft_id: Number(form.craft_id),
      artisan_id: Number(artisan.id),
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      image: form.image || null,
      stock: Number(form.stock) || 0,
      status: targetStatus || form.status,
    };

    setSaveError('');
    setIsSaving(true);
    try {
      await onSave(payload);
    } catch (error) {
      setSaveError(error.message || 'Could not save this product.');
    } finally {
      setIsSaving(false);
    }
  };

  const previewProduct = {
    ...form,
    id: productRecord?.id || 'preview',
    category: crafts.find((craft) => String(craft.id) === String(form.craft_id))?.name || '',
    name: form.name || 'Untitled Craft Item',
    image: form.image || 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80',
    price: Number(form.price) || 0,
    stock: Number(form.stock) || 0,
    description: form.description || 'Handmade with natural coastal fibers and traditional techniques passed down through generations.',
    createdAt: productRecord?.created_at || today(),
  };

  const previewButton = (
    <button type="button" onClick={() => setPreviewOpen(true)} className="btn-secondary artisan-small-button">
      <Eye className="artisan-icon" /> Preview Piece
    </button>
  );
  const saveButton = (
    <button
      type="button"
      onClick={() => handleSubmit(form.status)}
      className="btn-primary artisan-small-button"
      disabled={isSaving || crafts.length === 0}
    >
      <Save className="artisan-icon" /> {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Product'}
    </button>
  );

  return (
    <div className="artisan-product-form">
      <div className="artisan-product-form-heading">
        <div className="artisan-product-title-group">
          <button type="button" onClick={onCancel} title="Return to products" className="artisan-back-button">
            <ArrowLeft className="artisan-icon artisan-icon-large" />
          </button>
          <div>
            <h2 className="artisan-heading-secondary">
              {isEditing ? `Edit: ${productRecord?.name || 'Craft Product'}` : 'Add New Coastal Craft Product'}
            </h2>
            <p className="artisan-muted artisan-small-text">
              {isEditing ? 'Update product details and publishing state.' : 'Add a handmade coastal craft item to your catalogue.'}
            </p>
          </div>
        </div>
        <div className="artisan-form-heading-actions">
          {previewButton}
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            className="artisan-button artisan-button-draft"
            disabled={isSaving || crafts.length === 0}
          >
            {isSaving ? 'Saving...' : 'Save as Draft'}
          </button>
          {saveButton}
        </div>
      </div>

      {crafts.length === 0 && <p className="artisan-muted" role="status">Loading craft categories or no categories are available.</p>}
      {Object.keys(errors).length > 0 && (
        <div className="artisan-validation-banner" role="alert">
          <AlertCircle className="artisan-icon artisan-validation-icon" />
          <div className="artisan-validation-copy">
            <p className="artisan-small-strong">Please complete the required product details:</p>
            <ul className="artisan-validation-list">
              {Object.values(errors).map((message) => <li key={message}>{message}</li>)}
            </ul>
          </div>
        </div>
      )}
      {saveError && <p className="artisan-login-error" role="alert">{saveError}</p>}

      <div className="card artisan-product-section">
        <div className="artisan-section-heading">
          <h3 className="artisan-section-heading-title">General Product Information</h3>
          <p className="artisan-muted artisan-small-text">Details stored by the current product API.</p>
        </div>
        <Field
          {...bind('name')}
          label="Product Name / Title"
          required
          error={errors.name}
          placeholder="e.g. Handwoven Coconut Palm Harvest Basket"
        />

        <div className="artisan-product-details-grid">
          <Field {...bind('craft_id')} as="select" label="Craft Category" icon={Layers} required disabled={crafts.length === 0}>
            <option value="">Select a category</option>
            {crafts.map((craft) => <option key={craft.id} value={craft.id}>{craft.name}</option>)}
          </Field>
          <Field
            {...bind('price')}
            type="number"
            min="1"
            step="0.5"
            label="Price (INR)"
            icon={IndianRupee}
            prefix="₹"
            required
            error={errors.price}
            placeholder="2450"
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
            onImageChange={(image) => {
              set('image', image);
              setErrors((previous) => ({ ...previous, image: '' }));
            }}
          />
          {errors.image && <p className="artisan-field-error artisan-image-error">{errors.image}</p>}
          <p className="artisan-muted artisan-tiny-text" role="note">
            Images are saved in the existing image field. Choose files under 3.5 MB.
          </p>
        </div>

        <div className="artisan-publish-settings">
          <div>
            <p className="artisan-field-label">Publishing State</p>
            <p className="artisan-muted artisan-tiny-text">The backend supports published and draft statuses.</p>
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
                disabled={isSaving}
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>

      <CraftStory data={form.craftStory} onChange={setStory} productName={form.name} />

      <div className="card artisan-form-footer">
        <button type="button" onClick={onCancel} className="btn-secondary artisan-small-button" disabled={isSaving}>Cancel</button>
        <div className="artisan-action-row">
          {previewButton}
          {saveButton}
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
