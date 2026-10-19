import { ORIENTATIONS, SORTS } from "../constants";

export default function FilterBar({ title, total, orientation, orderBy, onChange, showFilters }) {
  return (
    <div className="filter-bar">
      <div>
        <h2>{title}</h2>
        {total != null && showFilters && <span className="muted">{total.toLocaleString()} results</span>}
      </div>
      {showFilters && (
        <div className="filters">
          <select value={orientation} onChange={(e) => onChange({ orientation: e.target.value })} aria-label="Orientation">
            {ORIENTATIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select value={orderBy} onChange={(e) => onChange({ orderBy: e.target.value })} aria-label="Sort by">
            {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}
