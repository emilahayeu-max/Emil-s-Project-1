import { describe, expect, it } from "vitest";
import { computeStreak } from "../src/lib/streak";

describe("computeStreak — мягкий стрик (US-29, FR-P1)", () => {
  it("считает непрерывную серию до сегодня", () => {
    const days = new Set(["2026-09-06", "2026-09-07", "2026-09-08"]);
    expect(computeStreak(days, "2026-09-08")).toEqual({ streak: 3, totalDays: 3 });
  });

  it("стрик жив, если активность была вчера (сегодня ещё не закончился)", () => {
    const days = new Set(["2026-09-05", "2026-09-06", "2026-09-07"]);
    expect(computeStreak(days, "2026-09-08")).toEqual({ streak: 3, totalDays: 3 });
  });

  it("пропуск дня обнуляет стрик, но сохраняет общий счётчик", () => {
    const days = new Set(["2026-09-01", "2026-09-02", "2026-09-08"]);
    const r = computeStreak(days, "2026-09-08");
    expect(r.streak).toBe(1);
    expect(r.totalDays).toBe(3);
  });

  it("нет активности вообще", () => {
    expect(computeStreak(new Set(), "2026-09-08")).toEqual({ streak: 0, totalDays: 0 });
  });

  it("игнорирует даты из будущего", () => {
    const days = new Set(["2026-09-08", "2026-09-12"]);
    expect(computeStreak(days, "2026-09-08").streak).toBe(1);
  });
});
