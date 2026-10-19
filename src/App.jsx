import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FilterBar from "./components/FilterBar";
import PhotoGrid from "./components/PhotoGrid";
import Lightbox from "./components/Lightbox";
import Footer from "./components/Footer";
import { getDownloadUrl, searchPhotos } from "./api/unsplash";
import { DEFAULT_QUERY } from "./constants";
import useDebounce from "./hooks/useDebounce";
import useLocalStorage from "./hooks/useLocalStorage";
import useTheme from "./hooks/useTheme";
import "./App.css";

const slim = (p) => ({
  id: p.id, width: p.width, height: p.height, color: p.color, likes: p.likes,
  alt_description: p.alt_description, description: p.description,
  urls: { small: p.urls.small, regular: p.urls.regular },
  links: { html: p.links.html, download_location: p.links.download_location },
  user: { name: p.user.name, links: { html: p.user.links.html }, profile_image: { small: p.user.profile_image?.small } },
});

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [view, setView] = useState("explore");
  const [input, setInput] = useState("");
  const debounced = useDebounce(input, 300);
  const [params, setParams] = useState({ query: DEFAULT_QUERY, orientation: "", orderBy: "relevant", page: 1 });
  const [photos, setPhotos] = useState([]);
  const [total, setTotal] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [favorites, setFavorites] = useLocalStorage("lumen-favorites", []);

  const updateParams = useCallback((patch) => {
    setParams((p) => {
      const next = { ...p, ...patch, page: 1 };
      const same = next.query === p.query && next.orientation === p.orientation && next.orderBy === p.orderBy;
      return same ? p : next;
    });
  }, []);

  useEffect(() => {
    updateParams({ query: debounced.trim() || DEFAULT_QUERY });
  }, [debounced, updateParams]);

  useEffect(() => {
    const controller = new AbortController();
    const { query, orientation, orderBy, page } = params;
    setIsLoading(true);
    setError(null);
    if (page === 1) setPhotos([]);

    searchPhotos({ query, page, orientation, orderBy, signal: controller.signal })
      .then((data) => {
        setPhotos((prev) => {
          if (page === 1) return data.results;
          const seen = new Set(prev.map((p) => p.id));
          return [...prev, ...data.results.filter((p) => !seen.has(p.id))];
        });
        setTotal(data.total);
        setHasMore(page < data.total_pages);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Something went wrong. Please try again.");
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [params, retryKey]);

  const loadMore = useCallback(() => {
    if (isLoading || error || !hasMore) return;
    setParams((p) => ({ ...p, page: p.page + 1 }));
  }, [isLoading, error, hasMore]);

  const retry = useCallback(() => setRetryKey((k) => k + 1), []);

  const toggleFavorite = useCallback((photo) => {
    setFavorites((prev) => (prev.some((f) => f.id === photo.id) ? prev.filter((f) => f.id !== photo.id) : [slim(photo), ...prev]));
  }, [setFavorites]);

  const download = useCallback(async (photo) => {
    try {
      const url = await getDownloadUrl(photo);
      const a = document.createElement("a");
      a.href = `${url}${url.includes("?") ? "&" : "?"}dl=unsplash-${photo.id}.jpg`;
      a.rel = "noreferrer";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      window.open(photo.links.html, "_blank", "noopener");
    }
  }, []);

  const handleInput = (value) => { setInput(value); setView("explore"); };
  const pickCategory = (c) => { setInput(c); updateParams({ query: c }); setView("explore"); };

  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);
  const isFav = view === "favorites";
  const list = isFav ? favorites : photos;
  const selectedIndex = list.findIndex((p) => p.id === selectedId);
  const selected = selectedIndex >= 0 ? list[selectedIndex] : null;
  const closeLightbox = useCallback(() => setSelectedId(null), []);
  const navigate = useCallback((d) => setSelectedId(list[selectedIndex + d]?.id ?? null), [list, selectedIndex]);

  const title = isFav ? "Your favorites" : params.query === DEFAULT_QUERY ? "Discover photos" : `Results for “${params.query}”`;

  return (
    <>
      <Header theme={theme} onToggleTheme={toggleTheme} view={view} onViewChange={setView} favoritesCount={favorites.length} />
      <Hero input={input} onInputChange={handleInput} onClear={() => handleInput("")} activeQuery={params.query} onPickCategory={pickCategory} />
      <main className="container">
        <FilterBar title={title} total={total} orientation={params.orientation} orderBy={params.orderBy} onChange={updateParams} showFilters={!isFav} />
        <PhotoGrid
          photos={list}
          isLoading={isFav ? false : isLoading}
          error={isFav ? null : error}
          hasMore={isFav ? false : hasMore}
          onLoadMore={loadMore}
          onRetry={retry}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          onDownload={download}
          onOpen={setSelectedId}
          emptyMessage={isFav ? "No favorites yet. Tap the heart on any photo to save it." : "No photos found. Try another search."}
        />
      </main>
      <Footer />
      {selected && (
        <Lightbox
          photo={selected}
          hasPrev={selectedIndex > 0}
          hasNext={selectedIndex < list.length - 1}
          onNavigate={navigate}
          onClose={closeLightbox}
          isFavorite={favoriteIds.has(selected.id)}
          onToggleFavorite={toggleFavorite}
          onDownload={download}
        />
      )}
    </>
  );
}
