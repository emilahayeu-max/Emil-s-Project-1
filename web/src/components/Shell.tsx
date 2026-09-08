"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useStore } from "@/lib/store";

const NAV = [
  { route: "/", icon: "⌂", key: "today" },
  { route: "/journal", icon: "📖", key: "journal" },
  { route: "/tasks", icon: "✅", key: "tasks" },
  { route: "/guide", icon: "🏺", key: "guide" },
  { route: "/settings", icon: "•", key: "settings" },
] as const;

export default function Shell({ children }: { children: React.ReactNode }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const { state, ready, signOut } = useStore();

  // Без логотипа/навигации — только вход и онбординг
  const bare = pathname.includes("/login") || pathname.includes("/onboarding");

  // Охрана маршрутов: нет сессии → на вход
  useEffect(() => {
    if (ready && !state.user && !bare) {
      router.replace("/login");
      router.refresh();
    }
  }, [ready, state.user, bare, router]);

  if (!ready) return null;

  return (
    <>
      {bare ? (
        children
      ) : (
        <div className="md:pl-60">
          <Sidebar t={t} pathname={pathname} user={state.user?.name} onSignOut={signOut} />
          <TopBar />
          <main className="mx-auto min-h-screen max-w-3xl px-5 pb-28 pt-2 md:max-w-4xl md:px-10 md:pb-16">
            {children}
          </main>
          <BottomNav t={t} pathname={pathname} />
        </div>
      )}
    </>
  );
}

function TopBar() {
  const t = useTranslations();
  const locale = useLocale();
  const { state, setTheme } = useStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const cycleTheme = () => {
    const order = ["light", "dark", "system"] as const;
    const next = order[(order.indexOf(state.settings.theme) + 1) % order.length];
    setTheme(next);
  };
  const themeIcon = state.settings.theme === "dark" ? "🌙" : state.settings.theme === "system" ? "🎨" : "☀️";
  const today = mounted
    ? new Date().toLocaleDateString(locale === "en" ? "en-US" : "ru-RU", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

  return (
    <header className="sticky top-0 z-20 bg-gradient-to-b from-bg via-bg to-transparent">
      <div className="mx-auto flex max-w-3xl items-center gap-2 px-5 pb-2 pt-5 md:max-w-4xl md:px-10">
        <Link href="/" className="font-serif text-2xl font-semibold tracking-wide">
          {t("brand.name")}
          <span className="ml-2 font-sans text-[11px] font-normal uppercase tracking-[.08em] text-soft">
            {t("brand.tagline")}
          </span>
        </Link>
        <span className="ml-auto hidden rounded-full border border-line px-3 py-1.5 text-[13px] text-soft md:inline">
          {today}
        </span>
        <button
          onClick={cycleTheme}
          aria-label={t("settings.theme")}
          className="flex h-11 w-11 items-center justify-center rounded-full text-lg text-soft transition-colors hover:bg-surface2"
        >
          {themeIcon}
        </button>
        <LangSwitch />
      </div>
    </header>
  );
}

function LangSwitch() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split("/")[1];
  const other = locale === "ru" ? "en" : "ru";
  return (
    <button
      onClick={() => router.push(pathname.replace(`/${locale}`, `/${other}`), { locale: other })}
      aria-label="RU / EN"
      className="flex h-11 w-11 items-center justify-center rounded-full text-lg text-soft transition-colors hover:bg-surface2"
    >
      🌐
    </button>
  );
}

function Sidebar({
  t,
  pathname,
  user,
  onSignOut,
}: {
  t: (key: string) => string;
  pathname: string;
  user?: string;
  onSignOut: () => void;
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line bg-surface px-5 py-7 md:flex">
      <div className="font-serif text-2xl font-semibold tracking-wide">
        {t("brand.name")}
        <div className="font-sans text-[11px] font-normal uppercase tracking-[.08em] text-soft">
          {t("brand.tagline")}
        </div>
      </div>
      <nav className="mt-8 flex flex-col gap-0.5">
        {NAV.map((item) => {
          const active =
            item.route === "/" ? pathname === "/" || pathname === "" : pathname.startsWith(item.route);
          return (
            <Link
              key={item.route}
              href={item.route}
              className={`flex items-center gap-3 rounded-md px-3.5 py-3 text-[15px] transition-colors ${
                active ? "bg-surface2 font-semibold text-accent" : "text-soft hover:bg-surface2"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {t(item.key)}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-line pt-4 text-sm text-soft">
        {user && <div className="truncate px-2 pb-3">👤 {user}</div>}
        <button onClick={onSignOut} className="rounded-md px-2 py-2 text-clay transition-colors hover:bg-clayBg">
          {t("auth.signOut")}
        </button>
      </div>
    </aside>
  );
}

function BottomNav({
  t,
  pathname,
}: {
  t: (key: string) => string;
  pathname: string;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-line bg-surface px-2 pb-[max(6px,env(safe-area-inset-bottom))] pt-1.5 md:hidden">
      {NAV.map((item) => {
        const active =
          item.route === "/" ? pathname === "/" || pathname === "" : pathname.startsWith(item.route);
        return (
          <Link
            key={item.route}
            href={item.route}
            className={`flex min-w-16 flex-col items-center gap-0.5 rounded-md px-2 py-1.5 text-[11px] ${
              active ? "text-accent" : "text-soft"
            }`}
          >
            <span className="text-xl leading-none">{item.icon}</span>
            {t(item.key)}
          </Link>
        );
      })}
    </nav>
  );
}
