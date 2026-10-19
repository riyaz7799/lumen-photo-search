const HEIGHTS = [220, 300, 180, 260, 340, 200, 280, 240, 320];

export default function SkeletonLoader() {
  return (
    <div className="skeleton-grid" data-testid="skeleton-loader" aria-busy="true">
      {HEIGHTS.map((h, i) => <div key={i} className="skeleton-item" style={{ height: h }} />)}
    </div>
  );
}
