import type { Locale } from "./types";

/** Промпты дневника (контент-план: docs/09-build-plan.md, MVP — 15 утро / 15 вечер → здесь 5+5, пополняется) */

export const PROMPTS: Record<
  "morning" | "evening",
  { ru: string[]; en: string[] }
> = {
  morning: {
    ru: [
      "Что сегодня действительно важно? Почему именно это?",
      "Какое одно действие приблизит меня к тому, кем я хочу быть?",
      "Каким человеком я хочу быть в сегодняшних обстоятельствах?",
      "Что я могу сделать сегодня из того, что в моей власти, — и только это?",
      "Какую одну привычку я поддержу сегодня, даже если день пойдёт не по плану?",
    ],
    en: [
      "What truly matters today? Why this?",
      "Which single action brings me closer to who I want to be?",
      "What kind of person do I want to be in today's circumstances?",
      "What can I do today that is up to me — and only that?",
      "Which one habit will I keep today, even if the plan falls apart?",
    ],
  },
  evening: {
    ru: [
      "Что сегодня получилось лучше всего?",
      "Какую одну вещь я сделал бы иначе?",
      "Какой момент дня я хочу сохранить в памяти?",
      "Что из сегодняшних тревог было в моей власти, а что — нет?",
      "Какое спокойное, тихое удовольствие подарил мне этот день?",
    ],
    en: [
      "What went best today?",
      "Which one thing would I do differently?",
      "Which moment of the day do I want to keep?",
      "Which of today's worries were up to me, and which were not?",
      "What quiet, calm pleasure did this day give me?",
    ],
  },
};

export function randomPrompt(kind: "morning" | "evening", locale: Locale): string {
  const arr = PROMPTS[kind][locale];
  return arr[Math.floor(Math.random() * arr.length)];
}
