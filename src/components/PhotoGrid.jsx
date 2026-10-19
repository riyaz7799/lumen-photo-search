import { useEffect, useRef } from "react";
import PhotoCard from "./PhotoCard";
import SkeletonLoader from "./SkeletonLoader";
import ErrorMessage from "./ErrorMessage";

export default function PhotoGrid({ photos, isLoading, error, hasMore, onLoadMore, onRetry, favoriteIds, onToggleFavorite, onDownload, onOpen, emptyMessage }) {
  const triggerRef = useRef(null);
  const showTrigger = photos.length > 0 && hasMore;

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => entries[0].isIntersecting && onLoadMore(), { rootMargin: "300px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [onLoadMore, showTrigger]);

  const isEmpty = !isLoading && !error && photos.length === 0;

  return (
    <>
      <div className="photo-grid" data-testid="photo-grid">
        {photos.map((p) => (
          <PhotoCard key={p.id} photo={p} isFavorite={favoriteIds.has(p.id)} onOpen={onOpen} onToggleFavorite={onToggleFavorite} onDownload={onDownload} />
        ))}
      </div>
      {isLoading && <SkeletonLoader />}
      {error && <ErrorMessage message={error} onRetry={onRetry} />}
      {isEmpty && <p className="empty">{emptyMessage}</p>}
      {showTrigger && <div ref={triggerRef} data-testid="infinite-scroll-trigger" className="scroll-trigger" />}
    </>
  );
}
