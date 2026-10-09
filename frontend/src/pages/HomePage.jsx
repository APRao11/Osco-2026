import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import CraftGrid from '../components/CraftGrid';
import MarketplaceToolbar from '../components/MarketplaceToolbar';
import ProductGrid from '../components/ProductGrid';
import SectionHeading from '../components/SectionHeading';
import { crafts as sampleCrafts } from '../data/crafts';
import { getCraftSlug } from '../data/craftRoutes';
import { products as sampleProducts } from '../data/products';
import { API_ROOT } from '../data/artisanApi.js';

export default function HomePage() {
  const [crafts, setCrafts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedCraft, setSelectedCraft] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortOrder, setSortOrder] = useState('featured');

  useEffect(() => {
    let ignore = false;

    async function loadMarketplace() {
      try {
        const [craftResponse, productResponse] = await Promise.all([
          fetch(`${API_ROOT}/crafts`),
          fetch(`${API_ROOT}/products`),
        ]);
        if (!craftResponse.ok || !productResponse.ok) {
          throw new Error('Could not load live marketplace data.');
        }

        const [craftData, productData] = await Promise.all([
          craftResponse.json(),
          productResponse.json(),
        ]);
        const normalizedProducts = productData.map((product) => {
          const craft = craftData.find(
            (item) => String(item.id) === String(product.craft_id ?? product.craftId),
          );
          return {
            ...product,
            craftId: product.craft_id ?? product.craftId,
            craftName: product.craft_name ?? product.craftName ?? craft?.name ?? '',
            artisanName: product.artisan_name ?? product.artisanName ?? '',
            location: product.location ?? craft?.location ?? '',
            price: Number(product.price),
          };
        });

        if (!ignore) {
          setCrafts(craftData);
          setProducts(normalizedProducts);
        }
      } catch {
        if (!ignore) {
          const fallbackProducts = sampleProducts.map((product) => {
            const craft = sampleCrafts.find((item) => item.id === product.craftId);
            return { ...product, craftName: craft?.name ?? '' };
          });
          setCrafts(sampleCrafts);
          setProducts(fallbackProducts);
          setError('Live marketplace data is unavailable. Showing sample listings.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadMarketplace();
    return () => {
      ignore = true;
    };
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const matchingCrafts = useMemo(
    () =>
      normalizedQuery
        ? crafts.filter((craft) =>
            `${craft.name} ${craft.description}`.toLowerCase().includes(normalizedQuery),
          )
        : [],
    [crafts, normalizedQuery],
  );

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const craft = crafts.find((item) => String(item.id) === String(product.craftId));
      const matchesCraft = selectedCraft === 'all' || String(product.craftId) === selectedCraft;
      const matchesQuery =
        !normalizedQuery ||
        `${product.name} ${product.artisanName} ${product.location} ${craft?.name ?? ''} ${craft?.description ?? ''}`
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
  }, [crafts, products, normalizedQuery, selectedCraft, priceRange, sortOrder]);

  return (
    <>
      <section className="container homepage-toolbar-wrap" aria-label="Marketplace discovery tools">
        <MarketplaceToolbar
          query={query}
          onQueryChange={setQuery}
          placeholder="Search crafts, products, or artisans"
          ariaLabel="Search crafts, products, or artisans"
          craftOptions={crafts}
          selectedCraft={selectedCraft}
          onCraftChange={setSelectedCraft}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
        {normalizedQuery && matchingCrafts.length > 0 ? (
          <div className="matching-crafts" aria-live="polite">
            <span>Craft collections</span>
            {matchingCrafts.map((craft) => (
              <Link key={craft.id} to={`/crafts/${getCraftSlug(craft)}`}>
                {craft.name}
                <span aria-hidden="true"> ↗</span>
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      <Hero />
      {error ? <p className="container marketplace-notice" role="status">{error}</p> : null}
      {loading ? (
        <p className="container section-block">Loading crafts...</p>
      ) : (
        <CraftGrid crafts={crafts} />
      )}

      <section className="container section-block home-product-section">
        <div className="catalogue-header-row">
          <SectionHeading
            eyebrow={normalizedQuery ? 'Search results' : 'Browse the marketplace'}
            title={
              normalizedQuery
                ? `${visibleProducts.length} ${visibleProducts.length === 1 ? 'piece' : 'pieces'} found`
                : 'Handmade finds'
            }
            description="Explore pieces from coastal Karnataka and select a product to continue to its details."
          />
        </div>
        {visibleProducts.length > 0 ? (
          <ProductGrid products={visibleProducts} />
        ) : (
          <div className="empty-state" aria-live="polite">
            <p>No products match your search or filters. Try another term or broaden your filters.</p>
          </div>
        )}
      </section>

      <section className="container section-block discovery-panel">
        <SectionHeading
          eyebrow="Why explore"
          title="Stories shaped by the coast"
          description="Every piece reflects a craft tradition, a family practice, and a way of life rooted in coastal Karnataka."
        />

        <div className="feature-grid">
          <article>
            <span>01</span>
            <h3>Curated collections</h3>
            <p>Discover thoughtfully selected crafts and keep the browsing experience rooted in inspiration.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Handmade with heritage</h3>
            <p>Each product brings a warm sense of place, process, and continuity from artisan to home.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Simple discovery</h3>
            <p>Explore by craft, follow your curiosity, and move from category to product without friction.</p>
          </article>
        </div>
      </section>
    </>
  );
}
