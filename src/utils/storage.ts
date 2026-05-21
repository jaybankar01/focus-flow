import { todayISO } from "./time";

export type SessionRecord = {
  durationSec: number;
  completedAt: number;
};

export type HistoryState = {
  date: string;
  sessions: SessionRecord[];
};

export type Settings = {
  focusMinutes: number;
  breakMinutes: number;
  muted: boolean;
};

export const HISTORY_KEY = "pomodoro.history";
export const SETTINGS_KEY = "pomodoro.settings";

export const DEFAULT_SETTINGS: Settings = {
  focusMinutes: 25,
  breakMinutes: 5,
  muted: false,
};

export function loadHistory(): HistoryState {
  if (typeof window === "undefined") return { date: todayISO(), sessions: [] };
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return { date: todayISO(), sessions: [] };
    const parsed = JSON.parse(raw) as HistoryState;
    if (parsed.date !== todayISO()) return { date: todayISO(), sessions: [] };
    return parsed;
  } catch {
    return { date: todayISO(), sessions: [] };
  }
}

export function saveHistory(h: HistoryState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
}

export function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      focusMinutes: clampMin(Number(parsed.focusMinutes) || 25, 1, 120),
      breakMinutes: clampMin(Number(parsed.breakMinutes) || 5, 1, 60),
      muted: Boolean(parsed.muted),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(s: Settings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

function clampMin(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
