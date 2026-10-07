import { useState } from 'react';
import { Save, Eye, AlertCircle, DollarSign, Package, Layers, ArrowLeft, CheckCircle } from 'lucide-react';
import { craftCategories } from '../data/mockData.js';
import { ImageUpload } from './ImageUpload.jsx';
import { ProductDetailModal } from './ProductDetailModal.jsx';

// shared input look, so we don't repeat this long class string everywhere
const inputStyle =
  'w-full text-xs p-3 rounded-lg border border-[#D8C7B2] bg-white focus:outline-none focus:ring-1 focus:ring-[#6B4632] text-[#2F2924]';

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
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-[#2F2924] flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-[#6B4632]" />}
        {label} {required && <span className="text-[#6B4632]">*</span>}
      </label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-3 text-xs text-[#756A60] font-semibold">{prefix}</span>}
        <Tag
          className={`${inputStyle} ${prefix ? 'pl-7' : ''} ${Tag === 'textarea' ? 'resize-none' : ''}`}
          {...props}
        >
          {children}
        </Tag>
      </div>
      {error && <p className="text-[11px] text-rose-700">{error}</p>}
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
    <button type="button" onClick={() => setPreviewOpen(true)} className="btn-secondary text-xs">
      <Eye className="w-4 h-4" /> Preview Piece
    </button>
  );
  const publishBtn = (
    <button type="button" onClick={() => handleSubmit('published')} className="btn-primary text-xs">
      <Save className="w-4 h-4" /> {isEditing ? 'Save Changes' : 'Publish Product'}
    </button>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#6B4632] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#A68A64]">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-xs font-semibold">{isEditing ? 'Product Updated Successfully' : 'Product Saved Successfully'}</p>
            <p className="text-[11px] text-[#EFE4D3]">
              {toast === 'published' ? 'Now available in your catalog' : 'Saved as draft'}
            </p>
          </div>
        </div>
      )}

      {/* header: back button, title and the main actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FFF9F0] p-4 sm:p-6 rounded-xl border border-[#D8C7B2]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            title="Return to products"
            className="p-2 rounded-lg text-[#756A60] hover:text-[#2F2924] hover:bg-[#EFE4D3] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#6B4632]">
              {isEditing ? `Edit: ${p?.name || 'Craft Product'}` : 'Add New Coastal Craft Product'}
            </h2>
            <p className="text-xs text-[#756A60]">
              {isEditing ? 'Update product details and the craft story.' : 'Document and publish a handmade coastal craft item.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {previewBtn}
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            className="text-xs font-semibold text-[#6B4632] bg-[#EFE4D3] hover:bg-[#E2D4BF] px-3.5 py-2.5 rounded-lg border border-[#D8C7B2] transition-colors"
          >
            Save as Draft
          </button>
          {publishBtn}
        </div>
      </div>

      {/* list of everything that failed validation */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-rose-50 border border-rose-300 p-4 rounded-xl text-rose-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold">Please complete the required details before publishing:</p>
            <ul className="list-disc list-inside text-rose-800">
              {Object.values(errors).map((msg) => (
                <li key={msg}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* general product info */}
      <div className="card p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#D8C7B2]/70 pb-3">
          <h3 className="text-base font-serif font-bold text-[#6B4632]">General Product Information</h3>
          <p className="text-xs text-[#756A60]">Details shown to buyers browsing the catalog.</p>
        </div>

        <Field
          {...bind('name')}
          label="Product Name / Title"
          required
          error={errors.name}
          placeholder="e.g. Handwoven Coconut Palm Harvest Basket"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
          {errors.image && <p className="text-[11px] text-rose-700 mt-1">{errors.image}</p>}
        </div>

        {/* draft / published switch */}
        <div className="pt-2 border-t border-[#D8C7B2]/70 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#2F2924]">Publishing State</p>
            <p className="text-[11px] text-[#756A60]">Publish immediately or keep it as a draft.</p>
          </div>
          <div className="flex items-center gap-2">
            {[
              ['draft', 'Draft Only', 'bg-amber-100 text-amber-900 border-amber-300'],
              ['published', 'Published', 'bg-emerald-800 text-white border-emerald-700'],
            ].map(([value, text, activeStyle]) => (
              <button
                key={value}
                type="button"
                onClick={() => set('status', value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  form.status === value ? activeStyle : 'bg-white text-[#756A60] border-[#D8C7B2] hover:bg-[#EFE4D3]'
                }`}
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
      <div className="card p-6 bg-[#FFF9F0] border border-[#D8C7B2] flex flex-wrap items-center justify-between gap-4">
        <button type="button" onClick={onCancel} className="btn-secondary text-xs">
          Cancel
        </button>
        <div className="flex items-center gap-3">
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