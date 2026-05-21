import type { Status } from "../../hooks/usePomodoroTimer";

type Props = {
  status: Status;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
};

export function Controls({ status, onStart, onPause, onResume, onReset }: Props) {
  const primaryLabel = status === "running" ? "Pause" : status === "paused" ? "Resume" : "Start";
  const onPrimary = status === "running" ? onPause : status === "paused" ? onResume : onStart;
  const resetDisabled = status === "idle";

  return (
    <div className="flex items-center justify-center gap-3 w-full">
      <button
        type="button"
        onClick={onPrimary}
        className="inline-flex min-w-[140px] items-center justify-center rounded-full px-7 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        style={{
          backgroundColor: "var(--pomo-accent)",
          boxShadow: "0 10px 30px -10px color-mix(in oklab, var(--pomo-accent) 60%, transparent)",
          // @ts-expect-error css var
          "--tw-ring-color": "var(--pomo-accent)",
        }}
        aria-label={primaryLabel}
      >
        {primaryLabel}
      </button>
      <button
        type="button"
        onClick={onReset}
        disabled={resetDisabled}
        className="inline-flex min-w-[100px] items-center justify-center rounded-full border border-border bg-background px-5 py-3.5 text-base font-medium text-foreground transition-all hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Reset timer"
      >
        Reset
      </button>
    </div>
  );
}
