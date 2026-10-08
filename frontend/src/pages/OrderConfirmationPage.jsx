import { Link, useParams } from 'react-router-dom';
import { getLocalOrder } from '../data/orderStorage';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const order = getLocalOrder(orderId);

  if (!order) {
    return (
      <main className="container section-block order-page">
        <div className="empty-state">
          <p>This receipt is not available in this browser.</p>
          <Link className="primary-button" to="/">Return to the marketplace</Link>
        </div>
      </main>
    );
  }

  const placedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const receiptNumber = `OSCO-${order.id.slice(-8)}`;

  return (
    <main className="container section-block order-page confirmation-page">
      <ol className="order-progress no-print" aria-label="Order progress">
        <li className="is-complete">Choose piece</li>
        <li className="is-complete">Your details</li>
        <li className="is-current">Confirmation</li>
      </ol>

      <div className="confirmation-content">
        <header className="confirmation-heading">
          <span className="confirmation-check" aria-hidden="true">✓</span>
          <p className="eyebrow">Order received</p>
          <h1>Thank you, {order.buyerName}!</h1>
          <p>
            Your order has been placed. {order.artisanName} can contact you at <strong>{order.phone}</strong> to coordinate delivery.
          </p>
        </header>

        <section className="receipt-card" aria-labelledby="receipt-heading">
          <h2 id="receipt-heading" className="sr-only">Order receipt</h2>
          <div className="receipt-metadata">
            <div><span>Order number</span><strong>{receiptNumber}</strong></div>
            <div><span>Date</span><strong>{placedDate}</strong></div>
            <div><span>Status</span><strong className="order-status">Order placed</strong></div>
          </div>

          <div className="receipt-product">
            {order.productImage ? <img src={order.productImage} alt={order.productName} /> : null}
            <div className="receipt-product-copy">
              <p className="eyebrow">{order.craftName || 'Handmade craft'}</p>
              <h3>{order.productName}</h3>
              <p>Handmade by {order.artisanName}</p>
              <p>₹{order.unitPrice.toLocaleString('en-IN')} × {order.quantity}</p>
            </div>
            <strong className="receipt-product-total">₹{order.total.toLocaleString('en-IN')}</strong>
          </div>

          <dl className="order-summary-lines receipt-totals">
            <div><dt>Subtotal</dt><dd>₹{order.total.toLocaleString('en-IN')}</dd></div>
            <div><dt>Delivery</dt><dd>Arranged with the maker</dd></div>
            <div className="order-total"><dt>Total · payment simulated</dt><dd>₹{order.total.toLocaleString('en-IN')}</dd></div>
          </dl>

          <div className="receipt-delivery">
            <span>Delivering to</span>
            <strong>{order.buyerName}</strong>
            <p>{order.address}</p>
          </div>
        </section>

        <section className="order-next-steps">
          <h2>What happens next</h2>
          <ol>
            <li><strong>The artisan confirms your order</strong><span>They will contact you using the number you provided.</span></li>
            <li><strong>Your piece is prepared by hand</strong><span>The maker will share an estimated delivery date.</span></li>
            <li><strong>Delivery is arranged directly</strong><span>Coordinate timing and delivery details with the artisan.</span></li>
          </ol>
        </section>

        <div className="confirmation-actions no-print">
          <Link className="primary-button" to="/">Continue browsing</Link>
          <button className="secondary-button" type="button" onClick={() => window.print()}>Print receipt</button>
        </div>
        <p className="confirmation-disclaimer no-print">This is a demo receipt. Payment and order fulfilment are not processed by the site.</p>
      </div>
    </main>
  );
}
