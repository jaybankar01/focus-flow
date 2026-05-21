import type { HistoryState } from "../../utils/storage";
import { formatClockTime, formatMMSS } from "../../utils/time";

type Props = { history: HistoryState };

export function SessionHistory({ history }: Props) {
  const sessions = [...history.sessions].reverse();
  const totalMin = Math.round(
    history.sessions.reduce((acc, s) => acc + s.durationSec, 0) / 60,
  );

  return (
    <section
      aria-label="Today's focus sessions"
      className="pomo-glass w-full rounded-2xl p-5"
    >
      <header className="flex items-baseline justify-between mb-3">
        <div className="flex items-baseline gap-2">
          <h2 className="text-sm font-semibold text-foreground tracking-tight">Today</h2>
          <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            sessions
          </span>
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">
          {history.sessions.length} · {totalMin}m focused
        </span>
      </header>

      {sessions.length === 0 ? (
        <div className="py-6 text-center">
          <div
            className="mx-auto mb-2 h-8 w-8 rounded-full border border-dashed"
            style={{ borderColor: "color-mix(in oklab, white 14%, transparent)" }}
            aria-hidden="true"
          />
          <p className="text-sm text-muted-foreground">
            No sessions yet — press Start to begin focusing.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col">
          {sessions.map((s, i) => (
            <li
              key={s.completedAt}
              className="pomo-fade-up group flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 -mx-2 text-sm transition-colors hover:bg-white/[0.04]"
              style={{ animationDelay: `${Math.min(i, 6) * 30}ms` }}
            >
              <span className="flex items-center gap-3 min-w-0">
                <span
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                  style={{
                    background:
                      "linear-gradient(180deg, var(--pomo-focus-edge), var(--pomo-focus))",
                    boxShadow: "0 6px 18px -8px var(--pomo-focus-glow)",
                  }}
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span className="flex flex-col min-w-0">
                  <span className="font-medium text-foreground leading-tight">
                    Focus session
                  </span>
                  <span className="text-[12px] text-muted-foreground leading-tight">
                    <span className="tabular-nums">{formatMMSS(s.durationSec)}</span>
                    <span className="mx-1.5 opacity-50">·</span>
                    <time
                      className="tabular-nums"
                      dateTime={new Date(s.completedAt).toISOString()}
                    >
                      {formatClockTime(s.completedAt)}
                    </time>
                  </span>
                </span>
              </span>
              <span
                className="h-1.5 w-1.5 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: "var(--pomo-focus)" }}
                aria-hidden="true"
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
