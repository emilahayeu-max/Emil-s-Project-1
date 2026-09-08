import { describe, expect, it } from "vitest";
import { mapTask, mapEntry, mapDayLog } from "../src/lib/adapters/supabase";

const TODAY = "2026-09-08";

describe("mapTask — строка БД → Task", () => {
  it("маппит основные поля", () => {
    const t = mapTask(
      {
        id: "t1",
        title: "Отчёт",
        note: null,
        priority: "P1",
        control: "ex",
        reaction: "Отпустить",
        due_date: null,
        recur: "daily",
        status: "doing",
        created_at: "2026-09-08T10:00:00Z",
      },
      TODAY
    );
    expect(t.id).toBe("t1");
    expect(t.priority).toBe("P1");
    expect(t.control).toBe("ex");
    expect(t.reaction).toBe("Отпустить");
    expect(t.dueToday).toBe(false);
    expect(t.recur).toBe("daily");
    expect(t.status).toBe("doing");
  });

  it("dueToday = true, когда срок <= сегодня", () => {
    const overdue = mapTask({ id: "a", title: "x", due_date: "2026-09-01" }, TODAY);
    const today = mapTask({ id: "b", title: "y", due_date: TODAY }, TODAY);
    const future = mapTask({ id: "c", title: "z", due_date: "2026-09-09" }, TODAY);
    expect(overdue.dueToday).toBe(true);
    expect(today.dueToday).toBe(true);
    expect(future.dueToday).toBe(false);
  });
});

describe("mapEntry — строка БД → Entry", () => {
  it("маппит тип, теги и практику", () => {
    const e = mapEntry({
      id: "e1",
      type: "practice",
      content: "Текст",
      mood: 4,
      tags: ["практика", "фокус"],
      practice_id: "dichotomy-of-control",
      created_at: "2026-09-07T20:00:00Z",
    });
    expect(e.type).toBe("practice");
    expect(e.mood).toBe(4);
    expect(e.tags).toEqual(["практика", "фокус"]);
    expect(e.practiceId).toBe("dichotomy-of-control");
  });

  it("пустая практика → undefined", () => {
    const e = mapEntry({ id: "e2", type: "free", content: "x", practice_id: null });
    expect(e.practiceId).toBeUndefined();
  });
});

describe("mapDayLog — строка БД → DayLog", () => {
  it("маппит флаги ритуалов и ответы разбора", () => {
    const d = mapDayLog({
      day: TODAY,
      morning_done: true,
      evening_done: false,
      intention: "Намерение",
      obstacles: "",
      q1: "Сделал",
      q2: "",
      q3: "Урок",
      q4: "",
    });
    expect(d.morningDone).toBe(true);
    expect(d.eveningDone).toBe(false);
    expect(d.intention).toBe("Намерение");
    expect(d.q3).toBe("Урок");
  });
});
