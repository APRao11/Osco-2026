export default function SearchBar({ value, onChange, placeholder = 'Search products...' }) {
  return (
    <label className="search-bar" aria-label="Search products">
      <span className="sr-only">Search products</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}
