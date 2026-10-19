import { Camera, Moon, Sun } from "./Icons";

export default function Header({ theme, onToggleTheme, view, onViewChange, favoritesCount }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a
          className="brand"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onViewChange("explore");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <Camera size={24} /> <span>Lumen</span>
        </a>
        <nav className="header-nav">
          <button type="button" className={`nav-btn ${view === "explore" ? "active" : ""}`} onClick={() => onViewChange("explore")}>
            Explore
          </button>
          <button type="button" className={`nav-btn ${view === "favorites" ? "active" : ""}`} onClick={() => onViewChange("favorites")}>
            Favorites {favoritesCount > 0 && <span className="badge">{favoritesCount}</span>}
          </button>
          <button type="button" className="icon-btn" onClick={onToggleTheme} aria-label="Toggle dark mode">
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
        </nav>
      </div>
    </header>
  );
}
