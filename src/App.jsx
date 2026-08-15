import { useReducer, useState, useEffect, useRef } from 'react';
import { initialPlayState, playReducer } from './game/playReducer';
import { calculateMaxLosses, riskFromMaxLosses, roundMoney } from './game/betting';
import { loadSession, saveSession, clearSession } from './persistence/sessionPersistence';
import { exportSessionJson, exportSessionCsv } from './utils/exportSession';
import { AppHeader } from './components/AppHeader';
import { SiteFooter } from './components/SiteFooter';
import { SetupForm } from './components/setup/SetupForm';
import { GameView } from './components/game/GameView';
import './App.css';

function validateSetup(bankroll, initialBet) {
  const err = {};
  const b = bankroll.trim();
  const ib = initialBet.trim();

  if (!b) err.bankroll = 'Enter your starting bankroll.';
  if (!ib) err.initialBet = 'Enter your opening bet.';

  const money = parseFloat(bankroll);
  const bet = parseFloat(initialBet);

  if (b && !Number.isFinite(money)) err.bankroll = 'Use a valid number for bankroll.';
  if (ib && !Number.isFinite(bet)) err.initialBet = 'Use a valid number for opening bet.';
  if (Number.isFinite(money) && money <= 0) err.bankroll = 'Bankroll must be greater than zero.';
  if (Number.isFinite(bet) && bet <= 0) err.initialBet = 'Opening bet must be greater than zero.';

  if (
    Number.isFinite(money) &&
    Number.isFinite(bet) &&
    bet > money
  ) {
    err.form = 'Opening bet can’t be larger than your bankroll.';
  }

  return err;
}

function App() {
  const [bankroll, setBankroll] = useState('');
  const [initialBet, setInitialBet] = useState('');
  const [includeGreen, setIncludeGreen] = useState(false);
  const [wheelType, setWheelType] = useState('european');
  const [gameStarted, setGameStarted] = useState(false);
  const [isProgressiveBetting, setIsProgressiveBetting] = useState(true);
  const [setupErrors, setSetupErrors] = useState({});
  const [play, dispatchPlay] = useReducer(playReducer, initialPlayState);
  const hasHydrated = useRef(false);
  const recordLock = useRef(false);

  const {
    currentMoney,
    currentBet,
    baseBet,
    round,
    gameHistory,
    consecutiveWins,
    consecutiveLosses,
    totalProfit,
    strategy,
    sessionIncludeGreen,
    sessionWheelType,
    sessionStartingBankroll,
    cumulativeTopUps,
  } = play;

  useEffect(() => {
    const data = loadSession();
    if (data?.gameStarted && data.play) {
      const bankParsed = parseFloat(data.bankroll);
      const normalizedPlay = {
        ...data.play,
        sessionStartingBankroll:
          data.play.sessionStartingBankroll ??
          (Number.isFinite(bankParsed) ? bankParsed : data.play.currentMoney ?? 0),
        cumulativeTopUps: data.play.cumulativeTopUps ?? 0,
      };
      dispatchPlay({ type: 'HYDRATE', state: normalizedPlay });
      setBankroll(data.bankroll ?? '');
      setInitialBet(data.initialBet ?? '');
      setIncludeGreen(data.includeGreen ?? false);
      setWheelType(data.wheelType ?? 'european');
      setIsProgressiveBetting(data.isProgressiveBetting ?? true);
      setGameStarted(true);
    }
    hasHydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) return;
    if (gameStarted) {
      saveSession({
        gameStarted,
        play,
        bankroll,
        initialBet,
        includeGreen,
        wheelType,
        isProgressiveBetting,
      });
    }
  }, [gameStarted, play, bankroll, initialBet, includeGreen, wheelType, isProgressiveBetting]);

  const clearSetupError = (key) => {
    setSetupErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleBankrollChange = (v) => {
    setBankroll(v);
    clearSetupError('bankroll');
    clearSetupError('form');
  };

  const handleInitialBetChange = (v) => {
    setInitialBet(v);
    clearSetupError('initialBet');
    clearSetupError('form');
  };

  const startGame = () => {
    const err = validateSetup(bankroll, initialBet);
    if (Object.keys(err).length > 0) {
      setSetupErrors(err);
      return;
    }
    setSetupErrors({});
    const money = parseFloat(bankroll);
    const bet = parseFloat(initialBet);
    dispatchPlay({ type: 'START', money, bet, includeGreen, wheelType });
    setGameStarted(true);
  };

  const resetGame = () => {
    clearSession();
    setGameStarted(false);
    setBankroll('');
    setInitialBet('');
    dispatchPlay({ type: 'RESET_PLAY' });
  };

  const recordResult = (won, stake) => {
    if (recordLock.current) return;
    const bet = stake != null ? roundMoney(stake) : currentBet;
    if (currentMoney < bet || bet <= 0 || currentMoney <= 0) return;
    recordLock.current = true;
    dispatchPlay({ type: 'SET_BET', bet });
    dispatchPlay({
      type: 'RECORD_RESULT',
      won,
      customBetAmount: bet,
      isProgressiveBetting,
    });
    window.setTimeout(() => {
      recordLock.current = false;
    }, 520);
  };

  const maxPossibleLosses = gameStarted
    ? calculateMaxLosses(currentMoney, currentBet, {
        baseBet,
        consecutiveWins,
        isProgressiveBetting,
      })
    : 0;
  const riskLevel = gameStarted ? riskFromMaxLosses(maxPossibleLosses) : 'low';
  const committedCapital = sessionStartingBankroll + cumulativeTopUps;
  const profitPct =
    gameStarted && committedCapital > 0 ? ((totalProfit / committedCapital) * 100).toFixed(1) : '0.0';

  const buildExportSnapshot = () => ({
    exportedAt: new Date().toISOString(),
    setup: {
      bankroll,
      initialBet,
      includeGreen,
      wheelType,
      isProgressiveBetting,
    },
    play,
    disclaimer: 'For personal records only; entertainment / session tracker—not gambling advice.',
  });

  return (
    <div className="App">
      <div className="container">
        <AppHeader />

        {!gameStarted ? (
          <SetupForm
            bankroll={bankroll}
            initialBet={initialBet}
            includeGreen={includeGreen}
            isProgressiveBetting={isProgressiveBetting}
            wheelType={wheelType}
            setupErrors={setupErrors}
            onBankrollChange={handleBankrollChange}
            onInitialBetChange={handleInitialBetChange}
            onIncludeGreenChange={setIncludeGreen}
            onProgressiveChange={setIsProgressiveBetting}
            onWheelTypeChange={setWheelType}
            onStart={startGame}
          />
        ) : (
          <GameView
            sessionIncludeGreen={sessionIncludeGreen}
            sessionWheelType={sessionWheelType}
            profitPct={profitPct}
            riskLevel={riskLevel}
            sessionStartingBankroll={sessionStartingBankroll}
            cumulativeTopUps={cumulativeTopUps}
            totalProfit={totalProfit}
            currentMoney={currentMoney}
            currentBet={currentBet}
            baseBet={baseBet}
            round={round}
            strategy={strategy}
            consecutiveWins={consecutiveWins}
            consecutiveLosses={consecutiveLosses}
            gameHistory={gameHistory}
            maxPossibleLosses={maxPossibleLosses}
            isProgressiveBetting={isProgressiveBetting}
            onWinRound={(stake) => recordResult(true, stake)}
            onLoseRound={(stake) => recordResult(false, stake)}
            onSetBet={(bet) => dispatchPlay({ type: 'SET_BET', bet })}
            onSetBaseBet={(bet) => dispatchPlay({ type: 'SET_BASE_BET', bet })}
            onSetStrategy={(strategy) => dispatchPlay({ type: 'SET_STRATEGY', strategy })}
            onReroll={() => dispatchPlay({ type: 'REROLL_STRATEGY' })}
            onProgressiveChange={setIsProgressiveBetting}
            onAddMoney={(amount) => dispatchPlay({ type: 'ADD_MONEY', amount: roundMoney(amount) })}
            onUndo={() => dispatchPlay({ type: 'UNDO' })}
            onReset={resetGame}
            onExportJson={() => exportSessionJson(buildExportSnapshot())}
            onExportCsv={() => exportSessionCsv(gameHistory)}
          />
        )}

        <SiteFooter />
      </div>
    </div>
  );
}

export default App;
