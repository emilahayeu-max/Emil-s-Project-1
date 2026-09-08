"use client";

/**
 * Хранилище приложения.
 *
 * Уровень доступа к данным реализован как АДАПТЕР: сейчас работает
 * LocalAdapter (localStorage, демо-режим — песочница/предпросмотр),
 * а в боевом режиме подключается SupabaseAdapter по env-переменным
 * (NEXT_PUBLIC_SUPABASE_URL + ANON_KEY) — см. docs/07-backend.md.
 * Доменные типы и действия не меняются при смене адаптера.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AppState,
  DayLog,
  defaultDayLog,
  defaultState,
  Entry,
  Settings,
  Task,
  todayISO,
  uid,
  User,
} from "./types";
import {
  makeTask,
  nextOccurrence,
  NewTaskInput,
  refreshDue,
  NEXT_STATUS,
} from "./tasks";

const STORAGE_KEY = "stoa:state:v1";
const USERS_KEY = "stoa:users:v1";

/* ---------- LocalAdapter (демо-режим) ---------- */

interface StoredUser extends User {
  pass: string; // демо-хэш (djb2) — только для прототипа, не для продакшена
}

function demoHash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(16);
}

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? { ...fallback, ...(JSON.parse(raw) as T) } : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* переполнение хранилища — молча пропускаем в демо */
  }
}

/* ---------- Контекст ---------- */

export interface StoreValue {
  state: AppState;
  ready: boolean;
  todayKey: string;
  day: DayLog;
  /* аккаунт */
  signIn: (email: string, password: string) => string | null;
  signUp: (name: string, email: string, password: string) => string | null;
  signOut: () => void;
  /* настройки */
  setTheme: (theme: Settings["theme"]) => void;
  /* цикл дня */
  updateDay: (patch: Partial<DayLog>) => void;
  finishMorning: () => void;
  saveEvening: () => void;
  /* задачи */
  addTask: (t: NewTaskInput) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  cycleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  /* дневник */
  addEntry: (e: { type: Entry["type"]; content: string; mood: number; tags: string[]; practiceId?: string }) => void;
  deleteEntry: (id: string) => void;
  /* цитаты */
  toggleFavoriteQuote: (id: number) => void;
  /* данные */
  exportData: () => void;
  resetData: () => void;
  deleteAccount: () => void;
  seedDemo: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [ready, setReady] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    const stored = loadJSON<AppState>(STORAGE_KEY, defaultState);
    // «подкатка» сроков: задачи со сроком <= сегодня оживают в «Сегодня»
    stored.tasks = refreshDue(stored.tasks, todayISO());
    setState(stored);
    loadedRef.current = true;
    setReady(true);
  }, []);

  useEffect(() => {
    if (loadedRef.current) saveJSON(STORAGE_KEY, state);
  }, [state]);

  /* Применение темы к <html data-theme> (токены из globals.css) */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const resolved =
        state.settings.theme === "system"
          ? mq.matches
            ? "dark"
            : "light"
          : state.settings.theme;
      document.documentElement.dataset.theme = resolved;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [state.settings.theme]);

  const todayKey = todayISO();

  const signIn = useCallback((email: string, password: string): string | null => {
    const users = loadJSON<Record<string, StoredUser>>(USERS_KEY, {});
    const user = users[email.toLowerCase()];
    if (!user || user.pass !== demoHash(password)) return "auth.errorCredentials";
    setState((s) => ({ ...s, user: { email: user.email, name: user.name } }));
    return null;
  }, []);

  const signUp = useCallback((name: string, email: string, password: string): string | null => {
    const users = loadJSON<Record<string, StoredUser>>(USERS_KEY, {});
    const key = email.toLowerCase();
    if (users[key]) return "auth.errorExists";
    const user: StoredUser = { name, email, pass: demoHash(password) };
    users[key] = user;
    saveJSON(USERS_KEY, users);
    setState((s) => ({ ...s, user: { email: user.email, name: user.name } }));
    return null;
  }, []);

  const signOut = useCallback(() => setState((s) => ({ ...s, user: null })), []);

  const setTheme = useCallback((theme: Settings["theme"]) => {
    setState((s) => ({ ...s, settings: { ...s.settings, theme } }));
  }, []);

  const updateDay = useCallback((patch: Partial<DayLog>) => {
    setState((s) => ({
      ...s,
      days: {
        ...s.days,
        [todayISO()]: { ...(s.days[todayISO()] ?? defaultDayLog()), ...patch },
      },
    }));
  }, []);

  const finishMorning = useCallback(() => {
    updateDay({ morningDone: true });
  }, [updateDay]);

  const saveEvening = useCallback(() => {
    setState((s) => {
      const k = todayISO();
      const day = { ...(s.days[k] ?? defaultDayLog()), eveningDone: true };
      const content = [day.q1, day.q2, day.q3, day.q4]
        .map((q, i) => q.trim() && `${["—", "—", "—", "—"][i]} ${q.trim()}`)
        .filter(Boolean)
        .join("\n");
      const entry: Entry = {
        id: uid(),
        type: "evening",
        content: content || "—",
        mood: 3,
        tags: ["разбор"],
        createdAt: new Date().toISOString(),
      };
      return {
        ...s,
        days: { ...s.days, [k]: day },
        entries: [entry, ...s.entries],
      };
    });
  }, []);

  const addTask = useCallback((input: NewTaskInput) => {
    setState((s) => ({ ...s, tasks: [makeTask(input), ...s.tasks] }));
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  }, []);

  const cycleTask = useCallback((id: string) => {
    setState((s) => {
      const task = s.tasks.find((t) => t.id === id);
      if (!task) return s;
      const status = NEXT_STATUS[task.status];
      let tasks = s.tasks.map((t) => (t.id === id ? { ...t, status } : t));
      // Повторяющаяся задача: при завершении создаём следующее вхождение (FR-K4)
      if (status === "done" && task.recur && task.recur !== "none") {
        const next = nextOccurrence(task);
        if (next) tasks = [makeTask(next), ...tasks];
      }
      return { ...s, tasks };
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
  }, []);

  const addEntry = useCallback(
    (e: { type: Entry["type"]; content: string; mood: number; tags: string[]; practiceId?: string }) => {
      setState((s) => ({
        ...s,
        entries: [{ id: uid(), createdAt: new Date().toISOString(), ...e }, ...s.entries],
      }));
    },
    []
  );

  const deleteEntry = useCallback((id: string) => {
    setState((s) => ({ ...s, entries: s.entries.filter((e) => e.id !== id) }));
  }, []);

  const toggleFavoriteQuote = useCallback((id: number) => {
    setState((s) => ({
      ...s,
      favoriteQuoteIds: s.favoriteQuoteIds.includes(id)
        ? s.favoriteQuoteIds.filter((x) => x !== id)
        : [...s.favoriteQuoteIds, id],
    }));
  }, []);

  const exportData = useCallback(() => {
    const blob = new Blob(
      [JSON.stringify({ exportedAt: new Date().toISOString(), ...state }, null, 2)],
      { type: "application/json" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `stoa-export-${todayISO()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [state]);

  const resetData = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(USERS_KEY);
    }
    setState(defaultState);
  }, []);

  /** UC-10 / US-35: удаление аккаунта со всеми данными */
  const deleteAccount = useCallback(() => {
    resetData();
  }, [resetData]);

  /** Демо-данные для презентации: 3 дня активности, записи, задачи, избранные цитаты */
  const seedDemo = useCallback(() => {
    const d = (offset: number) => {
      const dt = new Date();
      dt.setDate(dt.getDate() - offset);
      return dt.toISOString().slice(0, 10);
    };
    const past = (offset: number) => {
      const dt = new Date();
      dt.setDate(dt.getDate() - offset);
      return dt.toISOString();
    };
    const days: Record<string, DayLog> = {
      [d(2)]: {
        ...defaultDayLog(),
        morningDone: true,
        eveningDone: true,
        intention: "Спокойный день без гонки.",
        q1: "Закончил проектную часть.",
        q4: "Вечерний чай",
      },
      [d(1)]: {
        ...defaultDayLog(),
        morningDone: true,
        eveningDone: true,
        intention: "Один шаг к цели — уже успех.",
        q2: "Ответ партнёра — вне контроля.",
        q3: "Пауза перед ответом работает.",
      },
    };
    const tasks: Task[] = [
      makeTask({ title: "Прочитать главу Сенеки", priority: "P3", control: "in", dueToday: true, dueDate: todayISO(), recur: "daily" }, new Date(past(0))),
      makeTask({ title: "Подготовить презентацию", priority: "P1", control: "in", dueToday: true, dueDate: todayISO() }, new Date(past(0))),
      makeTask({ title: "Ответ партнёра по проекту", priority: "P2", control: "ex", reaction: "Напомнить один раз и отпустить", dueToday: true, dueDate: todayISO() }, new Date(past(0))),
      makeTask({ title: "Спортзал 30 минут", priority: "P2", control: "in", dueToday: false, dueDate: d(-1) }, new Date(past(1))),
    ];
    const entries: Entry[] = [
      {
        id: uid(),
        type: "practice",
        content: "Дихотомия контроля: три тревоги из четырёх — вне моей власти. Стало заметно легче.",
        mood: 4,
        tags: ["практика"],
        practiceId: "dichotomy-of-control",
        createdAt: past(1),
      },
      {
        id: uid(),
        type: "evening",
        content: "— Завершил черновик\n— Погода — вне контроля\n— План Б работает\n— За поддержку близких",
        mood: 4,
        tags: ["разбор"],
        createdAt: past(1),
      },
      {
        id: uid(),
        type: "free",
        content: "Поймал себя на тревоге из-за чужого мнения. Суждения других — не в моей власти.",
        mood: 3,
        tags: ["мысли"],
        createdAt: past(2),
      },
    ];
    setState((s) => ({
      ...s,
      days: { ...s.days, ...days },
      tasks,
      entries,
      favoriteQuoteIds: [...new Set([...s.favoriteQuoteIds, 0, 6])],
    }));
  }, []);

  const day = state.days[todayKey] ?? defaultDayLog();

  const value = useMemo<StoreValue>(
    () => ({
      state,
      ready,
      todayKey,
      day,
      signIn,
      signUp,
      signOut,
      setTheme,
      updateDay,
      finishMorning,
      saveEvening,
      addTask,
      updateTask,
      cycleTask,
      deleteTask,
      addEntry,
      deleteEntry,
      toggleFavoriteQuote,
      exportData,
      resetData,
      deleteAccount,
      seedDemo,
    }),
    [
      state,
      ready,
      todayKey,
      day,
      signIn,
      signUp,
      signOut,
      setTheme,
      updateDay,
      finishMorning,
      saveEvening,
      addTask,
      updateTask,
      cycleTask,
      deleteTask,
      addEntry,
      deleteEntry,
      toggleFavoriteQuote,
      exportData,
      resetData,
      deleteAccount,
      seedDemo,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
