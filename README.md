# Roulette session tracker

A small React (Vite) app for **logging play sessions**—bankroll, stakes, wins/losses, and playful color suggestions. It does **not** provide gambling advice or a way to beat the house; it’s for personal tracking and entertainment.

## Requirements

- [Bun](https://bun.sh) 1.x (see `packageManager` in `package.json`), or use `npm` / `pnpm` with the same scripts if you prefer.

## Commands

```bash
bun install
bun run dev      # http://localhost:5173 (or next free port)
bun run build    # output in dist/
bun run preview  # serve the production build locally
```

## Behavior notes

- **Autosave:** An active session is stored in `localStorage` so a refresh doesn’t wipe progress. **Reset session** clears it and returns to setup.
- **Profit %** uses **total capital in the session** (initial bankroll + any amount added via “Add money & continue”).
- **Export JSON** includes setup + full play state; **Export CSV** is round-by-round history (enabled once there is history).

## PWA / offline

- Production builds register a **service worker** (`vite-plugin-pwa`) that **precaches** the app shell (JS/CSS/HTML and static assets).
- After one successful load, opening the app **without a network** should still work for the same origin (session data stays in **localStorage** as before).
- **Install:** In supported browsers, use “Install app” / “Add to Home Screen.” Icons: `public/pwa-192.png`, `public/pwa-512.png`, maskable `public/pwa-512-maskable.png`, plus iOS splash images (`public/splash-*.png`).
- **Dev:** PWA is **disabled** during `bun run dev` (`devOptions.enabled: false`) to avoid stale SW while coding. Test with `bun run build && bun run preview`.

## Stack

React 19, Vite 6, `lucide-react`, `vite-plugin-pwa` (Workbox).
