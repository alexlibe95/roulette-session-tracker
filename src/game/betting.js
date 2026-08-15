/** Round cash to cents to avoid floating-point drift. */
export function roundMoney(n) {
  const value = Number(n);
  if (!Number.isFinite(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatMoney(n) {
  return roundMoney(n).toFixed(2);
}

export function toCents(n) {
  return Math.round(roundMoney(n) * 100);
}

function fromCents(cents) {
  return roundMoney(cents / 100);
}

function stakeMultiplier(currentBet, baseBet) {
  const baseCents = toCents(baseBet);
  if (baseCents <= 0) return 0;
  return toCents(currentBet) / baseCents;
}

/**
 * Next stake after a logged spin. Loss path is deterministic; win path may
 * pick a multiplier when progressive sizing is on.
 */
export function calculateNextBetAmount(
  isProgressiveBetting,
  isWin,
  currentWinStreak,
  currentBetAmount,
  baseBetAmount,
) {
  const base = roundMoney(baseBetAmount);
  const current = roundMoney(currentBetAmount);

  if (!isProgressiveBetting) {
    return isWin ? base : roundMoney(current * 2);
  }

  if (isWin) {
    const newWinStreak = currentWinStreak + 1;
    const random = Math.random();

    if (newWinStreak === 1) {
      return random > 0.4 ? roundMoney(base * 2) : base;
    }
    if (newWinStreak === 2) {
      if (random > 0.7) return roundMoney(base * 3);
      if (random > 0.3) return roundMoney(base * 2);
      return base;
    }
    if (newWinStreak === 3) {
      if (random > 0.8) return roundMoney(base * 4);
      if (random > 0.6) return roundMoney(base * 3);
      if (random > 0.3) return roundMoney(base * 2);
      return base;
    }
    if (newWinStreak <= 6) {
      if (random > 0.85) return roundMoney(base * 5);
      if (random > 0.7) return roundMoney(base * 4);
      if (random > 0.5) return roundMoney(base * 3);
      if (random > 0.25) return roundMoney(base * 2);
      return base;
    }
    if (random > 0.9) return roundMoney(base * 6);
    if (random > 0.7) return roundMoney(base * 3);
    if (random > 0.4) return roundMoney(base * 2);
    return base;
  }

  if (currentWinStreak > 0) {
    const currentMultiplier = stakeMultiplier(current, base);
    if (currentMultiplier >= 4) return roundMoney(base * 2);
    if (currentMultiplier >= 2) return roundMoney(base * 1.5);
    return base;
  }

  return roundMoney(current * 2);
}

/**
 * How many consecutive losses can still be logged from this balance.
 * Uses integer cents and the same next-stake rules as a real loss sequence
 * (Martingale doubles; progressive may step down once after a win streak, then doubles).
 */
export function calculateMaxLosses(money, bet, options = {}) {
  let remainingCents = toCents(money);
  let stakeCents = toCents(bet);
  if (remainingCents <= 0 || stakeCents <= 0) return 0;

  const baseBet = options.baseBet ?? bet;
  let winStreak = Number(options.consecutiveWins) || 0;
  if (winStreak < 0 || !Number.isFinite(winStreak)) winStreak = 0;
  const isProgressiveBetting = Boolean(options.isProgressiveBetting);

  let losses = 0;
  const MAX_STEPS = 128;

  while (losses < MAX_STEPS && stakeCents > 0 && remainingCents >= stakeCents) {
    remainingCents -= stakeCents;
    losses += 1;

    const next = calculateNextBetAmount(
      isProgressiveBetting,
      false,
      winStreak,
      fromCents(stakeCents),
      baseBet,
    );
    winStreak = 0;
    const nextCents = toCents(next);
    if (!Number.isSafeInteger(nextCents) || nextCents <= 0) break;
    stakeCents = nextCents;
  }

  return losses;
}

export function riskFromMaxLosses(maxLosses) {
  if (maxLosses <= 2) return 'high';
  if (maxLosses <= 5) return 'medium';
  return 'low';
}

export function parsePositiveMoney(raw) {
  const n = roundMoney(typeof raw === 'number' ? raw : parseFloat(String(raw).trim()));
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}
