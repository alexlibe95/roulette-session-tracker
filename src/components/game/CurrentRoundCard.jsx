import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Check, HelpCircle, RotateCcw, X } from 'lucide-react';
import { formatMoney, parsePositiveMoney } from '../../game/betting';
import { ColorSuggestion } from './ColorSuggestion';
import { LiveBetControls } from './LiveBetControls';
import { AddFundsRow } from './AddFundsRow';

const MARTINGALE_LOSSES_HELP =
  'Counted in whole cents. This spin uses the stake on the color disc, then each further loss doubles that stake until the balance cannot cover the next one.';

const PROGRESSIVE_LOSSES_HELP =
  'Counted in whole cents, using the same rules as the session: a loss after a win streak may step the stake down once, then losses double. Stops at the first stake your balance cannot cover.';

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
  const lossesHelp = isProgressiveBetting ? PROGRESSIVE_LOSSES_HELP : MARTINGALE_LOSSES_HELP;
  const broke = currentMoney <= 0;
  const shortfall = currentBet > currentMoney ? currentBet - currentMoney : 0;
  const showUndo = gameHistory.length > 0;
  const betRef = useRef(null);
  const [flash, setFlash] = useState(null);
  const flashTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(flashTimer.current), []);

  const flushStake = () => {
    const flushed = betRef.current?.flush?.();
    return parsePositiveMoney(flushed) ?? currentBet;
  };

  const handleResult = (kind) => {
    if (flash) return;
    const stake = flushStake();
    setFlash(kind);
    flashTimer.current = window.setTimeout(() => {
      if (kind === 'win') onWin(stake);
      else onLoss(stake);
      setFlash(null);
    }, 480);
  };

  return (
    <div className={`card current-round${flash ? ` is-result-${flash}` : ''}`}>
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
            more consecutive losses
            <button
              type="button"
              className="help-icon-btn"
              aria-label={lossesHelp}
              title={lossesHelp}
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
            className={`btn btn-result btn-result-win${flash === 'win' ? ' is-firing' : ''}`}
            aria-label="Won this spin"
            disabled={Boolean(flash)}
            onClick={() => handleResult('win')}
          >
            <Check className="btn-result-icon" strokeWidth={3} aria-hidden />
            <span className="btn-result-label">{flash === 'win' ? 'Logged' : 'Won'}</span>
          </button>
          <button
            type="button"
            className={`btn btn-result btn-result-loss${flash === 'loss' ? ' is-firing' : ''}`}
            aria-label="Lost this spin"
            disabled={Boolean(flash)}
            onClick={() => handleResult('loss')}
          >
            <X className="btn-result-icon" strokeWidth={3} aria-hidden />
            <span className="btn-result-label">{flash === 'loss' ? 'Logged' : 'Lost'}</span>
          </button>
          {flash && (
            <div className={`result-burst result-burst-${flash}`} aria-hidden>
              {flash === 'win' ? 'WON' : 'LOST'}
            </div>
          )}
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
