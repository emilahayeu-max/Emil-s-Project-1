import { describe, expect, it } from "vitest";
import {
  makeTask,
  nextOccurrence,
  refreshDue,
  NEXT_STATUS,
} from "../src/lib/tasks";
import { Task } from "../src/lib/types";

const base = {
  title: "Прочитать главу",
  priority: "P2" as const,
  control: "in" as const,
  dueToday: true,
};

describe("makeTask", () => {
  it("создаёт задачу с дефолтами (UT-03)", () => {
    const t = makeTask(base);
    expect(t.title).toBe("Прочитать главу");
    expect(t.status).toBe("todo");
    expect(t.recur).toBe("none");
    expect(t.id).toBeTruthy();
  });

  it("валидирует вход: пустое название не принимается вызывающим кодом", () => {
    expect(makeTask({ ...base, title: "" }).title).toBe("");
    // Сама валидация — на уровне UI (tasks/page), здесь фиксируем контракт:
    // вызов с пустой строкой не падает, но UI не должен его отправлять.
  });
});

describe("nextOccurrence — повторяющиеся задачи (FR-K4)", () => {
  const task: Task = makeTask({ ...base, recur: "daily" });

  it("daily → завтра", () => {
    const done = new Date("2026-09-08T18:00:00Z");
    const next = nextOccurrence(task, done)!;
    expect(next.dueDate).toBe("2026-09-09");
    expect(next.dueToday).toBe(false);
    expect(next.recur).toBe("daily");
    expect(next.title).toBe(task.title);
  });

  it("weekly → через 7 дней", () => {
    const t = makeTask({ ...base, recur: "weekly" });
    const next = nextOccurrence(t, new Date("2026-09-08T18:00:00Z"))!;
    expect(next.dueDate).toBe("2026-09-15");
  });

  it("none → null (повтора нет)", () => {
    const t = makeTask(base);
    expect(nextOccurrence(t)).toBeNull();
  });

  it("переносит реакцию «как отвечу» (UT-04)", () => {
    const t = makeTask({ ...base, control: "ex", reaction: "Напомнить и отпустить", recur: "daily" });
    const next = nextOccurrence(t)!;
    expect(next.reaction).toBe("Напомнить и отпустить");
    expect(next.control).toBe("ex");
  });
});

describe("refreshDue — «подкатка» сроков при загрузке", () => {
  it("просроченная задача становится «на сегодня»", () => {
    const t = makeTask({ ...base, dueToday: false, dueDate: "2026-09-07" });
    const [r] = refreshDue([t], "2026-09-08");
    expect(r.dueToday).toBe(true);
  });

  it("задача на завтра не появляется сегодня", () => {
    const t = makeTask({ ...base, dueToday: false, dueDate: "2026-09-09" });
    const [r] = refreshDue([t], "2026-09-08");
    expect(r.dueToday).toBe(false);
  });

  it("выполненная задача не «оживает»", () => {
    const t: Task = { ...makeTask({ ...base, dueToday: false, dueDate: "2026-09-01" }), status: "done" };
    const [r] = refreshDue([t], "2026-09-08");
    expect(r.dueToday).toBe(false);
    expect(r.status).toBe("done");
  });
});

describe("NEXT_STATUS — диаграмма состояний (UT-02)", () => {
  it("todo → doing → done → todo", () => {
    expect(NEXT_STATUS.todo).toBe("doing");
    expect(NEXT_STATUS.doing).toBe("done");
    expect(NEXT_STATUS.done).toBe("todo");
  });
});
