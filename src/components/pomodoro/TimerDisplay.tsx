import { formatMMSS } from "../../utils/time";
import type { Mode, Status } from "../../hooks/usePomodoroTimer";

type Props = {
  remaining: number;
  mode: Mode;
  status: Status;
};

export function TimerDisplay({ remaining, mode, status }: Props) {
  const label = status === "paused" ? "Paused" : mode === "focus" ? "Focus" : "Break";
  const sub =
    status === "idle"
      ? "Ready when you are"
      : status === "paused"
        ? "Take a breath"
        : mode === "focus"
          ? "Stay with it"
          : "Recharge";

  return (
    <>
      <span
        className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-3 transition-colors duration-500 flex items-center gap-2"
        style={{ color: "var(--pomo-accent-edge)" }}
      >
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{
            backgroundColor: "var(--pomo-accent)",
            boxShadow: "0 0 12px var(--pomo-accent-glow)",
          }}
        />
        {label}
      </span>
      <span
        aria-live="polite"
        aria-label={`${label} time remaining ${formatMMSS(remaining)}`}
        className="tabular-nums font-semibold text-foreground leading-none"
        style={{
          fontSize: "clamp(3.5rem, 13vw, 5.5rem)",
          letterSpacing: "-0.045em",
          fontVariantNumeric: "tabular-nums",
          textShadow: "0 2px 30px color-mix(in oklab, var(--pomo-accent) 25%, transparent)",
        }}
      >
        {formatMMSS(remaining)}
      </span>
      <span className="mt-4 text-[11px] tracking-wide text-muted-foreground transition-opacity duration-500">
        {sub}
      </span>
    </>
  );
}
