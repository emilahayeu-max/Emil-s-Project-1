"use client";

/**
 * Интерфейс слоя данных (docs/07-backend.md).
 *
 * Приложение работает с двумя адаптерами через один и тот же интерфейс:
 *  - localAdapter   — демо-режим (localStorage этого браузера), используется,
 *                     когда ключи Supabase не заданы;
 *  - supabaseAdapter — боевой режим (облако Supabase), включается автоматически,
 *                     когда заданы env-переменные:
 *                     NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY.
 *
 * UI и доменная логика не знают, какой адаптер активен.
 */

import type { DayLog, Entry, Settings, Task, User } from "./types";
import { localAdapter } from "./adapters/local";
import { supabaseAdapter } from "./adapters/supabase";

export interface LoadedData {
  tasks: Task[];
  entries: Entry[];
  days: Record<string, DayLog>;
  favoriteQuoteIds: number[];
  settings: Settings;
}

export interface DataAdapter {
  readonly kind: "local" | "supabase";

  /* аккаунт */
  getSession(): Promise<User | null>;
  signIn(email: string, password: string): Promise<string | null>;
  signUp(name: string, email: string, password: string): Promise<string | null>;
  signOut(): Promise<void>;

  /* данные */
  loadAll(): Promise<LoadedData>;
  saveDay(day: DayLog, dayKey: string): Promise<void>;
  addTask(task: Task): Promise<void>;
  updateTask(id: string, patch: Partial<Task>): Promise<void>;
  deleteTask(id: string): Promise<void>;
  addEntry(entry: Entry): Promise<void>;
  deleteEntry(id: string): Promise<void>;
  setFavorite(quoteId: number, on: boolean): Promise<void>;
  setSettings(settings: Settings): Promise<void>;
  deleteAllUserData(): Promise<void>;
}

export function createAdapter(): DataAdapter {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? supabaseAdapter : localAdapter;
}
