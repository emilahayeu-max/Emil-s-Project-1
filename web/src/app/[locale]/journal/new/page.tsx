"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useStore } from "@/lib/store";
import { getPracticeById, practiceTitle } from "@/lib/practices";
import { randomPrompt } from "@/lib/prompts";
import { EntryType } from "@/lib/types";
import { Button, Card, Field, Input, MoodPicker, Textarea } from "@/components/ui";

const TYPES: { id: EntryType; key: string }[] = [
  { id: "free", key: "typeFree" },
  { id: "morning", key: "typeMorning" },
  { id: "evening", key: "typeEvening" },
  { id: "practice", key: "typePractice" },
];

/** Черновик записи: автосохранение каждые 15 с (NFR-5, UT-05) */
const DRAFT_KEY = "stoa:draft:entry";
const DRAFT_INTERVAL_MS = 15000;

interface Draft {
  content: string;
  type: EntryType;
  mood: number;
  tags: string;
  practiceId: string | null;
}

export default function NewEntryPage() {
  const t = useTranslations("journal");
  const locale = useLocale() as "ru" | "en";
  const router = useRouter();
  const { addEntry } = useStore();

  const [practiceId, setPracticeId] = useState<string | null>(null);
  const [type, setType] = useState<EntryType>("free");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState(3);
  const [tags, setTags] = useState("");
  const [draftAt, setDraftAt] = useState<Date | null>(null);
  const restoredRef = useRef(false);

  // Восстановление черновика (один раз)
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    const p = new URLSearchParams(window.location.search).get("practice");
    if (p && getPracticeById(p)) {
      setPracticeId(p);
      setType("practice");
      return;
    }
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw) as Draft;
        if (d.content?.trim()) {
          setContent(d.content);
          setType(d.type ?? "free");
          setMood(d.mood ?? 3);
          setTags(d.tags ?? "");
          setPracticeId(d.practiceId ?? null);
        }
      }
    } catch {
      /* повреждённый черновик игнорируем */
    }
  }, []);

  // Автосохранение черновика
  useEffect(() => {
    if (!content.trim()) return;
    const save = () => {
      try {
        window.localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ content, type, mood, tags, practiceId } satisfies Draft)
        );
        setDraftAt(new Date());
      } catch {
        /* нет места — молча пропускаем */
      }
    };
    const id = setInterval(save, DRAFT_INTERVAL_MS);
    return () => clearInterval(id);
  }, [content, type, mood, tags, practiceId]);

  const practice = practiceId ? getPracticeById(practiceId) : undefined;

  const save = () => {
    if (!content.trim()) return;
    addEntry({
      type,
      content: content.trim(),
      mood,
      tags: tags.split(",").map((x) => x.trim().replace(/^#/, "")).filter(Boolean),
      practiceId: practiceId ?? undefined,
    });
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    router.replace("/journal");
    router.refresh();
  };

  const givePrompt = () => {
    const kind = type === "evening" ? "evening" : "morning";
    setContent(randomPrompt(kind, locale));
  };

  return (
    <div>
      <div className="mb-4 flex items-center">
        <Link href="/journal" className="flex h-11 w-11 items-center justify-center rounded-full text-lg text-soft hover:bg-surface2">
          ←
        </Link>
        <h1 className="ml-2 font-serif text-2xl font-semibold">{t("newEntry")}</h1>
        {draftAt && (
          <span className="ml-3 hidden text-xs text-soft sm:inline">
            {t("draftSaved")} {draftAt.toLocaleTimeString(locale === "ru" ? "ru-RU" : "en-US", { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
        <Button onClick={save} className="ml-auto" disabled={!content.trim()}>
          {t("save")}
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {TYPES.map((ty) => (
          <button
            key={ty.id}
            onClick={() => setType(ty.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              type === ty.id ? "border-accent bg-surface2 text-accent" : "border-line text-soft"
            }`}
          >
            {t(ty.key)}
          </button>
        ))}
      </div>

      {practice && (
        <Card className="border-l-4 border-l-accent">
          <div className="text-xs font-semibold uppercase tracking-[.1em] text-soft">
            🏺 {practiceTitle(practice, locale)}
          </div>
          <p className="mt-1.5 text-sm text-soft">{practice.example[locale]}</p>
        </Card>
      )}

      <button
        onClick={givePrompt}
        className="mb-3 mt-5 min-h-11 rounded-md border-[1.5px] border-line px-4 text-[15px] font-semibold transition-colors hover:bg-surface2"
      >
        {t("prompt")}
      </button>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t("contentPh")}
        className="min-h-48"
      />

      <Card className="mt-5">
        <Field label={t("mood")}>
          <MoodPicker value={mood} onChange={setMood} />
        </Field>
        <Field label="#" className="mt-4">
          <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder={t("tagsPh")} />
        </Field>
      </Card>
    </div>
  );
}
