import { parsePositiveMoney, formatMoney, roundMoney } from '../../game/betting';

export function SetupStakeSuggestions({ bankroll, onPickStake }) {
  const bank = parsePositiveMoney(bankroll);

  return (
    <section className="setup-panel" aria-labelledby="suggestions-heading">
      <h3 id="suggestions-heading" className="setup-panel-title">
        Quick stake ideas
      </h3>
      <p className="setup-panel-hint">Based on your bankroll—tap one to fill “Initial bet” above.</p>
      <div className="setup-suggestions">
        {bank != null ? (
          <div className="suggestion-buttons">
            <button
              type="button"
              className="suggestion-btn low-risk"
              onClick={() => onPickStake(formatMoney(roundMoney(bank * 0.01)))}
              title="1% of bankroll - Very safe, many rounds possible"
            >
              Low: ${formatMoney(roundMoney(bank * 0.01))}
            </button>
            <button
              type="button"
              className="suggestion-btn normal-risk"
              onClick={() => onPickStake(formatMoney(roundMoney(bank * 0.025)))}
              title="2.5% of bankroll - Balanced risk/reward"
            >
              Mid: ${formatMoney(roundMoney(bank * 0.025))}
            </button>
            <button
              type="button"
              className="suggestion-btn high-risk"
              onClick={() => onPickStake(formatMoney(roundMoney(bank * 0.05)))}
              title="5% of bankroll - Higher risk, fewer safe rounds"
            >
              Bold: ${formatMoney(roundMoney(bank * 0.05))}
            </button>
          </div>
        ) : (
          <p className="suggestions-placeholder">Enter a bankroll above to see one-tap suggestions.</p>
        )}
      </div>
    </section>
  );
}
