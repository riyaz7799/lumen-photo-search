import SearchBar from "./SearchBar";
import { CATEGORIES } from "../constants";

export default function Hero({ input, onInputChange, onClear, activeQuery, onPickCategory }) {
  return (
    <section className="hero">
      <div className="container">
        <h1>Discover free, high-resolution photos</h1>
        <p>Search millions of images from creators around the world. Powered by Unsplash.</p>
        <SearchBar value={input} onChange={onInputChange} onClear={onClear} />
        <div className="chips">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`chip ${activeQuery.toLowerCase() === c.toLowerCase() ? "active" : ""}`}
              onClick={() => onPickCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
