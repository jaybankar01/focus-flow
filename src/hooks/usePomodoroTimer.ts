import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_SETTINGS,
  HistoryState,
  Settings,
  loadHistory,
  loadSettings,
  saveHistory,
  saveSettings,
} from "../utils/storage";
import { todayISO } from "../utils/time";
import { useNotificationSound } from "./useNotificationSound";

export type Mode = "focus" | "break";
export type Status = "idle" | "running" | "paused";

export function usePomodoroTimer() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [history, setHistory] = useState<HistoryState>({ date: todayISO(), sessions: [] });
  const [mode, setMode] = useState<Mode>("focus");
  const [status, setStatus] = useState<Status>("idle");
  const [remaining, setRemaining] = useState<number>(DEFAULT_SETTINGS.focusMinutes * 60);
  const deadlineRef = useRef<number | null>(null);
  const playSound = useNotificationSound();

  // Hydrate from localStorage on mount
  useEffect(() => {
    const s = loadSettings();
    const h = loadHistory();
    setSettings(s);
    setHistory(h);
    setRemaining(s.focusMinutes * 60);
  }, []);

  const fullDurationSec = useCallback(
    (m: Mode, s: Settings = settings) =>
      (m === "focus" ? s.focusMinutes : s.breakMinutes) * 60,
    [settings],
  );

  // Roll over history if calendar date changed
  const ensureToday = useCallback(() => {
    const today = todayISO();
    setHistory((h) => {
      if (h.date !== today) {
        const next = { date: today, sessions: [] };
        saveHistory(next);
        return next;
      }
      return h;
    });
  }, []);

  // Complete current session, switch mode, auto-start next
  const completeSession = useCallback(() => {
    const finishedMode = mode;
    const dur = fullDurationSec(finishedMode);
    if (finishedMode === "focus") {
      const today = todayISO();
      setHistory((h) => {
        const base = h.date === today ? h : { date: today, sessions: [] };
        const next: HistoryState = {
          date: today,
          sessions: [...base.sessions, { durationSec: dur, completedAt: Date.now() }],
        };
        saveHistory(next);
        return next;
      });
    }
    playSound(settings.muted);
    const nextMode: Mode = finishedMode === "focus" ? "break" : "focus";
    const nextDur = fullDurationSec(nextMode);
    setMode(nextMode);
    setRemaining(nextDur);
    deadlineRef.current = Date.now() + nextDur * 1000;
    setStatus("running");
  }, [mode, fullDurationSec, playSound, settings.muted]);

  // Ticking interval
  useEffect(() => {
    if (status !== "running") return;
    const tick = () => {
      const dl = deadlineRef.current;
      if (dl == null) return;
      const left = Math.max(0, Math.round((dl - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) completeSession();
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [status, completeSession]);

  // Re-sync on tab visibility
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible" && status === "running" && deadlineRef.current) {
        const left = Math.max(0, Math.round((deadlineRef.current - Date.now()) / 1000));
        setRemaining(left);
        if (left <= 0) completeSession();
      }
      ensureToday();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [status, completeSession, ensureToday]);

  // Controls
  const start = useCallback(() => {
    if (status === "running") return;
    const base = remaining > 0 ? remaining : fullDurationSec(mode);
    deadlineRef.current = Date.now() + base * 1000;
    setRemaining(base);
    setStatus("running");
  }, [status, remaining, mode, fullDurationSec]);

  const pause = useCallback(() => {
    if (status !== "running") return;
    if (deadlineRef.current) {
      const left = Math.max(0, Math.round((deadlineRef.current - Date.now()) / 1000));
      setRemaining(left);
    }
    deadlineRef.current = null;
    setStatus("paused");
  }, [status]);

  const resume = useCallback(() => {
    if (status !== "paused") return;
    deadlineRef.current = Date.now() + remaining * 1000;
    setStatus("running");
  }, [status, remaining]);

  const reset = useCallback(() => {
    deadlineRef.current = null;
    setStatus("idle");
    setRemaining(fullDurationSec(mode));
  }, [mode, fullDurationSec]);

  const switchMode = useCallback(
    (m: Mode) => {
      deadlineRef.current = null;
      setStatus("idle");
      setMode(m);
      setRemaining(fullDurationSec(m));
    },
    [fullDurationSec],
  );

  const updateSettings = useCallback(
    (patch: Partial<Settings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        saveSettings(next);
        // If idle, reflect new duration immediately for current mode
        if (status === "idle") {
          setRemaining((mode === "focus" ? next.focusMinutes : next.breakMinutes) * 60);
        }
        return next;
      });
    },
    [status, mode],
  );

  const total = fullDurationSec(mode);
  const progress = total > 0 ? 1 - remaining / total : 0;

  return {
    mode,
    status,
    remaining,
    total,
    progress,
    settings,
    history,
    start,
    pause,
    resume,
    reset,
    switchMode,
    updateSettings,
  };
}
