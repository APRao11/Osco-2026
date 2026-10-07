import { Link, useParams } from 'react-router-dom';

export default function ProductRoutePlaceholder() {
  const { productId } = useParams();

  return (
    <main className="container section-block placeholder-page">
      <div className="placeholder-card">
        <p className="eyebrow">Member 3 handoff</p>
        <h1>Product route ready for details</h1>
        <p>
          The selected product is <strong>{productId}</strong>. This route is intentionally left as a handoff point for
          the product details page that Member 3 will build.
        </p>
        <Link className="primary-button" to="/">
          Return to the marketplace
        </Link>
      </div>
    </main>
  );
}
