import { Download, Heart } from "./Icons";

export const UTM = "?utm_source=lumen_photo_search&utm_medium=referral";
export const altOf = (p) => p.alt_description || p.description || "Unsplash photo";

export default function PhotoCard({ photo, isFavorite, onOpen, onToggleFavorite, onDownload }) {
  const avatar = photo.user.profile_image?.small;
  return (
    <figure className="photo-item" data-testid="photo-item">
      <button type="button" className="photo-btn" onClick={() => onOpen(photo.id)} aria-label={`Open photo: ${altOf(photo)}`}>
        <img
          src={photo.urls.small}
          alt={altOf(photo)}
          loading="lazy"
          style={{ aspectRatio: `${photo.width} / ${photo.height}`, backgroundColor: photo.color || "#ddd" }}
        />
      </button>
      <div className="photo-overlay">
        <a className="credit" href={`${photo.user.links.html}${UTM}`} target="_blank" rel="noreferrer">
          {avatar && <span className="avatar" style={{ backgroundImage: `url(${avatar})` }} />}
          <span>{photo.user.name}</span>
        </a>
        <div className="actions">
          <button type="button" className={`icon-btn glass ${isFavorite ? "fav" : ""}`} onClick={() => onToggleFavorite(photo)} aria-pressed={isFavorite} aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}>
            <Heart size={18} filled={isFavorite} />
          </button>
          <button type="button" className="icon-btn glass" onClick={() => onDownload(photo)} aria-label="Download photo">
            <Download size={18} />
          </button>
        </div>
      </div>
    </figure>
  );
}
