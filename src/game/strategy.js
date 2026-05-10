/**
 * Random color suggestion: fair 50/50 red/black without green,
 * or true wheel probabilities with green (18 red / 18 black / rest green).
 * @param {'european' | 'american'} wheelType
 */
export function generateStrategy(includeGreen, wheelType) {
  if (!includeGreen) {
    return Math.random() > 0.5 ? 'red' : 'black';
  }
  const slots = wheelType === 'american' ? 38 : 37;
  const pGreen = wheelType === 'american' ? 2 / 38 : 1 / 37;
  const pRed = 18 / slots;
  const r = Math.random();
  if (r < pGreen) return 'green';
  if (r < pGreen + pRed) return 'red';
  return 'black';
}
