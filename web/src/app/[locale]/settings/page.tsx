"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useStore } from "@/lib/store";
import { computeStreak } from "@/lib/streak";
import { getQuoteById, quoteAuthor, quoteText } from "@/lib/quotes";
import { todayISO } from "@/lib/types";
import { Button, Card, Input, Select } from "@/components/ui";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const ta = useTranslations("auth");
  const locale = useLocale() as "ru" | "en";
  const router = useRouter();
  const pathname = usePathname();
  const { state, setTheme, signOut, exportData, deleteAccount, seedDemo } = useStore();

  const [confirmEmail, setConfirmEmail] = useState("");
  const [flash, setFlash] = useState<string | null>(null);

  const flashAnd = (msg: string, fn: () => void) => {
    fn();
    setFlash(msg);
    setTimeout(() => setFlash(null), 2200);
  };

  const activeDays = new Set(
    Object.entries(state.days)
      .filter(([, d]) => d.morningDone || d.eveningDone)
      .map(([k]) => k)
  );
  const streak = computeStreak(activeDays, todayISO());

  const weekEntries = state.entries.filter((e) => {
    const age = Date.now() - new Date(e.createdAt).getTime();
    return age < 7 * 86400000;
  }).length;
  const weekTasks = state.tasks.filter((x) => x.status === "done").length;
  const weekPractices = state.entries.filter((e) => e.type === "practice").length;
  const avgMood =
    state.entries.length > 0
      ? (state.entries.reduce((s, e) => s + e.mood, 0) / state.entries.length).toFixed(1)
      : "—";

  const changeLocale = (l: string) => {
    router.push(pathname.replace(`/${locale}`, `/${l}`), { locale: l as "ru" | "en" });
  };

  const favorites = state.favoriteQuoteIds.map(getQuoteById).filter(Boolean);
  const emailMatches = confirmEmail.trim().toLowerCase() === state.user?.email?.toLowerCase();

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">{t("title")}</h1>

      {flash && (
        <div className="mt-4 animate-fadeUp rounded-md bg-sageBg px-4 py-2.5 text-sm font-medium text-sage">
          {flash}
        </div>
      )}

      {/* Прогресс: мягкий стрик, без наказаний */}
      <Card className="mt-5 py-8 text-center">
        <div className="font-serif text-7xl font-semibold leading-none text-accent">{streak.streak}</div>
        <div className="mt-2 text-soft">🔥 {t("streakDays")}</div>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-soft">{t("streakNote")}</p>
        <div className="mt-7 flex justify-around border-t border-line pt-5">
          <Stat value={String(streak.totalDays)} label={t("totalDays")} />
          <Stat value={String(weekEntries)} label={t("entries")} />
          <Stat value={String(weekTasks)} label={t("tasksDone")} />
          <Stat value={String(weekPractices)} label={t("practices")} />
          <Stat value={avgMood} label={t("avgMood")} />
        </div>
      </Card>

      <Card className="mt-4">
        <Row label={t("language")} icon="🌐">
          <Select value={locale} onChange={(e) => changeLocale(e.target.value)} className="w-40">
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </Select>
        </Row>
        <Row label={t("theme")} icon="🎨">
          <Select value={state.settings.theme} onChange={(e) => setTheme(e.target.value as never)} className="w-40">
            <option value="light">{t("themeLight")}</option>
            <option value="dark">{t("themeDark")}</option>
            <option value="system">{t("themeSystem")}</option>
          </Select>
        </Row>
        <Row label={t("reminders")} icon="⏰">
          <span className="text-sm text-soft">8:00 · 21:00 ({t("remindersPh")})</span>
        </Row>
        <Row label={t("export")} icon="⬇️">
          <button onClick={exportData} className="min-h-9 rounded-md px-3 text-sm text-accent hover:bg-surface2">
            JSON →
          </button>
        </Row>
        <Row label={t("seedDemo")} icon="🌱">
          <button
            onClick={() => flashAnd(t("seedDone"), seedDemo)}
            className="min-h-9 rounded-md px-3 text-sm text-accent hover:bg-surface2"
          >
            {t("seedDemo")}
          </button>
        </Row>
        <Row label={t("signOut")} icon="👤">
          <button onClick={signOut} className="min-h-9 rounded-md px-3 text-sm text-clay hover:bg-clayBg">
            {ta("signOut")}
          </button>
        </Row>
      </Card>

      {/* Удаление аккаунта (UC-10 / US-35): подтверждение email */}
      <Card className="mt-4 border-l-4 border-l-clay">
        <div className="flex items-center gap-3">
          <span className="w-7 text-center text-lg">🗑</span>
          <div>
            <div className="text-[15px] font-semibold">{t("deleteAccount")}</div>
            <p className="mt-0.5 text-sm text-soft">{t("deleteHint")}</p>
          </div>
        </div>
        <form
          className="mt-3 flex flex-wrap items-center gap-2.5"
          onSubmit={(e) => {
            e.preventDefault();
            if (emailMatches && confirm(t("deleteConfirm"))) {
              deleteAccount();
              router.replace("/login");
              router.refresh();
            }
          }}
        >
          <Input
            type="email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            placeholder={state.user?.email ?? "you@example.com"}
            className="min-w-40 flex-1"
          />
          <Button
            type="submit"
            variant="danger"
            className="border border-clay bg-transparent"
            disabled={!emailMatches}
          >
            {t("deleteBtn")}
          </Button>
        </form>
      </Card>

      {/* Избранные цитаты */}
      {favorites.length > 0 && (
        <>
          <div className="mb-2.5 mt-7 text-xs font-semibold uppercase tracking-[.1em] text-soft">
            ⭐ {t("favorites")}
          </div>
          <div className="space-y-3">
            {favorites.map((q) => (
              <Card key={q!.id} className="border-l-4 border-l-accent">
                <p className="font-serif text-lg leading-relaxed">{quoteText(q!, locale)}</p>
                <div className="mt-2 text-sm text-soft">{quoteAuthor(q!, locale)}</div>
              </Card>
            ))}
          </div>
        </>
      )}

      <p className="mt-8 text-center text-[13px] leading-relaxed text-soft">{t("about")}</p>
    </div>
  );
}

function Row({
  label,
  icon,
  children,
}: {
  label: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-line py-3 last:border-b-0">
      <span className="w-7 text-center text-lg">{icon}</span>
      <span className="text-[15px]">{label}</span>
      <span className="ml-auto flex items-center">{children}</span>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-serif text-2xl font-semibold">{value}</div>
      <div className="text-xs text-soft">{label}</div>
    </div>
  );
}
