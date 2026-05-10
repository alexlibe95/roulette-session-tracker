export function GameHistoryTable({ gameHistory }) {
  if (gameHistory.length === 0) return null;

  const tail = gameHistory.slice(-10).reverse();

  return (
    <div className="card mt-4">
      <h3>Game History</h3>
      <div className="history-table">
        <div className="history-header">
          <span>Round</span>
          <span>Strategy</span>
          <span>Bet</span>
          <span>Result</span>
          <span>Profit/Loss</span>
          <span>Balance</span>
        </div>
        {tail.map((entry, index) => (
          <div key={entry.id ?? `${entry.round}-${entry.balance}-${index}`} className="history-row">
            <span>{entry.round}</span>
            <span className={`strategy-tag ${entry.strategy}`}>{entry.strategy.toUpperCase()}</span>
            <span>${entry.bet.toFixed(2)}</span>
            <span className={`result ${entry.result}`}>{entry.result.toUpperCase()}</span>
            <span className={entry.profit >= 0 ? 'text-success' : 'text-danger'}>
              ${entry.profit.toFixed(2)}
            </span>
            <span>${entry.balance.toFixed(2)}</span>
          </div>
        ))}
      </div>
      {gameHistory.length > 10 && <p className="text-center mt-2">Showing last 10 rounds</p>}
    </div>
  );
}
