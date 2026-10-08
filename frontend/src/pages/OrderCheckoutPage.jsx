import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createLocalOrder, saveServerOrder } from '../data/orderStorage';

export default function OrderCheckoutPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ buyerName: '', phone: '', address: '', quantity: 1 });

  useEffect(() => {
    let ignore = false;

    async function loadProduct() {
      try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Product not found.' : 'Could not load product.');
        }
        const productData = await response.json();
        if (!ignore) setProduct(productData);
      } catch (loadError) {
        if (!ignore) setError(loadError.message || 'Could not load product.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadProduct();
    return () => {
      ignore = true;
    };
  }, [productId]);

  const quantity = Math.max(1, Math.min(20, Number(form.quantity) || 1));
  const total = product ? Number(product.price) * quantity : 0;
  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    if (!product) return;
    setError('');
    setSubmitting(true);

    let response;
    try {
      response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          buyer_name: form.buyerName,
          buyer_phone: form.phone,
          buyer_address: form.address,
          quantity,
        }),
      });
    } catch {
      try {
        const localOrder = createLocalOrder({ ...form, quantity, product });
        navigate(`/orders/${localOrder.id}/confirmation`, { state: { order: localOrder } });
      } catch {
        setError('The backend is unavailable and this browser could not save the demo order.');
        setSubmitting(false);
      }
      return;
    }

    let result = {};
    try {
      result = await response.json();
    } catch {
      result = {};
    }

    if (!response.ok) {
      setError(result.error || 'Could not place this order. Please try again.');
      setSubmitting(false);
      return;
    }

    try {
      const savedOrder = saveServerOrder(result.order);
      navigate(`/orders/${savedOrder.id}/confirmation`, { state: { order: savedOrder } });
    } catch {
      const serverOrder = result.order;
      navigate(`/orders/${serverOrder.id}/confirmation`, { state: { serverOrder } });
    }
  }

  if (loading) {
    return <main className="container section-block"><div className="empty-state">Loading product...</div></main>;
  }

  if (!product) {
    return (
      <main className="container section-block">
        <div className="empty-state">{error || 'Product not found.'}</div>
      </main>
    );
  }

  return (
    <main className="container section-block order-page">
      <Link className="order-back-link" to={`/products/${product.id}`}>
        ← Back to {product.name}
      </Link>
      <ol className="order-progress" aria-label="Order progress">
        <li className="is-complete">Choose piece</li>
        <li className="is-current">Your details</li>
        <li>Confirmation</li>
      </ol>
      <header className="order-page-heading">
        <p className="eyebrow">A simple, direct order</p>
        <h1>Complete your order</h1>
        <p>Share your delivery details. The artisan will coordinate delivery directly with you.</p>
      </header>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Delivery details</h2>
          <label htmlFor="buyer-name">Your name</label>
          <input
            id="buyer-name"
            autoComplete="name"
            value={form.buyerName}
            onChange={updateField('buyerName')}
            placeholder="e.g. Asha Rao"
            required
          />

          <label htmlFor="buyer-phone">Phone</label>
          <input
            id="buyer-phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={updateField('phone')}
            placeholder="Your contact number"
            required
          />

          <label htmlFor="buyer-address">Delivery address</label>
          <textarea
            id="buyer-address"
            autoComplete="street-address"
            rows="4"
            value={form.address}
            onChange={updateField('address')}
            placeholder="House, street, city and PIN code"
            required
          />

          <label htmlFor="order-quantity">Quantity</label>
          <input
            id="order-quantity"
            type="number"
            min="1"
            max="20"
            step="1"
            value={form.quantity}
            onChange={updateField('quantity')}
            required
          />

          <p className="checkout-demo-note">
            <strong>Demo checkout:</strong> payment is simulated and this order is saved only in this browser.
          </p>
          {error ? <p className="order-error" role="alert">{error}</p> : null}
          <button className="primary-button checkout-submit" type="submit" disabled={submitting}>
            {submitting ? 'Placing order…' : `Place order · ₹${total.toLocaleString('en-IN')}`}
          </button>
        </form>

        <aside className="checkout-summary" aria-label="Order summary">
          {product.image ? <img src={product.image} alt={product.name} /> : null}
          <div className="checkout-summary-body">
            <p className="eyebrow">{product.craft_name || 'Handmade craft'}</p>
            <h2>{product.name}</h2>
            <p>Handmade by {product.artisan_name || 'Local artisan'}</p>
            <dl className="order-summary-lines">
              <div><dt>Price</dt><dd>₹{Number(product.price).toLocaleString('en-IN')}</dd></div>
              <div><dt>Quantity</dt><dd>× {quantity}</dd></div>
              <div><dt>Delivery</dt><dd>Arranged with the maker</dd></div>
              <div className="order-total"><dt>Total</dt><dd>₹{total.toLocaleString('en-IN')}</dd></div>
            </dl>
          </div>
        </aside>
      </div>
    </main>
  );
}
