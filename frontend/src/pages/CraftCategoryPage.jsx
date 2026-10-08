import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import FilterControls from '../components/FilterControls';
import ProductGrid from '../components/ProductGrid';
import SearchBar from '../components/SearchBar';
import SectionHeading from '../components/SectionHeading';

export default function CraftCategoryPage() {
  const { craftId } = useParams();
  const [craft, setCraft] = useState(null);
  const [crafts, setCrafts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedCraft, setSelectedCraft] = useState(craftId);
  const [priceRange, setPriceRange] = useState('all');
  const [sortOrder, setSortOrder] = useState('featured');

  useEffect(() => {
    let ignore = false;

    async function loadCollection() {
      setLoading(true);
      setError('');

      try {
        const [craftResponse, craftsResponse, productsResponse] = await Promise.all([
          fetch(`http://localhost:3000/api/crafts/${craftId}`),
          fetch('http://localhost:3000/api/crafts'),
          fetch('http://localhost:3000/api/products'),
        ]);

        if (!craftResponse.ok || !craftsResponse.ok || !productsResponse.ok) {
          throw new Error('Could not load this craft collection.');
        }

        const [craftData, craftsData, productsData] = await Promise.all([
          craftResponse.json(),
          craftsResponse.json(),
          productsResponse.json(),
        ]);

        if (!ignore) {
          setCraft(craftData);
          setCrafts(craftsData);
          setProducts(
            productsData.map((product) => ({
              ...product,
              craftId: product.craft_id,
              craftName: product.craft_name ?? '',
              artisanName: product.artisan_name ?? '',
              location: product.location ?? '',
            }))
          );
        }
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    setSelectedCraft(craftId);
    loadCollection();
    return () => {
      ignore = true;
    };
  }, [craftId]);

  const baseProducts = products.filter((product) => {
    const matchesCraft = selectedCraft === 'all' || String(product.craftId) === selectedCraft;
    const matchesQuery =
      !query ||
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.artisanName.toLowerCase().includes(query.toLowerCase()) ||
      product.location.toLowerCase().includes(query.toLowerCase()) ||
      product.craftName.toLowerCase().includes(query.toLowerCase());

    let matchesPrice = true;
    if (priceRange === 'under-2000') matchesPrice = product.price < 2000;
    if (priceRange === '2000-5000') matchesPrice = product.price >= 2000 && product.price <= 5000;
    if (priceRange === 'above-5000') matchesPrice = product.price > 5000;

    return matchesCraft && matchesQuery && matchesPrice;
  });

  const visibleProducts = [...baseProducts];
  if (sortOrder === 'low-to-high') {
    visibleProducts.sort((a, b) => a.price - b.price);
  }
  if (sortOrder === 'high-to-low') {
    visibleProducts.sort((a, b) => b.price - a.price);
  }

  if (loading) {
    return <main className="container section-block"><div className="empty-state">Loading craft collection...</div></main>;
  }

  if (error || !craft) {
    return <main className="container section-block"><div className="empty-state">{error || 'Craft not found.'}</div></main>;
  }

  return (
    <main className="container section-block">
      <div className="category-hero">
        <div className="category-hero-copy">
          <p className="eyebrow">Craft collection</p>
          <h1>{craft.name}</h1>
          <p>{craft.description}</p>
        </div>
        <img src={craft.image} alt={craft.name} />
      </div>

      <div className="catalogue-tools">
        <SearchBar value={query} onChange={setQuery} />
        <FilterControls
          craftOptions={crafts}
          selectedCraft={selectedCraft}
          priceRange={priceRange}
          sortOrder={sortOrder}
          onCraftChange={(value) => setSelectedCraft(value)}
          onPriceChange={setPriceRange}
          onSortChange={setSortOrder}
        />
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
