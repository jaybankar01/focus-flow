# Pomodoro Timer — Build Plan

A single-screen, frontend-only Pomodoro app built on the existing TanStack Start + Tailwind v4 template. Everything lives on `/`, persisted via `localStorage`, with a circular progress ring as the focal point.

## Scope

- Replace placeholder home (`src/routes/index.tsx`) with the Pomodoro experience.
- Focus (default 25m) / Break (default 5m), configurable.
- Accurate countdown using `Date.now()` deadlines (no drift).
- Start / Pause / Resume / Reset with smart enable/disable.
- Auto-switch focus ↔ break with a short notification sound.
- Daily focus-session history, auto-resets on date change.
- Responsive 360px → 1440px, accessible, animated.

## File structure

```text
src/
  routes/index.tsx              // mounts <PomodoroApp />
  components/pomodoro/
    PomodoroApp.tsx             // layout + state wiring
    ProgressRing.tsx            // SVG circular progress
    TimerDisplay.tsx            // mm:ss + mode label
    Controls.tsx                // Start/Pause/Resume/Reset
    SettingsPanel.tsx           // focus/break duration inputs
    SessionHistory.tsx          // today's completed focus sessions
  hooks/
    usePomodoroTimer.ts         // core timer state machine
    useLocalStorage.ts          // typed localStorage hook (SSR-safe)
    useNotificationSound.ts     // WebAudio beep
  utils/
    time.ts                     // formatMMSS, todayISO, etc.
    storage.ts                  // history schema + date-reset logic
```

No new dependencies. Tailwind v4 tokens already in `src/styles.css`; add a couple of mode-specific accent tokens (focus = warm/energetic, break = cool/calm) and a `--shadow-glow` for the ring.

## Timer logic (drift-free)

`usePomodoroTimer` keeps:

- `mode`: `'focus' | 'break'`
- `status`: `'idle' | 'running' | 'paused'`
- `durations`: `{ focus, break }` (seconds, from localStorage)
- `deadline`: epoch ms when current session ends (when running)
- `remaining`: seconds left (authoritative when paused/idle)

Tick via `setInterval(250ms)` that recomputes `remaining = Math.max(0, Math.round((deadline - Date.now())/1000))`. When it hits 0: push to history (focus only), play sound, flip `mode`, auto-start next session by setting a new `deadline`. Pause stores `remaining` and clears `deadline`; Resume sets `deadline = Date.now() + remaining*1000`. Reset restores `remaining` to current mode's full duration and goes `idle`.

Also re-syncs on `visibilitychange` so a backgrounded tab catches up instantly.

## Persistence

Two localStorage keys:

- `pomodoro.settings` → `{ focusMinutes, breakMinutes }`
- `pomodoro.history` → `{ date: "YYYY-MM-DD", sessions: [{ durationSec, completedAt }] }`

On load, if `history.date !== todayISO()`, reset to `{ date: today, sessions: [] }`. Same check before each insert.

## UI / UX

- Centered column, max-width ~480px on mobile, ~560px on desktop.
- Header: app title + small settings gear that toggles `SettingsPanel` (inline collapsible, no modal clutter).
- `ProgressRing`: SVG circle, `stroke-dashoffset` animated via CSS transition; color shifts with mode; soft glow shadow via `filter: drop-shadow`. Inside the ring: mode label (Focus / Break / Paused), large `mm:ss`.
- Controls: primary action morphs Start ↔ Pause ↔ Resume; secondary Reset. Disabled states styled, not just dimmed.
- Mode theming via a `data-mode` attribute on the root element driving CSS custom properties (focus = warm coral, break = calm teal, paused = desaturated). Smooth `transition: background/color/box-shadow 400ms`.
- History list below: `✓ 25:00 focus — 3:42 PM`, newest first, empty state message.
- Sound: short WebAudio sine-blip generated in-code (no asset needed), respects a mute toggle in settings.

## Accessibility

- Semantic `<main>`, `<section>`, `<button>`, `<form>`.
- `aria-live="polite"` on timer text; `aria-label` on icon buttons.
- Visible `:focus-visible` rings via Tailwind.
- Mode communicated by label text + icon, not color alone.
- Contrast checked in both light and dark token sets.

## Responsive

- Mobile-first; ring sized via `clamp(220px, 70vw, 360px)`.
- Touch targets ≥ 44px.
- No layout shift between idle/running (reserve space for all elements).

## Out of scope (per spec)

No backend, auth, routing additions, dashboards, or extra pages.
