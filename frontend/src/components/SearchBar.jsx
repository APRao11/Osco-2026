export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search products...',
  ariaLabel = 'Search products',
  className = '',
}) {
  return (
    <label className={`search-bar ${className}`.trim()}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 4.5 4.5" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
    </label>
  );
}
