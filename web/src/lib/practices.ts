import type { Locale } from "./types";

/**
 * Каталог практик (контент-план: docs/09-build-plan.md, MVP — 6 из 12).
 * Адаптации классических стоических упражнений.
 */

export interface Practice {
  id: string;
  icon: string;
  durationMin: number;
  category: { ru: string; en: string };
  title: { ru: string; en: string };
  why: { ru: string; en: string };
  steps: { ru: string[]; en: string[] };
  example: { ru: string; en: string };
}

export const PRACTICES: Practice[] = [
  {
    id: "dichotomy-of-control",
    icon: "⚖️",
    durationMin: 5,
    category: { ru: "Принятие", en: "Acceptance" },
    title: { ru: "Дихотомия контроля", en: "Dichotomy of Control" },
    why: {
      ru: "Эпиктет начинает «Энхиридион» с разделения всего на зависящее и не зависящее от нас. Тревога почти всегда направлена на второе. Упражнение возвращает внимание туда, где у вас есть власть.",
      en: "Epictetus opens the Enchiridion by dividing everything into what is and what is not up to us. Anxiety almost always targets the latter. This practice returns attention to where you have power.",
    },
    steps: {
      ru: [
        "Выпишите всё, что вас сейчас тревожит, — крупное и мелкое.",
        "Проведите черту: слева «в моей власти» (суждения, действия, усилия), справа — «вне её» (погода, чужие решения, прошлое).",
        "Правую колонку скажите вслух: «Это не в моей власти» — и отпустите.",
        "Из левой колонки выберите одно действие и выполните его сегодня.",
      ],
      en: [
        "Write down everything currently worrying you — big and small.",
        "Draw a line: left — “up to me” (judgments, actions, effort); right — “not up to me” (weather, other people's decisions, the past).",
        "Say the right column out loud: “This is not up to me” — and let it go.",
        "From the left column, pick one action and do it today.",
      ],
    },
    example: {
      ru: "«Рейс задержали» — вне моей власти. «Как я проведу это время в аэропорту» — в моей.",
      en: "“The flight is delayed” — not up to me. “How I spend this time at the airport” — up to me.",
    },
  },
  {
    id: "negative-visualization",
    icon: "🌫",
    durationMin: 10,
    category: { ru: "Принятие", en: "Acceptance" },
    title: { ru: "Негативная визуализация", en: "Negative Visualization" },
    why: {
      ru: "Стоики мысленно «теряли» то, что имеют, — чтобы ценить настоящее и быть готовыми к переменам. Это не про тревогу, а про благодарность и устойчивость.",
      en: "The Stoics mentally “lost” what they had — to appreciate the present and prepare for change. This is about gratitude and resilience, not anxiety.",
    },
    steps: {
      ru: [
        "Выберите то, что вам дорого: человек, здоровье, работа, привычный уклад.",
        "На 60 секунд представьте, что этого больше нет. Почувствуйте пустоту.",
        "Вернитесь в настоящее: «Сейчас это у меня есть».",
        "Сформулируйте одну благодарность и запишите её.",
      ],
      en: [
        "Choose something dear to you: a person, health, work, a routine.",
        "For 60 seconds, imagine it is gone. Feel the absence.",
        "Return to the present: “Right now, I still have it.”",
        "Formulate one gratitude and write it down.",
      ],
    },
    example: {
      ru: "Утренний кофе, звонок маме, возможность бегать — что исчезло бы без следа, если бы день сложился иначе?",
      en: "Morning coffee, a call to your mother, the ability to run — what would vanish without a trace if the day went differently?",
    },
  },
  {
    id: "memento-mori",
    icon: "🕯",
    durationMin: 7,
    category: { ru: "Смерть и время", en: "Death & Time" },
    title: { ru: "Memento mori", en: "Memento Mori" },
    why: {
      ru: "«Помни о смерти» — не мрачный лозунг, а напоминание о цене времени. Оно обостряет вопрос: «На что я трачу сегодняшний день?»",
      en: "“Remember death” is not a gloomy slogan but a reminder of the price of time. It sharpens the question: “What am I spending today on?”",
    },
    steps: {
      ru: [
        "Скажите себе спокойно, без драмы: «Этот день не бесконечен. И я тоже».",
        "Спросите: что из запланированного я делаю из страха, а не из смысла?",
        "Уберите одну «не свою» задачу из списка.",
        "Сделайте одну маленькую вещь, которую давно откладывали.",
      ],
      en: [
        "Tell yourself calmly, without drama: “This day is not endless. Neither am I.”",
        "Ask: which of my plans come from fear rather than meaning?",
        "Remove one “not mine” task from the list.",
        "Do one small thing you have long postponed.",
      ],
    },
    example: {
      ru: "Сенека: «Не то, что у нас мало времени, а то, что мы много его теряем» — а вы сегодня знаете цену.",
      en: "Seneca: “It is not that we have a short time to live, but that we waste much of it.” Today you know its price.",
    },
  },
  {
    id: "amor-fati",
    icon: "🔥",
    durationMin: 6,
    category: { ru: "Дисциплина", en: "Discipline" },
    title: { ru: "Amor fati — любовь к судьбе", en: "Amor Fati — Love of Fate" },
    why: {
      ru: "Не просто терпеть происходящее, а видеть в нём материал для роста. Препятствие становится путём.",
      en: "Not merely to endure what happens, but to see in it material for growth. The obstacle becomes the way.",
    },
    steps: {
      ru: [
        "Вспомните неприятное событие недели.",
        "Спросите: «Что хорошего оно уже принесло или может принести?»",
        "Найдите три ответа — даже неожиданных.",
        "Переформулируйте событие в одну фразу со словом «благодаря».",
      ],
      en: [
        "Recall an unpleasant event from this week.",
        "Ask: “What good has it already brought or may bring?”",
        "Find three answers — even surprising ones.",
        "Reframe the event in one sentence starting with “thanks to”.",
      ],
    },
    example: {
      ru: "«Отказ на собеседовании» → «Благодаря отказу я увидел, что презентация была слабой» → план: улучшить её.",
      en: "“Rejected at the interview” → “Thanks to the rejection I saw my presentation was weak” → plan: improve it.",
    },
  },
  {
    id: "view-from-above",
    icon: "🌌",
    durationMin: 8,
    category: { ru: "Спокойствие", en: "Calm" },
    title: { ru: "Взгляд сверху", en: "View from Above" },
    why: {
      ru: "Марк Аврелий советовал смотреть на вещи с высоты — так проблемы возвращаются к своему настоящему размеру.",
      en: "Marcus Aurelius advised viewing things from above — this returns problems to their true size.",
    },
    steps: {
      ru: [
        "Закройте глаза и представьте свою комнату, дом, улицу, город — всё выше и выше.",
        "Найдите на этой карте свою сегодняшнюю проблему. Каков её размер?",
        "Представьте время: неделю, год, десять лет. Что останется важным?",
        "Запишите одну мысль, которая пришла.",
      ],
      en: [
        "Close your eyes and picture your room, home, street, city — higher and higher.",
        "Find today's problem on this map. How big is it?",
        "Picture time: a week, a year, ten years. What will still matter?",
        "Write down one thought that came.",
      ],
    },
    example: {
      ru: "Спор в чате кажется огромным — а с высоты города он меньше точки. Что важно: спор или вечер с семьёй?",
      en: "An argument in a group chat feels huge — from above the city it is smaller than a dot. What matters: the argument or an evening with family?",
    },
  },
  {
    id: "seneca-evening-review",
    icon: "🌙",
    durationMin: 5,
    category: { ru: "Ритуалы", en: "Rituals" },
    title: { ru: "Вечерний разбор Сенеки", en: "Seneca's Evening Review" },
    why: {
      ru: "Сенека каждый вечер задавал себе три вопроса и проверял день, как судья — прожитое. Разбор превращает ошибки в уроки, а успехи — в привычку.",
      en: "Seneca asked himself three questions every night and examined the day like a judge. The review turns mistakes into lessons and successes into habits.",
    },
    steps: {
      ru: [
        "Вспомните день от пробуждения до этого момента — крупными мазками.",
        "Спросите: «Какой свой порок я сегодня исцелил? Против чего устоял? В чём стал лучше?»",
        "Простите себе сегодняшние промахи — и запишите, как поступить завтра.",
        "Поблагодарите себя за одно дело, доведённое до конца.",
      ],
      en: [
        "Recall the day from waking to now — in broad strokes.",
        "Ask: “Which fault of mine did I heal today? What did I resist? Where did I become better?”",
        "Forgive yourself today's slips — and write down how to act tomorrow.",
        "Thank yourself for one thing you finished.",
      ],
    },
    example: {
      ru: "«Вспылил в споре» → урок: пауза в три вдоха перед ответом. Завтра начну с этого.",
      en: "“I lost my temper in an argument” → lesson: pause for three breaths before answering. Start with that tomorrow.",
    },
  },
];

export function getPracticeById(id: string): Practice | undefined {
  return PRACTICES.find((p) => p.id === id);
}

export function practiceTitle(p: Practice, locale: Locale): string {
  return p.title[locale];
}
