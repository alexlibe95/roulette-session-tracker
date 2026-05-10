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
  gameHistory,
  maxPossibleLosses,
  isProgressiveBetting,
  onWinRound,
  onLoseRound,
  onPlayRemaining,
  onAddMoney,
  onUndo,
  onReset,
  onExportJson,
  onExportCsv,
}) {
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
        gameHistory={gameHistory}
        riskLevel={riskLevel}
      />
      <CurrentRoundCard
        round={round}
        strategy={strategy}
        currentBet={currentBet}
        currentMoney={currentMoney}
        maxPossibleLosses={maxPossibleLosses}
        isProgressiveBetting={isProgressiveBetting}
        consecutiveWins={consecutiveWins}
        baseBet={baseBet}
        gameHistory={gameHistory}
        onWin={onWinRound}
        onLoss={onLoseRound}
        onPlayRemaining={onPlayRemaining}
        onAddMoney={onAddMoney}
        onUndo={onUndo}
      />
      <GameHistoryTable gameHistory={gameHistory} />
      <div className="game-footer-actions">
        <button type="button" className="btn btn-primary" onClick={onReset}>
          <RotateCcw className="inline-icon" />
          Reset session
        </button>
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
        Reset removes your autosaved session on this device. Use Export if you want a copy first.
      </p>
    </div>
  );
}
