export function SetupStakeSuggestions({ bankroll, onPickStake }) {
  return (
    <section className="setup-panel" aria-labelledby="suggestions-heading">
      <h3 id="suggestions-heading" className="setup-panel-title">
        Quick stake ideas
      </h3>
      <p className="setup-panel-hint">Based on your bankroll—tap one to fill “Initial bet” above.</p>
      <div className="setup-suggestions">
        {bankroll ? (
          <div className="suggestion-buttons">
            <button
              type="button"
              className="suggestion-btn low-risk"
              onClick={() => onPickStake((parseFloat(bankroll) * 0.01).toFixed(2))}
              title="1% of bankroll - Very safe, many rounds possible"
            >
              Low: ${(parseFloat(bankroll) * 0.01).toFixed(2)}
            </button>
            <button
              type="button"
              className="suggestion-btn normal-risk"
              onClick={() => onPickStake((parseFloat(bankroll) * 0.025).toFixed(2))}
              title="2.5% of bankroll - Balanced risk/reward"
            >
              Mid: ${(parseFloat(bankroll) * 0.025).toFixed(2)}
            </button>
            <button
              type="button"
              className="suggestion-btn high-risk"
              onClick={() => onPickStake((parseFloat(bankroll) * 0.05).toFixed(2))}
              title="5% of bankroll - Higher risk, fewer safe rounds"
            >
              Bold: ${(parseFloat(bankroll) * 0.05).toFixed(2)}
            </button>
          </div>
        ) : (
          <p className="suggestions-placeholder">Enter a bankroll above to see one-tap suggestions.</p>
        )}
      </div>
    </section>
  );
}
