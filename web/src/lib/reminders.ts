/**
 * Напоминания об утреннем/вечернем ритуале (фаза 2, FR-S3).
 * Мягкий принцип: баннер показывается, только когда приложение открыто
 * в «окно напоминания» (время ритуала + 15 минут) и ритуал ещё не выполнен.
 * Web Push — после деплоя (заготовка в public/sw.js).
 */

/** Разбор "HH:MM" → {h, m}; невалидное время → null */
export function parseHM(value: string): { h: number; m: number } | null {
  const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(value.trim());
  if (!match) return null;
  return { h: Number(match[1]), m: Number(match[2]) };
}

/**
 * Сейчас — «окно напоминания»?
 * @param now текущий момент
 * @param reminder строка "HH:MM"
 * @param windowMin длительность окна в минутах (по умолчанию 15)
 */
export function isReminderWindow(now: Date, reminder: string, windowMin = 15): boolean {
  const t = parseHM(reminder);
  if (!t) return false;
  const target = t.h * 60 + t.m;
  const current = now.getHours() * 60 + now.getMinutes();
  return current >= target && current < target + windowMin;
}
