import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const craftName = product.craftName ?? product.craft_name ?? '';

  return (
    <Link className="product-card" to={`/products/${product.id}`} aria-label={`View ${product.name}`}>
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-card-body">
        <div className="product-meta-row">
          <span className="product-craft">{craftName}</span>
          <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
        </div>
        <h3>{product.name}</h3>
        <p className="product-artist">{product.artisanName}</p>
        {product.location && <p className="product-location">{product.location}</p>}
      </div>
    </Link>
  );
}
