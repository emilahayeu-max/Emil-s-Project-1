import type { Locale } from "./types";

/**
 * Библиотека цитат (контент-план: docs/09-build-plan.md, цель MVP — 36+).
 * Адаптации переводов из первоисточников в общественном достоянии:
 * Марк Аврелий «Размышления», Сенека «Письма к Луцилию» / «О скоротечности жизни»,
 * Эпиктет «Энхиридион» / «Беседы», Мусоний Руф.
 */

export interface Quote {
  id: number;
  author: { ru: string; en: string };
  source: { ru: string; en: string };
  text: { ru: string; en: string };
}

export const QUOTES: Quote[] = [
  {
    id: 0,
    author: { ru: "Марк Аврелий", en: "Marcus Aurelius" },
    source: { ru: "«Размышления»", en: "Meditations" },
    text: {
      ru: "Поутру скажи себе: сегодня я встречу людей суетных, неблагодарных и заносчивых. Никто из них не может причинить мне зла — ведь я сам выбираю, как к этому отнестись.",
      en: "Begin each day by telling yourself: today I shall meet people who are interfering, ungrateful and arrogant. None of them can hurt me — for I alone choose how to respond.",
    },
  },
  {
    id: 1,
    author: { ru: "Эпиктет", en: "Epictetus" },
    source: { ru: "«Энхиридион»", en: "Enchiridion" },
    text: {
      ru: "Не вещи тревожат людей, а их суждения о вещах.",
      en: "It is not things that trouble people, but their judgments about things.",
    },
  },
  {
    id: 2,
    author: { ru: "Сенека", en: "Seneca" },
    source: { ru: "«Письма к Луцилию»", en: "Letters to Lucilius" },
    text: {
      ru: "Пока мы откладываем жизнь, она проходит.",
      en: "While we postpone, life speeds by.",
    },
  },
  {
    id: 3,
    author: { ru: "Марк Аврелий", en: "Marcus Aurelius" },
    source: { ru: "«Размышления»", en: "Meditations" },
    text: {
      ru: "У тебя есть власть над своим умом — но не над внешними событиями. Осознай это — и обретёшь силу.",
      en: "You have power over your mind — not outside events. Realize this, and you will find strength.",
    },
  },
  {
    id: 4,
    author: { ru: "Сенека", en: "Seneca" },
    source: { ru: "«Письма к Луцилию»", en: "Letters to Lucilius" },
    text: {
      ru: "Мы страдаем чаще в воображении, чем в действительности.",
      en: "We suffer more often in imagination than in reality.",
    },
  },
  {
    id: 5,
    author: { ru: "Эпиктет", en: "Epictetus" },
    source: { ru: "«Беседы»", en: "Discourses" },
    text: {
      ru: "Сначала скажи себе, кем ты хочешь быть, а затем делай то, что должен делать.",
      en: "First say to yourself what you would be; and then do what you have to do.",
    },
  },
  {
    id: 6,
    author: { ru: "Марк Аврелий", en: "Marcus Aurelius" },
    source: { ru: "«Размышления»", en: "Meditations" },
    text: {
      ru: "Препятствие к действию становится путём. То, что мешает, — помогает.",
      en: "The impediment to action advances action. What stands in the way becomes the way.",
    },
  },
  {
    id: 7,
    author: { ru: "Сенека", en: "Seneca" },
    source: { ru: "«О скоротечности жизни»", en: "On the Shortness of Life" },
    text: {
      ru: "Ожидание — главная помеха жизни: оно зависит от завтрашнего дня и губит сегодняшний.",
      en: "Expectation is the greatest impediment to living: it hangs upon tomorrow and loses today.",
    },
  },
  {
    id: 8,
    author: { ru: "Эпиктет", en: "Epictetus" },
    source: { ru: "«Энхиридион»", en: "Enchiridion" },
    text: {
      ru: "Не проси, чтобы события происходили так, как ты хочешь; желай, чтобы они происходили так, как происходят, — и жизнь твоя будет спокойна.",
      en: "Do not ask for things to happen as you wish; wish them to happen as they do — and your life will flow well.",
    },
  },
  {
    id: 9,
    author: { ru: "Марк Аврелий", en: "Marcus Aurelius" },
    source: { ru: "«Размышления»", en: "Meditations" },
    text: {
      ru: "Душа окрашивается цветом твоих мыслей.",
      en: "The soul becomes dyed with the color of its thoughts.",
    },
  },
  {
    id: 10,
    author: { ru: "Сенека", en: "Seneca" },
    source: { ru: "«Письма к Луцилию»", en: "Letters to Lucilius" },
    text: {
      ru: "Мы не отваживаемся на многое не потому, что оно трудно; оно трудно потому, что мы не отваживаемся.",
      en: "It is not because things are difficult that we do not dare; they are difficult because we do not dare.",
    },
  },
  {
    id: 11,
    author: { ru: "Эпиктет", en: "Epictetus" },
    source: { ru: "«Энхиридион»", en: "Enchiridion" },
    text: {
      ru: "В нашей власти — наши суждения, стремления и действия. Вне нашей власти — тело, имущество, репутация, должности.",
      en: "Up to us are our judgments, strivings and actions. Not up to us are the body, property, reputation and offices.",
    },
  },
  {
    id: 12,
    author: { ru: "Марк Аврелий", en: "Marcus Aurelius" },
    source: { ru: "«Размышления»", en: "Meditations" },
    text: {
      ru: "Утром, когда не хочется подниматься, вспомни: я встаю, чтобы делать дело человека.",
      en: "At dawn, when you have trouble getting out of bed, tell yourself: I rise to do the work of a human being.",
    },
  },
  {
    id: 13,
    author: { ru: "Сенека", en: "Seneca" },
    source: { ru: "«Письма к Луцилию»", en: "Letters to Lucilius" },
    text: {
      ru: "Судьба ведёт того, кто согласен, и тащит того, кто упирается.",
      en: "Fate leads the willing and drags the reluctant.",
    },
  },
  {
    id: 14,
    author: { ru: "Эпиктет", en: "Epictetus" },
    source: { ru: "«Беседы»", en: "Discourses" },
    text: {
      ru: "Свободен тот, кто живёт, как хочет, — кого нельзя ни принудить, ни удержать.",
      en: "He is free who lives as he wishes — who cannot be compelled or restrained.",
    },
  },
  {
    id: 15,
    author: { ru: "Марк Аврелий", en: "Marcus Aurelius" },
    source: { ru: "«Размышления»", en: "Meditations" },
    text: {
      ru: "Лучший способ отомстить — не уподобляться обидчику.",
      en: "The best revenge is not to be like your enemy.",
    },
  },
  {
    id: 16,
    author: { ru: "Сенека", en: "Seneca" },
    source: { ru: "«Письма к Луцилию»", en: "Letters to Lucilius" },
    text: {
      ru: "Не то, что у нас мало времени, а то, что мы много его теряем.",
      en: "It is not that we have a short time to live, but that we waste much of it.",
    },
  },
  {
    id: 17,
    author: { ru: "Эпиктет", en: "Epictetus" },
    source: { ru: "«Энхиридион»", en: "Enchiridion" },
    text: {
      ru: "Болезнь — помеха телу, но не воле, если сама воля того не захочет.",
      en: "Sickness is a hindrance to the body, but not to the will — unless the will itself consents.",
    },
  },
  {
    id: 18,
    author: { ru: "Марк Аврелий", en: "Marcus Aurelius" },
    source: { ru: "«Размышления»", en: "Meditations" },
    text: {
      ru: "Сколько покоя обрёл бы тот, кто не заглядывается на то, что сказал, сделал или подумал ближний.",
      en: "How much rest he would gain who does not look to what his neighbor said, did or thought.",
    },
  },
  {
    id: 19,
    author: { ru: "Сенека", en: "Seneca" },
    source: { ru: "«Письма к Луцилию»", en: "Letters to Lucilius" },
    text: {
      ru: "Кто везде — тот нигде.",
      en: "He who is everywhere is nowhere.",
    },
  },
  {
    id: 20,
    author: { ru: "Эпиктет", en: "Epictetus" },
    source: { ru: "«Энхиридион»", en: "Enchiridion" },
    text: {
      ru: "Помни: обижает не тот, кто оскорбляет, а твоё суждение об этом.",
      en: "Remember: it is not the one who insults who harms you, but your judgment about it.",
    },
  },
  {
    id: 21,
    author: { ru: "Марк Аврелий", en: "Marcus Aurelius" },
    source: { ru: "«Размышления»", en: "Meditations" },
    text: {
      ru: "Не поступай так, будто тебе жить десять тысяч лет. Пока жив — делай, что должно.",
      en: "Do not act as if you had ten thousand years to live. While you live — do what must be done.",
    },
  },
  {
    id: 22,
    author: { ru: "Сенека", en: "Seneca" },
    source: { ru: "«Письма к Луцилию»", en: "Letters to Lucilius" },
    text: {
      ru: "Пока ты не знаешь, куда плывёшь, ни один ветер не будет попутным.",
      en: "If you do not know to which port you are sailing, no wind is favorable.",
    },
  },
  {
    id: 23,
    author: { ru: "Мусоний Руф", en: "Musonius Rufus" },
    source: { ru: "«Беседы»", en: "Lectures" },
    text: {
      ru: "Человека делает добрым не множество слов, а жизнь, согласная с добрыми делами.",
      en: "It is not many words that make a person good, but a life lived in accord with good deeds.",
    },
  },
  {
    id: 24,
    author: { ru: "Марк Аврелий", en: "Marcus Aurelius" },
    source: { ru: "«Размышления»", en: "Meditations" },
    text: {
      ru: "Совершенство характера — проводить каждый день так, будто он последний.",
      en: "Perfection of character is this: to live each day as if it were your last.",
    },
  },
  {
    id: 25,
    author: { ru: "Сенека", en: "Seneca" },
    source: { ru: "«Письма к Луцилию»", en: "Letters to Lucilius" },
    text: {
      ru: "Огонь испытывает золото, несчастье — мужественных.",
      en: "Fire tests gold, misfortune tests brave men.",
    },
  },
  {
    id: 26,
    author: { ru: "Эпиктет", en: "Epictetus" },
    source: { ru: "«Беседы»", en: "Discourses" },
    text: {
      ru: "Не великое дело — то, что ты берёшься за многое; великое — довести до конца то, за что взялся.",
      en: "It is no great thing to take up many tasks; the great thing is to finish what you have taken up.",
    },
  },
  {
    id: 27,
    author: { ru: "Марк Аврелий", en: "Marcus Aurelius" },
    source: { ru: "«Размышления»", en: "Meditations" },
    text: {
      ru: "Если тебя что-то тревожит извне, мучает тебя не оно, а твоё суждение о нём. И в твоей власти изменить это суждение.",
      en: "If you are distressed by anything external, the pain is not due to the thing itself, but to your estimate of it. And this you have the power to revoke at any moment.",
    },
  },
  {
    id: 28,
    author: { ru: "Сенека", en: "Seneca" },
    source: { ru: "«Письма к Луцилию»", en: "Letters to Lucilius" },
    text: {
      ru: "Беден не тот, у кого мало, а тот, кто хочет большего.",
      en: "It is not the man who has too little who is poor, but the one who craves more.",
    },
  },
  {
    id: 29,
    author: { ru: "Эпиктет", en: "Epictetus" },
    source: { ru: "«Энхиридион»", en: "Enchiridion" },
    text: {
      ru: "Держись всегда того, что в твоей власти; об остальном говори: «Это меня не касается».",
      en: "Always cling to what is in your power; of the rest say: “This is nothing to me.”",
    },
  },
  {
    id: 30,
    author: { ru: "Марк Аврелий", en: "Marcus Aurelius" },
    source: { ru: "«Размышления»", en: "Meditations" },
    text: {
      ru: "Счастье твоей жизни зависит от качества твоих мыслей.",
      en: "The happiness of your life depends upon the quality of your thoughts.",
    },
  },
  {
    id: 31,
    author: { ru: "Сенека", en: "Seneca" },
    source: { ru: "«Письма к Луцилию»", en: "Letters to Lucilius" },
    text: {
      ru: "Каждый день следует проводить так, словно он замыкает череду дней.",
      en: "Every day should be lived as though it were closing the series of days.",
    },
  },
  {
    id: 32,
    author: { ru: "Мусоний Руф", en: "Musonius Rufus" },
    source: { ru: "«Беседы»", en: "Lectures" },
    text: {
      ru: "Философствовать — значит искать, как жить правильно, и жить согласно найденному.",
      en: "To philosophize is to seek how to live rightly, and to live according to what is found.",
    },
  },
  {
    id: 33,
    author: { ru: "Эпиктет", en: "Epictetus" },
    source: { ru: "«Беседы»", en: "Discourses" },
    text: {
      ru: "Ни один человек не свободен, если он не владеет собой.",
      en: "No man is free who is not master of himself.",
    },
  },
  {
    id: 34,
    author: { ru: "Марк Аврелий", en: "Marcus Aurelius" },
    source: { ru: "«Размышления»", en: "Meditations" },
    text: {
      ru: "Терпи и воздерживайся. Не позволяй настоящему ускользнуть — не оглядывайся на прошлое с сожалением, не заглядывай в будущее со страхом.",
      en: "Bear and forbear. Do not let the present slip away — do not look back with regret, nor forward with fear.",
    },
  },
  {
    id: 35,
    author: { ru: "Сенека", en: "Seneca" },
    source: { ru: "«Письма к Луцилию»", en: "Letters to Lucilius" },
    text: {
      ru: "Трудности закаляют дух: что не убивает волю — делает её сильнее.",
      en: "Difficulty strengthens the spirit: what does not break the will makes it stronger.",
    },
  },
];

/* ---------------- Детерминированная ротация ----------------
 * Цитата дня: единая фиксированная перестановка библиотеки (36 цитат).
 * Индекс = номер дня mod 36 → в ЛЮБОМ окне из 36 (и тем более 30) дней
 * повторов нет (требование FR-T6). Результат детерминирован и одинаков
 * у всех пользователей; воспроизводим в тестах.
 */

function dayNumber(dateISO: string): number {
  return Math.floor(new Date(dateISO + "T00:00:00Z").getTime() / 86400000);
}

function seededShuffle<T>(arr: readonly T[], seed: number): T[] {
  const out = [...arr];
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const DECK = seededShuffle(QUOTES, 42);

export function quoteOfDay(dateISO: string): Quote {
  const dn = dayNumber(dateISO);
  const idx = ((dn % DECK.length) + DECK.length) % DECK.length;
  return DECK[idx];
}

export function randomQuote(excludeId?: number): Quote {
  const pool = QUOTES.filter((q) => q.id !== excludeId);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function quoteText(q: Quote, locale: Locale): string {
  return q.text[locale];
}

export function quoteAuthor(q: Quote, locale: Locale): string {
  return `${q.author[locale]} · ${q.source[locale]}`;
}

export function getQuoteById(id: number): Quote | undefined {
  return QUOTES.find((q) => q.id === id);
}
