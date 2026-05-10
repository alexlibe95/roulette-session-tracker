export function WheelPicker({ wheelType, onWheelTypeChange }) {
  return (
    <fieldset className="wheel-picker">
      <legend className="wheel-picker-heading">Which wheel should color odds follow?</legend>
      <div className="wheel-options">
        <label className="radio-label">
          <input
            type="radio"
            name="wheelType"
            checked={wheelType === 'european'}
            onChange={() => onWheelTypeChange('european')}
          />
          <span>
            <strong>European</strong> — 37 slots, one green (≈2.7% green)
          </span>
        </label>
        <label className="radio-label">
          <input
            type="radio"
            name="wheelType"
            checked={wheelType === 'american'}
            onChange={() => onWheelTypeChange('american')}
          />
          <span>
            <strong>American</strong> — 38 slots, 0 and 00 (≈5.3% green)
          </span>
        </label>
      </div>
    </fieldset>
  );
}
