import { describe, expect, it } from "vitest";
import { isReminderWindow, parseHM } from "../src/lib/reminders";

describe("parseHM", () => {
  it("разбирает корректное время", () => {
    expect(parseHM("08:00")).toEqual({ h: 8, m: 0 });
    expect(parseHM("21:30")).toEqual({ h: 21, m: 30 });
    expect(parseHM("0:05")).toEqual({ h: 0, m: 5 });
  });

  it("отклоняет некорректное время", () => {
    expect(parseHM("25:00")).toBeNull();
    expect(parseHM("12:60")).toBeNull();
    expect(parseHM("8.00")).toBeNull();
    expect(parseHM("")).toBeNull();
  });
});

describe("isReminderWindow — окно напоминания (FR-S3)", () => {
  const at = (h: number, m: number) => new Date(2026, 8, 8, h, m, 0);

  it("срабатывает в начале окна", () => {
    expect(isReminderWindow(at(8, 0), "08:00")).toBe(true);
  });

  it("срабатывает внутри 15-минутного окна", () => {
    expect(isReminderWindow(at(8, 14), "08:00")).toBe(true);
  });

  it("не срабатывает после окна", () => {
    expect(isReminderWindow(at(8, 15), "08:00")).toBe(false);
  });

  it("не срабатывает до времени напоминания", () => {
    expect(isReminderWindow(at(7, 59), "08:00")).toBe(false);
  });

  it("вечернее напоминание 21:00", () => {
    expect(isReminderWindow(at(21, 5), "21:00")).toBe(true);
    expect(isReminderWindow(at(20, 45), "21:00")).toBe(false);
  });

  it("невалидное время → false (не падает)", () => {
    expect(isReminderWindow(at(8, 5), "")).toBe(false);
  });
});
