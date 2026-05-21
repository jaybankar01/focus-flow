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
      className="grid w-full overflow-hidden transition-[grid-template-rows,opacity,margin] duration-500 ease-out"
      style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0, marginTop: open ? "0.5rem" : 0 }}
      aria-hidden={!open}
    >
      <div className="min-h-0">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 rounded-full bg-muted p-1">
            <ModeTab active={mode === "focus"} onClick={() => onSwitchMode("focus")} label="Focus" />
            <ModeTab active={mode === "break"} onClick={() => onSwitchMode("break")} label="Break" />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

          <label className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-3 py-2 cursor-pointer">
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
      className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
      }`}
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
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center rounded-xl border border-border bg-background">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="h-10 w-10 text-lg text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-l-xl"
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
          className="h-10 w-10 text-lg text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-r-xl"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </label>
  );
}
