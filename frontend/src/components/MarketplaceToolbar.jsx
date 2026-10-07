import { useState } from 'react';
import FilterControls from './FilterControls';
import SearchBar from './SearchBar';

export default function MarketplaceToolbar({
  query,
  onQueryChange,
  placeholder,
  ariaLabel,
  craftOptions = [],
  selectedCraft,
  onCraftChange,
  priceRange,
  onPriceChange,
  sortOrder,
  onSortChange,
  showCraft = true,
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilterCount = [
    showCraft && selectedCraft !== 'all',
    priceRange !== 'all',
    sortOrder !== 'featured',
  ].filter(Boolean).length;

  return (
    <section className="marketplace-toolbar" aria-label="Marketplace search and filters">
      <div className="marketplace-toolbar-row">
        <SearchBar
          value={query}
          onChange={onQueryChange}
          placeholder={placeholder}
          ariaLabel={ariaLabel}
        />
        <button
          className={`filter-toggle${filtersOpen ? ' is-open' : ''}`}
          type="button"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M4 7h16M7 12h10m-7 5h4" />
          </svg>
          Filters
          {activeFilterCount > 0 ? (
            <span className="filter-count" aria-label={`${activeFilterCount} active`}>
              {activeFilterCount}
            </span>
          ) : null}
          <span className="filter-toggle-chevron" aria-hidden="true">
            ▾
          </span>
        </button>
      </div>
      {filtersOpen ? (
        <div className="marketplace-filter-panel">
          <FilterControls
            craftOptions={craftOptions}
            selectedCraft={selectedCraft}
            priceRange={priceRange}
            sortOrder={sortOrder}
            onCraftChange={onCraftChange}
            onPriceChange={onPriceChange}
            onSortChange={onSortChange}
            showCraft={showCraft}
          />
        </div>
      ) : null}
    </section>
  );
}
