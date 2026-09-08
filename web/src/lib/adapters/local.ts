"use client";

/**
 * LocalAdapter — демо-режим (docs/07-backend.md).
 * Все данные пользователя лежат в localStorage этого браузера.
 * Запись данных выполняет store (автосохранение всего состояния),
 * поэтому методы-записи здесь — пустые; адаптер отвечает за аккаунты
 * и чтение/сброс хранилища.
 */

import type { DataAdapter } from "../adapter";
import type { AppState, DayLog, User } from "../types";
import { defaultState } from "../types";

export const STORAGE_KEY = "stoa:state:v1";
export const USERS_KEY = "stoa:users:v1";

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

function loadState(): AppState {
  return loadJSON<AppState>(STORAGE_KEY, defaultState);
}

export const localAdapter: DataAdapter = {
  kind: "local",

  async getSession() {
    return loadState().user;
  },

  async signIn(email, password) {
    const users = loadJSON<Record<string, StoredUser>>(USERS_KEY, {});
    const user = users[email.toLowerCase()];
    if (!user || user.pass !== demoHash(password)) return "auth.errorCredentials";
    const st = loadState();
    st.user = { email: user.email, name: user.name };
    saveJSON(STORAGE_KEY, st);
    return null;
  },

  async signUp(name, email, password) {
    const users = loadJSON<Record<string, StoredUser>>(USERS_KEY, {});
    const key = email.toLowerCase();
    if (users[key]) return "auth.errorExists";
    users[key] = { name, email, pass: demoHash(password) };
    saveJSON(USERS_KEY, users);
    const st = loadState();
    st.user = { email, name };
    saveJSON(STORAGE_KEY, st);
    return null;
  },

  async signOut() {
    const st = loadState();
    st.user = null;
    saveJSON(STORAGE_KEY, st);
  },

  async loadAll() {
    const st = loadState();
    return {
      tasks: st.tasks,
      entries: st.entries,
      days: st.days,
      favoriteQuoteIds: st.favoriteQuoteIds,
      theme: st.settings.theme,
    };
  },

  /* записи данных выполняет store через автосохранение состояния */
  async saveDay() {},
  async addTask() {},
  async updateTask() {},
  async deleteTask() {},
  async addEntry() {},
  async deleteEntry() {},
  async setFavorite() {},
  async setTheme() {},

  async deleteAllUserData() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(USERS_KEY);
    }
  },
};
