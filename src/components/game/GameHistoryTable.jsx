import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export function GameHistoryTable({ gameHistory }) {
  const [showAll, setShowAll] = useState(false);

  if (gameHistory.length === 0) return null;

  const tail = (showAll ? gameHistory : gameHistory.slice(-10)).slice().reverse();

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
            <span className={`result-icon-cell ${entry.result}`}>
              {entry.result === 'win' ? (
                <CheckCircle2 className="result-icon result-icon-win" strokeWidth={2.4} aria-hidden />
              ) : (
                <XCircle className="result-icon result-icon-loss" strokeWidth={2.4} aria-hidden />
              )}
              <span className="sr-only">{entry.result === 'win' ? 'Win' : 'Loss'}</span>
            </span>
            <span className={entry.profit >= 0 ? 'text-success' : 'text-danger'}>
              ${entry.profit.toFixed(2)}
            </span>
            <span>${entry.balance.toFixed(2)}</span>
          </div>
        ))}
      </div>
      {gameHistory.length > 10 && (
        <p className="text-center mt-2 history-more">
          {showAll ? `Showing all ${gameHistory.length} spins` : 'Showing last 10 spins'}{' '}
          <button type="button" className="history-toggle" onClick={() => setShowAll((v) => !v)}>
            {showAll ? 'Show last 10' : 'Show all'}
          </button>
        </p>
      )}
    </div>
  );
}
