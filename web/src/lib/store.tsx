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
  Control,
  DayLog,
  defaultDayLog,
  defaultState,
  Entry,
  Priority,
  Settings,
  Task,
  TaskStatus,
  todayISO,
  uid,
  User,
} from "./types";

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
  addTask: (t: { title: string; priority: Priority; control: Control; dueToday: boolean }) => void;
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
    setState(stored);
    loadedRef.current = true;
    setReady(true);
  }, []);

  useEffect(() => {
    if (loadedRef.current) saveJSON(STORAGE_KEY, state);
  }, [state]);

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

  const addTask = useCallback(
    (t: { title: string; priority: Priority; control: Control; dueToday: boolean }) => {
      setState((s) => ({
        ...s,
        tasks: [
          { id: uid(), status: "todo" as TaskStatus, createdAt: new Date().toISOString(), ...t },
          ...s.tasks,
        ],
      }));
    },
    []
  );

  const cycleTask = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "todo" ? "doing" : t.status === "doing" ? "done" : "todo" }
          : t
      ),
    }));
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
      cycleTask,
      deleteTask,
      addEntry,
      deleteEntry,
      toggleFavoriteQuote,
      exportData,
      resetData,
    }),
    [state, ready, todayKey, day, signIn, signUp, signOut, setTheme, updateDay, finishMorning, saveEvening, addTask, cycleTask, deleteTask, addEntry, deleteEntry, toggleFavoriteQuote, exportData, resetData]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
