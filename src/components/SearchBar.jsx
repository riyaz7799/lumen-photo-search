import { Close, SearchIcon } from "./Icons";

export default function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="search-bar">
      <SearchIcon />
      <input
        type="text"
        data-testid="search-input"
        placeholder="Search free high-resolution photos..."
        aria-label="Search photos"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button type="button" className="clear-btn" onClick={onClear} aria-label="Clear search">
          <Close size={18} />
        </button>
      )}
    </div>
  );
}
