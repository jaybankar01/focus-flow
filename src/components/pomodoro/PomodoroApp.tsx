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
      className="pomo-bg-transition min-h-screen w-full flex flex-col items-center px-5 py-8 sm:py-12"
      style={{
        background:
          "radial-gradient(ellipse at top, color-mix(in oklab, var(--pomo-accent-soft) 80%, transparent), var(--background) 60%)",
      }}
    >
      <div className="w-full max-w-[520px] flex flex-col items-center gap-6">
        <header className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: "var(--pomo-accent)" }}
              aria-hidden="true"
            />
            <h1 className="text-base font-semibold tracking-tight text-foreground">
              Pomodoro
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setSettingsOpen((v) => !v)}
            aria-expanded={settingsOpen}
            aria-label="Toggle settings"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </header>

        <SettingsPanel
          open={settingsOpen}
          settings={t.settings}
          mode={t.mode}
          onUpdate={t.updateSettings}
          onSwitchMode={t.switchMode}
        />

        <div className="py-2">
          <ProgressRing progress={t.progress}>
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

        <div className="w-full mt-2">
          <SessionHistory history={t.history} />
        </div>
      </div>
    </main>
  );
}
