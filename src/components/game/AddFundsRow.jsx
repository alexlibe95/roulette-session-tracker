import { useState } from 'react';
import { formatMoney, parsePositiveMoney } from '../../game/betting';

export function AddFundsRow({ suggestedAmount = 0, onAddMoney }) {
  const suggestion = suggestedAmount > 0 ? formatMoney(suggestedAmount) : '';
  const [draft, setDraft] = useState(suggestion);

  const add = (raw) => {
    const parsed = parsePositiveMoney(raw);
    if (parsed == null) return;
    onAddMoney(parsed);
    setDraft('');
  };

  return (
    <div className="add-funds-row">
      <label htmlFor="add-funds-input">Add chips mid-session</label>
      <div className="add-funds-fields">
        <span className="live-bet-prefix" aria-hidden>
          $
        </span>
        <input
          id="add-funds-input"
          type="number"
          className="form-control"
          value={draft}
          min="0.01"
          step="0.01"
          inputMode="decimal"
          placeholder={suggestion || '0.00'}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add(draft);
            }
          }}
        />
        <button type="button" className="btn btn-secondary" onClick={() => add(draft)} disabled={!parsePositiveMoney(draft)}>
          Add
        </button>
        {suggestedAmount > 0 && (
          <button type="button" className="btn btn-secondary" onClick={() => add(suggestedAmount)}>
            Add ${formatMoney(suggestedAmount)} to cover
          </button>
        )}
      </div>
      <p className="add-money-note">
        Top-ups count toward <strong>total capital in session</strong> for the profit % — they don’t rewrite past
        win/loss, only what you’ve put at risk.
      </p>
    </div>
  );
}