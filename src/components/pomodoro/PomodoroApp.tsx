import { useState } from "react";
import { usePomodoroTimer } from "../../hooks/usePomodoroTimer";
import { ProgressRing } from "./ProgressRing";
import { TimerDisplay } from "./TimerDisplay";
import { Controls } from "./Controls";
import { SettingsPanel } from "./SettingsPanel";
import { SessionHistory } from "./SessionHistory";

export function PomodoroApp() {
  const t = usePomodoroTimer();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <main
      data-mode={t.mode}
      data-paused={t.status === "paused"}
      data-status={t.status}
      className="pomo-bg-transition pomo-grain relative min-h-[100dvh] w-full overflow-hidden flex flex-col items-center px-5 pt-8 pb-12 sm:pt-10"
    >
      {/* Ambient animated aura layers */}
      <div
        className="pomo-aura pomo-aura-a"
        aria-hidden="true"
        style={{
          top: "-15%",
          left: "-10%",
          width: "70vmax",
          height: "70vmax",
          background: "radial-gradient(circle at 30% 30%, var(--pomo-aura-1), transparent 60%)",
        }}
      />
      <div
        className="pomo-aura pomo-aura-b"
        aria-hidden="true"
        style={{
          bottom: "-20%",
          right: "-10%",
          width: "65vmax",
          height: "65vmax",
          background: "radial-gradient(circle at 60% 60%, var(--pomo-aura-2), transparent 60%)",
        }}
      />

      <div className="relative z-10 w-full max-w-[540px] flex flex-col items-center gap-5">
        <header className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="relative inline-flex h-2.5 w-2.5 rounded-full transition-colors duration-500"
              style={{
                backgroundColor: "var(--pomo-accent)",
                boxShadow: "0 0 14px var(--pomo-accent-glow)",
              }}
              aria-hidden="true"
            />
            <h1 className="text-[15px] font-semibold tracking-tight text-foreground">
              Pomo
              <span className="text-muted-foreground font-medium">.focus</span>
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setSettingsOpen((v) => !v)}
            aria-expanded={settingsOpen}
            aria-label="Toggle settings"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{
              transform: settingsOpen ? "rotate(60deg)" : "rotate(0deg)",
              transition:
                "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1), background 200ms ease, color 200ms ease",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </header>

        {/* Timer hero */}
        <div className="pt-3 pb-1 flex flex-col items-center">
          <ProgressRing progress={t.progress} status={t.status}>
            <TimerDisplay remaining={t.remaining} mode={t.mode} status={t.status} />
          </ProgressRing>
        </div>

        <Controls
          status={t.status}
          onStart={t.start}
          onPause={t.pause}
          onResume={t.resume}
          onReset={t.reset}
        />

        <SettingsPanel
          open={settingsOpen}
          settings={t.settings}
          mode={t.mode}
          onUpdate={t.updateSettings}
          onSwitchMode={t.switchMode}
        />

        <div className="w-full mt-1">
          <SessionHistory history={t.history} />
        </div>
      </div>
    </main>
  );
}
