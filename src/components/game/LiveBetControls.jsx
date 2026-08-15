import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { formatMoney, parsePositiveMoney, roundMoney } from '../../game/betting';

export const LiveBetControls = forwardRef(function LiveBetControls(
  { currentBet, currentMoney, baseBet, onSetBet, onSetBaseBet },
  ref,
) {
  const [draft, setDraft] = useState(formatMoney(currentBet));
  const [baseDraft, setBaseDraft] = useState(formatMoney(baseBet));

  useEffect(() => {
    setDraft(formatMoney(currentBet));
  }, [currentBet]);

  useEffect(() => {
    setBaseDraft(formatMoney(baseBet));
  }, [baseBet]);

  const commitBet = (raw) => {
    const parsed = parsePositiveMoney(raw);
    if (parsed == null) {
      setDraft(formatMoney(currentBet));
      return currentBet;
    }
    onSetBet(parsed);
    setDraft(formatMoney(parsed));
    return parsed;
  };

  const commitBase = (raw) => {
    const parsed = parsePositiveMoney(raw);
    if (parsed == null) {
      setBaseDraft(formatMoney(baseBet));
      return;
    }
    onSetBaseBet(parsed);
    setBaseDraft(formatMoney(parsed));
  };

  useImperativeHandle(ref, () => ({
    flush: () => commitBet(draft),
  }));

  const overBet = currentMoney > 0 && currentBet > currentMoney;
  const half = roundMoney(Math.max(0.01, currentBet / 2));
  const doubled = roundMoney(currentBet * 2);
  const multiplier = baseBet > 0 ? currentBet / baseBet : 0;

  return (
    <div className="live-bet-controls">
      <div className="live-bet-main">
        <label htmlFor="live-bet-input" className="live-bet-label">
          Stake this spin
        </label>
        <div className="live-bet-input-row">
          <span className="live-bet-prefix" aria-hidden>
            $
          </span>
          <input
            id="live-bet-input"
            type="number"
            className={`form-control live-bet-input${overBet ? ' is-over' : ''}`}
            value={draft}
            min="0.01"
            step="0.01"
            inputMode="decimal"
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => commitBet(draft)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.currentTarget.blur();
              }
            }}
          />
        </div>
        {baseBet > 0 && (
          <p className="live-bet-meta">
            {multiplier.toFixed(multiplier % 1 === 0 ? 0 : 2)}× base
            {overBet
              ? ` · ${formatMoney(currentBet - currentMoney)} over balance`
              : currentMoney > 0
                ? ` · ${formatMoney(currentMoney)} on the table`
                : ''}
          </p>
        )}
      </div>

      <div className="live-bet-chips" role="group" aria-label="Quick stake changes">
        <button type="button" className="bet-chip" onClick={() => commitBet(half)} disabled={half <= 0}>
          ½
        </button>
        <button type="button" className="bet-chip" onClick={() => commitBet(baseBet)}>
          Base ${formatMoney(baseBet)}
        </button>
        <button type="button" className="bet-chip" onClick={() => commitBet(doubled)}>
          ×2
        </button>
        <button
          type="button"
          className="bet-chip"
          onClick={() => commitBet(currentMoney)}
          disabled={currentMoney <= 0}
        >
          All-in
        </button>
      </div>

      <div className="live-base-row">
        <label htmlFor="live-base-input">Base bet</label>
        <div className="live-base-fields">
          <span className="live-bet-prefix" aria-hidden>
            $
          </span>
          <input
            id="live-base-input"
            type="number"
            className="form-control live-base-input"
            value={baseDraft}
            min="0.01"
            step="0.01"
            inputMode="decimal"
            onChange={(e) => setBaseDraft(e.target.value)}
            onBlur={() => commitBase(baseDraft)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.currentTarget.blur();
              }
            }}
          />
          <button
            type="button"
            className="btn btn-secondary live-base-apply"
            onClick={() => commitBase(currentBet)}
            disabled={roundMoney(currentBet) === roundMoney(baseBet)}
          >
            Use current stake as base
          </button>
        </div>
      </div>
    </div>
  );
});
