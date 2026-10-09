import React, { useState } from 'react';
import { submitArtisanSupport, submitCustomOrderRequest } from '../data/artisanApi.js';

export function CustomOrderRequest({ product }) {
  const [form, setForm] = useState({ buyerName: '', contact: '', description: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setConfirmation('');
    try {
      const result = await submitCustomOrderRequest({
        product_id: product.id,
        craft_id: product.craft_id,
        buyer_name: form.buyerName,
        buyer_contact: form.contact,
        description: form.description,
      });
      setConfirmation(`Request #${result.request.id} received. This is a request only; the artisan has not yet accepted it.`);
      setForm({ buyerName: '', contact: '', description: '' });
    } catch (submitError) {
      setError(submitError.message || 'Could not submit the custom order request.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="buyer-action-card" onSubmit={submit}>
      <h2>Request a Custom Piece</h2>
      <p>Tell the maker what you have in mind. No payment is taken with this request.</p>
      <label>Your name<input required maxLength="120" value={form.buyerName} onChange={(event) => setForm({ ...form, buyerName: event.target.value })} /></label>
      <label>Phone or email<input required maxLength="160" value={form.contact} onChange={(event) => setForm({ ...form, contact: event.target.value })} /></label>
      <label>What would you like made?<textarea required minLength="10" maxLength="2000" rows="4" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
      {error && <p className="buyer-form-error" role="alert">{error}</p>}
      {confirmation && <p className="buyer-form-success" role="status">{confirmation}</p>}
      <button className="secondary-button" type="submit" disabled={busy}>{busy ? 'Sending request...' : 'Send custom request'}</button>
    </form>
  );
}

export function SupportArtisan({ artisan, product }) {
  const [amount, setAmount] = useState('100');
  const [customAmount, setCustomAmount] = useState('');
  const [supporterName, setSupporterName] = useState('');
  const [supporterContact, setSupporterContact] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const selectedAmount = amount === 'custom' ? customAmount : amount;

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setConfirmation('');
    try {
      const result = await submitArtisanSupport({
        artisan_id: artisan.id,
        product_id: product?.id,
        supporter_name: supporterName,
        supporter_contact: supporterContact,
        amount: Number(selectedAmount),
      });
      setConfirmation(`Demo contribution of ₹${Number(result.support.amount).toLocaleString('en-IN')} recorded for ${artisan.name}. No money was transferred.`);
    } catch (submitError) {
      setError(submitError.message || 'Could not record the demo contribution.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="buyer-action-card" onSubmit={submit}>
      <h2>Support {artisan.name}</h2>
      <p><strong>Demo contribution only:</strong> this records support intent; no money is transferred.</p>
      <label>Contribution amount
        <select value={amount} onChange={(event) => setAmount(event.target.value)}>
          <option value="100">₹100</option>
          <option value="250">₹250</option>
          <option value="500">₹500</option>
          <option value="custom">Enter another amount</option>
        </select>
      </label>
      {amount === 'custom' && <label>Amount in INR<input type="number" min="1" max="1000000" step="1" required value={customAmount} onChange={(event) => setCustomAmount(event.target.value)} /></label>}
      <label>Your name<input required maxLength="120" value={supporterName} onChange={(event) => setSupporterName(event.target.value)} /></label>
      <label>Contact (optional)<input maxLength="160" value={supporterContact} onChange={(event) => setSupporterContact(event.target.value)} /></label>
      {error && <p className="buyer-form-error" role="alert">{error}</p>}
      {confirmation && <p className="buyer-form-success" role="status">{confirmation}</p>}
      <button className="secondary-button" type="submit" disabled={busy}>{busy ? 'Recording...' : `Record demo contribution · ₹${Number(selectedAmount || 0).toLocaleString('en-IN')}`}</button>
    </form>
  );
}
