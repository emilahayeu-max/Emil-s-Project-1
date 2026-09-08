"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Badge, Card, Input } from "@/components/ui";

const MOODS = ["😞", "😐", "🙂", "😄", "🤩"];

const TYPE_KEYS = {
  morning: "typeMorning",
  evening: "typeEvening",
  free: "typeFree",
  practice: "typePractice",
} as const;

export default function JournalPage() {
  const t = useTranslations("journal");
  const locale = useLocale();
  const { state, deleteEntry } = useStore();
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const entries = q
    ? state.entries.filter(
        (e) =>
          e.content.toLowerCase().includes(q) ||
          e.tags.some((tag) => tag.toLowerCase().includes(q))
      )
    : state.entries;

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="font-serif text-3xl font-semibold">{t("title")}</h1>
        <Link
          href="/journal/new"
          className="ml-auto hidden rounded-md bg-accent px-5 py-2.5 text-[15px] font-semibold text-accentInk transition-opacity hover:opacity-90 md:inline-flex"
        >
          ＋ {t("newEntry")}
        </Link>
      </div>
      <p className="mb-4 mt-2 text-sm text-soft">🔒 {t("privacy")}</p>

      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("searchPh")}
        className="mb-5"
        type="search"
      />

      {entries.length === 0 ? (
        <Card>
          <p className="py-6 text-center text-soft">{q ? t("noResults") : t("empty")}</p>
        </Card>
      ) : (
        <div className="space-y-3.5">
          {entries.map((e) => (
            <Card key={e.id} className="animate-fadeUp group">
              <div className="mb-2 flex items-center gap-2.5">
                <Badge tone="neutral">{t(TYPE_KEYS[e.type])}</Badge>
                <span className="text-[13px] text-soft">{fmtDate(e.createdAt)}</span>
                <span className="ml-auto text-xl leading-none">{MOODS[e.mood - 1] ?? MOODS[2]}</span>
              </div>
              <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{e.content}</p>
              {e.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {e.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-line px-2.5 py-0.5 text-[11.5px] text-soft">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-3 flex justify-end opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => deleteEntry(e.id)}
                  className="min-h-9 rounded-md px-3 text-sm text-clay hover:bg-clayBg"
                >
                  {t("delete")}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Link
        href="/journal/new"
        aria-label={t("newEntry")}
        className="fixed bottom-24 right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl text-accentInk shadow-fab transition-transform active:scale-95 md:hidden"
      >
        ⊕
      </Link>
    </div>
  );
}
