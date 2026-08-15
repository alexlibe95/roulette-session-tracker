import { Target } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="text-center mb-4 app-header">
      <p className="app-kicker">SESSION LOG // ENTERTAINMENT ONLY</p>
      <h1 className="app-title">
        <Target className="icon" />
        Roulette session tracker
      </h1>
      <p className="app-subtitle">
        Session log and stake helper—playful colors, real wheel odds optional, zero crystal balls. The house math
        still wins long-term; this just helps you keep track without pretending otherwise.
      </p>
    </header>
  );
}
