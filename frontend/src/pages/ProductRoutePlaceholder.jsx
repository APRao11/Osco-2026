import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MeetTheMaker } from '../components/ArtisanProfile.jsx';
import { CustomOrderRequest, SupportArtisan } from '../components/BuyerActions.jsx';
import { getArtisanProfile, getProduct, normalizeArtisan, normalizeProduct } from '../data/artisanApi.js';

const storyItems = [
  ['Technique & Process', 'technique'],
  ['Materials Used', 'materials'],
  ['Cultural Significance', 'culturalSignificance'],
  ['Making Time', 'makingTime'],
  ['Story Behind This Piece', 'storyBehindCraft'],
];

export default function ProductRoutePlaceholder() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadProduct() {
      setLoading(true);
      setError('');
      setProduct(null);
      setArtisan(null);

      try {
        const productData = await getProduct(productId);
        const makerData = productData.artisan_id ? await getArtisanProfile(productData.artisan_id) : null;
        if (!ignore) {
          setProduct(normalizeProduct(productData));
          setArtisan(makerData ? normalizeArtisan(makerData) : null);
        }
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

  if (loading) return <main className="container section-block"><div className="empty-state" role="status">Loading product...</div></main>;
  if (error || !product) return <main className="container section-block"><div className="empty-state">{error || 'Product not found.'}<p><Link to="/">Return to the marketplace</Link></p></div></main>;

  const story = product.craftStory || {};
  const hasStory = Object.values(story).some(Boolean);

  return (
    <main className="container section-block product-detail-page">
      <Link className="product-detail-back" to="/">← Back to marketplace</Link>
      <div className="product-detail-layout">
        <div className="product-detail-image"><img src={product.image} alt={product.name} /></div>
        <section className="product-detail-copy">
          <p className="eyebrow">{product.craft_name || 'Handmade craft'}</p>
          <h1>{product.name}</h1>
          <p>{product.description || 'A handmade piece from a coastal artisan.'}</p>
          <p className="product-detail-price">₹{Number(product.price).toLocaleString('en-IN')}</p>
          <p className="product-detail-stock">{Number(product.stock) > 0 ? `${product.stock} in stock` : 'Currently out of stock'}</p>
          {product.artisan_name && <p>Made by {product.artisan_name}</p>}
          {product.status === 'published' && Number(product.stock) > 0 ? (
            <Link className="primary-button product-order-button" to={`/products/${product.id}/order`}>Buy Now · Place Order</Link>
          ) : <button className="primary-button product-order-button" type="button" disabled>{product.status !== 'published' ? 'Not available to order' : 'Out of stock'}</button>}
        </section>
      </div>

      <section className="product-detail-story" aria-labelledby="product-story-heading">
        <p className="eyebrow">The making</p>
        <h2 id="product-story-heading">Craft Story</h2>
        {hasStory ? (
          <div className="product-detail-story-grid">
            {storyItems.filter(([, key]) => story[key]).map(([label, key]) => (
              <article className="product-detail-story-item" key={key}><h3>{label}</h3><p>{story[key]}</p></article>
            ))}
          </div>
        ) : <p>The maker has not added a product-specific craft story yet.</p>}
      </section>

      {artisan && (
        <section className="product-maker-section" aria-label="Meet the maker">
          <MeetTheMaker artisan={artisan} showEditButton={false} />
          <SupportArtisan artisan={artisan} product={product} />
        </section>
      )}
      <CustomOrderRequest product={product} />
    </main>
  );
}
