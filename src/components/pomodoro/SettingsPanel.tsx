import type { Settings } from "../../utils/storage";
import type { Mode } from "../../hooks/usePomodoroTimer";

type Props = {
  open: boolean;
  settings: Settings;
  mode: Mode;
  onUpdate: (patch: Partial<Settings>) => void;
  onSwitchMode: (m: Mode) => void;
};

export function SettingsPanel({ open, settings, mode, onUpdate, onSwitchMode }: Props) {
  return (
    <div
      className="grid w-full overflow-hidden transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
      style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0, marginTop: open ? "0.25rem" : 0 }}
      aria-hidden={!open}
    >
      <div className="min-h-0">
        <div className="pomo-glass rounded-2xl p-5">
          <div className="flex items-center gap-1 mb-4 rounded-full bg-white/[0.04] p-1 border border-white/[0.06]">
            <ModeTab active={mode === "focus"} onClick={() => onSwitchMode("focus")} label="Focus" />
            <ModeTab active={mode === "break"} onClick={() => onSwitchMode("break")} label="Break" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Focus minutes"
              value={settings.focusMinutes}
              min={1}
              max={120}
              onChange={(v) => onUpdate({ focusMinutes: v })}
            />
            <NumberField
              label="Break minutes"
              value={settings.breakMinutes}
              min={1}
              max={60}
              onChange={(v) => onUpdate({ breakMinutes: v })}
            />
          </div>

          <label className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-white/[0.04] border border-white/[0.06] px-3.5 py-2.5 cursor-pointer">
            <span className="text-sm font-medium text-foreground">Notification sound</span>
            <input
              type="checkbox"
              checked={!settings.muted}
              onChange={(e) => onUpdate({ muted: !e.target.checked })}
              className="h-4 w-4 accent-[var(--pomo-accent)]"
              aria-label="Toggle notification sound"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

function ModeTab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        active
          ? "text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
      style={
        active
          ? {
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--pomo-accent) 35%, transparent), color-mix(in oklab, var(--pomo-accent) 18%, transparent))",
              boxShadow:
                "inset 0 1px 0 color-mix(in oklab, white 14%, transparent), 0 6px 18px -10px var(--pomo-accent-glow)",
            }
          : undefined
      }
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <div className="flex items-center rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="h-11 w-11 text-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (Number.isFinite(n)) onChange(Math.min(max, Math.max(min, Math.round(n))));
          }}
          className="w-full bg-transparent text-center text-base font-semibold text-foreground tabular-nums focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="h-11 w-11 text-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </label>
  );
}
