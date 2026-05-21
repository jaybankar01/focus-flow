import { useCallback, useRef } from "react";

export function useNotificationSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const play = useCallback((muted = false) => {
    if (muted || typeof window === "undefined") return;
    try {
      if (!ctxRef.current) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        ctxRef.current = new AC();
      }
      const ctx = ctxRef.current!;
      if (ctx.state === "suspended") void ctx.resume();
      const now = ctx.currentTime;
      const tones = [880, 1175, 1568];
      tones.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        const start = now + i * 0.14;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.18, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
        osc.connect(gain).connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.3);
      });
    } catch {
      // ignore
    }
  }, []);

  return play;
}
