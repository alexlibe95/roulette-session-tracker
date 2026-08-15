/** Round cash to cents to avoid floating-point drift. */
export function roundMoney(n) {
  const value = Number(n);
  if (!Number.isFinite(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatMoney(n) {
  return roundMoney(n).toFixed(2);
}

/** Martingale-style: consecutive losses at doubling stakes from `bet` until balance is exhausted. */
export function calculateMaxLosses(money, bet) {
  if (!Number.isFinite(money) || !Number.isFinite(bet) || bet <= 0) {
    return 0;
  }
  let stake = bet;
  let remaining = money;
  let losses = 0;
  while (remaining >= stake) {
    remaining -= stake;
    losses++;
    stake *= 2;
  }
  return losses;
}

export function calculateNextBetAmount(
  isProgressiveBetting,
  isWin,
  currentWinStreak,
  currentBetAmount,
  baseBetAmount,
) {
  if (!isProgressiveBetting) {
    return isWin ? baseBetAmount : currentBetAmount * 2;
  }

  if (isWin) {
    const newWinStreak = currentWinStreak + 1;
    const random = Math.random();

    if (newWinStreak === 1) {
      return random > 0.4 ? baseBetAmount * 2 : baseBetAmount;
    }
    if (newWinStreak === 2) {
      if (random > 0.7) return baseBetAmount * 3;
      if (random > 0.3) return baseBetAmount * 2;
      return baseBetAmount;
    }
    if (newWinStreak === 3) {
      if (random > 0.8) return baseBetAmount * 4;
      if (random > 0.6) return baseBetAmount * 3;
      if (random > 0.3) return baseBetAmount * 2;
      return baseBetAmount;
    }
    if (newWinStreak <= 6) {
      if (random > 0.85) return baseBetAmount * 5;
      if (random > 0.7) return baseBetAmount * 4;
      if (random > 0.5) return baseBetAmount * 3;
      if (random > 0.25) return baseBetAmount * 2;
      return baseBetAmount;
    }
    if (random > 0.9) return baseBetAmount * 6;
    if (random > 0.7) return baseBetAmount * 3;
    if (random > 0.4) return baseBetAmount * 2;
    return baseBetAmount;
  }

  if (currentWinStreak > 0) {
    const currentMultiplier = currentBetAmount / baseBetAmount;
    if (currentMultiplier >= 4) {
      return baseBetAmount * 2;
    }
    if (currentMultiplier >= 2) {
      return baseBetAmount * 1.5;
    }
    return baseBetAmount;
  }

  return currentBetAmount * 2;
}

export function parsePositiveMoney(raw) {
  const n = roundMoney(typeof raw === 'number' ? raw : parseFloat(String(raw).trim()));
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}
