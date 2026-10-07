import { Link } from 'react-router-dom';
import { crafts } from '../data/crafts';

export default function ProductCard({ product }) {
  const craftName = crafts.find((craft) => craft.id === product.craftId)?.name ?? product.craftId;

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
        <p className="product-location">{product.location}</p>
      </div>
    </Link>
  );
}
