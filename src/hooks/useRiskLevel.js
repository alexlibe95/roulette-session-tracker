import { useState, useEffect } from 'react';
import { calculateMaxLosses } from '../game/betting';

export function useRiskLevel(gameStarted, currentMoney, currentBet) {
  const [riskLevel, setRiskLevel] = useState('low');

  useEffect(() => {
    if (gameStarted) {
      const maxLosses = calculateMaxLosses(currentMoney, currentBet);
      if (maxLosses <= 2) {
        setRiskLevel('high');
      } else if (maxLosses <= 5) {
        setRiskLevel('medium');
      } else {
        setRiskLevel('low');
      }
    }
  }, [currentMoney, currentBet, gameStarted]);

  return [riskLevel, setRiskLevel];
}
