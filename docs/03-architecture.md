# 03. Архитектура: блок-схемы и потоки

> Диаграммы в формате Mermaid (GitHub отображает их встроенно). Всё спроектировано под бесплатные тиры Supabase + Vercel.

## 1. Контекстная диаграмма системы

```mermaid
flowchart LR
    U["👤 Пользователь<br/>телефон / ноутбук"]
    FE["🖥 Клиент — Next.js PWA<br/>React + TypeScript + Tailwind"]
    API["⚙️ Next.js Route Handlers<br/>бизнес-логика (уровень BFF)"]
    SU["☁️ Supabase<br/>Auth · Postgres+RLS · Storage · Realtime"]
    V["▲ Vercel — хостинг и CDN"]

    U -->|"HTTPS"| V
    V -->|"статика + SSR"| FE
    FE -->|"REST / supabase-js"| API
    FE -->|"Auth-сессии, RLS-запросы"| SU
    API -->|"сервисная роль, миграции"| SU
    SU -->|"JWT-сессии"| FE
```

**Принцип безопасности:** чувствительные данные (дневник, задачи) читаются/пишутся напрямую через Supabase с Row Level Security — сервер-посредник не может «случайно» отдать чужие данные. Бизнес-логика (ротация цитат, недельная сводка, экспорт) — в Route Handlers.

## 2. Схема модулей и навигации приложения

```mermaid
flowchart TD
    START["🔐 Splash / вход"] -->|"нет сессии"| AUTH["Регистрация / Вход / OAuth"]
    AUTH -->|"новый пользователь"| ONB["Онбординг (3 шага)"]
    AUTH -->|"есть сессия"| HOME
    ONB --> HOME

    HOME["🏛 Сегодня (ядро)"]
    HOME -->|"утро"| MORN["Утренний ритуал<br/>намерение · цитата · задачи"]
    HOME -->|"вечер"| EVE["Вечерний разбор<br/>итоги · урок · благодарность"]

    subgraph NAV["Основная навигация"]
        JRN["📖 Дневник"]
        TSK["✅ Задачи"]
        GDE["🏺 Гид"]
        SET["⚙️ Настройки"]
    end

    HOME <--> JRN
    HOME <--> TSK
    HOME <--> GDE
    HOME <--> SET

    JRN --> JEDIT["Редактор записи<br/>промпт · настроение · теги"]
    JRN --> JVIEW["Просмотр записи"]
    TSK --> KBOARD["Канбан: todo / doing / done"]
    TSK --> KEDIT["Создание задачи<br/>метка контроля"]
    GDE --> PRAC["Карточка практики"]
    PRAC -->|"«Выполнить»"| JEDIT
    GDE --> QUOT["Цитаты · избранное"]
    SET --> EXP["Экспорт · удаление аккаунта"]
```

## 3. Главный поток: «цикл дня»

```mermaid
sequenceDiagram
    actor U as Пользователь
    participant FE as Клиент (Next.js)
    participant SB as Supabase
    participant DB as Postgres (RLS)

    Note over U,DB: ☀️ УТРО
    U->>FE: открывает «Сегодня»
    FE->>SB: SELECT цитата дня (по дате)
    SB->>DB: запрос под RLS
    DB-->>FE: цитата (ru/en)
    U->>FE: намерение + препятствия + 1–3 задачи
    FE->>DB: UPSERT day_log (morning), INSERT tasks
    Note over FE: отметка «утро завершено» ✓

    Note over U,DB: 🌤 ДЕНЬ
    U->>FE: двигает задачи (todo→doing→done)
    FE->>DB: UPDATE tasks (Realtime-событие для других устройств)

    Note over U,DB: 🌙 ВЕЧЕР
    U->>FE: вечерний разбор
    FE->>DB: SELECT задачи дня (автоитоги)
    U->>FE: отвечает на вопросы разбора
    FE->>DB: UPSERT day_log (evening), INSERT journal_entry
    DB-->>FE: стрик обновлён, запись в дневнике ✓
```

## 4. Поток авторизации

```mermaid
sequenceDiagram
    actor U as Пользователь
    participant FE as Клиент
    participant SA as Supabase Auth
    participant DB as Postgres

    U->>FE: email + пароль
    FE->>SA: signUp()
    SA->>U: письмо подтверждения
    U->>SA: переход по ссылке
    SA-->>FE: сессия (JWT)
    FE->>DB: SELECT profile (RLS: auth.uid() = user_id)
    alt профиля нет (новый пользователь)
        FE->>DB: INSERT profile + показать онбординг
    else профиль есть
        FE->>FE: открыть «Сегодня»
    end
    Note over SA,FE: OAuth Google — аналогично, без письма
```

## 5. Модель данных (ER-диаграмма)

```mermaid
erDiagram
    PROFILES ||--o{ JOURNAL_ENTRIES : "пишет"
    PROFILES ||--o{ TASKS : "ведёт"
    PROFILES ||--o{ DAY_LOGS : "по дням"
    PROFILES ||--o{ FAVORITE_QUOTES : "избранное"
    PROFILES ||--o{ PRACTICE_LOGS : "выполняет"

    PROFILES {
        uuid id PK "auth.uid()"
        text name
        text lang "ru|en"
        text theme "light|dark|system"
        text timezone
        time morning_reminder
        time evening_reminder
    }

    JOURNAL_ENTRIES {
        uuid id PK
        uuid user_id FK
        text type "morning|evening|free|practice"
        text content
        smallint mood "1..5"
        text tags
        uuid practice_id FK "опц."
        timestamptz created_at
        timestamptz updated_at
    }

    TASKS {
        uuid id PK
        uuid user_id FK
        text title
        text note
        text status "todo|doing|done"
        text priority "P1|P2|P3"
        text control "in_control|external"
        text reaction "как отвечу (для external)"
        date due_date
        text recur "daily|weekly|none"
        timestamptz completed_at
    }

    DAY_LOGS {
        uuid id PK
        uuid user_id FK
        date day
        text intention
        text obstacles
        text lesson
        text gratitude
        boolean morning_done
        boolean evening_done
        unique(user_id, day)
    }

    QUOTES {
        uuid id PK
        text author
        text text_ru
        text text_en
        text source
        text tags
    }

    PRACTICES {
        uuid id PK
        text slug
        text title_ru
        text title_en
        text summary_ru
        text summary_en
        jsonb steps_ru
        jsonb steps_en
        text category
        text duration
    }

    PRACTICE_LOGS {
        uuid id PK
        uuid user_id FK
        uuid practice_id FK
        date day
    }

    FAVORITE_QUOTES {
        uuid user_id FK
        uuid quote_id FK
        unique(user_id, quote_id)
    }
```

**RLS-политики (ядро безопасности):**
- `JOURNAL_ENTRIES`, `TASKS`, `DAY_LOGS`, `PRACTICE_LOGS`, `FAVORITE_QUOTES`: `user_id = auth.uid()` на SELECT/INSERT/UPDATE/DELETE — пользователь видит только свои данные;
- `QUOTES`, `PRACTICES` — публичное чтение (это общий контент), запись — только сервисной ролью (seed-скрипты);
- `PROFILES`: чтение/запись только своего профиля.

## 6. Диаграмма состояний задачи

```mermaid
stateDiagram-v2
    [*] --> todo: создать задачу
    todo --> doing: начать
    doing --> done: завершить
    doing --> todo: вернуть
    done --> todo: переоткрыть
    done --> [*]: архив (авто через 24 ч)
    todo --> [*]: удалить
    doing --> [*]: удалить
```

## 7. Схема i18n

```mermaid
flowchart LR
    RQ["Запрос /ru/... или /en/..."] --> LOC["next-intl: выбор локали"]
    LOC --> UI["Словарь UI (JSON):<br/>ru.json / en.json"]
    DB --> CONT["Контент из БД:<br/>text_ru / text_en"]
    LOC --> CONT
    CONT --> OUT["Отрисовка"]
    UI --> OUT
    note["Дефолт: заголовок Accept-Language<br/>Переключение — в настройках, мгновенно"]
```

## 8. Поток данных (data flow, упрощённо)

```mermaid
flowchart TD
    subgraph Client["Клиент (браузер)"]
        CACHE["Кэш TanStack Query<br/>+ Zustand (UI-состояние)"]
        UI["Компоненты"]
    end
    subgraph Server["Vercel"]
        RH["Route Handlers"]
    end
    subgraph Supabase["Supabase Cloud"]
        AUTH["Auth"]
        PG["Postgres + RLS"]
        ST["Storage"]
        RT["Realtime"]
    end

    UI <-->|"1. запросы/подписки"| CACHE
    CACHE -->|"2. supabase-js (RLS)"| PG
    CACHE -->|"3. бизнес-логика"| RH
    RH -->|"4. SQL/миграции"| PG
    PG -->|"5. события"| RT
    RT -->|"6. обновление кэша"| CACHE
    UI -->|"7. файлы (фаза 2)"| ST
```

## 9. Структура репозитория (фактическая, v0.1)

```
stoa/
├── web/                    # Next.js-приложение (App Router)
│   ├── src/
│   │   ├── app/
│   │   │   ├── [locale]/   # страницы: (login, onboarding, today, journal, tasks, guide, settings)
│   │   │   ├── api/        # Route Handlers (/api/health)
│   │   │   └── globals.css # дизайн-токены (2 темы)
│   │   ├── components/     # Shell (навигация), ui-примитивы
│   │   ├── i18n/           # next-intl: routing, navigation, request
│   │   ├── lib/            # store (адаптер данных), quotes, practices, prompts, streak, types
│   │   ├── messages/       # ru.json, en.json
│   │   └── middleware.ts   # локаль-роутинг
│   ├── tests/              # vitest: бизнес-логика
│   └── package.json
├── prototype/              # статический hi-fi прототип этапа дизайна
├── supabase/               # (далее) миграции, seed
└── docs/                   # проектная документация
```

**Уровень данных — адаптерный** (`web/src/lib/store.tsx`): `LocalAdapter` (localStorage, демо-режим) сейчас; `SupabaseAdapter` подключается по env-ключам без изменения доменной логики и UI.
