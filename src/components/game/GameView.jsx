import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { WheelSessionBanner } from './WheelSessionBanner';
import { GameStats } from './GameStats';
import { CurrentRoundCard } from './CurrentRoundCard';
import { GameHistoryTable } from './GameHistoryTable';
import { RoundAnnouncer } from '../RoundAnnouncer';

export function GameView({
  sessionIncludeGreen,
  sessionWheelType,
  profitPct,
  riskLevel,
  sessionStartingBankroll,
  cumulativeTopUps,
  totalProfit,
  currentMoney,
  currentBet,
  baseBet,
  round,
  strategy,
  consecutiveWins,
  consecutiveLosses,
  gameHistory,
  maxPossibleLosses,
  isProgressiveBetting,
  onWinRound,
  onLoseRound,
  onSetBet,
  onSetBaseBet,
  onSetStrategy,
  onReroll,
  onProgressiveChange,
  onAddMoney,
  onUndo,
  onReset,
  onExportJson,
  onExportCsv,
}) {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="game-interface">
      {sessionIncludeGreen && <WheelSessionBanner sessionWheelType={sessionWheelType} />}
      <RoundAnnouncer gameHistory={gameHistory} />
      <GameStats
        currentMoney={currentMoney}
        sessionStartingBankroll={sessionStartingBankroll}
        cumulativeTopUps={cumulativeTopUps}
        totalProfit={totalProfit}
        profitPct={profitPct}
        consecutiveWins={consecutiveWins}
        consecutiveLosses={consecutiveLosses}
        gameHistory={gameHistory}
        riskLevel={riskLevel}
      />
      <CurrentRoundCard
        round={round}
        strategy={strategy}
        sessionIncludeGreen={sessionIncludeGreen}
        currentBet={currentBet}
        currentMoney={currentMoney}
        maxPossibleLosses={maxPossibleLosses}
        isProgressiveBetting={isProgressiveBetting}
        consecutiveWins={consecutiveWins}
        baseBet={baseBet}
        gameHistory={gameHistory}
        onWin={onWinRound}
        onLoss={onLoseRound}
        onSetBet={onSetBet}
        onSetBaseBet={onSetBaseBet}
        onSetStrategy={onSetStrategy}
        onReroll={onReroll}
        onProgressiveChange={onProgressiveChange}
        onAddMoney={onAddMoney}
        onUndo={onUndo}
      />
      <GameHistoryTable gameHistory={gameHistory} />
      <div className="game-footer-actions">
        {confirmReset ? (
          <div className="reset-confirm" role="alertdialog" aria-labelledby="reset-confirm-title">
            <p id="reset-confirm-title">Clear this session on this device? Export first if you want a copy.</p>
            <button type="button" className="btn btn-danger" onClick={onReset}>
              Yes, reset
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setConfirmReset(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button type="button" className="btn btn-primary" onClick={() => setConfirmReset(true)}>
            <RotateCcw className="inline-icon" />
            Reset session
          </button>
        )}
        <button type="button" className="btn btn-secondary" onClick={onExportJson}>
          Export JSON
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onExportCsv}
          disabled={gameHistory.length === 0}
        >
          Export CSV
        </button>
      </div>
      <p className="text-center capital-note" style={{ marginTop: '8px' }}>
        Reset removes your autosaved session on this device.
      </p>
    </div>
  );
}
