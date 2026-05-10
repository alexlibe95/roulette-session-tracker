import { DollarSign, TrendingUp } from 'lucide-react';

export function SetupBankrollSection({
  bankroll,
  initialBet,
  bankrollError,
  initialBetError,
  onBankrollChange,
  onInitialBetChange,
}) {
  return (
    <section className="setup-panel" aria-labelledby="setup-heading">
      <h2 id="setup-heading" className="setup-heading">
        Set up your session
      </h2>
      <p className="setup-lede">
        Drop in your bankroll and first stake—everything below stays in neat little boxes so it’s easier to scan.
      </p>
      <div className="grid grid-2 setup-field-grid">
        <div className="form-group">
          <label htmlFor="setup-bankroll">
            <DollarSign className="inline-icon" aria-hidden />
            Total bankroll ($)
          </label>
          <input
            id="setup-bankroll"
            type="number"
            className="form-control"
            value={bankroll}
            onChange={(e) => onBankrollChange(e.target.value)}
            placeholder="e.g. 500"
            min="1"
            step="0.01"
            aria-invalid={Boolean(bankrollError)}
            aria-describedby={bankrollError ? 'setup-bankroll-error' : undefined}
          />
          {bankrollError && (
            <p id="setup-bankroll-error" className="field-error" role="alert">
              {bankrollError}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="setup-initial-bet">
            <TrendingUp className="inline-icon" aria-hidden />
            Initial bet ($)
          </label>
          <input
            id="setup-initial-bet"
            type="number"
            className="form-control"
            value={initialBet}
            onChange={(e) => onInitialBetChange(e.target.value)}
            placeholder="e.g. 10"
            min="0.01"
            step="0.01"
            aria-invalid={Boolean(initialBetError)}
            aria-describedby={initialBetError ? 'setup-initial-bet-error' : undefined}
          />
          {initialBetError && (
            <p id="setup-initial-bet-error" className="field-error" role="alert">
              {initialBetError}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
