import { Shuffle } from 'lucide-react';
import { formatMoney } from '../../game/betting';

const COLORS = ['red', 'black', 'green'];

export function ColorSuggestion({ strategy, includeGreen, currentBet, onSelect, onReroll }) {
  const options = includeGreen ? COLORS : COLORS.filter((c) => c !== 'green');
  const color = strategy || 'red';

  return (
    <div className="strategy-recommendation">
      <h3>Color this spin</h3>
      <div className={`color-choice ${color}`} aria-live="polite">
        <span className="color-choice-name">{color.toUpperCase()}</span>
        <span className="color-choice-bet">${formatMoney(currentBet)}</span>
      </div>
      <p className="color-picker-hint">Tap a color if you staked something else at the table.</p>
      <div className="color-picker-row" role="group" aria-label="Color on the felt">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`color-chip ${option}${color === option ? ' is-selected' : ''}`}
            onClick={() => onSelect(option)}
            aria-pressed={color === option}
          >
            {option}
          </button>
        ))}
        <button type="button" className="color-chip color-chip-shuffle" onClick={onReroll}>
          <Shuffle size={14} aria-hidden />
          New pick
        </button>
      </div>
    </div>
  );
}
