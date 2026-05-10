import { calculateNextBetAmount } from './betting';
import { generateStrategy } from './strategy';

function newEntryId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `r-${Date.now()}-${Math.random()}`;
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

export function playReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE': {
      const s = action.state;
      return {
        ...initialPlayState,
        ...s,
        gameHistory: withHistoryIds(s.gameHistory),
        sessionStartingBankroll: Number(s.sessionStartingBankroll) || 0,
        cumulativeTopUps: Number(s.cumulativeTopUps) || 0,
      };
    }
    case 'START': {
      const { money, bet, includeGreen, wheelType } = action;
      return {
        ...initialPlayState,
        currentMoney: money,
        currentBet: bet,
        baseBet: bet,
        sessionIncludeGreen: includeGreen,
        sessionWheelType: wheelType,
        sessionStartingBankroll: money,
        cumulativeTopUps: 0,
        strategy: generateStrategy(includeGreen, wheelType),
      };
    }
    case 'RESET_PLAY':
      return initialPlayState;
    case 'RECORD_RESULT': {
      const { won, customBetAmount, isProgressiveBetting } = action;
      const betAmount =
        customBetAmount != null && customBetAmount !== '' ? customBetAmount : state.currentBet;
      const {
        round,
        strategy,
        currentMoney,
        currentBet,
        baseBet,
        consecutiveWins,
        consecutiveLosses,
        totalProfit,
        gameHistory,
      } = state;

      const newHistory = [...gameHistory];

      if (won) {
        const winAmount = betAmount;
        const newWinStreak = consecutiveWins + 1;
        const newMoney = currentMoney + winAmount;
        const newProfit = totalProfit + winAmount;
        const nextBet = calculateNextBetAmount(
          isProgressiveBetting,
          true,
          consecutiveWins,
          currentBet,
          baseBet,
        );

        newHistory.push({
          id: newEntryId(),
          round,
          bet: betAmount,
          result: 'win',
          strategy,
          profit: winAmount,
          balance: newMoney,
          previousBet: currentBet,
          previousMoney: currentMoney,
          previousProfit: totalProfit,
          previousLosses: consecutiveLosses,
          previousWins: consecutiveWins,
          winStreak: newWinStreak,
          nextBet,
        });

        return {
          ...state,
          currentMoney: newMoney,
          totalProfit: newProfit,
          consecutiveLosses: 0,
          consecutiveWins: newWinStreak,
          currentBet: nextBet,
          gameHistory: newHistory,
          round: round + 1,
          strategy: generateStrategy(state.sessionIncludeGreen, state.sessionWheelType),
        };
      }

      const newMoney = currentMoney - betAmount;
      const newProfit = totalProfit - betAmount;
      const newLossStreak = consecutiveLosses + 1;
      const nextBet = calculateNextBetAmount(
        isProgressiveBetting,
        false,
        consecutiveWins,
        currentBet,
        baseBet,
      );

      newHistory.push({
        id: newEntryId(),
        round,
        bet: betAmount,
        result: 'loss',
        strategy,
        profit: -betAmount,
        balance: newMoney,
        previousBet: currentBet,
        previousMoney: currentMoney,
        previousProfit: totalProfit,
        previousLosses: consecutiveLosses,
        previousWins: consecutiveWins,
        winStreak: 0,
        nextBet,
      });

      return {
        ...state,
        currentMoney: newMoney,
        totalProfit: newProfit,
        consecutiveLosses: newLossStreak,
        consecutiveWins: 0,
        currentBet: nextBet,
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
        consecutiveLosses: lastRound.previousLosses,
        consecutiveWins: lastRound.previousWins ?? 0,
        round: state.round - 1,
        gameHistory: state.gameHistory.slice(0, -1),
        strategy: lastRound.strategy,
      };
    }
    case 'ADD_MONEY_CONTINUE': {
      const delta = Math.max(0, state.currentBet - state.currentMoney);
      return {
        ...state,
        currentMoney: state.currentBet,
        cumulativeTopUps: state.cumulativeTopUps + delta,
      };
    }
    default:
      return state;
  }
}
