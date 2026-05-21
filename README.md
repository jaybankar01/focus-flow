# 🍅 Pomo.focus — Pomodoro Timer

A calm, polished Pomodoro timer built for deep work. Beautiful ambient visuals, smooth transitions, and zero distractions — so you can actually focus.

---

## ✨ Features

- **Focus & Break cycles** — configurable durations (1–120 min focus, 1–60 min break)
- **Auto-switching** — automatically transitions between focus and break sessions
- **Daily history** — tracks completed focus sessions with timestamps
- **Persistent storage** — settings and history survive page refreshes via `localStorage`
- **Responsive UI** — works seamlessly on mobile, tablet, and desktop
- **Audible notifications** — synthesized chime tones via Web Audio API (no external assets)
- **Ambient animations** — slow-drifting aura layers and breathing progress ring
- **Accessibility** — keyboard navigation, `aria-live` timer, focus-visible outlines, WCAG contrast

---

## 🛠 Tech Stack

| Layer           | Technology                                   |
| --------------- | -------------------------------------------- |
| Framework       | React 19                                     |
| Routing & SSR   | TanStack Start (TanStack Router)             |
| Build Tool      | Vite 7                                       |
| Styling         | Tailwind CSS v4 + custom OKLCH design tokens |
| State           | React hooks (no external state library)      |
| Package Manager | Bun                                          |
| Language        | TypeScript                                   |
| Audio           | Web Audio API (native browser)               |
| Storage         | `localStorage`                               |

---

## 🚀 Run Locally

### Prerequisites

- [Bun](https://bun.sh) (recommended) **or** Node.js 18+

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/your-username/focus-flow.git
cd focus-flow

# 2. Install dependencies
bun install
# or: npm install

# 3. Start development server
bun run dev
# or: npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 🏗 Build

```bash
# Production build
bun run build
# or: npm run build

# Preview production build locally
bun run preview
# or: npm run preview
```

---

## 🌐 Deployment

The app is deployed publicly at:

> **[https://focus-flow-three-xi.vercel.app/](https://focus-flow-three-xi.vercel.app/)**

### Deploy your own fork

**Vercel (recommended):**

```bash
npm i -g vercel
vercel
```

**Netlify:**

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## 📁 Project Structure

```
focus-flow/
├── src/
│   ├── components/
│   │   └── pomodoro/
│   │       ├── PomodoroApp.tsx      # Root layout & ambient auras
│   │       ├── ProgressRing.tsx     # SVG arc + breathing animation
│   │       ├── TimerDisplay.tsx     # mm:ss readout + state labels
│   │       ├── Controls.tsx         # Start / Pause / Resume / Reset
│   │       ├── SettingsPanel.tsx    # Expandable settings drawer
│   │       └── SessionHistory.tsx   # Daily session log
│   ├── hooks/
│   │   ├── usePomodoroTimer.ts      # Core timer state machine
│   │   └── useNotificationSound.ts  # Web Audio API chime
│   ├── utils/
│   │   ├── storage.ts               # localStorage helpers
│   │   └── time.ts                  # Time formatting utilities
│   ├── routes/
│   │   ├── __root.tsx               # HTML shell + error boundaries
│   │   └── index.tsx                # Root route → PomodoroApp
│   └── styles.css                   # Design tokens + animations
├── ANSWERS.md                       # Engineering Q&A
├── README.md
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## ⌨️ Keyboard Usage

| Key                               | Action                               |
| --------------------------------- | ------------------------------------ |
| `Space` / `Enter` on Start button | Start / Pause / Resume               |
| `Tab`                             | Navigate between controls            |
| `Escape`                          | Close settings panel (click outside) |

---

## 🎨 Design Decisions

- **OKLCH color space** for perceptually uniform, vibrant accent transitions between focus (amber) and break (teal) modes
- **Grain overlay** (`mix-blend-mode: overlay`) for premium texture without image assets
- **`prefers-reduced-motion`** respected — all animations disabled for users who prefer it
- **Tabular numerals** keep the timer digits stable-width to prevent layout shift during countdown

---

## 📝 License

MIT
