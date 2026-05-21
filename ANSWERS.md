# ANSWERS.md — Engineering Q&A

Responses to the five evaluation questions for the Pomodoro Timer submission.

---

## 1. How to Run the Project

### Prerequisites

- **Bun** (recommended): https://bun.sh — or Node.js 18+
- Git

### Steps

```bash
git clone https://github.com/your-username/focus-flow.git
cd focus-flow
bun install        # install all dependencies
bun run dev        # start local dev server at http://localhost:8080
```

**Build for production:**

```bash
bun run build      # outputs to .output/ via Vite + TanStack Start
bun run preview    # preview production bundle locally
```

**Live deployment:** [https://focus-flow-three-xi.vercel.app/](https://focus-flow-three-xi.vercel.app/)

---

## 2. Stack & Design Choices

### Why TanStack Start instead of plain Vite + React?

TanStack Start provides file-based routing, SSR-ready server entry points, and an opinionated project scaffold that mirrors production-grade apps. While a Pomodoro timer doesn't _need_ SSR, using it demonstrated familiarity with modern React meta-frameworks beyond create-react-app or basic Vite SPAs. It also gives proper `<head>` management (title, meta, OG tags) without reaching for a separate Helmet library.

### Why no Redux / Zustand?

All timer state lives in a single custom hook — `usePomodoroTimer`. The state graph is simple: `mode` (focus/break), `status` (idle/running/paused), `remaining` (seconds), `settings`, `history`. React's `useState` + `useCallback` + `useRef` (for the deadline timestamp) is more than sufficient and avoids unnecessary dependency overhead.

### Why `useRef` for the deadline instead of state?

The deadline (`deadlineRef`) is the absolute `Date.now()` timestamp when the timer should reach zero. Storing it in a `ref` (not state) means:

- It persists across renders without causing re-renders itself
- The ticking interval reads the _current_ wall-clock time minus deadline, so pausing the tab or backgrounding doesn't cause drift — the timer self-corrects on resume
- Tab visibility changes trigger an explicit re-sync, so the timer stays accurate even after a laptop sleep

### Why Tailwind CSS v4 + OKLCH design tokens?

Tailwind v4 ships its own CSS compiler without PostCSS overhead and supports native CSS custom properties natively. OKLCH was chosen for colors because:

- It's perceptually uniform — equal numeric steps look equally different to the human eye
- Smooth hue transitions between focus (amber ~32°) and break (teal ~200°) look gorgeous
- It's now natively supported in all modern browsers without polyfills

### Why Web Audio API for sounds?

Synthesizing tones directly (`OscillatorNode` → `GainNode`) avoids loading any audio files. This means:

- Zero network requests for sound
- Instant playback with no buffering
- Works offline / in airplane mode
- The three-tone rising chime (880Hz → 1175Hz → 1568Hz) is a musical major chord arpeggio — intentionally pleasant, not jarring

---

## 3. Responsive Design & Accessibility

### Responsive Strategy

The layout uses a centered single-column flex container with `max-w-[540px]` — this gives the app a native-app feel on mobile while remaining proportional on wider screens. Key responsive decisions:

- **Progress ring**: `clamp(260px, 74vw, 380px)` — scales fluidly between phone (~260px) and desktop (~380px) without breakpoint jumps
- **Timer digit size**: `clamp(3.5rem, 13vw, 5.5rem)` — the countdown stays large and legible at every viewport
- **Settings panel**: grid-based accordion with `grid-template-rows` animation — no absolute positioning that could overflow on small screens
- **Touch targets**: all interactive elements are minimum `44×44px` (iOS HIG minimum), buttons use `h-10 w-10` or larger

### Accessibility

| Concern            | Implementation                                                                                             |
| ------------------ | ---------------------------------------------------------------------------------------------------------- |
| **Live region**    | `aria-live="polite"` on the timer span — screen readers announce time changes without interrupting         |
| **Button labels**  | All icon-only buttons have explicit `aria-label` attributes                                                |
| **Keyboard nav**   | Full `Tab` traversal, `focus-visible:ring-2` outlines on every interactive element                         |
| **Reduced motion** | `@media (prefers-reduced-motion: reduce)` disables all CSS animations (breathing, shimmer, auras, fade-up) |
| **ARIA states**    | Settings toggle uses `aria-expanded`, mode tabs use `aria-pressed`                                         |
| **Semantic HTML**  | `<main>`, `<header>`, `<section>`, `<h1>`, `<h2>`, `<time>`, `<ul>/<li>` used appropriately                |
| **Color contrast** | Foreground text uses `oklch(0.97 ...)` on a `oklch(0.16 ...)` background — exceeds WCAG AA ratio of 4.5:1  |

---

## 4. AI Usage

AI (specifically Lovable.dev's generative UI) was used as a **starting scaffold and design accelerator**, not as a replacement for engineering judgment.

### What AI generated:

- Initial component file stubs (`PomodoroApp`, `TimerDisplay`, `Controls`, `ProgressRing`, `SettingsPanel`, `SessionHistory`)
- The base CSS design token system and OKLCH palette skeleton
- The TanStack Start project configuration (`vite.config.ts`, routing setup)

### What was manually refined / written:

- The `usePomodoroTimer` hook logic — particularly the `deadlineRef` pattern for drift-resistant timing, tab visibility resync, and calendar-day rollover
- The `useNotificationSound` hook — the Web Audio API oscillator chain
- All animation keyframes and timing curves in `styles.css`
- The SVG `strokeDashoffset` math in `ProgressRing`
- Error boundary and SSR error normalization in `server.ts`
- The `clampMin` validation in `storage.ts`

**The rule I followed:** Accept AI scaffolding for boilerplate, rewrite any logic that needs to be _correct_ (timers, state machines, browser APIs). AI is fast at CSS patterns; humans need to verify math.

---

## 5. Honest Gap

### What I would do with more time:

**Browser Notifications API**: The app currently plays an audio chime when a session ends. Native browser push notifications (`Notification.requestPermission()`) would work even when the tab is backgrounded — important for long focus sessions where users switch windows. This is a missing feature.

**Keyboard Shortcuts**: Power users expect `Space` to toggle play/pause globally, not just when the button has focus. Implementing a document-level `keydown` listener with proper conflict avoidance (don't trigger when typing in an input) was deprioritized for time.

**Streak / Statistics View**: The daily history shows only today's sessions. A weekly bar chart (minutes focused per day, using Recharts — already in the dependency tree) would make the app genuinely useful for tracking focus habits over time. The data model in `storage.ts` would need to shift from a single-day object to a keyed-by-date record.

**Timer Accuracy Below 250ms**: The interval fires every 250ms, which means the displayed second can lag by up to 250ms. For a Pomodoro timer this is imperceptible, but a proper implementation would use `requestAnimationFrame` for smoother sub-second visual updates while keeping the deadline math as-is.

**E2E Tests**: The timer logic is well-suited for Playwright tests (start, wait N seconds, assert remaining time decreased). Currently there are no automated tests — a gap for a production app.
