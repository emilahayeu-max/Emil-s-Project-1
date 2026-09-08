/* ============================================================
   Стоя | Stoa — интерактивный hi-fi прототип (черновые UI-макеты)
   Vanilla JS, hash-роутинг, i18n RU/EN, светлая/тёмная тема.
   Это прототип, а не продакшен-код: проверка дизайн-гипотез.
   ============================================================ */

"use strict";

/* ---------------- i18n ---------------- */
const I18N = {
  ru: {
    brand: { name: "Стоя", tagline: "стоический ежедневник" },
    nav: { today: "Сегодня", journal: "Дневник", tasks: "Задачи", guide: "Гид", more: "Ещё" },
    auth: {
      welcome: "Добро пожаловать", sub: "Утро. Намерение. Вечер. Разбор.",
      email: "Электронная почта", password: "Пароль", signin: "Войти",
      signup: "Создать аккаунт", google: "Продолжить с Google", forgot: "Забыли пароль?",
      noacc: "Нет аккаунта? Зарегистрируйтесь", haveacc: "Уже есть аккаунт? Войдите",
      demo: "Демо-прототип: нажмите «Войти» с любым email — аккаунт не создаётся."
    },
    onboarding: {
      skip: "Пропустить", next: "Далее", start: "Начать",
      steps: [
        { icon: "🌅", t: "Утро. Намерение.", d: "Цитата дня, намерение и три главные задачи. День начинается осознанно, а не с уведомлений." },
        { icon: "⚖️", t: "День. Дела под контролем.", d: "Задачи с меткой стоиков: «в моей власти» или «вне её». Энергия — только туда, где вы влияете на исход." },
        { icon: "🌙", t: "Вечер. Честный разбор.", d: "Четыре вопроса Сенеки: что удалось, что было вне контроля, чему научились, за что благодарны." }
      ]
    },
    today: {
      greeting: { morning: "Доброе утро", evening: "Добрый вечер" },
      partMorning: "☀ Утро", partEvening: "🌙 Вечер",
      intention: "Намерение дня", intentionPh: "Ради чего этот день?",
      obstacles: "Предвосхищение препятствий", obstaclesPh: "Что может помешать? Как я отвечу?",
      mainTasks: "Главные задачи дня", addTask: "+ добавить",
      finishMorning: "Завершить утро",
      morningDoneTitle: "Утро завершено", morningDoneSub: "Хорошего дня. До встречи вечером.",
      eveningTitle: "Вечерний разбор",
      q1: "Что удалось?", q1ph: "Главное достижение дня…",
      q2: "Что было вне контроля?", q2ph: "Что я не мог изменить?",
      q3: "Чему я научился?", q3ph: "Один урок дня…",
      q4: "За что благодарен?", q4ph: "Даже малое имеет значение…",
      autoSummary: "Итоги дня — автоматически",
      of: "из", tasksDone: "задач выполнено", external: "вне контроля",
      saveEvening: "Сохранить разбор", eveningSaved: "Разбор сохранён в дневник ✓",
      skipped: "Утро пропущено — и это тоже практика. Начните прямо с вечера.",
      refill: "Изменить утро"
    },
    journal: {
      title: "Дневник", newEntry: "Новая запись", prompt: "✨ Дайте промпт",
      type: "Тип записи", types: { morning: "☀ Утро", evening: "🌙 Вечер", free: "✍ Свободная", practice: "🏺 Практика" },
      mood: "Настроение", tagsPh: "#теги через запятую",
      save: "Сохранить запись", saved: "Запись сохранена ✓",
      empty: "Пока нет записей. Вечерний разбор и практики создают их автоматически.",
      privacy: "🔒 Дневник виден только вам — защита на уровне базы данных",
      textPh: "О чём хочется написать?"
    },
    tasks: {
      title: "Задачи", list: "Список", board: "Доска",
      filterAll: "Все", filterToday: "На сегодня", filterIn: "⭕ В моей власти", filterEx: "◌ Вне моей власти",
      newTask: "Новая задача", titlePh: "Название задачи", notePh: "Заметка (необязательно)",
      priority: "Приоритет", due: "Срок", today: "Сегодня",
      control: "Дихотомия контроля", inControl: "⭕ В моей власти", outControl: "◌ Вне моей власти",
      reactionPh: "Как отвечу? (если вне власти)",
      add: "Добавить", added: "Задача добавлена ✓",
      cols: { todo: "К выполнению", doing: "В работе", done: "Готово" },
      empty: "Задач нет. Пусто — тоже порядок."
    },
    guide: {
      title: "Гид", all: "Все", duration: "мин", why: "Зачем", steps: "Шаги", example: "Пример",
      doPractice: "Выполнить →", practiceDone: "Практика выполнена. Запишите наблюдения в дневник ✓",
      favorites: "⭐ Избранные цитаты", favEmpty: "Сохраняйте цитаты кнопкой 🔖"
    },
    more: {
      title: "Ещё", streakDays: "дней подряд",
      streakNote: "Пропуск — не провал. Возвращаться — тоже практика.",
      week: "Неделя", entries: "записей", tasksDone: "задач", practices: "практик", avgMood: "среднее настроение",
      progress: "Прогресс", favorites: "Избранные цитаты", lang: "Язык интерфейса",
      theme: "Тема", themeLight: "Светлая", themeDark: "Тёмная", themeSystem: "Системная",
      reminders: "Напоминания", morning: "Утро", evening: "Вечер",
      export: "Экспорт данных", exported: "Архив с данными скачан ✓",
      deleteAccount: "Удалить аккаунт",
      deleteConfirm: "Удалить аккаунт и все данные безвозвратно? (демо)",
      deleted: "Аккаунт удалён — это демо, данные на месте :)",
      about: "О приложении",
      aboutText: "Стоя — стоический ежедневник: утренний ритуал, задачи с дихотомией контроля, дневник и вечерний разбор. Учебный проект. Версия 0.1.0 (прототип)."
    },
    quote: { fav: "В избранное", favAdded: "Цитата в избранном ✓", refresh: "Другая" },
    common: { back: "Назад", today: "Сегодня" }
  },
  en: {
    brand: { name: "Stoa", tagline: "stoic daily companion" },
    nav: { today: "Today", journal: "Journal", tasks: "Tasks", guide: "Guide", more: "More" },
    auth: {
      welcome: "Welcome", sub: "Morning. Intention. Evening. Review.",
      email: "Email", password: "Password", signin: "Sign in",
      signup: "Create account", google: "Continue with Google", forgot: "Forgot password?",
      noacc: "No account? Sign up", haveacc: "Already have an account? Sign in",
      demo: "Demo prototype: press “Sign in” with any email — no account is created."
    },
    onboarding: {
      skip: "Skip", next: "Next", start: "Begin",
      steps: [
        { icon: "🌅", t: "Morning. Intention.", d: "A daily quote, an intention, three main tasks. The day starts consciously, not with notifications." },
        { icon: "⚖️", t: "Day. What you control.", d: "Tasks marked the Stoic way: “up to me” or “not up to me”. Energy goes only where you make a difference." },
        { icon: "🌙", t: "Evening. Honest review.", d: "Seneca's four questions: what went well, what was outside your control, what you learned, what you're grateful for." }
      ]
    },
    today: {
      greeting: { morning: "Good morning", evening: "Good evening" },
      partMorning: "☀ Morning", partEvening: "🌙 Evening",
      intention: "Intention for the day", intentionPh: "What is this day for?",
      obstacles: "Premeditation of obstacles", obstaclesPh: "What may get in the way? How will I respond?",
      mainTasks: "Main tasks of the day", addTask: "+ add",
      finishMorning: "Complete morning",
      morningDoneTitle: "Morning complete", morningDoneSub: "Have a good day. See you in the evening.",
      eveningTitle: "Evening review",
      q1: "What went well?", q1ph: "The day's main achievement…",
      q2: "What was outside your control?", q2ph: "What could I not change?",
      q3: "What did I learn?", q3ph: "One lesson of the day…",
      q4: "What am I grateful for?", q4ph: "Even the small things matter…",
      autoSummary: "Day summary — automatic",
      of: "of", tasksDone: "tasks done", external: "outside control",
      saveEvening: "Save review", eveningSaved: "Review saved to journal ✓",
      skipped: "Morning skipped — that is practice too. Start right with the evening.",
      refill: "Edit morning"
    },
    journal: {
      title: "Journal", newEntry: "New entry", prompt: "✨ Give me a prompt",
      type: "Entry type", types: { morning: "☀ Morning", evening: "🌙 Evening", free: "✍ Free", practice: "🏺 Practice" },
      mood: "Mood", tagsPh: "#tags, comma separated",
      save: "Save entry", saved: "Entry saved ✓",
      empty: "No entries yet. Evening reviews and practices create them automatically.",
      privacy: "🔒 Your journal is visible only to you — enforced at the database level",
      textPh: "What would you like to write about?"
    },
    tasks: {
      title: "Tasks", list: "List", board: "Board",
      filterAll: "All", filterToday: "Today", filterIn: "⭕ Up to me", filterEx: "◌ Not up to me",
      newTask: "New task", titlePh: "Task title", notePh: "Note (optional)",
      priority: "Priority", due: "Due", today: "Today",
      control: "Dichotomy of control", inControl: "⭕ Up to me", outControl: "◌ Not up to me",
      reactionPh: "How will I respond? (if not up to me)",
      add: "Add", added: "Task added ✓",
      cols: { todo: "To do", doing: "In progress", done: "Done" },
      empty: "No tasks. Empty is order too."
    },
    guide: {
      title: "Guide", all: "All", duration: "min", why: "Why", steps: "Steps", example: "Example",
      doPractice: "Complete →", practiceDone: "Practice complete. Write your observations in the journal ✓",
      favorites: "⭐ Favorite quotes", favEmpty: "Save quotes with the 🔖 button"
    },
    more: {
      title: "More", streakDays: "day streak",
      streakNote: "A miss is not a failure. Coming back is practice too.",
      week: "This week", entries: "entries", tasksDone: "tasks", practices: "practices", avgMood: "avg mood",
      progress: "Progress", favorites: "Favorite quotes", lang: "Interface language",
      theme: "Theme", themeLight: "Light", themeDark: "Dark", themeSystem: "System",
      reminders: "Reminders", morning: "Morning", evening: "Evening",
      export: "Export data", exported: "Data archive downloaded ✓",
      deleteAccount: "Delete account",
      deleteConfirm: "Delete the account and all data permanently? (demo)",
      deleted: "Account deleted — this is a demo, data is safe :)",
      about: "About",
      aboutText: "Stoa — a stoic daily companion: morning ritual, tasks with the dichotomy of control, journal, evening review. A learning project. Version 0.1.0 (prototype)."
    },
    quote: { fav: "Save", favAdded: "Quote saved ✓", refresh: "Another" },
    common: { back: "Back", today: "Today" }
  }
};

/* ---------------- Данные (моки) ---------------- */
const QUOTES = {
  ru: [
    { a: "Марк Аврелий", s: "«Размышления»", t: "Начинай день с мысли: сегодня я встречу людей суетных, неблагодарных и заносчивых. Никто из них не может причинить мне зла — ведь я сам выбираю, как к этому отнестись." },
    { a: "Эпиктет", s: "«Энхиридион»", t: "Не вещи тревожат людей, а их суждения о вещах." },
    { a: "Сенека", s: "«Письма к Луцилию»", t: "Пока мы откладываем жизнь, она проходит." },
    { a: "Марк Аврелий", s: "«Размышления»", t: "Ты властен над своим умом — но не над внешними событиями. Осознай это, и обретёшь силу." },
    { a: "Сенека", s: "«Письма к Луцилию»", t: "Мы страдаем чаще в воображении, чем в действительности." },
    { a: "Эпиктет", s: "«Беседы»", t: "Сначала скажи себе, кем ты хочешь быть, а затем делай то, что должен делать." }
  ],
  en: [
    { a: "Marcus Aurelius", s: "Meditations", t: "Begin each day by telling yourself: today I shall meet people who are interfering, ungrateful and arrogant. None of them can hurt me — for I alone choose how to respond." },
    { a: "Epictetus", s: "Enchiridion", t: "It is not things that trouble people, but their judgments about things." },
    { a: "Seneca", s: "Letters to Lucilius", t: "While we postpone, life speeds by." },
    { a: "Marcus Aurelius", s: "Meditations", t: "You have power over your mind — not outside events. Realize this, and you will find strength." },
    { a: "Seneca", s: "Letters to Lucilius", t: "We suffer more often in imagination than in reality." },
    { a: "Epictetus", s: "Discourses", t: "First say to yourself what you would be; and then do what you have to do." }
  ]
};

const PROMPTS = {
  ru: {
    morning: ["Что сегодня действительно важно? Почему именно это?", "Какое одно действие приблизит меня к тому, кем я хочу быть?", "Каким человеком я хочу быть в сегодняшних обстоятельствах?"],
    evening: ["Что сегодня получилось лучше всего?", "Какую одну вещь я сделал бы иначе?", "Какой момент дня я хочу сохранить в памяти?"]
  },
  en: {
    morning: ["What truly matters today? Why this?", "Which single action brings me closer to who I want to be?", "What kind of person do I want to be in today's circumstances?"],
    evening: ["What went best today?", "Which one thing would I do differently?", "Which moment of the day do I want to keep?"]
  }
};

const PRACTICES = [
  {
    id: "dichotomy", icon: "⚖️", dur: 5,
    cat: { ru: "Принятие", en: "Acceptance" },
    title: { ru: "Дихотомия контроля", en: "Dichotomy of Control" },
    why: { ru: "Эпиктет начинает «Энхиридион» с разделения всего на зависящее и не зависящее от нас. Тревога почти всегда направлена на второе. Упражнение возвращает внимание туда, где у вас есть власть.", en: "Epictetus opens the Enchiridion by dividing everything into what is and what is not up to us. Anxiety almost always targets the latter. This practice returns attention to where you have power." },
    steps: {
      ru: ["Выпишите всё, что вас сейчас тревожит, — крупно и мелко.", "Проведите черту: слева «в моей власти» (суждения, действия, усилия), справа — «вне её» (погода, чужие решения, прошлое).", "Правую колонку скажите вслух: «Это не в моей власти» — и отпустите.", "Для левой выберите одно действие и выполните его сегодня."],
      en: ["Write down everything currently worrying you — big and small.", "Draw a line: left — “up to me” (judgments, actions, effort); right — “not up to me” (weather, other people's decisions, the past).", "Say the right column out loud: “This is not up to me” — and let it go.", "From the left column, pick one action and do it today."]
    },
    example: { ru: "«Рейс задержали» — вне моей власти. «Как я проведу это время в аэропорту» — в моей.", en: "“The flight is delayed” — not up to me. “How I spend this time at the airport” — up to me." }
  },
  {
    id: "negative-visualization", icon: "🌫", dur: 10,
    cat: { ru: "Принятие", en: "Acceptance" },
    title: { ru: "Негативная визуализация", en: "Negative Visualization" },
    why: { ru: "Стоики мысленно «теряли» то, что имеют, — чтобы ценить настоящее и быть готовыми к переменам. Это не про тревогу, а про благодарность и устойчивость.", en: "The Stoics mentally “lost” what they had — to appreciate the present and prepare for change. This is about gratitude and resilience, not anxiety." },
    steps: {
      ru: ["Выберите то, что вам дорого: человек, здоровье, работа, привычный уклад.", "Представьте на 60 секунд, что этого больше нет. Почувствуйте пустоту.", "Вернитесь в настоящее: «Сейчас это у меня есть».", "Сформулируйте одну благодарность и запишите её."],
      en: ["Choose something dear to you: a person, health, work, a routine.", "For 60 seconds, imagine it is gone. Feel the absence.", "Return to the present: “Right now, I still have it.”", "Formulate one gratitude and write it down."]
    },
    example: { ru: "Утренний кофе, звонок маме, возможность бегать — что исчезло бы без следа, если бы день сложился иначе?", en: "Morning coffee, a call to your mother, the ability to run — what would vanish without a trace if the day went differently?" }
  },
  {
    id: "memento-mori", icon: "🕯", dur: 7,
    cat: { ru: "Смерть и время", en: "Death & Time" },
    title: { ru: "Memento mori", en: "Memento Mori" },
    why: { ru: "«Помни о смерти» — не мрачный лозунг, а напоминание о цене времени. Оно обостряет вопрос: «На что я трачу сегодняшний день?»", en: "“Remember death” is not a gloomy slogan but a reminder of the price of time. It sharpens the question: “What am I spending today on?”" },
    steps: {
      ru: ["Скажите себе: «Этот день не бесконечен. И я тоже» — спокойно, без драмы.", "Спросите: что из запланированного я делаю из страха, а не из смысла?", "Уберите одну «не свою» задачу из списка.", "Сделайте одну вещь, которую давно откладывали, — маленькую."],
      en: ["Tell yourself calmly: “This day is not endless. Neither am I.”", "Ask: which of my plans come from fear rather than meaning?", "Remove one “not mine” task from the list.", "Do one small thing you have long postponed."]
    },
    example: { ru: "Сенека: «Не мало ли у нас времени?.. Мы теряем его, не зная цену» — а вы сегодня знаете цену.", en: "Seneca: “It is not that we have a short time to live… we waste it.” Today, you know its price." }
  },
  {
    id: "amor-fati", icon: "🔥", dur: 6,
    cat: { ru: "Дисциплина", en: "Discipline" },
    title: { ru: "Amor fati — любовь к судьбе", en: "Amor Fati — Love of Fate" },
    why: { ru: "Не просто терпеть происходящее, а видеть в нём материал для роста. Препятствие становится путём.", en: "Not merely to endure what happens, but to see in it material for growth. The obstacle becomes the way." },
    steps: {
      ru: ["Вспомните неприятное событие недели.", "Спросите: «Что хорошего оно уже принесло или может принести?»", "Найдите три ответа — даже неожиданных.", "Переформулируйте событие в одну фразу со словом «благодаря»."],
      en: ["Recall an unpleasant event from this week.", "Ask: “What good has it already brought or may bring?”", "Find three answers — even surprising ones.", "Reframe the event in one sentence starting with “thanks to”."]
    },
    example: { ru: "«Отказ на собеседовании» → «Благодаря отказу я увидел, что презентация была слабой» → план: улучшить её.", en: "“Rejected at the interview” → “Thanks to the rejection I saw my presentation was weak” → plan: improve it." }
  },
  {
    id: "view-from-above", icon: "🌌", dur: 8,
    cat: { ru: "Спокойствие", en: "Calm" },
    title: { ru: "Взгляд сверху", en: "View from Above" },
    why: { ru: "Марк Аврелий советовал смотреть на вещи с высоты — так проблемы возвращаются к своему настоящему размеру.", en: "Marcus Aurelius advised viewing things from above — this returns problems to their true size." },
    steps: {
      ru: ["Закройте глаза и представьте свою комнату, дом, улицу, город — всё выше и выше.", "Найдите на этой карте свою сегодняшнюю проблему. Каков её размер?", "Представьте время: неделю, год, десять лет. Что останется важным?", "Запишите одну мысль, которая пришла."],
      en: ["Close your eyes and picture your room, home, street, city — higher and higher.", "Find today's problem on this map. How big is it?", "Picture time: a week, a year, ten years. What will still matter?", "Write down one thought that came."]
    },
    example: { ru: "Спор в чате кажется огромным — а с высоты города он меньше точки. Что важно: спор или вечер с семьёй?", en: "An argument in a group chat feels huge — from above the city it is smaller than a dot. What matters: the argument or an evening with family?" }
  }
];

const INIT_ENTRIES = [
  { id: "e1", type: "morning", date: "сегодня", mood: 4, tags: ["намерение"], text: "День ради спокойной, сделанной работы. Если начнётся хаос — сначала пауза, потом ответ." },
  { id: "e2", type: "free", date: "вчера", mood: 3, tags: ["работа", "фокус"], text: "Поймал себя на тревоге из-за чужого мнения. Напомнил себе: суждения других — не в моей власти." },
  { id: "e3", type: "practice", date: "вчера", mood: 4, tags: ["практика"], text: "Дихотомия контроля: три пункта тревоги из четырёх оказались вне моей власти. Стало заметно легче." }
];

const INIT_TASKS = [
  { id: "t1", title: "Написать отчёт", note: "", prio: "P1", ctrl: "in", due: "today", status: "doing" },
  { id: "t2", title: "Позвонить партнёру", note: "жду его решения", prio: "P2", ctrl: "ex", due: "today", status: "todo", reaction: "Напомнить один раз и отпустить" },
  { id: "t3", title: "Спортзал 30 минут", note: "", prio: "P2", ctrl: "in", due: "today", status: "done" },
  { id: "t4", title: "Читать Сенеку 15 минут", note: "", prio: "P3", ctrl: "in", due: "", status: "todo" }
];

/* ---------------- Состояние ---------------- */
const S = {
  lang: (localStorage.getItem("stoa.lang") || "ru"),
  theme: (localStorage.getItem("stoa.theme") || "light"),
  route: "auth", onbStep: 0, authMode: "signin",
  dayPart: "morning", morningDone: false, eveningDone: false,
  intention: "", obstacles: "", ev1: "", ev2: "", ev3: "", ev4: "",
  tasks: [...INIT_TASKS], entries: [...INIT_ENTRIES],
  favQuotes: new Set(), quoteIdx: new Date().getDate() % QUOTES.ru.length,
  taskFilter: "all", taskView: "list",
  entryType: "free", entryMood: 3, entryTags: "", entryText: "",
  practiceId: null
};

/* ---------------- Утилиты ---------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const t = (key) => {
  let v = I18N[S.lang];
  for (const p of key.split(".")) v = v?.[p];
  return v ?? I18N.en[key.split(".").pop()] ?? key;
};
const todayStr = () => new Date().toLocaleDateString(S.lang === "ru" ? "ru-RU" : "en-US", { weekday: "long", day: "numeric", month: "long" });
const q = (i) => QUOTES[S.lang][S.quoteIdx % QUOTES[S.lang].length];
const randomPrompt = (kind) => {
  const arr = PROMPTS[S.lang][kind] || PROMPTS[S.lang].morning;
  return arr[Math.floor(Math.random() * arr.length)];
};
const moods = ["😞", "😐", "🙂", "😄", "🤩"];

let toastTimer;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg; el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

function applyTheme() {
  const want = S.theme === "system"
    ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : S.theme;
  document.documentElement.dataset.theme = want;
}

/* ---------------- Рендер ---------------- */
function render() {
  applyTheme();
  document.documentElement.lang = S.lang;
  const app = $("#app");
  const { route } = S;
  const bare = ["auth", "onboarding"].includes(route);

  let shell = "";
  if (!bare) {
    shell += renderSidebar();
    shell += `<div class="app">`;
    if (route !== "entry") shell += `<div class="topbar">${topbarHTML()}${desktopDate()}</div>`;
    shell += `<main class="animate-in" id="main">`;
    shell += SCREENS[route] ? SCREENS[route]() : `<p>404</p>`;
    shell += `</main></div>`;
    shell += route !== "entry" ? renderBottomNav() : "";
  } else {
    shell = SCREENS[route]();
  }
  app.innerHTML = shell;
  bind();
  window.scrollTo(0, 0);
}

function topbarHTML() {
  return `
    <span class="logo">${esc(t("brand.name"))}<small>${esc(t("brand.tagline"))}</small></span>
    <span class="spacer"></span>
    <button class="icon-btn" data-action="theme" title="${esc(t("more.theme"))}">${S.theme === "dark" ? "☀️" : S.theme === "light" ? "🌙" : "🎨"}</button>
    <button class="icon-btn" data-action="lang" title="RU / EN">🌐</button>`;
}
function desktopDate() { return `<span class="date-chip" id="date-chip" style="display:none"></span>`; }

function renderSidebar() {
  const items = [
    ["today", "⌂", t("nav.today")], ["journal", "📖", t("nav.journal")],
    ["tasks", "✅", t("nav.tasks")], ["guide", "🏺", t("nav.guide")], ["more", "•", t("nav.more")]
  ].map(([r, ic, lb]) =>
    `<button class="side-item ${S.route === r ? "active" : ""}" data-nav="${r}"><span>${ic}</span> ${lb}</button>`).join("");
  return `<aside class="sidebar"><span class="logo">${esc(t("brand.name"))}<small>${esc(t("brand.tagline"))}</small></span><nav>${items}</nav>
    <div class="side-foot">
      <button class="icon-btn" data-action="lang" title="RU / EN">🌐</button>
      <button class="icon-btn" data-action="theme" title="${esc(t("more.theme"))}">${S.theme === "dark" ? "☀️" : S.theme === "light" ? "🌙" : "🎨"}</button>
    </div></aside>`;
}

function renderBottomNav() {
  const items = [
    ["today", "⌂", t("nav.today")], ["journal", "📖", t("nav.journal")],
    ["tasks", "✅", t("nav.tasks")], ["guide", "🏺", t("nav.guide")], ["more", "•", t("nav.more")],
  ].map(([r, ic, lb]) =>
    `<button class="${S.route === r ? "active" : ""}" data-nav="${r}"><span class="nav-ic">${ic}</span>${lb}</button>`).join("");
  return `<nav class="bottom-nav">${items}</nav>`;
}

/* ---------------- Экраны ---------------- */
const SCREENS = {

  /* ---- Аутентификация ---- */
  auth() {
    const signin = S.authMode === "signin";
    return `
    <div class="auth-wrap animate-in">
      <div class="hero-mark">🏛</div>
      <h1 style="text-align:center">${esc(t("brand.name"))}</h1>
      <p class="hero-tag">${esc(t("auth.sub"))}</p>
      <div style="max-width:360px;margin:0 auto">
        <div class="card" style="padding:24px">
          <h2 style="margin-bottom:16px">${signin ? esc(t("auth.welcome")) : esc(t("auth.signup"))}</h2>
          <label class="field-label" for="auth-email">${esc(t("auth.email"))}</label>
          <input id="auth-email" class="input-box" type="email" placeholder="you@example.com" style="margin-bottom:14px" />
          <label class="field-label" for="auth-pass">${esc(t("auth.password"))}</label>
          <input id="auth-pass" class="input-box" type="password" placeholder="••••••••" />
          <button class="btn btn-primary btn-block btn-lg" data-action="login" style="margin-top:18px">${signin ? esc(t("auth.signin")) : esc(t("auth.signup"))}</button>
          <button class="btn btn-ghost btn-block" data-action="login" style="margin-top:10px">${esc(t("auth.google"))}</button>
          <div style="display:flex;justify-content:space-between;margin-top:14px">
            <button class="btn-text" data-action="toggle-auth">${signin ? esc(t("auth.noacc")) : esc(t("auth.haveacc"))}</button>
            <button class="btn-text">${esc(t("auth.forgot"))}</button>
          </div>
        </div>
        <p class="muted-note" style="text-align:center;margin-top:14px">${esc(t("auth.demo"))}</p>
      </div>
    </div>`;
  },

  /* ---- Онбординг ---- */
  onboarding() {
    const st = I18N[S.lang].onboarding.steps[S.onbStep];
    const last = S.onbStep === 2;
    return `
    <div class="app animate-in" style="padding-bottom:40px">
      <div class="topbar">
        <span class="logo">${esc(t("brand.name"))}</span>
        <span class="spacer"></span>
        <button class="btn-text" data-action="skip-onb">${esc(t("onboarding.skip"))}</button>
      </div>
      <div class="onb-step">
        <div class="onb-ill">${st.icon}</div>
        <h2>${esc(st.t)}</h2>
        <p>${esc(st.d)}</p>
        <div class="dots">${[0, 1, 2].map(i => `<span class="dot ${i === S.onbStep ? "on" : ""}"></span>`).join("")}</div>
        <button class="btn btn-primary btn-lg" style="min-width:200px" data-action="onb-next">${last ? esc(t("onboarding.start")) : esc(t("onboarding.next"))} →</button>
      </div>
    </div>`;
  },

  /* ---- Сегодня ---- */
  today() {
    const qq = q();
    const fav = S.favQuotes.has(S.quoteIdx);
    const morning = S.dayPart === "morning";
    const tasksToday = S.tasks.filter(x => x.due === "today");
    const doneN = tasksToday.filter(x => x.status === "done").length;
    const extN = tasksToday.filter(x => x.ctrl === "ex" && x.status !== "done").length;

    let body = "";
    if (morning) {
      if (S.morningDone) {
        body = `
          <div class="card animate-in" style="text-align:center;padding:32px 20px">
            <div style="font-size:40px;margin-bottom:8px">🌤</div>
            <h2>${esc(t("today.morningDoneTitle"))}</h2>
            <p class="soft" style="margin:10px 0 18px">${esc(t("today.morningDoneSub"))}</p>
            <button class="btn btn-ghost" data-action="part" data-part="evening">${esc(t("today.partEvening"))}</button>
            <button class="btn-text" data-action="refill-morning">${esc(t("today.refill"))}</button>
          </div>`;
      } else {
        body = `
          <div class="card quote-card animate-in">
            <div class="quote-text">${esc(qq.t)}</div>
            <div class="quote-author">${esc(qq.a)} · ${esc(qq.s)}</div>
            <div class="quote-actions">
              <button class="icon-btn ${fav ? "active" : ""}" data-action="fav-quote" title="${esc(t("quote.fav"))}">🔖</button>
              <button class="icon-btn" data-action="next-quote" title="${esc(t("quote.refresh"))}">↻</button>
            </div>
          </div>

          <div class="card animate-in">
            <label class="field-label">${esc(t("today.intention"))}</label>
            <textarea class="underline-input" data-field="intention" placeholder="${esc(t("today.intentionPh"))}">${esc(S.intention)}</textarea>
            <label class="field-label" style="margin-top:18px">${esc(t("today.obstacles"))}</label>
            <textarea class="underline-input" data-field="obstacles" placeholder="${esc(t("today.obstaclesPh"))}">${esc(S.obstacles)}</textarea>
          </div>

          <div class="card animate-in">
            <div class="section-label" style="margin-top:0">${esc(t("today.mainTasks"))}</div>
            <div id="today-checks">${tasksToday.map(x => `
              <div class="check-row ${x.status === "done" ? "done" : ""}" data-id="${x.id}">
                <button class="check" data-action="toggle-task" data-id="${x.id}">✓</button>
                <div><div class="check-title">${esc(x.title)}</div>
                <div class="check-sub"><span class="badge priority">${x.prio}</span>
                <span class="badge ${x.ctrl === "in" ? "control-in" : "control-ex"}">${x.ctrl === "in" ? esc(t("tasks.inControl")) : esc(t("tasks.outControl"))}</span></div></div>
              </div>`).join("") || `<p class="soft" style="padding:8px 4px">${esc(t("tasks.empty"))}</p>`}
            </div>
            <button class="btn-text" data-action="go-tasks" style="margin-top:6px">${esc(t("today.addTask"))}</button>
          </div>

          <button class="btn btn-primary btn-block btn-lg animate-in" data-action="finish-morning">${esc(t("today.finishMorning"))} ✓</button>`;
      }
    } else {
      const saved = S.eveningDone;
      body = `
        <div class="card animate-in" style="border-left:3px solid var(--accent)">
          <div class="section-label" style="margin-top:0">${esc(t("today.eveningTitle"))}</div>
          ${saved ? `<div style="text-align:center;padding:18px 0">
              <div style="font-size:36px">🌙</div>
              <h2 style="margin:8px 0">${esc(t("today.eveningSaved"))}</h2>
              <button class="btn-text" data-action="part" data-part="morning">${esc(t("today.partMorning"))}</button>
            </div>` : `
          ${[["ev1", "q1", "q1ph"], ["ev2", "q2", "q2ph"], ["ev3", "q3", "q3ph"], ["ev4", "q4", "q4ph"]].map(([f, l, p]) => `
            <label class="field-label">${esc(t("today." + l))}</label>
            <textarea class="underline-input" data-field="${f}" placeholder="${esc(t("today." + p))}">${esc(S[f])}</textarea>`).join("")}
          <div class="card" style="background:var(--surface-2);margin-top:18px;box-shadow:none">
            <div class="field-label" style="font-size:13px">${esc(t("today.autoSummary"))}</div>
            <div class="muted-note">✅ ${doneN} ${esc(t("today.of"))} ${tasksToday.length} ${esc(t("today.tasksDone"))}${extN ? ` · ◌ ${extN} ${esc(t("today.external"))}` : ""}</div>
          </div>
          <button class="btn btn-primary btn-block btn-lg" style="margin-top:14px" data-action="save-evening">${esc(t("today.saveEvening"))}</button>`}
        </div>
        ${!S.morningDone && !saved ? `<p class="muted-note animate-in" style="text-align:center">${esc(t("today.skipped"))}</p>` : ""}`;
    }

    const greet = t("today.greeting." + (morning ? "morning" : "evening"));
    return `
      <div class="screen-head animate-in">
        <h1>${greet}${S.lang === "ru" ? ", путник" : ", friend"}</h1>
        <p class="soft" style="margin-top:4px">${esc(todayStr())}</p>
      </div>
      <div class="seg animate-in" style="margin:14px 0 20px">
        <button class="${morning ? "on" : ""}" data-action="part" data-part="morning">${esc(t("today.partMorning"))}</button>
        <button class="${!morning ? "on" : ""}" data-action="part" data-part="evening">${esc(t("today.partEvening"))}</button>
      </div>
      ${body}`;
  },

  /* ---- Дневник ---- */
  journal() {
    const list = S.entries.map(e => {
      const typeLabel = t("journal.types." + e.type);
      return `
      <div class="card entry-card animate-in" data-action="open-entry" data-id="${e.id}">
        <div class="entry-head">
          <span class="badge type">${typeLabel}</span>
          <span class="entry-date">${esc(e.date)}</span>
          <span class="spacer" style="flex:1"></span>
          <span class="mood">${moods[e.mood - 1] || moods[2]}</span>
        </div>
        <div class="entry-text">${esc(e.text.length > 160 ? e.text.slice(0, 160) + "…" : e.text)}</div>
        <div class="entry-tags">${e.tags.map(tag => `<span class="chip">#${esc(tag)}</span>`).join("")}</div>
      </div>`;
    }).join("");
    return `
      <div style="display:flex;align-items:center;gap:12px">
        <h1 class="screen-title animate-in" style="flex:1">${esc(t("journal.title"))}</h1>
        <button class="btn btn-primary desktop-only" data-action="new-entry">＋ ${esc(t("journal.newEntry"))}</button>
      </div>
      <p class="lock-line animate-in" style="margin-bottom:16px">${esc(t("journal.privacy"))}</p>
      ${list || `<div class="card animate-in"><p class="soft" style="text-align:center;padding:16px">${esc(t("journal.empty"))}</p></div>`}
      <button class="fab" data-action="new-entry" aria-label="${esc(t("journal.newEntry"))}">⊕</button>`;
  },

  /* ---- Редактор записи ---- */
  entry() {
    const types = ["morning", "evening", "free", "practice"];
    const practice = PRACTICES.find(p => p.id === S.practiceId);
    return `
      <div class="topbar">
        <button class="icon-btn" data-action="back" aria-label="${esc(t("common.back"))}">←</button>
        <span class="spacer"></span>
        <button class="btn btn-primary" data-action="save-entry">${esc(t("journal.save"))}</button>
      </div>
      <div class="animate-in">
        <div class="seg" style="margin-bottom:18px;flex-wrap:wrap">
          ${types.map(ty => `<button class="${S.entryType === ty ? "on" : ""}" data-action="entry-type" data-type="${ty}">${esc(t("journal.types." + ty))}</button>`).join("")}
        </div>
        ${practice ? `<div class="card" style="border-left:3px solid var(--accent)">
            <div class="section-label" style="margin-top:0">🏺 ${esc(practice.title[S.lang])}</div>
            <p class="muted-note">${esc(practice.example[S.lang])}</p></div>` : ""}
        <button class="btn btn-ghost" data-action="give-prompt" style="margin-bottom:14px">${esc(t("journal.prompt"))}</button>
        <textarea class="underline-input" id="entry-text" data-field="entryText" style="min-height:180px" placeholder="${esc(t("journal.textPh"))}">${esc(S.entryText)}</textarea>
        <div class="card" style="margin-top:20px">
          <label class="field-label">${esc(t("journal.mood"))}</label>
          <div class="mood-picker" style="margin-bottom:16px">
            ${moods.map((m, i) => `<button class="${S.entryMood === i + 1 ? "on" : ""}" data-action="entry-mood" data-mood="${i + 1}">${m}</button>`).join("")}
          </div>
          <label class="field-label">#</label>
          <input class="input-box" data-field="entryTags" placeholder="${esc(t("journal.tagsPh"))}" value="${esc(S.entryTags)}" />
        </div>
      </div>`;
  },

  /* ---- Задачи ---- */
  tasks() {
    const filtered = S.tasks.filter(x =>
      S.taskFilter === "all" ? true :
      S.taskFilter === "today" ? x.due === "today" :
      S.taskFilter === "in" ? x.ctrl === "in" :
      S.taskFilter === "ex" ? x.ctrl === "ex" : true);
    const row = x => `
      <div class="card task-card animate-in" data-id="${x.id}">
        <button class="check" data-action="cycle-task" data-id="${x.id}" style="${x.status === "done" ? "background:var(--sage);border-color:var(--sage);color:#fff" : ""}">${x.status === "done" ? "✓" : ""}</button>
        <div style="flex:1">
          <div class="task-title ${x.status === "done" ? "done-title" : ""}" style="${x.status === "done" ? "text-decoration:line-through;color:var(--text-soft)" : ""}">${esc(x.title)}</div>
          <div class="task-meta">
            <span class="badge priority">${x.prio}</span>
            ${x.due === "today" ? `<span class="badge type">${esc(t("tasks.today"))}</span>` : ""}
            <span class="badge ${x.ctrl === "in" ? "control-in" : "control-ex"}">${x.ctrl === "in" ? esc(t("tasks.inControl")) : esc(t("tasks.outControl"))}</span>
            ${x.reaction ? `<span class="badge type">↳ ${esc(x.reaction)}</span>` : ""}
          </div>
        </div>
      </div>`;

    let view;
    if (S.taskView === "list") {
      view = filtered.map(row).join("") || `<div class="card animate-in"><p class="soft" style="text-align:center;padding:14px">${esc(t("tasks.empty"))}</p></div>`;
    } else {
      const cols = ["todo", "doing", "done"];
      view = `<div class="board">` + cols.map(c => `
        <div class="col animate-in">
          <h4>${esc(t("tasks.cols." + c))}</h4>
          ${filtered.filter(x => x.status === c).map(x => `
            <div class="mini">
              <div class="task-title" style="font-size:14px">${esc(x.title)}</div>
              <div class="task-meta">
                <span class="badge priority">${x.prio}</span>
                <span class="badge ${x.ctrl === "in" ? "control-in" : "control-ex"}">${x.ctrl === "in" ? "⭕" : "◌"}</span>
              </div>
            </div>`).join("") || `<p class="muted-note" style="text-align:center;padding:8px">—</p>`}
        </div>`).join("") + `</div>`;
    }

    return `
      <div class="animate-in">
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <h1 class="screen-title" style="margin:0">${esc(t("tasks.title"))}</h1>
          <span class="spacer" style="flex:1"></span>
          <div class="seg">
            <button class="${S.taskView === "list" ? "on" : ""}" data-action="task-view" data-view="list">${esc(t("tasks.list"))}</button>
            <button class="${S.taskView === "board" ? "on" : ""}" data-action="task-view" data-view="board">${esc(t("tasks.board"))}</button>
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin:16px 0 18px">
          ${["all", "today", "in", "ex"].map(f => `<button class="chip ${S.taskFilter === f ? "on" : ""}" data-action="task-filter" data-filter="${f}">${esc(t("tasks.filter" + (f === "all" ? "All" : f === "today" ? "Today" : f === "in" ? "In" : "Ex")))}</button>`).join("")}
        </div>
        <form id="quick-task" class="card animate-in" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
          <input class="input-box" id="quick-title" placeholder="${esc(t("tasks.titlePh"))}" style="flex:1" />
          <select class="input-box" id="quick-prio" style="width:70px;padding:12px 8px">
            <option>P1</option><option selected>P2</option><option>P3</option>
          </select>
          <select class="input-box" id="quick-ctrl" style="width:170px;padding:12px 8px">
            <option value="in">⭕ ${esc(t("tasks.inControl"))}</option>
            <option value="ex">◌ ${esc(t("tasks.outControl"))}</option>
          </select>
          <button class="btn btn-primary" type="submit">${esc(t("tasks.add"))}</button>
        </form>
        ${view}
      </div>`;
  },

  /* ---- Гид ---- */
  guide() {
    const cards = PRACTICES.map(p => `
      <div class="card practice-card animate-in" data-action="open-practice" data-id="${p.id}">
        <div class="cat">${p.icon} ${esc(p.cat[S.lang])} · ${p.dur} ${esc(t("guide.duration"))}</div>
        <h3>${esc(p.title[S.lang])}</h3>
        <p class="muted-note">${esc(p.why[S.lang].slice(0, 110))}…</p>
      </div>`).join("");
    return `
      <h1 class="screen-title animate-in">${esc(t("guide.title"))}</h1>
      <div class="practice-grid">${cards}</div>`;
  },

  /* ---- Карточка практики ---- */
  practice() {
    const p = PRACTICES.find(x => x.id === S.practiceId);
    if (!p) return `<p>404</p>`;
    const steps = p.steps[S.lang].map((s, i) => `
      <div class="step animate-in"><div class="step-num">${i + 1}</div><div>${esc(s)}</div></div>`).join("");
    return `
      <div class="animate-in">
        <button class="btn-text" data-action="back">← ${esc(t("common.back"))}</button>
        <div class="card" style="margin-top:10px;border-left:3px solid var(--accent)">
          <div class="cat" style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-soft)">${p.icon} ${esc(p.cat[S.lang])} · ${p.dur} ${esc(t("guide.duration"))}</div>
          <h2 style="margin:8px 0 10px">${esc(p.title[S.lang])}</h2>
          <div class="section-label">${esc(t("guide.why"))}</div>
          <p class="muted-note">${esc(p.why[S.lang])}</p>
        </div>
        <div class="card">
          <div class="section-label" style="margin-top:0">${esc(t("guide.steps"))}</div>
          ${steps}
        </div>
        <div class="card" style="background:var(--surface-2);box-shadow:none">
          <div class="section-label" style="margin-top:0">${esc(t("guide.example"))}</div>
          <p class="muted-note">${esc(p.example[S.lang])}</p>
        </div>
        <button class="btn btn-primary btn-block btn-lg" data-action="do-practice" data-id="${p.id}">${esc(t("guide.doPractice"))}</button>
      </div>`;
  },

  /* ---- Ещё / настройки ---- */
  more() {
    const favs = [...S.favQuotes].map(i => QUOTES[S.lang][i]);
    return `
      <h1 class="screen-title animate-in">${esc(t("more.title"))}</h1>
      <div class="card streak-card animate-in">
        <div class="streak-num">7</div>
        <div class="soft" style="margin-top:4px">🔥 ${esc(t("more.streakDays"))}</div>
        <p class="muted-note" style="margin-top:10px;max-width:340px;margin-left:auto;margin-right:auto">${esc(t("more.streakNote"))}</p>
        <div class="stat-row">
          <div class="stat"><b>5</b><span>${esc(t("more.entries"))}</span></div>
          <div class="stat"><b>12</b><span>${esc(t("more.tasksDone"))}</span></div>
          <div class="stat"><b>2</b><span>${esc(t("more.practices"))}</span></div>
          <div class="stat"><b>4.2</b><span>${esc(t("more.avgMood"))}</span></div>
        </div>
      </div>

      <div class="card animate-in">
        <button class="menu-row" data-action="lang"><span class="mr-ic">🌐</span> ${esc(t("more.lang"))}<span class="chev">${S.lang === "ru" ? "Русский" : "English"} ›</span></button>
        <button class="menu-row" data-action="theme"><span class="mr-ic">🎨</span> ${esc(t("more.theme"))}<span class="chev">${S.theme === "dark" ? esc(t("more.themeDark")) : S.theme === "system" ? esc(t("more.themeSystem")) : esc(t("more.themeLight"))} ›</span></button>
        <button class="menu-row" data-action="reminders"><span class="mr-ic">⏰</span> ${esc(t("more.reminders"))}<span class="chev">${esc(t("more.morning"))} 8:00 · ${esc(t("more.evening"))} 21:00 ›</span></button>
        <button class="menu-row" data-action="export"><span class="mr-ic">⬇️</span> ${esc(t("more.export"))}<span class="chev">›</span></button>
        <button class="menu-row" data-action="about"><span class="mr-ic">ℹ️</span> ${esc(t("more.about"))}<span class="chev">›</span></button>
        <button class="menu-row" data-action="delete-account" style="color:var(--clay)"><span class="mr-ic">🗑</span> ${esc(t("more.deleteAccount"))}<span class="chev">›</span></button>
      </div>

      <div class="section-label">${esc(t("more.favorites"))}</div>
      ${favs.length ? favs.map(f => `
        <div class="card animate-in" style="border-left:3px solid var(--gold)">
          <div class="quote-text" style="font-size:17px">${esc(f.t)}</div>
          <div class="quote-author" style="margin-top:6px">${esc(f.a)}</div>
        </div>`).join("") : `<div class="card animate-in"><p class="muted-note" style="text-align:center;padding:10px">${esc(t("guide.favEmpty"))}</p></div>`}
      <p class="muted-note animate-in" style="text-align:center;margin-top:10px">${esc(t("more.aboutText"))}</p>`;
  }
};

/* ---------------- Действия ---------------- */
function go(route, extra) {
  S.route = route;
  if (extra) Object.assign(S, extra);
  location.hash = "#/" + route;
}

function bind() {
  // поля с data-field
  document.querySelectorAll("[data-field]").forEach(el => {
    el.addEventListener("input", () => { S[el.dataset.field] = el.value; });
  });
  // дата (десктоп)
  const dc = $("#date-chip");
  if (dc) dc.textContent = todayStr(), dc.style.display = "";
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action], [data-nav], .entry-card");
  if (!btn) return;

  const nav = btn.dataset.nav;
  if (nav) { go(nav); return; }

  switch (btn.dataset.action) {

    case "login": { go("onboarding"); break; }
    case "toggle-auth": { S.authMode = S.authMode === "signin" ? "signup" : "signin"; render(); break; }
    case "skip-onb": { go("today"); break; }
    case "onb-next": {
      if (S.onbStep < 2) { S.onbStep++; render(); }
      else { S.onbStep = 0; go("today"); }
      break;
    }

    case "part": { S.dayPart = btn.dataset.part; render(); break; }
    case "refill-morning": { S.morningDone = false; render(); break; }
    case "finish-morning": { S.morningDone = true; toast(t("today.morningDoneTitle")); render(); break; }
    case "save-evening": { S.eveningDone = true; toast(t("today.eveningSaved")); render(); break; }

    case "toggle-task": {
      const x = S.tasks.find(v => v.id === btn.dataset.id);
      if (x) { x.status = x.status === "done" ? "todo" : "done"; render(); }
      break;
    }
    case "cycle-task": {
      const x = S.tasks.find(v => v.id === btn.dataset.id);
      if (x) { x.status = x.status === "todo" ? "doing" : x.status === "doing" ? "done" : "todo"; render(); }
      break;
    }
    case "task-view": { S.taskView = btn.dataset.view; render(); break; }
    case "task-filter": { S.taskFilter = btn.dataset.filter; render(); break; }
    case "go-tasks": { go("tasks"); break; }

    case "new-entry": { S.practiceId = null; go("entry"); break; }
    case "entry-type": { S.entryType = btn.dataset.type; render(); break; }
    case "entry-mood": { S.entryMood = +btn.dataset.mood; render(); break; }
    case "give-prompt": {
      const kind = S.entryType === "evening" ? "evening" : S.entryType === "morning" ? "morning" : (Math.random() > .5 ? "morning" : "evening");
      S.entryText = randomPrompt(kind);
      render();
      break;
    }
    case "save-entry": {
      if (!S.entryText.trim()) { toast(t("journal.textPh")); break; }
      const practice = PRACTICES.find(p => p.id === S.practiceId);
      S.entries.unshift({
        id: "e" + Date.now(), type: S.practiceId ? "practice" : S.entryType,
        date: t("common.today"), mood: S.entryMood,
        tags: S.entryTags.split(",").map(x => x.trim().replace(/^#/, "")).filter(Boolean),
        text: S.entryText
      });
      S.entryText = ""; S.entryTags = ""; S.practiceId = null;
      toast(t("journal.saved"));
      go("journal");
      break;
    }
    case "open-entry": { /* демо: просмотр = тост */ toast(t("journal.types." + (S.entries.find(v => v.id === btn.dataset.id)?.type || "free"))); break; }

    case "open-practice": { S.practiceId = btn.dataset.id; go("practice"); break; }
    case "do-practice": {
      S.practiceId = btn.dataset.id;
      toast(t("guide.practiceDone"));
      S.entryType = "practice";
      go("entry");
      break;
    }

    case "fav-quote": {
      S.favQuotes.has(S.quoteIdx) ? S.favQuotes.delete(S.quoteIdx) : S.favQuotes.add(S.quoteIdx);
      toast(t("quote.favAdded")); render();
      break;
    }
    case "next-quote": { S.quoteIdx++; render(); break; }

    case "lang": {
      S.lang = S.lang === "ru" ? "en" : "ru";
      localStorage.setItem("stoa.lang", S.lang);
      render();
      break;
    }
    case "theme": {
      S.theme = S.theme === "light" ? "dark" : S.theme === "dark" ? "system" : "light";
      localStorage.setItem("stoa.theme", S.theme);
      applyTheme(); render();
      break;
    }
    case "reminders": { toast("⏰ 8:00 / 21:00 — демо"); break; }
    case "about": { toast(t("more.aboutText")); break; }
    case "export": {
      const blob = new Blob([JSON.stringify({ entries: S.entries, tasks: S.tasks, exportedAt: new Date().toISOString() }, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "stoa-export.json";
      a.click();
      toast(t("more.exported"));
      break;
    }
    case "delete-account": {
      if (confirm(t("more.deleteConfirm"))) toast(t("more.deleted"));
      break;
    }
    case "back": { history.back(); break; }
  }
});

/* форма быстрого добавления задачи */
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && (e.target.id === "auth-email" || e.target.id === "auth-pass")) {
    e.preventDefault();
    S.authMode = "signin";
    go("onboarding");
  }
});

document.addEventListener("submit", (e) => {
  if (e.target.id !== "quick-task") return;
  e.preventDefault();
  const title = $("#quick-title").value.trim();
  if (!title) { toast(t("tasks.titlePh")); return; }
  S.tasks.unshift({
    id: "t" + Date.now(), title, note: "",
    prio: $("#quick-prio").value,
    ctrl: $("#quick-ctrl").value,
    due: "today", status: "todo"
  });
  toast(t("tasks.added"));
  render();
});

/* ---------------- Роутер ---------------- */
function route() {
  const h = location.hash.replace(/^#\//, "") || "auth";
  const [name, param] = h.split("/");
  S.route = ["auth", "onboarding", "today", "journal", "entry", "tasks", "guide", "practice", "more"].includes(name) ? name : "today";
  if (S.route === "practice") S.practiceId = param || S.practiceId;
  render();
}
window.addEventListener("hashchange", route);
route();
