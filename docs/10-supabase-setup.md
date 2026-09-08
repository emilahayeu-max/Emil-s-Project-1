# 10. Подключение облака Supabase — инструкция для новичка (по шагам)

> **Статус: ✅ ПОДКЛЮЧЕНО.** Облачный проект Supabase создан, SQL выполнен («Success. No rows returned»), ключи (Project URL + anon public) заведены в `web/.env.local` (файл вне git). Приложение работает в облачном режиме — `/api/health` отдаёт `"backend": "supabase"`, на экране входа — надпись «☁ Облачный режим».
>
> Инструкция ниже остаётся как справочник (например, если понадобится новый проект или перенос на другое устройство).

## Что это даст (простыми словами)

Сейчас приложение работает в **демо-режиме**: всё, что вы записываете, хранится только в вашем браузере.

После подключения облака:
- ✅ **Один аккаунт на всех устройствах** — начали запись на телефоне, продолжили на ноутбуке;
- ✅ **Данные не пропадут**, даже если очистить браузер или сменить компьютер;
- ✅ Данные **защищены** «замками» на уровне базы данных (правила RLS): каждый видит только своё;
- ✅ Бесплатно в пределах: 500 МБ данных, 50 000 пользователей в месяц. Для личного дневника это очень много (тысячи записей — это копейки мегабайт).

## Словарик (30 секунд)

| Слово | Что это простым языком |
|---|---|
| **Supabase** | Бесплатный «готовый сервер в облаке»: хранит ваши данные и управляет аккаунтами |
| **Проект** | Ваша личная база данных на их сервере |
| **SQL Editor** | Окошко, куда вставляют готовые команды для базы |
| **Ключи (URL + anon key)** | «Адрес дома» + «ключ от входной двери» — их получает приложение, чтобы знать, куда сохранять данные. Anon-ключ специально сделан публичным, он не секретный |
| **RLS** | «Замки» в базе: каждый пользователь видит только свои записи, чужие — физически недоступны |

---

## Шаг 1. Регистрируемся на supabase.com (2 минуты)

1. Откройте в браузере сайт **https://supabase.com**
2. Нажмите кнопку **«Start your project»** (или «Sign in» / «Войти»).
3. Самый простой способ — войти через **GitHub** (кнопка «Continue with GitHub»). Если у вас есть аккаунт на GitHub — просто нажмите её и разрешите вход.
   Нет GitHub? Зарегистрируйтесь обычным способом — по электронной почте.

## Шаг 2. Создаём проект (2 минуты + ожидание)

1. Нажмите зелёную кнопку **«New project»** («Новый проект»).
2. Заполните форму:
   - **Name** — название, например `stoa`;
   - **Database password** — нажмите кнопку «Generate a password» (сгенерировать пароль) и **сохраните его** (запишите или положите в менеджер паролей). Этот пароль нужен только для входа в панель управления, приложение его не использует;
   - **Region** — выберите регион, ближайший к вам (для Европы — например, **Frankfurt**, для ОАЭ — Frankfurt или Mumbai тоже подойдут);
   - **Free plan** — ничего не меняйте, бесплатный план уже выбран.
3. Нажмите **«Create new project»**.
4. Подождите 1–2 минуты, пока проект готовится (страница сама обновится).

## Шаг 3. Включаем «каркас» базы данных (3 минуты)

Мы заранее написали все команды. Вам нужно просто «вставить и нажать» — **один раз**.

1. В меню слева на сайте Supabase найдите пункт **«SQL Editor»**.
2. Нажмите **«New query»** («Новый запрос») — откроется пустое окошко.
3. Скопируйте **весь текст одним куском** — он лежит ниже в этом документе (раздел «Текст для вставки») или в файле `supabase/setup-all.sql` репозитория.
4. Вставьте текст в окошко и нажмите зелёную кнопку **«Run»**.
5. Дождитесь надписи **«Success. No rows returned»** — значит, всё сработало. ✅

Что только что произошло: создались 8 «ящиков» (таблиц) для записей, задач, дневника — и на каждый ящик повесили «замок» (правило RLS): каждый пользователь видит только свои данные. Плюс загрузились цитаты и практики.

> ⚠️ Выполняйте этот шаг **ровно один раз**. Если нажали Run дважды и появилась ошибка — не страшно, просто напишите мне, я подскажу, как поправить.

## Шаг 4. Выключаем подтверждение почты (необязательно, но проще)

Если оставить как есть, то после регистрации в приложении вам будет приходить письмо со ссылкой для подтверждения — это безопаснее, но чуть сложнее.

Для простого старта рекомендую выключить:
1. В меню слева: **Authentication** → **Sign In / Providers** → **Email**.
2. Выключите переключатель **«Confirm email»**.
3. Нажмите **«Save»**.

Теперь регистрация в приложении будет мгновенной, без писем.

## Шаг 5. Берём ключи (1 минута)

1. В меню слева внизу нажмите **«Project Settings»** (иконка-шестерёнка).
2. Откройте раздел **«API»** (или «Data API»).
3. Скопируйте два значения:
   - **Project URL** — выглядит как `https://xxxxxxxx.supabase.co`;
   - **anon public** (ключ `anon public`) — длинная строка букв и цифр.

Сохраните их в блокнот — они понадобятся в следующем шаге.

## Шаг 6. Подключаем приложение (два способа — выберите один)

### Способ А — пришлите ключи мне (проще всего) ✉️

Просто отправьте оба значения прямо в этот чат:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=длинная-строка
```

Это безопасно: anon-ключ специально сделан «публичным» — он и так встраивается в приложение и виден любому посетителю. Секретным является только пароль базы из шага 2 — его присылать не нужно.

Я сам подключу ключи, перезапущу приложение и проверю, что всё работает. После этого в приложении на экране «Ещё» появится строка **«Источник данных: Supabase (облако) ☁»**.

### Способ Б — если вы запускаете проект сами на своём компьютере

1. В папке `web` создайте файл с точным именем **`.env.local`** (начинается с точки).
2. Внутри — две строки:

```
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш-длинный-ключ
```

3. Перезапустите приложение: остановите `npm run dev` (Ctrl+C) и запустите снова.

## Шаг 7. Проверяем, что всё работает (2 минуты)

1. Откройте приложение → экран **«Ещё»** → строка «Источник данных» должна показывать **«Supabase (облако) ☁»**.
2. Создайте новый аккаунт (регистрация).
3. Добавьте задачу или запись.
4. Откройте приложение на другом устройстве (или в другом браузере) → войдите тем же email и паролем → **ваши данные на месте**.
5. Смелый тест: очистите данные браузера → войдите снова → ничего не пропало.

---

## Если что-то пошло не так

| Ситуация | Что делать |
|---|---|
| Проект «заснул» (через 7 дней без использования) | Зайдите на supabase.com → ваш проект → нажмите кнопку **«Restore project»**. Займёт минуту |
| Забыли пароль базы данных (из шага 2) | Project Settings → **Database** → «Reset database password» |
| В приложении всё ещё «Демо (этот браузер)» | Проверьте, что ключи записаны без опечаток и приложение перезапущено |
| При регистрации ошибка «Что-то пошло не так» | Проверьте интернет; откройте в Supabase раздел Authentication → Users — если пользователь появился, просто войдите снова |
| Ошибка «Invalid login credentials» | Неверный email или пароль. Пароль можно сбросить: Authentication → Users → выбрать пользователя → Reset password (но проще создать новый аккаунт) |
| После SQL не «Success», а ошибка | Скопируйте текст ошибки и пришлите мне — разберёмся вместе |

## А если не хочется возиться с Supabase?

Ничего страшного! Приложение полностью работает и в демо-режиме — просто данные хранятся в браузере. Инструкция нужна только для синхронизации между устройствами.

## Что дальше (необязательно)

- **Выложить приложение в интернет** (Vercel, бесплатно) — тогда оно будет открываться с любого устройства по ссылке, без запуска на компьютере. Скажите — распишу так же по шагам.
- Включить подтверждение почты обратно (Шаг 4) — когда захочется больше безопасности.

---

## Приложение: Текст для вставки (скопируйте целиком)

Это и есть то, что нужно вставить в **SQL Editor → New query → Run**. Скопируйте **весь серый блок ниже целиком** (кнопка «Copy» в углу блока или выделите всё вручную от первой строки `-- ====` до самой последней строки со словом `tomorrow.`), вставьте в окошко Supabase и нажмите **Run**. Ничего внутри текста не меняйте.

```sql
-- ============================================================
-- «Стоя» / Stoa — ВСЁ В ОДНОМ: создание базы данных и контента
-- Скопируйте ЭТОТ ТЕКСТ ЦЕЛИКОМ в SQL Editor (Supabase) и нажмите Run.
-- Выполнять ровно один раз.
-- ============================================================

-- ---------- 1. Таблицы ----------

-- Профиль пользователя (1:1 с auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  lang text not null default 'ru' check (lang in ('ru', 'en')),
  theme text not null default 'light' check (theme in ('light', 'dark', 'system')),
  timezone text not null default 'UTC',
  morning_reminder time,
  evening_reminder time,
  created_at timestamptz not null default now()
);

-- Записи дневника
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('morning', 'evening', 'free', 'practice')),
  content text not null,
  mood smallint check (mood between 1 and 5),
  tags text[] not null default '{}',
  practice_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Задачи (с дихотомией контроля и повторами)
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(title) > 0),
  note text,
  status text not null default 'todo' check (status in ('todo', 'doing', 'done')),
  priority text not null default 'P2' check (priority in ('P1', 'P2', 'P3')),
  control text not null default 'in' check (control in ('in', 'ex')),
  reaction text,
  due_date date,
  recur text not null default 'none' check (recur in ('none', 'daily', 'weekly')),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Лог дня (утренний/вечерний ритуал)
create table if not exists public.day_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  intention text not null default '',
  obstacles text not null default '',
  q1 text not null default '',
  q2 text not null default '',
  q3 text not null default '',
  q4 text not null default '',
  morning_done boolean not null default false,
  evening_done boolean not null default false,
  unique (user_id, day)
);

-- Контент: цитаты (публичное чтение)
create table if not exists public.quotes (
  id serial primary key,
  author_ru text not null,
  author_en text not null,
  source_ru text not null default '',
  source_en text not null default '',
  text_ru text not null,
  text_en text not null,
  tags text[] not null default '{}'
);

-- Контент: практики (публичное чтение)
create table if not exists public.practices (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  icon text not null default '🏺',
  duration_min smallint not null default 5,
  category_ru text not null default '',
  category_en text not null default '',
  title_ru text not null,
  title_en text not null,
  why_ru text not null default '',
  why_en text not null default '',
  steps_ru jsonb not null default '[]',
  steps_en jsonb not null default '[]',
  example_ru text not null default '',
  example_en text not null default ''
);

-- Выполненные практики
create table if not exists public.practice_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  practice_id uuid not null references public.practices (id) on delete cascade,
  day date not null default current_date,
  created_at timestamptz not null default now()
);

-- Избранные цитаты
create table if not exists public.favorite_quotes (
  user_id uuid not null references auth.users (id) on delete cascade,
  quote_id int not null references public.quotes (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, quote_id)
);

-- ---------- 2. Индексы ----------

create index if not exists journal_entries_user_idx on public.journal_entries (user_id, created_at desc);
create index if not exists tasks_user_idx on public.tasks (user_id, created_at desc);
create index if not exists day_logs_user_idx on public.day_logs (user_id, day desc);

-- ---------- 3. Row Level Security ----------
-- Ядро приватности: владелец видит только своё.

alter table public.profiles enable row level security;
alter table public.journal_entries enable row level security;
alter table public.tasks enable row level security;
alter table public.day_logs enable row level security;
alter table public.quotes enable row level security;
alter table public.practices enable row level security;
alter table public.practice_logs enable row level security;
alter table public.favorite_quotes enable row level security;

-- profiles: только свой профиль
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() = id);

-- journal_entries: только свои записи
create policy "entries_select_own" on public.journal_entries
  for select using (auth.uid() = user_id);
create policy "entries_insert_own" on public.journal_entries
  for insert with check (auth.uid() = user_id);
create policy "entries_update_own" on public.journal_entries
  for update using (auth.uid() = user_id);
create policy "entries_delete_own" on public.journal_entries
  for delete using (auth.uid() = user_id);

-- tasks: только свои задачи
create policy "tasks_select_own" on public.tasks
  for select using (auth.uid() = user_id);
create policy "tasks_insert_own" on public.tasks
  for insert with check (auth.uid() = user_id);
create policy "tasks_update_own" on public.tasks
  for update using (auth.uid() = user_id);
create policy "tasks_delete_own" on public.tasks
  for delete using (auth.uid() = user_id);

-- day_logs: только свои дни
create policy "day_logs_select_own" on public.day_logs
  for select using (auth.uid() = user_id);
create policy "day_logs_insert_own" on public.day_logs
  for insert with check (auth.uid() = user_id);
create policy "day_logs_update_own" on public.day_logs
  for update using (auth.uid() = user_id);
create policy "day_logs_delete_own" on public.day_logs
  for delete using (auth.uid() = user_id);

-- quotes: публичное чтение для авторизованных
create policy "quotes_select_public" on public.quotes
  for select using (auth.role() = 'authenticated');

-- practices: публичное чтение для авторизованных
create policy "practices_select_public" on public.practices
  for select using (auth.role() = 'authenticated');

-- practice_logs: только свои
create policy "practice_logs_select_own" on public.practice_logs
  for select using (auth.uid() = user_id);
create policy "practice_logs_insert_own" on public.practice_logs
  for insert with check (auth.uid() = user_id);
create policy "practice_logs_delete_own" on public.practice_logs
  for delete using (auth.uid() = user_id);

-- favorite_quotes: только свои
create policy "favorites_select_own" on public.favorite_quotes
  for select using (auth.uid() = user_id);
create policy "favorites_insert_own" on public.favorite_quotes
  for insert with check (auth.uid() = user_id);
create policy "favorites_delete_own" on public.favorite_quotes
  for delete using (auth.uid() = user_id);

-- ---------- 4. Авто-профиль при регистрации ----------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- 5. Контент: цитаты ----------

insert into public.quotes (author_ru, author_en, source_ru, source_en, text_ru, text_en) values
('Марк Аврелий','Marcus Aurelius','«Размышления»','Meditations',
 'Поутру скажи себе: сегодня я встречу людей суетных, неблагодарных и заносчивых. Никто из них не может причинить мне зла — ведь я сам выбираю, как к этому отнестись.',
 'Begin each day by telling yourself: today I shall meet people who are interfering, ungrateful and arrogant. None of them can hurt me — for I alone choose how to respond.'),
('Эпиктет','Epictetus','«Энхиридион»','Enchiridion',
 'Не вещи тревожат людей, а их суждения о вещах.',
 'It is not things that trouble people, but their judgments about things.'),
('Сенека','Seneca','«Письма к Луцилию»','Letters to Lucilius',
 'Пока мы откладываем жизнь, она проходит.',
 'While we postpone, life speeds by.'),
('Марк Аврелий','Marcus Aurelius','«Размышления»','Meditations',
 'У тебя есть власть над своим умом — но не над внешними событиями. Осознай это — и обретёшь силу.',
 'You have power over your mind — not outside events. Realize this, and you will find strength.'),
('Сенека','Seneca','«Письма к Луцилию»','Letters to Lucilius',
 'Мы страдаем чаще в воображении, чем в действительности.',
 'We suffer more often in imagination than in reality.'),
('Эпиктет','Epictetus','«Беседы»','Discourses',
 'Сначала скажи себе, кем ты хочешь быть, а затем делай то, что должен делать.',
 'First say to yourself what you would be; and then do what you have to do.'),
('Марк Аврелий','Marcus Aurelius','«Размышления»','Meditations',
 'Препятствие к действию становится путём. То, что мешает, — помогает.',
 'The impediment to action advances action. What stands in the way becomes the way.'),
('Сенека','Seneca','«О скоротечности жизни»','On the Shortness of Life',
 'Ожидание — главная помеха жизни: оно зависит от завтрашнего дня и губит сегодняшний.',
 'Expectation is the greatest impediment to living: it hangs upon tomorrow and loses today.'),
('Эпиктет','Epictetus','«Энхиридион»','Enchiridion',
 'Не проси, чтобы события происходили так, как ты хочешь; желай, чтобы они происходили так, как происходят, — и жизнь твоя будет спокойна.',
 'Do not ask for things to happen as you wish; wish them to happen as they do — and your life will flow well.'),
('Марк Аврелий','Marcus Aurelius','«Размышления»','Meditations',
 'Душа окрашивается цветом твоих мыслей.',
 'The soul becomes dyed with the color of its thoughts.'),
('Сенека','Seneca','«Письма к Луцилию»','Letters to Lucilius',
 'Мы не отваживаемся на многое не потому, что оно трудно; оно трудно потому, что мы не отваживаемся.',
 'It is not because things are difficult that we do not dare; they are difficult because we do not dare.'),
('Эпиктет','Epictetus','«Энхиридион»','Enchiridion',
 'В нашей власти — наши суждения, стремления и действия. Вне нашей власти — тело, имущество, репутация, должности.',
 'Up to us are our judgments, strivings and actions. Not up to us are the body, property, reputation and offices.');

-- ---------- 6. Контент: практики ----------

insert into public.practices (slug, icon, duration_min, category_ru, category_en, title_ru, title_en, why_ru, why_en, steps_ru, steps_en, example_ru, example_en) values
('dichotomy-of-control','⚖️',5,'Принятие','Acceptance','Дихотомия контроля','Dichotomy of Control',
 'Эпиктет начинает «Энхиридион» с разделения всего на зависящее и не зависящее от нас. Тревога почти всегда направлена на второе. Упражнение возвращает внимание туда, где у вас есть власть.',
 'Epictetus opens the Enchiridion by dividing everything into what is and what is not up to us. Anxiety almost always targets the latter. This practice returns attention to where you have power.',
 '["Выпишите всё, что вас сейчас тревожит, — крупное и мелкое.","Проведите черту: слева «в моей власти», справа — «вне её».","Правую колонку скажите вслух: «Это не в моей власти» — и отпустите.","Из левой колонки выберите одно действие и выполните его сегодня."]',
 '["Write down everything currently worrying you — big and small.","Draw a line: left — “up to me”; right — “not up to me”.","Say the right column out loud: “This is not up to me” — and let it go.","From the left column, pick one action and do it today."]',
 '«Рейс задержали» — вне моей власти. «Как я проведу это время в аэропорту» — в моей.',
 '“The flight is delayed” — not up to me. “How I spend this time at the airport” — up to me.'),

('negative-visualization','🌫',10,'Принятие','Acceptance','Негативная визуализация','Negative Visualization',
 'Стоики мысленно «теряли» то, что имеют, — чтобы ценить настоящее и быть готовыми к переменам. Это не про тревогу, а про благодарность и устойчивость.',
 'The Stoics mentally “lost” what they had — to appreciate the present and prepare for change. This is about gratitude and resilience, not anxiety.',
 '["Выберите то, что вам дорого: человек, здоровье, работа, привычный уклад.","На 60 секунд представьте, что этого больше нет. Почувствуйте пустоту.","Вернитесь в настоящее: «Сейчас это у меня есть».","Сформулируйте одну благодарность и запишите её."]',
 '["Choose something dear to you: a person, health, work, a routine.","For 60 seconds, imagine it is gone. Feel the absence.","Return to the present: “Right now, I still have it.”","Formulate one gratitude and write it down."]',
 'Утренний кофе, звонок маме, возможность бегать — что исчезло бы без следа, если бы день сложился иначе?',
 'Morning coffee, a call to your mother, the ability to run — what would vanish without a trace if the day went differently?'),

('memento-mori','🕯',7,'Смерть и время','Death & Time','Memento mori','Memento Mori',
 '«Помни о смерти» — не мрачный лозунг, а напоминание о цене времени. Оно обостряет вопрос: «На что я трачу сегодняшний день?»',
 '“Remember death” is not a gloomy slogan but a reminder of the price of time. It sharpens the question: “What am I spending today on?”',
 '["Скажите себе спокойно, без драмы: «Этот день не бесконечен. И я тоже».","Спросите: что из запланированного я делаю из страха, а не из смысла?","Уберите одну «не свою» задачу из списка.","Сделайте одну маленькую вещь, которую давно откладывали."]',
 '["Tell yourself calmly, without drama: “This day is not endless. Neither am I.”","Ask: which of my plans come from fear rather than meaning?","Remove one “not mine” task from the list.","Do one small thing you have long postponed."]',
 'Сенека: «Не то, что у нас мало времени, а то, что мы много его теряем» — а вы сегодня знаете цену.',
 'Seneca: “It is not that we have a short time to live, but that we waste much of it.” Today you know its price.'),

('amor-fati','🔥',6,'Дисциплина','Discipline','Amor fati — любовь к судьбе','Amor Fati — Love of Fate',
 'Не просто терпеть происходящее, а видеть в нём материал для роста. Препятствие становится путём.',
 'Not merely to endure what happens, but to see in it material for growth. The obstacle becomes the way.',
 '["Вспомните неприятное событие недели.","Спросите: «Что хорошего оно уже принесло или может принести?»","Найдите три ответа — даже неожиданных.","Переформулируйте событие в одну фразу со словом «благодаря»."]',
 '["Recall an unpleasant event from this week.","Ask: “What good has it already brought or may bring?”","Find three answers — even surprising ones.","Reframe the event in one sentence starting with “thanks to”."]',
 '«Отказ на собеседовании» → «Благодаря отказу я увидел, что презентация была слабой» → план: улучшить её.',
 '“Rejected at the interview” → “Thanks to the rejection I saw my presentation was weak” → plan: improve it.'),

('view-from-above','🌌',8,'Спокойствие','Calm','Взгляд сверху','View from Above',
 'Марк Аврелий советовал смотреть на вещи с высоты — так проблемы возвращаются к своему настоящему размеру.',
 'Marcus Aurelius advised viewing things from above — this returns problems to their true size.',
 '["Закройте глаза и представьте свою комнату, дом, улицу, город — всё выше и выше.","Найдите на этой карте свою сегодняшнюю проблему. Каков её размер?","Представьте время: неделю, год, десять лет. Что останется важным?","Запишите одну мысль, которая пришла."]',
 '["Close your eyes and picture your room, home, street, city — higher and higher.","Find today''s problem on this map. How big is it?","Picture time: a week, a year, ten years. What will still matter?","Write down one thought that came."]',
 'Спор в чате кажется огромным — а с высоты города он меньше точки. Что важно: спор или вечер с семьёй?',
 'An argument in a group chat feels huge — from above the city it is smaller than a dot. What matters: the argument or an evening with family?'),

('seneca-evening-review','🌙',5,'Ритуалы','Rituals','Вечерний разбор Сенеки','Seneca''s Evening Review',
 'Сенека каждый вечер задавал себе три вопроса и проверял день, как судья — прожитое. Разбор превращает ошибки в уроки, а успехи — в привычку.',
 'Seneca asked himself three questions every night and examined the day like a judge. The review turns mistakes into lessons and successes into habits.',
 '["Вспомните день от пробуждения до этого момента — крупными мазками.","Спросите: «Какой свой порок я сегодня исцелил? Против чего устоял? В чём стал лучше?»","Простите себе сегодняшние промахи — и запишите, как поступить завтра.","Поблагодарите себя за одно дело, доведённое до конца."]',
 '["Recall the day from waking to now — in broad strokes.","Ask: “Which fault of mine did I heal today? What did I resist? Where did I become better?”","Forgive yourself today''s slips — and write down how to act tomorrow.","Thank yourself for one thing you finished."]',
 '«Вспылил в споре» → урок: пауза в три вдоха перед ответом. Завтра начну с этого.',
 '“I lost my temper in an argument” → lesson: pause for three breaths before answering. Start with that tomorrow.');
```
