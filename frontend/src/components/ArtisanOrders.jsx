import React, { useCallback, useEffect, useState } from 'react';
import { getArtisanOrders, updateOrderStatus } from '../data/artisanApi.js';

const ORDER_STATUSES = ['Pending', 'Confirmed', 'In Progress', 'Ready', 'Completed', 'Cancelled'];

export default function ArtisanOrders({ artisanId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setOrders(await getArtisanOrders(artisanId));
    } catch (loadError) {
      setError(loadError.message || 'Could not load orders.');
    } finally {
      setLoading(false);
    }
  }, [artisanId]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const changeStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    setError('');
    setNotice('');
    try {
      await updateOrderStatus(orderId, artisanId, status);
      await loadOrders();
      setNotice('Order status updated.');
    } catch (updateError) {
      setError(updateError.message || 'Could not update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="artisan-orders-section" aria-labelledby="artisan-orders-heading">
      <div className="artisan-orders-heading">
        <div>
          <h2 id="artisan-orders-heading" className="artisan-section-heading-title artisan-recent-title">Buyer Orders</h2>
          <p className="artisan-muted artisan-small-text">Orders placed for your products.</p>
        </div>
        <button type="button" className="artisan-text-link" onClick={loadOrders} disabled={loading}>Refresh</button>
      </div>
      {loading && <p className="artisan-muted" role="status">Loading your orders...</p>}
      {error && <p className="artisan-login-error" role="alert">{error}</p>}
      {notice && <p className="artisan-success-banner" role="status">{notice}</p>}
      {!loading && !error && orders.length === 0 && (
        <div className="card artisan-order-empty artisan-muted">No buyer orders yet.</div>
      )}
      {!loading && orders.length > 0 && (
        <div className="artisan-orders-list">
          {orders.map((order) => (
            <article className="card artisan-order-card" key={order.id}>
              <div className="artisan-order-product">
                {order.product_image && <img src={order.product_image} alt="" />}
                <div>
                  <h3>{order.product_name}</h3>
                  <p className="artisan-muted">Order #{order.id} · {new Date(order.created_at).toLocaleDateString('en-IN')}</p>
                  <p>Quantity: {order.quantity} · Unit price: ₹{Number(order.unit_price).toLocaleString('en-IN')}</p>
                </div>
              </div>
              <div className="artisan-order-buyer">
                <strong>{order.buyer_name}</strong>
                <span>{order.buyer_phone}</span>
                <span>{order.buyer_address}</span>
              </div>
              <div className="artisan-order-total">
                <strong>₹{Number(order.total_price).toLocaleString('en-IN')}</strong>
                <label>
                  <span className="sr-only">Order status</span>
                  <select value={order.status} onChange={(event) => changeStatus(order.id, event.target.value)} disabled={updatingId === order.id}>
                    {ORDER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </label>
                {updatingId === order.id && <small role="status">Updating...</small>}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
