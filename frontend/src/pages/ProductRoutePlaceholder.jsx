import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function ProductRoutePlaceholder() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadProduct() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Product not found.' : 'Could not load product.');
        }
        const data = await response.json();
        if (!ignore) setProduct(data);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadProduct();
    return () => {
      ignore = true;
    };
  }, [productId]);

  return (
    <main className="container section-block placeholder-page">
      <div className="placeholder-card">
        {loading ? (
          <p>Loading product...</p>
        ) : error ? (
          <p>{error}</p>
        ) : product ? (
          <>
            <p className="eyebrow">{product.craft_name}</p>
            <h1>{product.name}</h1>
            <img src={product.image} alt={product.name} />
            <p>{product.description || 'A handmade piece from coastal Karnataka.'}</p>
            <p>Artisan: {product.artisan_name || 'Not specified'}</p>
            <p>Price: ₹{product.price.toLocaleString('en-IN')}</p>
            <p>In stock: {product.stock}</p>
          </>
        ) : null}
        <Link className="primary-button" to="/">
          Return to the marketplace
        </Link>
      </div>
    </main>
  );
}
