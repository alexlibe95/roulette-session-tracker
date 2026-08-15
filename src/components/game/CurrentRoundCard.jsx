import { useRef } from 'react';
import { AlertTriangle, Check, HelpCircle, RotateCcw, X } from 'lucide-react';
import { formatMoney, parsePositiveMoney } from '../../game/betting';
import { ColorSuggestion } from './ColorSuggestion';
import { LiveBetControls } from './LiveBetControls';
import { AddFundsRow } from './AddFundsRow';

const SAFE_LOSSES_HELP =
  'Assumes every future loss doubles your stake (simple Martingale). If you change the stake or use progressive sizing, treat this as a guide—not a guarantee.';

export function CurrentRoundCard({
  round,
  strategy,
  sessionIncludeGreen,
  currentBet,
  currentMoney,
  maxPossibleLosses,
  isProgressiveBetting,
  consecutiveWins,
  baseBet,
  gameHistory,
  onWin,
  onLoss,
  onSetBet,
  onSetBaseBet,
  onSetStrategy,
  onReroll,
  onProgressiveChange,
  onAddMoney,
  onUndo,
}) {
  const canAffordBet = currentMoney >= currentBet && currentBet > 0 && currentMoney > 0;
  const broke = currentMoney <= 0;
  const shortfall = currentBet > currentMoney ? currentBet - currentMoney : 0;
  const showUndo = gameHistory.length > 0;
  const betRef = useRef(null);

  const flushStake = () => {
    const flushed = betRef.current?.flush?.();
    return parsePositiveMoney(flushed) ?? currentBet;
  };

  return (
    <div className="card current-round">
      <h2>Round {round}</h2>

      <div className="prediction-display">
        <ColorSuggestion
          strategy={strategy}
          includeGreen={sessionIncludeGreen}
          currentBet={currentBet}
          onSelect={onSetStrategy}
          onReroll={onReroll}
        />

        <div className="risk-minimal-2">
          <AlertTriangle size={20} aria-hidden />
          <span className="risk-minimal-2-text">
            Safe for{' '}
            <strong
              className={`rounds-number-colored ${
                maxPossibleLosses > 6 ? 'safe' : maxPossibleLosses >= 4 ? 'warning' : 'danger'
              }`}
            >
              {maxPossibleLosses}
            </strong>{' '}
            more losses (if each loss doubles this stake)
            <button
              type="button"
              className="help-icon-btn"
              aria-label={SAFE_LOSSES_HELP}
              title={SAFE_LOSSES_HELP}
            >
              <HelpCircle size={18} aria-hidden />
            </button>
          </span>
        </div>
      </div>

      <LiveBetControls
        ref={betRef}
        currentBet={currentBet}
        currentMoney={currentMoney}
        baseBet={baseBet}
        onSetBet={onSetBet}
        onSetBaseBet={onSetBaseBet}
      />

      <div className="betting-strategy-container">
        <div className="betting-strategy-info">
          <label className="checkbox-label staking-toggle">
            <input
              type="checkbox"
              checked={isProgressiveBetting}
              onChange={(e) => onProgressiveChange(e.target.checked)}
            />
            <span>
              {isProgressiveBetting ? 'Progressive sizing' : 'Classic Martingale'} — next stake after this
              spin
            </span>
          </label>
          {isProgressiveBetting && consecutiveWins > 0 && (
            <p className="win-streak-bonus">
              Win streak {consecutiveWins}: next suggestion can step up from base
            </p>
          )}
          {!isProgressiveBetting && (
            <p className="base-bet-info">Losses double the stake you just played; a win returns to base.</p>
          )}
        </div>
      </div>

      {broke ? (
        <div className="final-round-options">
          <h3 className="final-round-title">Bankroll is empty</h3>
          <p className="final-round-info">Add chips to keep logging, or undo the last spin if that was a misclick.</p>
        </div>
      ) : canAffordBet ? (
        <div className="action-buttons">
          <button
            type="button"
            className="btn btn-result btn-result-win"
            aria-label="Won this spin"
            onClick={() => onWin(flushStake())}
          >
            <Check className="btn-result-icon" strokeWidth={3} aria-hidden />
            <span className="btn-result-label">Won</span>
          </button>
          <button
            type="button"
            className="btn btn-result btn-result-loss"
            aria-label="Lost this spin"
            onClick={() => onLoss(flushStake())}
          >
            <X className="btn-result-icon" strokeWidth={3} aria-hidden />
            <span className="btn-result-label">Lost</span>
          </button>
        </div>
      ) : (
        <div className="final-round-options">
          <h3 className="final-round-title">Stake is bigger than your balance</h3>
          <p className="final-round-info">
            You have ${formatMoney(currentMoney)} but this spin is set to ${formatMoney(currentBet)}.
          </p>
          <p className="money-needed">
            Lower the stake, or add <strong>${formatMoney(shortfall)}</strong> to cover it.
          </p>
          <div className="final-options-grid">
            <div className="final-option">
              <div className="option-content">
                <h4>Use remaining balance</h4>
                <p>Set this spin to ${formatMoney(currentMoney)} so you can log a win or a loss.</p>
              </div>
              <button type="button" className="btn btn-primary" onClick={() => onSetBet(currentMoney)}>
                Stake ${formatMoney(currentMoney)}
              </button>
            </div>
            <div className="final-option">
              <div className="option-content">
                <h4>Cover the current stake</h4>
                <p>Drop in the shortfall and keep ${formatMoney(currentBet)} on this spin.</p>
              </div>
              <button type="button" className="btn btn-secondary" onClick={() => onAddMoney(shortfall)}>
                Add ${formatMoney(shortfall)}
              </button>
            </div>
          </div>
        </div>
      )}

      <AddFundsRow suggestedAmount={shortfall} onAddMoney={onAddMoney} />

      {showUndo && (
        <div className="undo-section">
          <button type="button" className="btn btn-secondary" onClick={onUndo}>
            <RotateCcw className="inline-icon" />
            Undo last spin
          </button>
        </div>
      )}
    </div>
  );
}
