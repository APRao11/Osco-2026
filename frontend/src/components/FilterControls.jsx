import React from 'react';

export default function FilterControls({ craftOptions, selectedCraft, priceRange, sortOrder, onCraftChange, onPriceChange, onSortChange }) {
  return (
    <div className="filter-controls">
      <label>
        <span>Craft</span>
        <select value={selectedCraft} onChange={(event) => onCraftChange(event.target.value)}>
          <option value="all">All crafts</option>
          {craftOptions.map((craft) => (
            <option key={craft.id} value={craft.id}>
              {craft.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Price</span>
        <select value={priceRange} onChange={(event) => onPriceChange(event.target.value)}>
          <option value="all">Any price</option>
          <option value="under-2000">Under ₹2,000</option>
          <option value="2000-5000">₹2,000 to ₹5,000</option>
          <option value="above-5000">Above ₹5,000</option>
        </select>
      </label>

      <label>
        <span>Sort by</span>
        <select value={sortOrder} onChange={(event) => onSortChange(event.target.value)}>
          <option value="featured">Featured</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
        </select>
      </label>
    </div>
  );
}
