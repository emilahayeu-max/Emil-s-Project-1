"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useStore } from "@/lib/store";
import { quoteAuthor, quoteOfDay, quoteText, randomQuote } from "@/lib/quotes";
import { Button, Card, Badge, SectionLabel, Field } from "@/components/ui";

export default function TodayPage() {
  const t = useTranslations("today");
  const locale = useLocale() as "ru" | "en";
  const router = useRouter();
  const store = useStore();
  const { day, state, todayKey, updateDay, finishMorning, saveEvening, toggleFavoriteQuote } = store;

  const [part, setPart] = useState<"morning" | "evening">(day.morningDone && !day.eveningDone ? "evening" : "morning");
  const [quote, setQuote] = useState(() => quoteOfDay(todayKey));
  const [flash, setFlash] = useState<string | null>(null);

  const dayTasks = state.tasks.filter((x) => x.dueToday);
  const doneCount = dayTasks.filter((x) => x.status === "done").length;
  const externalCount = dayTasks.filter((x) => x.control === "ex" && x.status !== "done").length;

  const flashAnd = (msg: string, fn: () => void) => {
    fn();
    setFlash(msg);
    setTimeout(() => setFlash(null), 2200);
  };

  return (
    <div>
      <h1 className="animate-fadeUp font-serif text-3xl font-semibold">
        {part === "morning" ? t("greetingMorning") : t("greetingEvening")}
        {state.user?.name ? `, ${state.user.name}` : ""}
      </h1>
      <p className="mt-1 text-soft">
        {new Date().toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </p>

      <div className="mt-4 inline-flex gap-1 rounded-md border border-line bg-surface2 p-1">
        {(["morning", "evening"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPart(p)}
            className={`rounded-[10px] px-4 py-2 text-sm font-semibold transition-colors ${
              part === p ? "bg-surface text-ink shadow-card" : "text-soft"
            }`}
          >
            {p === "morning" ? t("partMorning") : t("partEvening")}
            {p === "morning" && day.morningDone ? " ✓" : ""}
            {p === "evening" && day.eveningDone ? " ✓" : ""}
          </button>
        ))}
      </div>

      {flash && (
        <div className="mt-4 animate-fadeUp rounded-md bg-sageBg px-4 py-2.5 text-sm font-medium text-sage">
          {flash}
        </div>
      )}

      {part === "morning" ? (
        <Morning
          day={day}
          quote={quote}
          quoteLabel={quoteAuthor(quote, locale)}
          quoteText={quoteText(quote, locale)}
          isFav={state.favoriteQuoteIds.includes(quote.id)}
          dayTasks={dayTasks}
          onIntention={(v) => updateDay({ intention: v })}
          onObstacles={(v) => updateDay({ obstacles: v })}
          onNextQuote={() => setQuote(randomQuote(quote.id))}
          onFav={() => toggleFavoriteQuote(quote.id)}
          onAddTask={() => router.push("/tasks")}
          onFinish={() => flashAnd(t("morningDone"), finishMorning)}
          goTasks={() => router.push("/tasks")}
        />
      ) : (
        <Evening
          day={day}
          doneCount={doneCount}
          total={dayTasks.length}
          externalCount={externalCount}
          onChange={(patch) => updateDay(patch)}
          onSave={() => flashAnd(t("eveningSaved"), saveEvening)}
        />
      )}

      {!day.morningDone && part === "evening" && (
        <p className="mt-6 text-center text-sm text-soft">{t("skippedNote")}</p>
      )}
    </div>
  );
}

/* ---------- Утро ---------- */

function Morning(props: {
  day: { morningDone: boolean; intention: string; obstacles: string };
  quote: ReturnType<typeof quoteOfDay>;
  quoteLabel: string;
  quoteText: string;
  isFav: boolean;
  dayTasks: { id: string; title: string; status: string; priority: string; control: "in" | "ex" }[];
  onIntention: (v: string) => void;
  onObstacles: (v: string) => void;
  onNextQuote: () => void;
  onFav: () => void;
  onAddTask: () => void;
  onFinish: () => void;
  goTasks: () => void;
}) {
  const t = useTranslations("today");
  const tt = useTranslations("tasks");

  if (props.day.morningDone) {
    return (
      <Card className="mt-6 animate-fadeUp px-5 py-10 text-center">
        <div className="text-5xl">🌤</div>
        <h2 className="mt-3 font-serif text-2xl font-semibold">{t("morningDoneTitle")}</h2>
        <p className="mt-2 text-soft">{t("morningDoneSub")}</p>
      </Card>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <Card className="relative overflow-hidden rounded-xl p-6">
        <div className="absolute -top-2 left-4 font-serif text-7xl leading-none text-accent/15">❝</div>
        <p className="relative font-serif text-[21px] font-medium leading-relaxed md:text-2xl">{props.quoteText}</p>
        <div className="relative mt-3 text-sm text-soft">{props.quoteLabel}</div>
        <div className="relative mt-4 flex gap-2">
          <button
            onClick={props.onFav}
            className={`flex h-10 w-10 items-center justify-center rounded-md border text-base transition-colors ${
              props.isFav ? "border-accent bg-surface2 text-accent" : "border-line text-soft hover:bg-surface2"
            }`}
            aria-label="fav"
          >
            🔖
          </button>
          <button
            onClick={props.onNextQuote}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-line text-base text-soft transition-colors hover:bg-surface2"
            aria-label="refresh"
          >
            ↻
          </button>
        </div>
      </Card>

      <Card>
        <Field label={t("intention")}>
          <textarea
            value={props.day.intention}
            onChange={(e) => props.onIntention(e.target.value)}
            placeholder={t("intentionPh")}
            className="w-full resize-y bg-transparent px-0.5 py-2.5 text-base leading-relaxed outline-none border-b-[1.5px] border-line transition-colors focus:border-accent"
            rows={2}
          />
        </Field>
        <Field label={t("obstacles")} className="mt-5">
          <textarea
            value={props.day.obstacles}
            onChange={(e) => props.onObstacles(e.target.value)}
            placeholder={t("obstaclesPh")}
            className="w-full resize-y bg-transparent px-0.5 py-2.5 text-base leading-relaxed outline-none border-b-[1.5px] border-line transition-colors focus:border-accent"
            rows={2}
          />
        </Field>
      </Card>

      <Card>
        <SectionLabel className="mt-0">{t("mainTasks")}</SectionLabel>
        {props.dayTasks.length === 0 ? (
          <p className="py-2 text-sm text-soft">{tt("empty")}</p>
        ) : (
          <ul>
            {props.dayTasks.map((task) => (
              <li key={task.id} className="flex items-start gap-3 border-b border-line py-2.5 last:border-b-0">
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs ${
                    task.status === "done" ? "border-sage bg-sage text-white" : "border-line"
                  }`}
                >
                  {task.status === "done" ? "✓" : ""}
                </span>
                <span className={`text-[15px] ${task.status === "done" ? "text-soft line-through" : ""}`}>
                  {task.title}
                </span>
                <span className="ml-auto">
                  <Badge tone={task.control === "in" ? "sage" : "clay"}>
                    {task.control === "in" ? tt("inControl") : tt("outControl")}
                  </Badge>
                </span>
              </li>
            ))}
          </ul>
        )}
        <button onClick={props.goTasks} className="mt-2 min-h-11 px-3 text-accent">
          {t("addTask")}
        </button>
      </Card>

      <Button onClick={props.onFinish} className="w-full">
        {t("finishMorning")} ✓
      </Button>
    </div>
  );
}

/* ---------- Вечер ---------- */

function Evening(props: {
  day: { eveningDone: boolean; q1: string; q2: string; q3: string; q4: string };
  doneCount: number;
  total: number;
  externalCount: number;
  onChange: (patch: Record<string, string | boolean>) => void;
  onSave: () => void;
}) {
  const t = useTranslations("today");

  if (props.day.eveningDone) {
    return (
      <Card className="mt-6 animate-fadeUp px-5 py-10 text-center">
        <div className="text-5xl">🌙</div>
        <h2 className="mt-3 font-serif text-2xl font-semibold">{t("eveningSaved")}</h2>
        <p className="mt-2 text-soft">{t("eveningDoneSub")}</p>
      </Card>
    );
  }

  const fields = [
    { key: "q1", label: t("q1"), ph: t("q1ph") },
    { key: "q2", label: t("q2"), ph: t("q2ph") },
    { key: "q3", label: t("q3"), ph: t("q3ph") },
    { key: "q4", label: t("q4"), ph: t("q4ph") },
  ] as const;

  return (
    <div className="mt-6 space-y-4">
      <Card>
        <SectionLabel className="mt-0">{t("eveningTitle")}</SectionLabel>
        {fields.map((f) => (
          <Field key={f.key} label={f.label} className="mb-5 last:mb-0">
            <textarea
              value={props.day[f.key]}
              onChange={(e) => props.onChange({ [f.key]: e.target.value })}
              placeholder={f.ph}
              className="w-full resize-y bg-transparent px-0.5 py-2.5 text-base leading-relaxed outline-none border-b-[1.5px] border-line transition-colors focus:border-accent"
              rows={2}
            />
          </Field>
        ))}
      </Card>

      <Card className="bg-surface2 shadow-none">
        <div className="text-[13px] font-semibold uppercase tracking-[.1em] text-soft">{t("autoSummary")}</div>
        <p className="mt-2 text-sm text-soft">
          ✅ {props.doneCount} {t("of")} {props.total} {t("tasksDone")}
          {props.externalCount > 0 && (
            <>
              {" · "}◌ {props.externalCount} {t("external")}
            </>
          )}
        </p>
      </Card>

      <Button onClick={props.onSave} className="w-full">
        {t("saveEvening")}
      </Button>
    </div>
  );
}
