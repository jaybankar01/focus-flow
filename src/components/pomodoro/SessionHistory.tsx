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
      className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      <header className="flex items-baseline justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">Today</h2>
        <span className="text-xs text-muted-foreground">
          {history.sessions.length} session{history.sessions.length === 1 ? "" : "s"}
          {totalMin > 0 ? ` · ${totalMin}m` : ""}
        </span>
      </header>

      {sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          No completed focus sessions yet. Press Start to begin.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {sessions.map((s) => (
            <li
              key={s.completedAt}
              className="flex items-center justify-between py-2.5 text-sm"
            >
              <span className="flex items-center gap-2 text-foreground">
                <span
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{ backgroundColor: "var(--pomo-focus)" }}
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span className="tabular-nums font-medium">{formatMMSS(s.durationSec)}</span>
                <span className="text-muted-foreground">focus</span>
              </span>
              <time className="text-muted-foreground tabular-nums" dateTime={new Date(s.completedAt).toISOString()}>
                {formatClockTime(s.completedAt)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
