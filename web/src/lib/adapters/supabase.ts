"use client";

/**
 * SupabaseAdapter — боевой режим (docs/07-backend.md).
 * Данные пользователя живут в облачной БД Postgres; доступ ограничен
 * Row Level Security (миграция supabase/migrations/0001_init.sql):
 * каждый пользователь видит только свои строки.
 *
 * Контент (цитаты и практики) приложение берёт из локальных модулей
 * (lib/quotes.ts, lib/practices.ts) — они идентичны seed.sql, это даёт
 * мгновенную загрузку и меньше запросов к бесплатному тиру.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { DataAdapter } from "../adapter";
import type { DayLog, Entry, Settings, Task } from "../types";
import { todayISO } from "../types";

/* ---------- Клиент ---------- */

let cachedClient: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!cachedClient) {
    cachedClient = createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return cachedClient;
}

async function requireUid(sb: SupabaseClient): Promise<string> {
  const { data } = await sb.auth.getUser();
  if (!data.user) throw new Error("supabase: нет активной сессии");
  return data.user.id;
}

/* ---------- Мапперы строк БД → доменные типы ---------- */

export function mapTask(row: Record<string, unknown>, today = todayISO()): Task {
  const dueDate = (row.due_date as string) || undefined;
  return {
    id: row.id as string,
    title: (row.title as string) ?? "",
    note: (row.note as string) || undefined,
    priority: (row.priority as Task["priority"]) ?? "P2",
    control: (row.control as Task["control"]) ?? "in",
    reaction: (row.reaction as string) || undefined,
    dueToday: !!dueDate && dueDate <= today,
    dueDate,
    recur: (row.recur as Task["recur"]) ?? "none",
    status: (row.status as Task["status"]) ?? "todo",
    createdAt: (row.created_at as string) ?? new Date().toISOString(),
  };
}

export function mapEntry(row: Record<string, unknown>): Entry {
  return {
    id: row.id as string,
    type: (row.type as Entry["type"]) ?? "free",
    content: (row.content as string) ?? "",
    mood: (row.mood as number) ?? 3,
    tags: (row.tags as string[]) ?? [],
    practiceId: (row.practice_id as string) || undefined,
    createdAt: (row.created_at as string) ?? new Date().toISOString(),
  };
}

export function mapDayLog(row: Record<string, unknown>): DayLog {
  return {
    morningDone: !!row.morning_done,
    eveningDone: !!row.evening_done,
    intention: (row.intention as string) ?? "",
    obstacles: (row.obstacles as string) ?? "",
    q1: (row.q1 as string) ?? "",
    q2: (row.q2 as string) ?? "",
    q3: (row.q3 as string) ?? "",
    q4: (row.q4 as string) ?? "",
  };
}

/* ---------- Адаптер ---------- */

export const supabaseAdapter: DataAdapter = {
  kind: "supabase",

  async getSession() {
    const sb = getClient();
    if (!sb) return null;
    try {
      const { data } = await sb.auth.getSession();
      const su = data.session?.user;
      if (!su) return null;
      let name = "";
      const prof = await sb.from("profiles").select("name").eq("id", su.id).maybeSingle();
      if (prof.data) name = (prof.data.name as string) ?? "";
      return { email: su.email ?? "", name };
    } catch (e) {
      console.error("supabase getSession:", e);
      return null;
    }
  },

  async signIn(email, password) {
    const sb = getClient();
    if (!sb) return "auth.errorGeneric";
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("supabase signIn:", error.message);
      return error.message.toLowerCase().includes("invalid login")
        ? "auth.errorCredentials"
        : "auth.errorGeneric";
    }
    return null;
  },

  async signUp(name, email, password) {
    const sb = getClient();
    if (!sb) return "auth.errorGeneric";
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) {
      console.error("supabase signUp:", error.message);
      return /already registered|already exists/i.test(error.message)
        ? "auth.errorExists"
        : "auth.errorGeneric";
    }
    // Подтверждение почты включено → сессии нет, ждём письмо
    if (!data.session) return "auth.checkEmail";
    // Сессия есть (подтверждение выключено) → сохраняем имя в профиле
    if (data.user) {
      await sb.from("profiles").upsert({ id: data.user.id, name }).select().maybeSingle();
    }
    return null;
  },

  async signOut() {
    const sb = getClient();
    if (!sb) return;
    await sb.auth.signOut();
  },

  async loadAll() {
    const sb = getClient();
    if (!sb) throw new Error("supabase: клиент не настроен");
    const uid = await requireUid(sb);
    const [t, e, d, f, p] = await Promise.all([
      sb.from("tasks").select("*").order("created_at", { ascending: false }),
      sb.from("journal_entries").select("*").order("created_at", { ascending: false }),
      sb.from("day_logs").select("*"),
      sb.from("favorite_quotes").select("quote_id"),
      sb.from("profiles").select("theme").eq("id", uid).maybeSingle(),
    ]);
    if (t.error) throw t.error;
    if (e.error) throw e.error;
    if (d.error) throw d.error;
    if (f.error) throw f.error;

    const days: Record<string, DayLog> = {};
    for (const row of d.data ?? []) {
      days[(row.day as string)] = mapDayLog(row);
    }
    return {
      tasks: (t.data ?? []).map((r) => mapTask(r as Record<string, unknown>)),
      entries: (e.data ?? []).map((r) => mapEntry(r as Record<string, unknown>)),
      days,
      favoriteQuoteIds: (f.data ?? []).map((r) => r.quote_id as number),
      theme: ((p.data?.theme as string | undefined) ?? "light") as Settings["theme"],
    };
  },

  async saveDay(day, dayKey) {
    const sb = getClient();
    if (!sb) return;
    const uid = await requireUid(sb);
    const { error } = await sb.from("day_logs").upsert(
      {
        user_id: uid,
        day: dayKey,
        intention: day.intention,
        obstacles: day.obstacles,
        q1: day.q1,
        q2: day.q2,
        q3: day.q3,
        q4: day.q4,
        morning_done: day.morningDone,
        evening_done: day.eveningDone,
      },
      { onConflict: "user_id,day" }
    );
    if (error) throw error;
  },

  async addTask(task) {
    const sb = getClient();
    if (!sb) return;
    const uid = await requireUid(sb);
    const { error } = await sb.from("tasks").insert({
      id: task.id,
      user_id: uid,
      title: task.title,
      note: task.note ?? null,
      status: task.status,
      priority: task.priority,
      control: task.control,
      reaction: task.reaction ?? null,
      due_date: task.dueDate ?? null,
      recur: task.recur,
      completed_at: task.status === "done" ? new Date().toISOString() : null,
    });
    if (error) throw error;
  },

  async updateTask(id, patch) {
    const sb = getClient();
    if (!sb) return;
    const row: Record<string, unknown> = {};
    if (patch.title !== undefined) row.title = patch.title;
    if (patch.note !== undefined) row.note = patch.note || null;
    if (patch.status !== undefined) {
      row.status = patch.status;
      row.completed_at = patch.status === "done" ? new Date().toISOString() : null;
    }
    if (patch.priority !== undefined) row.priority = patch.priority;
    if (patch.control !== undefined) row.control = patch.control;
    if (patch.reaction !== undefined) row.reaction = patch.reaction || null;
    if (patch.dueDate !== undefined) row.due_date = patch.dueDate || null;
    if (patch.recur !== undefined) row.recur = patch.recur;
    const { error } = await sb.from("tasks").update(row).eq("id", id);
    if (error) throw error;
  },

  async deleteTask(id) {
    const sb = getClient();
    if (!sb) return;
    const { error } = await sb.from("tasks").delete().eq("id", id);
    if (error) throw error;
  },

  async addEntry(entry) {
    const sb = getClient();
    if (!sb) return;
    const uid = await requireUid(sb);
    const { error } = await sb.from("journal_entries").insert({
      id: entry.id,
      user_id: uid,
      type: entry.type,
      content: entry.content,
      mood: entry.mood,
      tags: entry.tags,
      practice_id: entry.practiceId ?? null,
    });
    if (error) throw error;
  },

  async deleteEntry(id) {
    const sb = getClient();
    if (!sb) return;
    const { error } = await sb.from("journal_entries").delete().eq("id", id);
    if (error) throw error;
  },

  async setFavorite(quoteId, on) {
    const sb = getClient();
    if (!sb) return;
    const uid = await requireUid(sb);
    if (on) {
      const { error } = await sb.from("favorite_quotes").upsert({ user_id: uid, quote_id: quoteId });
      if (error) throw error;
    } else {
      const { error } = await sb
        .from("favorite_quotes")
        .delete()
        .eq("user_id", uid)
        .eq("quote_id", quoteId);
      if (error) throw error;
    }
  },

  async setTheme(theme) {
    const sb = getClient();
    if (!sb) return;
    const uid = await requireUid(sb);
    const { error } = await sb.from("profiles").update({ theme }).eq("id", uid);
    if (error) throw error;
  },

  /** UC-10: стираем все данные пользователя (RLS позволяет удалять только свои строки) */
  async deleteAllUserData() {
    const sb = getClient();
    if (!sb) return;
    const uid = await requireUid(sb);
    await Promise.all([
      sb.from("journal_entries").delete().eq("user_id", uid),
      sb.from("tasks").delete().eq("user_id", uid),
      sb.from("day_logs").delete().eq("user_id", uid),
      sb.from("practice_logs").delete().eq("user_id", uid),
      sb.from("favorite_quotes").delete().eq("user_id", uid),
      sb.from("profiles").delete().eq("id", uid),
    ]);
    await sb.auth.signOut();
  },
};
