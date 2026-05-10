const STORAGE_KEY = 'roulette-session-tracker-v1';

export function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.v !== 1 || !data.play) return null;
    return data;
  } catch {
    return null;
  }
}

export function saveSession(payload) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: 1, ...payload }));
  } catch {
    /* quota / private mode */
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
