import { SetupBankrollSection } from './SetupBankrollSection';
import { SetupStakeSuggestions } from './SetupStakeSuggestions';
import { SetupOptionsSection } from './SetupOptionsSection';

export function SetupForm({
  bankroll,
  initialBet,
  includeGreen,
  isProgressiveBetting,
  wheelType,
  setupErrors,
  onBankrollChange,
  onInitialBetChange,
  onIncludeGreenChange,
  onProgressiveChange,
  onWheelTypeChange,
  onStart,
}) {
  return (
    <div className="setup-layout">
      {setupErrors.form ? (
        <div className="setup-validation-banner" role="alert">
          {setupErrors.form}
        </div>
      ) : null}

      <SetupBankrollSection
        bankroll={bankroll}
        initialBet={initialBet}
        bankrollError={setupErrors.bankroll}
        initialBetError={setupErrors.initialBet}
        onBankrollChange={onBankrollChange}
        onInitialBetChange={onInitialBetChange}
      />
      <SetupStakeSuggestions bankroll={bankroll} onPickStake={onInitialBetChange} />
      <SetupOptionsSection
        includeGreen={includeGreen}
        isProgressiveBetting={isProgressiveBetting}
        wheelType={wheelType}
        onIncludeGreenChange={onIncludeGreenChange}
        onProgressiveChange={onProgressiveChange}
        onWheelTypeChange={onWheelTypeChange}
      />
      <div className="setup-actions">
        <button type="button" className="btn btn-primary btn-large setup-start-btn" onClick={onStart}>
          Start session
        </button>
      </div>
    </div>
  );
}
