import { useMemo } from 'react';

export function GameStats({
  currentMoney,
  sessionStartingBankroll,
  cumulativeTopUps,
  totalProfit,
  profitPct,
  consecutiveWins,
  gameHistory,
  riskLevel,
}) {
  const { wins, losses, winRatePct } = useMemo(() => {
    const w = gameHistory.filter((g) => g.result === 'win').length;
    const l = gameHistory.length - w;
    const pct = gameHistory.length > 0 ? Math.round((w / gameHistory.length) * 100) : null;
    return { wins: w, losses: l, winRatePct: pct };
  }, [gameHistory]);

  const committedCapital = sessionStartingBankroll + cumulativeTopUps;

  return (
    <div className="grid grid-5 mb-4">
      <div className="stat-card">
        <h3>Current Balance</h3>
        <p
          className={`stat-value ${
            currentMoney < sessionStartingBankroll ? 'text-danger' : 'text-success'
          }`}
        >
          ${currentMoney.toFixed(2)}
        </p>
        {committedCapital > 0 && (
          <p className="capital-note">
            vs. ${sessionStartingBankroll.toFixed(2)} initial buy-in
            {cumulativeTopUps > 0
              ? ` · +$${cumulativeTopUps.toFixed(2)} added mid-session ($${committedCapital.toFixed(
                  2,
                )} total in)`
              : ''}
          </p>
        )}
      </div>

      <div className="stat-card">
        <h3>Total Profit</h3>
        <p className={`stat-value ${totalProfit >= 0 ? 'text-success' : 'text-danger'}`}>
          ${totalProfit.toFixed(2)}
        </p>
        <p className="profit-percentage">{profitPct}%</p>
        {committedCapital > 0 && (
          <p className="capital-note">% of total capital in session (initial + any add-ons)</p>
        )}
      </div>

      <div className="stat-card">
        <h3>Win Streak {consecutiveWins > 0 ? '🔥' : ''}</h3>
        <p className={`stat-value ${consecutiveWins > 0 ? 'text-success' : 'text-warning'}`}>
          {consecutiveWins}
        </p>
      </div>

      <div className="stat-card">
        <h3>Win/Loss Ratio</h3>
        {gameHistory.length > 0 ? (
          <div>
            <p
              className={`stat-value ${
                wins / gameHistory.length >= 0.5 ? 'text-success' : 'text-danger'
              }`}
            >
              {winRatePct}%
            </p>
            <p className="ratio-details">
              {wins}W / {losses}L
            </p>
          </div>
        ) : (
          <p className="stat-value text-warning">--</p>
        )}
      </div>

      <div className="stat-card">
        <h3>Risk Level</h3>
        <p
          className={`stat-value text-${
            riskLevel === 'high' ? 'danger' : riskLevel === 'medium' ? 'warning' : 'success'
          }`}
        >
          {riskLevel.toUpperCase()}
        </p>
      </div>
    </div>
  );
}
