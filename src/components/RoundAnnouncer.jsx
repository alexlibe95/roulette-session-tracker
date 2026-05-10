/**
 * Announces the latest round result for screen readers (does not affect layout).
 */
export function RoundAnnouncer({ gameHistory }) {
  const last = gameHistory.length > 0 ? gameHistory[gameHistory.length - 1] : null;
  const message = last
    ? `Round ${last.round}: ${last.result}. Balance ${last.balance.toFixed(2)} dollars.`
    : '';

  return (
    <p id="round-result-live" className="sr-only" aria-live="polite" aria-atomic="true">
      {message}
    </p>
  );
}
