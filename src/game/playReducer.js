import { calculateNextBetAmount, roundMoney } from './betting';
import { generateStrategy } from './strategy';

function newEntryId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `r-${Date.now()}-${Math.random()}`;
}

export const initialPlayState = {
  currentMoney: 0,
  currentBet: 0,
  baseBet: 0,
  round: 1,
  gameHistory: [],
  consecutiveLosses: 0,
  consecutiveWins: 0,
  totalProfit: 0,
  strategy: 'red',
  sessionIncludeGreen: false,
  sessionWheelType: 'european',
  sessionStartingBankroll: 0,
  cumulativeTopUps: 0,
};

function withHistoryIds(history) {
  if (!Array.isArray(history)) return [];
  return history.map((e) => ({ ...e, id: e.id ?? newEntryId() }));
}

function isColor(strategy, includeGreen) {
  if (strategy === 'red' || strategy === 'black') return true;
  return strategy === 'green' && includeGreen;
}

export function playReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE': {
      const s = action.state;
      return {
        ...initialPlayState,
        ...s,
        gameHistory: withHistoryIds(s.gameHistory),
        currentMoney: roundMoney(s.currentMoney),
        currentBet: roundMoney(s.currentBet),
        baseBet: roundMoney(s.baseBet),
        totalProfit: roundMoney(s.totalProfit),
        consecutiveLosses: Number(s.consecutiveLosses) || 0,
        consecutiveWins: Number(s.consecutiveWins) || 0,
        sessionStartingBankroll: roundMoney(s.sessionStartingBankroll) || 0,
        cumulativeTopUps: roundMoney(s.cumulativeTopUps) || 0,
      };
    }
    case 'START': {
      const { money, bet, includeGreen, wheelType } = action;
      const startMoney = roundMoney(money);
      const startBet = roundMoney(bet);
      return {
        ...initialPlayState,
        currentMoney: startMoney,
        currentBet: startBet,
        baseBet: startBet,
        sessionIncludeGreen: includeGreen,
        sessionWheelType: wheelType,
        sessionStartingBankroll: startMoney,
        cumulativeTopUps: 0,
        strategy: generateStrategy(includeGreen, wheelType),
      };
    }
    case 'RESET_PLAY':
      return initialPlayState;
    case 'SET_BET': {
      const bet = roundMoney(action.bet);
      if (!Number.isFinite(bet) || bet <= 0) return state;
      return { ...state, currentBet: bet };
    }
    case 'SET_BASE_BET': {
      const bet = roundMoney(action.bet);
      if (!Number.isFinite(bet) || bet <= 0) return state;
      return { ...state, baseBet: bet };
    }
    case 'SET_STRATEGY': {
      if (!isColor(action.strategy, state.sessionIncludeGreen)) return state;
      return { ...state, strategy: action.strategy };
    }
    case 'REROLL_STRATEGY':
      return {
        ...state,
        strategy: generateStrategy(state.sessionIncludeGreen, state.sessionWheelType),
      };
    case 'RECORD_RESULT': {
      const { won, customBetAmount, isProgressiveBetting } = action;
      const betAmount = roundMoney(
        customBetAmount != null && customBetAmount !== '' ? customBetAmount : state.currentBet,
      );
      if (!Number.isFinite(betAmount) || betAmount <= 0) return state;
      if (betAmount > roundMoney(state.currentMoney)) return state;

      const {
        round,
        strategy,
        currentMoney,
        baseBet,
        consecutiveWins,
        consecutiveLosses,
        totalProfit,
        gameHistory,
      } = state;

      const newHistory = [...gameHistory];
      const nextBet = roundMoney(
        calculateNextBetAmount(
          isProgressiveBetting,
          won,
          consecutiveWins,
          betAmount,
          baseBet,
        ),
      );

      if (won) {
        const winAmount = betAmount;
        const newWinStreak = consecutiveWins + 1;
        const newMoney = roundMoney(currentMoney + winAmount);
        const newProfit = roundMoney(totalProfit + winAmount);

        newHistory.push({
          id: newEntryId(),
          round,
          bet: betAmount,
          result: 'win',
          strategy,
          profit: winAmount,
          balance: newMoney,
          previousBet: state.currentBet,
          previousMoney: currentMoney,
          previousProfit: totalProfit,
          previousLosses: consecutiveLosses,
          previousWins: consecutiveWins,
          previousBaseBet: baseBet,
          winStreak: newWinStreak,
          nextBet,
        });

        return {
          ...state,
          currentMoney: newMoney,
          totalProfit: newProfit,
          consecutiveLosses: 0,
          consecutiveWins: newWinStreak,
          currentBet: nextBet > 0 ? nextBet : baseBet,
          gameHistory: newHistory,
          round: round + 1,
          strategy: generateStrategy(state.sessionIncludeGreen, state.sessionWheelType),
        };
      }

      const newMoney = roundMoney(currentMoney - betAmount);
      const newProfit = roundMoney(totalProfit - betAmount);
      const newLossStreak = consecutiveLosses + 1;

      newHistory.push({
        id: newEntryId(),
        round,
        bet: betAmount,
        result: 'loss',
        strategy,
        profit: roundMoney(-betAmount),
        balance: newMoney,
        previousBet: state.currentBet,
        previousMoney: currentMoney,
        previousProfit: totalProfit,
        previousLosses: consecutiveLosses,
        previousWins: consecutiveWins,
        previousBaseBet: baseBet,
        winStreak: 0,
        nextBet,
      });

      return {
        ...state,
        currentMoney: newMoney,
        totalProfit: newProfit,
        consecutiveLosses: newLossStreak,
        consecutiveWins: 0,
        currentBet: nextBet > 0 ? nextBet : baseBet,
        gameHistory: newHistory,
        round: round + 1,
        strategy: generateStrategy(state.sessionIncludeGreen, state.sessionWheelType),
      };
    }
    case 'UNDO': {
      if (state.gameHistory.length === 0) return state;
      const lastRound = state.gameHistory[state.gameHistory.length - 1];
      return {
        ...state,
        currentMoney: lastRound.previousMoney,
        totalProfit: lastRound.previousProfit,
        currentBet: lastRound.previousBet,
        baseBet: lastRound.previousBaseBet ?? state.baseBet,
        consecutiveLosses: lastRound.previousLosses,
        consecutiveWins: lastRound.previousWins ?? 0,
        round: state.round - 1,
        gameHistory: state.gameHistory.slice(0, -1),
        strategy: lastRound.strategy,
      };
    }
    case 'ADD_MONEY': {
      const amount = roundMoney(action.amount);
      if (!(amount > 0)) return state;
      return {
        ...state,
        currentMoney: roundMoney(state.currentMoney + amount),
        cumulativeTopUps: roundMoney(state.cumulativeTopUps + amount),
      };
    }
    default:
      return state;
  }
}
