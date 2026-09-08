import { describe, expect, it } from "vitest";
import { QUOTES, quoteOfDay } from "../src/lib/quotes";

describe("quoteOfDay — ротация цитат (FR-T6)", () => {
  it("возвращает цитату из библиотеки", () => {
    const q = quoteOfDay("2026-09-08");
    expect(QUOTES.map((x) => x.id)).toContain(q.id);
  });

  it("детерминирован: одна дата — одна цитата", () => {
    expect(quoteOfDay("2026-09-08").id).toBe(quoteOfDay("2026-09-08").id);
  });

  it("нет повторов в пределах 30-дневного окна", () => {
    const start = new Date("2026-01-01T00:00:00Z");
    const seen = new Set<number>();
    for (let i = 0; i < 30; i++) {
      const d = new Date(start.getTime() + i * 86400000).toISOString().slice(0, 10);
      const id = quoteOfDay(d).id;
      expect(seen.has(id)).toBe(false);
      seen.add(id);
    }
  });

  it("содержит и русскую, и английскую версии каждого текста", () => {
    for (const q of QUOTES) {
      expect(q.text.ru.length).toBeGreaterThan(10);
      expect(q.text.en.length).toBeGreaterThan(10);
      expect(q.author.ru).toBeTruthy();
      expect(q.author.en).toBeTruthy();
    }
  });
});
