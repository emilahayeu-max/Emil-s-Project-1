/**
 * Чистая бизнес-логика задач: статусы, повторы, сроки.
 * Покрыта юнит-тестами (tests/tasks.test.ts) — UT-02, UT-04, FR-K4.
 */

import {
  Control,
  Priority,
  Recur,
  Task,
  TaskStatus,
  uid,
} from "./types";

export const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  todo: "doing",
  doing: "done",
  done: "todo",
};

export interface NewTaskInput {
  title: string;
  note?: string;
  priority: Priority;
  control: Control;
  reaction?: string;
  dueToday: boolean;
  dueDate?: string;
  recur?: Recur;
}

export function makeTask(input: NewTaskInput, now = new Date()): Task {
  return {
    id: uid(),
    status: "todo",
    createdAt: now.toISOString(),
    title: input.title.trim(),
    note: input.note?.trim() || undefined,
    priority: input.priority,
    control: input.control,
    reaction: input.reaction?.trim() || undefined,
    dueToday: input.dueToday,
    dueDate: input.dueDate,
    recur: input.recur ?? "none",
  };
}

/**
 * Следующее вхождение повторяющейся задачи (FR-K4):
 * daily → завтра, weekly → через 7 дней. Для «none» — null.
 */
export function nextOccurrence(
  task: Task,
  doneAt = new Date()
): NewTaskInput | null {
  if (!task.recur || task.recur === "none") return null;
  const next = new Date(doneAt.getTime());
  next.setDate(next.getDate() + (task.recur === "daily" ? 1 : 7));
  return {
    title: task.title,
    note: task.note,
    priority: task.priority,
    control: task.control,
    reaction: task.reaction,
    dueToday: false,
    dueDate: next.toISOString().slice(0, 10),
    recur: task.recur,
  };
}

/**
 * «Подкатка» сроков при загрузке приложения:
 * у невыполненных задач с dueDate <= сегодня включается dueToday
 * (повторяющиеся задачи сами «оживают» каждый день).
 */
export function refreshDue(tasks: Task[], todayISO: string): Task[] {
  return tasks.map((t) => {
    if (t.dueToday || t.status === "done") return t;
    if (t.dueDate && t.dueDate <= todayISO) return { ...t, dueToday: true };
    return t;
  });
}

export function isDueToday(task: Task, todayISO: string): boolean {
  return task.dueToday || (!!task.dueDate && task.dueDate === todayISO);
}
