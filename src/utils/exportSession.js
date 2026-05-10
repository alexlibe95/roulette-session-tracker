function downloadBlob(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.rel = 'noopener';
  a.click();
  URL.revokeObjectURL(a.href);
}

export function exportSessionJson(snapshot) {
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `roulette-session-${Date.now()}.json`);
}

export function exportSessionCsv(gameHistory) {
  const header = ['Round', 'Strategy', 'Bet', 'Result', 'ProfitLoss', 'Balance'];
  const rows = gameHistory.map((e) => [
    e.round,
    e.strategy,
    e.bet.toFixed(2),
    e.result,
    e.profit.toFixed(2),
    e.balance.toFixed(2),
  ]);
  const csv = [header.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join(
    '\n',
  );
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, `roulette-history-${Date.now()}.csv`);
}
