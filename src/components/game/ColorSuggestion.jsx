import { Shuffle } from 'lucide-react';

const COLORS = ['red', 'black', 'green'];

export function ColorSuggestion({ strategy, includeGreen, onSelect, onReroll }) {
  const options = includeGreen ? COLORS : COLORS.filter((c) => c !== 'green');

  return (
    <div className="strategy-recommendation">
      <h3>Color this spin</h3>
      <div className={`color-choice ${strategy}`} aria-live="polite">
        {(strategy || 'red').toUpperCase()}
      </div>
      <p className="color-picker-hint">Tap a color if you staked something else at the table.</p>
      <div className="color-picker-row" role="group" aria-label="Color on the felt">
        {options.map((color) => (
          <button
            key={color}
            type="button"
            className={`color-chip ${color}${strategy === color ? ' is-selected' : ''}`}
            onClick={() => onSelect(color)}
            aria-pressed={strategy === color}
          >
            {color}
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
