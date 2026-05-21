import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

type Props = {
  progress: number; // 0..1
  status: "idle" | "running" | "paused";
  children?: ReactNode;
};

export function ProgressRing({ progress, status, children }: Props) {
  const size = 320;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(1, Math.max(0, progress));
  const offset = c * (1 - clamped);

  // Pulse on completion (when progress crosses back from ~1 to ~0)
  const wrapRef = useRef<HTMLDivElement>(null);
  const prev = useRef(progress);
  useEffect(() => {
    if (prev.current > 0.95 && progress < 0.05 && wrapRef.current) {
      const el = wrapRef.current;
      el.classList.remove("pomo-pop");
      void el.offsetWidth;
      el.classList.add("pomo-pop");
    }
    prev.current = progress;
  }, [progress]);

  return (
    <div
      ref={wrapRef}
      data-status={status}
      className="relative pomo-glow"
      style={{ width: "clamp(260px, 74vw, 380px)", aspectRatio: "1 / 1" }}
    >
      {/* Rotating conic shimmer */}
      <div className="pomo-shimmer" aria-hidden="true" />

      <svg
        viewBox={`0 0 ${size} ${size}`}
        className={`relative w-full h-full -rotate-90 ${status === "running" ? "pomo-breathe" : ""}`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="pomo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--pomo-accent)" />
            <stop offset="100%" stopColor="var(--pomo-accent-edge)" />
          </linearGradient>
          <radialGradient id="pomo-inner" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="transparent" />
            <stop offset="100%" stopColor="var(--pomo-accent-soft)" />
          </radialGradient>
          <filter id="pomo-edge-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Inner soft fill for depth */}
        <circle cx={size / 2} cy={size / 2} r={r - stroke} fill="url(#pomo-inner)" />

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="color-mix(in oklab, white 6%, transparent)"
          strokeWidth={stroke}
        />

        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#pomo-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          filter="url(#pomo-edge-glow)"
          style={{
            transition: "stroke-dashoffset 900ms cubic-bezier(0.4, 0, 0.2, 1), stroke 600ms ease",
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}
