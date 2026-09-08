-- ============================================================
-- «Стоя» / Stoa — Supabase: схема БД (migration 0001)
-- Соответствует ER-модели из docs/03-architecture.md.
-- Применяется в SQL Editor Supabase (или supabase db push).
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
  practice_id uuid,
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
-- Ядро приватности (docs/07-backend.md): владелец видит только своё.

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
