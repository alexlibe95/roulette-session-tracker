import { WheelPicker } from '../WheelPicker';

export function SetupOptionsSection({
  includeGreen,
  isProgressiveBetting,
  wheelType,
  onIncludeGreenChange,
  onProgressiveChange,
  onWheelTypeChange,
}) {
  return (
    <section className="setup-panel" aria-labelledby="options-heading">
      <h3 id="options-heading" className="setup-panel-title">
        Suggestions &amp; staking style
      </h3>
      <p className="setup-panel-hint">
        These only change how the app nudges you—not the real odds at a physical table.
      </p>
      <div className="setup-options-stack">
        <label className="checkbox-label setup-checkbox-row">
          <input
            type="checkbox"
            checked={includeGreen}
            onChange={(e) => onIncludeGreenChange(e.target.checked)}
            aria-describedby="options-heading"
          />
          <span className="checkbox-label-text">
            Include green on the virtual wheel
            <span className="green-numbers" title="Uses real European or American odds">
              calibrated
            </span>
          </span>
        </label>

        <label className="checkbox-label setup-checkbox-row">
          <input
            type="checkbox"
            checked={isProgressiveBetting}
            onChange={(e) => onProgressiveChange(e.target.checked)}
            aria-describedby="options-heading"
          />
          <span className="checkbox-label-text">Progressive staking (after wins / losses)</span>
        </label>

        {includeGreen && (
          <WheelPicker wheelType={wheelType} onWheelTypeChange={onWheelTypeChange} />
        )}
      </div>
    </section>
  );
}
