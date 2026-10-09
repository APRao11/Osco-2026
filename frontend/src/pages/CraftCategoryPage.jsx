import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MarketplaceToolbar from '../components/MarketplaceToolbar';
import ProductGrid from '../components/ProductGrid';
import SectionHeading from '../components/SectionHeading';
import { getCraftSlug } from '../data/craftRoutes';
import { crafts as sampleCrafts } from '../data/crafts';
import { products as sampleProducts } from '../data/products';
import { API_ROOT } from '../data/artisanApi.js';

export default function CraftCategoryPage() {
  const { craftSlug } = useParams();
  const [craft, setCraft] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [sortOrder, setSortOrder] = useState('featured');

  useEffect(() => {
    let ignore = false;

    async function loadCollection() {
      setLoading(true);
      setError('');
      try {
        const [craftsResponse, productsResponse] = await Promise.all([
          fetch(`${API_ROOT}/crafts`),
          fetch(`${API_ROOT}/products`),
        ]);
        if (!craftsResponse.ok || !productsResponse.ok) {
          throw new Error('Could not load this craft collection.');
        }

        const [craftData, productData] = await Promise.all([
          craftsResponse.json(),
          productsResponse.json(),
        ]);
        const matchedCraft = craftData.find(
          (item) => getCraftSlug(item) === craftSlug ||
            String(item.id) === craftSlug || String(item.category) === craftSlug,
        );
        if (!matchedCraft) throw new Error('Craft not found.');

        // Keep the existing single-craft API lookup, resolving the buyer-facing slug first.
        const detailResponse = await fetch(`${API_ROOT}/crafts/${matchedCraft.id}`);
        const detailCraft = detailResponse.ok ? await detailResponse.json() : matchedCraft;
        const normalizedProducts = productData.map((product) => {
          const productCraft = craftData.find(
            (item) => String(item.id) === String(product.craft_id ?? product.craftId),
          );
          return {
            ...product,
            craftId: product.craft_id ?? product.craftId,
            craftName: product.craft_name ?? product.craftName ?? productCraft?.name ?? '',
            artisanName: product.artisan_name ?? product.artisanName ?? '',
            location: product.location ?? productCraft?.location ?? '',
            price: Number(product.price),
          };
        });

        if (!ignore) {
          setCraft(detailCraft);
          setProducts(normalizedProducts);
        }
      } catch (loadError) {
        if (!ignore) {
          const fallbackCraft = sampleCrafts.find(
            (item) => getCraftSlug(item) === craftSlug || craftSlug.startsWith(item.id),
          );
          const fallbackProducts = sampleProducts.map((product) => {
            const productCraft = sampleCrafts.find((item) => item.id === product.craftId);
            return { ...product, craftName: productCraft?.name ?? '' };
          });
          setCraft(fallbackCraft ?? null);
          setProducts(fallbackProducts);
          setError(loadError.message || 'Live marketplace data is unavailable.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadCollection();
    return () => {
      ignore = true;
    };
  }, [craftSlug]);

  const visibleProducts = useMemo(() => {
    if (!craft) return [];
    const filtered = products.filter((product) => {
      const matchesCraft = String(product.craftId) === String(craft.id);
      const normalizedQuery = query.trim().toLowerCase();
      const matchesQuery =
        !normalizedQuery ||
        `${product.name} ${product.artisanName} ${product.location} ${product.craftName} ${craft.name}`
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesPrice =
        priceRange === 'all' ||
        (priceRange === 'under-2000' && product.price < 2000) ||
        (priceRange === '2000-5000' && product.price >= 2000 && product.price <= 5000) ||
        (priceRange === 'above-5000' && product.price > 5000);
      return matchesCraft && matchesQuery && matchesPrice;
    });

    if (sortOrder === 'low-to-high') return filtered.sort((a, b) => a.price - b.price);
    if (sortOrder === 'high-to-low') return filtered.sort((a, b) => b.price - a.price);
    return filtered;
  }, [craft, products, query, priceRange, sortOrder]);

  if (loading) {
    return <main className="container section-block"><div className="empty-state">Loading craft collection...</div></main>;
  }

  if (!craft) {
    return <main className="container section-block"><div className="empty-state">{error || 'Craft not found.'}</div></main>;
  }

  return (
    <main className="container section-block category-page">
      {error ? <p className="marketplace-notice" role="status">{error} Showing sample listings.</p> : null}
      <MarketplaceToolbar
        query={query}
        onQueryChange={setQuery}
        placeholder={`Search ${craft.name} products or artisans`}
        ariaLabel={`Search ${craft.name} products or artisans`}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        showCraft={false}
      />

      <div className="category-hero">
        <div className="category-hero-copy">
          <p className="eyebrow">Craft collection</p>
          <h1>{craft.name}</h1>
          <p>{craft.description}</p>
        </div>
        <img src={craft.image} alt={craft.name} />
      </div>

      <div className="catalogue-header-row">
        <SectionHeading
          eyebrow="Collection"
          title={`${visibleProducts.length} products`}
          description="Browse the pieces most closely aligned with this craft tradition."
        />
        <Link className="secondary-button inline-button" to="/#explore">
          Back to crafts
        </Link>
      </div>

      {visibleProducts.length > 0 ? (
        <ProductGrid products={visibleProducts} />
      ) : (
        <div className="empty-state">
          <p>No products match your current search or filters.</p>
        </div>
      )}
    </main>
  );
}
