import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MarketplaceToolbar from '../components/MarketplaceToolbar';
import ProductGrid from '../components/ProductGrid';
import SectionHeading from '../components/SectionHeading';
import { crafts } from '../data/crafts';
import { getCraftSlug } from '../data/craftRoutes';
import { products } from '../data/products';

export default function CraftCategoryPage() {
  const { craftSlug } = useParams();
  const craft =
    crafts.find((item) => getCraftSlug(item) === craftSlug) ??
    crafts.find((item) => item.id === craftSlug) ??
    crafts[0];

  const [query, setQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [sortOrder, setSortOrder] = useState('featured');

  const visibleProducts = useMemo(() => {
    const baseProducts = products.filter((product) => {
      const matchesCraft = product.craftId === craft.id;
      const matchesQuery =
        !query ||
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.artisanName.toLowerCase().includes(query.toLowerCase()) ||
        product.location.toLowerCase().includes(query.toLowerCase()) ||
        crafts
          .find((item) => item.id === product.craftId)
          ?.name.toLowerCase()
          .includes(query.toLowerCase());

      let matchesPrice = true;
      if (priceRange === 'under-2000') matchesPrice = product.price < 2000;
      if (priceRange === '2000-5000') matchesPrice = product.price >= 2000 && product.price <= 5000;
      if (priceRange === 'above-5000') matchesPrice = product.price > 5000;

      return matchesCraft && matchesQuery && matchesPrice;
    });

    const sortedProducts = [...baseProducts];
    if (sortOrder === 'low-to-high') {
      sortedProducts.sort((a, b) => a.price - b.price);
    }
    if (sortOrder === 'high-to-low') {
      sortedProducts.sort((a, b) => b.price - a.price);
    }

    return sortedProducts;
  }, [craft.id, query, priceRange, sortOrder]);

  return (
    <main className="container section-block category-page">
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
