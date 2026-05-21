import { formatMMSS } from "../../utils/time";
import type { Mode, Status } from "../../hooks/usePomodoroTimer";

type Props = {
  remaining: number;
  mode: Mode;
  status: Status;
};

export function TimerDisplay({ remaining, mode, status }: Props) {
  const label =
    status === "paused" ? "Paused" : mode === "focus" ? "Focus" : "Break";

  return (
    <>
      <span
        className="text-xs font-semibold uppercase tracking-[0.25em] mb-2"
        style={{ color: "var(--pomo-accent)" }}
      >
        {label}
      </span>
      <span
        aria-live="polite"
        aria-label={`${label} time remaining ${formatMMSS(remaining)}`}
        className="tabular-nums font-bold text-foreground leading-none"
        style={{ fontSize: "clamp(3rem, 11vw, 4.5rem)", letterSpacing: "-0.02em" }}
      >
        {formatMMSS(remaining)}
      </span>
      <span className="mt-3 text-xs text-muted-foreground">
        {status === "idle" ? "Ready when you are" : status === "paused" ? "Take a breath" : "Stay with it"}
      </span>
    </>
  );
}
