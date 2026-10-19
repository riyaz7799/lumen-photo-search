export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-box" role="alert">
      <p data-testid="error-message">{message}</p>
      <button type="button" className="btn" data-testid="retry-button" onClick={onRetry}>Retry</button>
    </div>
  );
}
