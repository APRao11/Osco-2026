import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import FilterControls from '../components/FilterControls';
import ProductGrid from '../components/ProductGrid';
import SearchBar from '../components/SearchBar';
import SectionHeading from '../components/SectionHeading';
import { crafts } from '../data/crafts';
import { products } from '../data/products';

export default function CraftCategoryPage() {
  const { craftId } = useParams();
  const craft = crafts.find((item) => item.id === craftId) ?? crafts[0];

  const [query, setQuery] = useState('');
  const [selectedCraft, setSelectedCraft] = useState(craft.id);
  const [priceRange, setPriceRange] = useState('all');
  const [sortOrder, setSortOrder] = useState('featured');

  useEffect(() => {
    setSelectedCraft(craft.id);
  }, [craft.id]);

  const visibleProducts = useMemo(() => {
    const baseProducts = products.filter((product) => {
      const matchesCraft = selectedCraft === 'all' ? true : product.craftId === selectedCraft;
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
  }, [query, selectedCraft, priceRange, sortOrder]);

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
