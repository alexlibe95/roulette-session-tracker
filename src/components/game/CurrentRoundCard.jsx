import { AlertTriangle, HelpCircle, RotateCcw } from 'lucide-react';

const SAFE_LOSSES_HELP =
  'Assumes every future loss doubles your stake (simple Martingale). If you use progressive staking, the next stake can change, so treat this as a guide—not a guarantee.';

export function CurrentRoundCard({
  round,
  strategy,
  currentBet,
  currentMoney,
  maxPossibleLosses,
  isProgressiveBetting,
  consecutiveWins,
  baseBet,
  gameHistory,
  onWin,
  onLoss,
  onPlayRemaining,
  onAddMoney,
  onUndo,
}) {
  const canAffordBet = currentMoney >= currentBet;
  const showUndo = gameHistory.length > 0 && canAffordBet;

  return (
    <div className="card current-round">
      <h2>Round {round}</h2>

      <div className="prediction-display">
        <div className="strategy-recommendation">
          <h3>Round suggestion</h3>
          <div className={`color-choice ${strategy}`}>{strategy.toUpperCase()}</div>
          <p className="bet-amount">Bet: ${currentBet.toFixed(2)}</p>
        </div>

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
            more losses (if each loss doubles the stake)
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

      <div className="betting-strategy-container">
        {isProgressiveBetting && (
          <div className="betting-strategy-info">
            <p className="strategy-mode">📈 Progressive Mode</p>
            {consecutiveWins > 0 && (
              <div>
                <p className="win-streak-bonus">
                  🔥 Win streak: {consecutiveWins} | Next stake: progression rules
                </p>
                <p className="cycle-info">
                  {consecutiveWins <= 1 && '🎯 Modest increase options (1x-2x)'}
                  {consecutiveWins === 2 && '⚖️ Balanced choices (1x-3x)'}
                  {consecutiveWins === 3 && '🎰 More options (1x-4x)'}
                  {consecutiveWins > 3 && consecutiveWins <= 6 && '💫 Peak opportunities (1x-5x)'}
                  {consecutiveWins > 6 && '💰 Conservative with rare big bets (1x-6x)'}
                </p>
              </div>
            )}
            <p className="base-bet-info">Base bet: ${baseBet.toFixed(2)}</p>
          </div>
        )}
        {!isProgressiveBetting && (
          <div className="betting-strategy-info">
            <p className="strategy-mode">🔄 Classic Martingale</p>
            <p className="base-bet-info">Base bet: ${baseBet.toFixed(2)}</p>
          </div>
        )}
      </div>

      {canAffordBet ? (
        <div className="action-buttons">
          <button type="button" className="btn btn-success" onClick={onWin}>
            Won This Round
          </button>
          <button type="button" className="btn btn-danger" onClick={onLoss}>
            Lost This Round
          </button>
        </div>
      ) : (
        <div className="final-round-options">
          <h3 className="final-round-title">Insufficient Funds</h3>
          <p className="final-round-info">
            You have ${currentMoney.toFixed(2)} but need ${currentBet.toFixed(2)} for the proper bet
          </p>
          <p className="money-needed">
            You need <strong>${(currentBet - currentMoney).toFixed(2)} more</strong> to continue
          </p>

          <div className="final-options-grid">
            <div className="final-option">
              <div className="option-content">
                <h4>Option 1: Play with what you have</h4>
                <p>Bet your remaining ${currentMoney.toFixed(2)} (final round)</p>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onPlayRemaining}
                disabled={currentMoney <= 0}
              >
                Bet Remaining ${currentMoney.toFixed(2)}
              </button>
            </div>

            <div className="final-option">
              <div className="option-content">
                <h4>Option 2: Add money and continue</h4>
                <p>
                  Add ${(currentBet - currentMoney).toFixed(2)} to your balance and play the proper bet of $
                  {currentBet.toFixed(2)}
                </p>
              </div>
              <button type="button" className="btn btn-secondary" onClick={onAddMoney}>
                Add ${(currentBet - currentMoney).toFixed(2)} & Continue
              </button>
            </div>
          </div>
          <p className="add-money-note">
            Amounts you add here count toward <strong>total capital in session</strong> for the profit % on the
            stats row—they don’t change the session win/loss tally itself, only what you’ve put at risk.
          </p>
        </div>
      )}

      {showUndo && (
        <div className="undo-section">
          <button type="button" className="btn btn-secondary" onClick={onUndo}>
            <RotateCcw className="inline-icon" />
            Undo Last Round
          </button>
        </div>
      )}
    </div>
  );
}
