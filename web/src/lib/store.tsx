"use client";

/**
 * Хранилище приложения (единая точка данных для UI).
 *
 * Работает поверх DataAdapter (lib/adapter.ts):
 *  - без ключей Supabase → LocalAdapter (демо-режим, localStorage);
 *  - с ключами (NEXT_PUBLIC_SUPABASE_URL + ANON_KEY) → SupabaseAdapter (облако).
 *
 * Принципы:
 *  - гидратация: при старте читаем сессию и данные из адаптера;
 *  - оптимистичные обновления: UI меняется сразу, запись в адаптер — фоном;
 *  - ошибки записи попадают в state.syncError и показываются баннером;
 *  - в демо-режиме всё состояние дополнительно автосохраняется в localStorage.
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
import { createAdapter, DataAdapter } from "./adapter";
import {
  makeTask,
  nextOccurrence,
  NewTaskInput,
  refreshDue,
  NEXT_STATUS,
} from "./tasks";

/* ---------- Контекст ---------- */

export interface StoreValue {
  state: AppState;
  ready: boolean;
  todayKey: string;
  day: DayLog;
  /** какой источник данных активен: облако или демо */
  backend: DataAdapter["kind"];
  syncError: string | null;
  /* аккаунт */
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (name: string, email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  /* настройки */
  setTheme: (theme: Settings["theme"]) => void;
  setSettings: (patch: Partial<Settings>) => void;
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
  deleteAccount: () => Promise<void>;
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
  const [syncError, setSyncError] = useState<string | null>(null);
  const adapter = useMemo(() => createAdapter(), []);
  const stateRef = useRef(state);
  stateRef.current = state;
  const hydratedRef = useRef(false);

  /* ---------- Гидратация из адаптера ---------- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const user = await adapter.getSession();
        if (!user) {
          setReady(true);
          return;
        }
        const data = await adapter.loadAll();
        if (cancelled) return;
        setState({
          user,
          settings: data.settings,
          tasks: refreshDue(data.tasks, todayISO()),
          entries: data.entries,
          days: data.days,
          favoriteQuoteIds: data.favoriteQuoteIds,
        });
        hydratedRef.current = true;
      } catch (e) {
        console.error("stoa: ошибка загрузки данных", e);
        setSyncError(String(e));
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [adapter]);

  /* В демо-режиме всё состояние автосохраняется в localStorage */
  useEffect(() => {
    if (!hydratedRef.current || adapter.kind !== "local") return;
    try {
      window.localStorage.setItem("stoa:state:v1", JSON.stringify(state));
    } catch {
      /* переполнение — пропускаем */
    }
  }, [state, adapter.kind]);

  /* ---------- Фоновая запись в адаптер ---------- */
  const persist = useCallback(
    (op: () => Promise<void>) => {
      setSyncError(null);
      void op().catch((e) => {
        console.error("stoa: ошибка синхронизации", e);
        setSyncError(e instanceof Error ? e.message : String(e));
      });
    },
    []
  );

  const applyState = useCallback((updater: (s: AppState) => AppState) => {
    setState((s) => updater(s));
  }, []);

  /* ---------- Тема ---------- */
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

  /* ---------- Аккаунт ---------- */

  const hydrateAfterAuth = useCallback(
    async (): Promise<string | null> => {
      const user = await adapter.getSession();
      if (!user) return "auth.errorGeneric";
      const data = await adapter.loadAll();
      setState({
        user,
        settings: data.settings,
        tasks: refreshDue(data.tasks, todayISO()),
        entries: data.entries,
        days: data.days,
        favoriteQuoteIds: data.favoriteQuoteIds,
      });
      hydratedRef.current = true;
      return null;
    },
    [adapter]
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      const err = await adapter.signIn(email, password);
      if (err) return err;
      return hydrateAfterAuth();
    },
    [adapter, hydrateAfterAuth]
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string): Promise<string | null> => {
      const err = await adapter.signUp(name, email, password);
      if (err) return err;
      return hydrateAfterAuth();
    },
    [adapter, hydrateAfterAuth]
  );

  const signOut = useCallback(async () => {
    await adapter.signOut();
    setState(defaultState);
  }, [adapter]);

  const setSettings = useCallback(
    (patch: Partial<Settings>) => {
      const next = { ...stateRef.current.settings, ...patch };
      applyState((s) => ({ ...s, settings: next }));
      persist(() => adapter.setSettings(next));
    },
    [adapter, applyState, persist]
  );

  const setTheme = useCallback(
    (theme: Settings["theme"]) => setSettings({ theme }),
    [setSettings]
  );

  /* ---------- Цикл дня ---------- */

  const updateDay = useCallback(
    (patch: Partial<DayLog>) => {
      const k = todayISO();
      const s = stateRef.current;
      const day = { ...(s.days[k] ?? defaultDayLog()), ...patch };
      applyState((prev) => ({ ...prev, days: { ...prev.days, [k]: day } }));
      persist(() => adapter.saveDay(day, k));
    },
    [adapter, applyState, persist]
  );

  const finishMorning = useCallback(() => updateDay({ morningDone: true }), [updateDay]);

  const saveEvening = useCallback(() => {
    const k = todayISO();
    const s = stateRef.current;
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
    applyState((prev) => ({
      ...prev,
      days: { ...prev.days, [k]: day },
      entries: [entry, ...prev.entries],
    }));
    persist(async () => {
      await adapter.saveDay(day, k);
      await adapter.addEntry(entry);
    });
  }, [adapter, applyState, persist]);

  /* ---------- Задачи ---------- */

  const addTask = useCallback(
    (input: NewTaskInput) => {
      const task = makeTask(input);
      applyState((s) => ({ ...s, tasks: [task, ...s.tasks] }));
      persist(() => adapter.addTask(task));
    },
    [adapter, applyState, persist]
  );

  const updateTask = useCallback(
    (id: string, patch: Partial<Task>) => {
      applyState((s) => ({
        ...s,
        tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      }));
      persist(() => adapter.updateTask(id, patch));
    },
    [adapter, applyState, persist]
  );

  const cycleTask = useCallback(
    (id: string) => {
      const s = stateRef.current;
      const task = s.tasks.find((t) => t.id === id);
      if (!task) return;
      const status = NEXT_STATUS[task.status];
      // Повторяющаяся задача: при завершении создаём следующее вхождение (FR-K4)
      const next =
        status === "done" && task.recur && task.recur !== "none"
          ? nextOccurrence(task)
          : null;
      let tasks = s.tasks.map((t) => (t.id === id ? { ...t, status } : t));
      if (next) tasks = [makeTask(next), ...tasks];
      applyState((prev) => ({ ...prev, tasks }));
      persist(async () => {
        await adapter.updateTask(id, { status });
        if (next) await adapter.addTask(makeTask(next));
      });
    },
    [adapter, applyState, persist]
  );

  const deleteTask = useCallback(
    (id: string) => {
      applyState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
      persist(() => adapter.deleteTask(id));
    },
    [adapter, applyState, persist]
  );

  /* ---------- Дневник ---------- */

  const addEntry = useCallback(
    (e: { type: Entry["type"]; content: string; mood: number; tags: string[]; practiceId?: string }) => {
      const entry: Entry = { id: uid(), createdAt: new Date().toISOString(), ...e };
      applyState((s) => ({ ...s, entries: [entry, ...s.entries] }));
      persist(() => adapter.addEntry(entry));
    },
    [adapter, applyState, persist]
  );

  const deleteEntry = useCallback(
    (id: string) => {
      applyState((s) => ({ ...s, entries: s.entries.filter((e) => e.id !== id) }));
      persist(() => adapter.deleteEntry(id));
    },
    [adapter, applyState, persist]
  );

  /* ---------- Цитаты ---------- */

  const toggleFavoriteQuote = useCallback(
    (id: number) => {
      const on = !stateRef.current.favoriteQuoteIds.includes(id);
      applyState((s) => ({
        ...s,
        favoriteQuoteIds: on
          ? [...s.favoriteQuoteIds, id]
          : s.favoriteQuoteIds.filter((x) => x !== id),
      }));
      persist(() => adapter.setFavorite(id, on));
    },
    [adapter, applyState, persist]
  );

  /* ---------- Данные ---------- */

  const exportData = useCallback(() => {
    const blob = new Blob(
      [JSON.stringify({ exportedAt: new Date().toISOString(), ...stateRef.current }, null, 2)],
      { type: "application/json" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `stoa-export-${todayISO()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, []);

  /** UC-10: удаление аккаунта со всеми данными (в облаке — каскадно через RLS) */
  const deleteAccount = useCallback(async () => {
    await adapter.deleteAllUserData();
    setState(defaultState);
  }, [adapter]);

  /** Демо-данные для презентации */
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

  const todayKey = todayKeyOf();
  const day = state.days[todayKey] ?? defaultDayLog();

  const value = useMemo<StoreValue>(
    () => ({
      state,
      ready,
      todayKey,
      day,
      backend: adapter.kind,
      syncError,
      signIn,
      signUp,
      signOut,
      setTheme,
      setSettings,
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
      deleteAccount,
      seedDemo,
    }),
    [
      state,
      ready,
      todayKey,
      day,
      adapter.kind,
      syncError,
      signIn,
      signUp,
      signOut,
      setTheme,
      setSettings,
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
      deleteAccount,
      seedDemo,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

function todayKeyOf(): string {
  return todayISO();
}
