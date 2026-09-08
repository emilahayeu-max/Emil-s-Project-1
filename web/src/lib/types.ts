/* Доменные типы «Стоя» — соответствуют ER-модели из docs/03-architecture.md */

export type Locale = "ru" | "en";
export type ThemePref = "light" | "dark" | "system";
export type TaskStatus = "todo" | "doing" | "done";
export type Priority = "P1" | "P2" | "P3";
/** Дихотомия контроля: in — в моей власти, ex — вне моей власти */
export type Control = "in" | "ex";
export type EntryType = "morning" | "evening" | "free" | "practice";
/** Правило повтора задачи (FR-K4) */
export type Recur = "none" | "daily" | "weekly";

export interface Task {
  id: string;
  title: string;
  note?: string;
  priority: Priority;
  control: Control;
  /** Как отвечу — для задач «вне моей власти» */
  reaction?: string;
  /** Кэш-флаг «на сегодня» (пересчитывается из dueDate при загрузке) */
  dueToday: boolean;
  /** Дата срока YYYY-MM-DD (FR-K1, опционально) */
  dueDate?: string;
  recur: Recur;
  status: TaskStatus;
  createdAt: string; // ISO
}

export interface Entry {
  id: string;
  type: EntryType;
  content: string;
  mood: number; // 1..5
  tags: string[];
  practiceId?: string;
  createdAt: string; // ISO
}

/** Лог дня: утренний ритуал и вечерний разбор (аналог day_logs) */
export interface DayLog {
  morningDone: boolean;
  eveningDone: boolean;
  intention: string;
  obstacles: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
}

export interface Settings {
  theme: ThemePref;
}

export interface User {
  email: string;
  name: string;
}

export interface AppState {
  user: User | null;
  settings: Settings;
  tasks: Task[];
  entries: Entry[];
  days: Record<string, DayLog>; // ключ — YYYY-MM-DD
  favoriteQuoteIds: number[];
}

export const defaultDayLog = (): DayLog => ({
  morningDone: false,
  eveningDone: false,
  intention: "",
  obstacles: "",
  q1: "",
  q2: "",
  q3: "",
  q4: "",
});

export const defaultState: AppState = {
  user: null,
  settings: { theme: "light" },
  tasks: [],
  entries: [],
  days: {},
  favoriteQuoteIds: [],
};

export const todayISO = (): string => new Date().toISOString().slice(0, 10);

export const uid = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
