export function WheelSessionBanner({ sessionWheelType }) {
  return (
    <p className="wheel-session-banner">
      Color suggestions use{' '}
      <strong>{sessionWheelType === 'american' ? 'American (0 + 00)' : 'European (single 0)'}</strong> wheel
      odds — red/black/green match that layout.
    </p>
  );
}
