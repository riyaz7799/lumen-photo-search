import { useEffect } from "react";
import { altOf, UTM } from "./PhotoCard";
import { ChevronLeft, ChevronRight, Close, Download, Heart } from "./Icons";

export default function Lightbox({ photo, hasPrev, hasNext, onNavigate, onClose, isFavorite, onToggleFavorite, onDownload }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onNavigate(-1);
      if (e.key === "ArrowRight" && hasNext) onNavigate(1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onNavigate, hasPrev, hasNext]);

  return (
    <div className="lightbox" data-testid="lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <button type="button" className="lb-close icon-btn glass" onClick={onClose} aria-label="Close"><Close /></button>
      {hasPrev && (
        <button type="button" className="lb-nav prev icon-btn glass" onClick={(e) => { e.stopPropagation(); onNavigate(-1); }} aria-label="Previous photo"><ChevronLeft size={24} /></button>
      )}
      {hasNext && (
        <button type="button" className="lb-nav next icon-btn glass" onClick={(e) => { e.stopPropagation(); onNavigate(1); }} aria-label="Next photo"><ChevronRight size={24} /></button>
      )}
      <div className="lb-content" onClick={(e) => e.stopPropagation()}>
        <img src={photo.urls.regular} alt={altOf(photo)} />
        <div className="lb-panel">
          <div>
            <a href={`${photo.user.links.html}${UTM}`} target="_blank" rel="noreferrer" className="lb-author">{photo.user.name}</a>
            <p className="lb-meta">
              {photo.width} × {photo.height}
              {photo.likes != null && ` · ${photo.likes.toLocaleString()} likes`}
              {" · "}
              <a href={`${photo.links.html}${UTM}`} target="_blank" rel="noreferrer">View on Unsplash</a>
            </p>
            {photo.description && <p className="lb-desc">{photo.description}</p>}
          </div>
          <div className="actions">
            <button type="button" className={`btn secondary ${isFavorite ? "fav" : ""}`} onClick={() => onToggleFavorite(photo)}>
              <Heart size={18} filled={isFavorite} /> {isFavorite ? "Saved" : "Save"}
            </button>
            <button type="button" className="btn" onClick={() => onDownload(photo)}>
              <Download size={18} /> Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
