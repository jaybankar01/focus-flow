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
        className="pomo-cta inline-flex min-w-[170px] items-center justify-center gap-2 rounded-full px-8 py-4 text-[15px] font-semibold tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        style={{
          // @ts-expect-error css var
          "--tw-ring-color": "var(--pomo-accent)",
        }}
        aria-label={primaryLabel}
      >
        <Icon name={status === "running" ? "pause" : "play"} />
        {primaryLabel}
      </button>
      <button
        type="button"
        onClick={onReset}
        disabled={resetDisabled}
        className="pomo-ghost inline-flex min-w-[110px] items-center justify-center gap-2 rounded-full px-6 py-4 text-[15px] font-medium disabled:opacity-35 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Reset timer"
      >
        <Icon name="reset" />
        Reset
      </button>
    </div>
  );
}

function Icon({ name }: { name: "play" | "pause" | "reset" }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "play")
    return (
      <svg {...common}>
        <path d="M6 4.5v15l13-7.5L6 4.5Z" fill="currentColor" stroke="none" />
      </svg>
    );
  if (name === "pause")
    return (
      <svg {...common}>
        <rect x="6" y="5" width="4" height="14" rx="1.2" fill="currentColor" stroke="none" />
        <rect x="14" y="5" width="4" height="14" rx="1.2" fill="currentColor" stroke="none" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}
