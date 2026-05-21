import { describe, it, expect } from "vitest";
import { formatMMSS, todayISO, formatClockTime } from "../time";

describe("Time Utilities", () => {
  describe("formatMMSS", () => {
    it("should format zero seconds correctly", () => {
      expect(formatMMSS(0)).toBe("00:00");
    });

    it("should format single digit seconds correctly", () => {
      expect(formatMMSS(5)).toBe("00:05");
    });

    it("should format double digit seconds correctly", () => {
      expect(formatMMSS(45)).toBe("00:45");
    });

    it("should format minutes correctly", () => {
      expect(formatMMSS(60)).toBe("01:00");
      expect(formatMMSS(150)).toBe("02:30");
    });

    it("should format larger times correctly", () => {
      expect(formatMMSS(3599)).toBe("59:59");
      expect(formatMMSS(3600)).toBe("60:00");
    });

    it("should handle negative numbers gracefully by clamping to zero", () => {
      expect(formatMMSS(-10)).toBe("00:00");
    });
  });

  describe("todayISO", () => {
    it("should return correct YYYY-MM-DD format for a given date", () => {
      const testDate = new Date("2026-05-22T12:00:00");
      expect(todayISO(testDate)).toBe("2026-05-22");
    });

    it("should use the current date by default", () => {
      const now = new Date();
      const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      expect(todayISO()).toBe(expected);
    });
  });

  describe("formatClockTime", () => {
    it("should format timestamp to clock time correctly", () => {
      const timestamp = new Date("2026-05-22T15:42:00").getTime();
      const formatted = formatClockTime(timestamp);
      // Depending on locale/runner environment settings, let's verify format matching a clock pattern
      expect(formatted).toMatch(/^(?:[0-9]|1[0-2]):[0-5][0-9]\s*(?:AM|PM|am|pm)$/);
    });
  });
});
