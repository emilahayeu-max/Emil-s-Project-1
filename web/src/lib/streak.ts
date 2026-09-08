/**
 * Логика «мягкого» стрика (US-11/29, FR-P1).
 * Пропуски не наказываются: стрик — информативный, возвращение — без упрёков.
 */

const DAY_MS = 86400000;

function dayNumber(dateISO: string): number {
  return Math.floor(new Date(dateISO + "T00:00:00Z").getTime() / DAY_MS);
}

export interface StreakResult {
  /** дней подряд с активностью, заканчиваясь сегодня или вчера */
  streak: number;
  /** всего активных дней (не сбрасывается) */
  totalDays: number;
}

/**
 * @param activeDays множество дат YYYY-MM-DD, где был завершён хотя бы один ритуал
 * @param todayISO текущая дата YYYY-MM-DD
 */
export function computeStreak(activeDays: Set<string>, todayISO: string): StreakResult {
  const today = dayNumber(todayISO);
  // будущие даты игнорируются (часовые пояса, ручной ввод)
  const days = [...activeDays].map(dayNumber).filter((d) => d <= today).sort((a, b) => a - b);
  const totalDays = days.length;

  if (totalDays === 0) return { streak: 0, totalDays: 0 };

  const hasToday = days[days.length - 1] === today;
  const hasYesterday = days[days.length - 1] === today - 1;
  // Стрик жив, если активность была сегодня или вчера
  if (!hasToday && !hasYesterday) return { streak: 0, totalDays };

  let cursor = hasToday ? today : today - 1;
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i] === cursor) {
      streak++;
      cursor--;
    } else if (days[i] < cursor) {
      break;
    }
  }
  return { streak, totalDays };
}

/** Вчерашняя дата YYYY-MM-DD */
export function yesterdayISO(todayISO: string): string {
  return new Date(dayNumber(todayISO) * DAY_MS - DAY_MS).toISOString().slice(0, 10);
}
