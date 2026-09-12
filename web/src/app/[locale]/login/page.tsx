"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useStore } from "@/lib/store";
import { Button, Card, Field, Input } from "@/components/ui";

/** Самопроверка связи с облаком Supabase (диагностика на экране входа) */
function CloudCheck() {
  const t = useTranslations("auth");
  const [status, setStatus] = useState<"checking" | "ok" | "fail">("checking");
  const [detail, setDetail] = useState<string | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      setStatus("fail");
      setDetail("no-env");
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    // Лёгкий GET к реальной таблице: корень /rest/v1/ на новых проектах
    // закрыт для публичных ключей (отдаёт 401/403), поэтому проверяем
    // именно рабочий эндпоинт. Аноним получит пустой список [] — это 200.
    fetch(
      `${url}/rest/v1/quotes?select=id&limit=1&apikey=${encodeURIComponent(key)}`,
      { signal: controller.signal }
    )
      .then((r) => {
        setStatus(r.ok ? "ok" : "fail");
        if (!r.ok) setDetail(`HTTP ${r.status}`);
      })
      .catch((e) => {
        setStatus("fail");
        setDetail(String(e));
      })
      .finally(() => clearTimeout(timer));
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, []);

  if (status === "checking") {
    return <p className="mb-4 text-center text-[13px] text-soft">{t("cloudChecking")}</p>;
  }
  return (
    <div
      className={`mb-4 rounded-md px-3.5 py-2.5 text-center text-[13px] ${
        status === "ok" ? "bg-sageBg text-sage" : "bg-clayBg text-clay"
      }`}
    >
      {status === "ok" ? t("cloudOk") : t("cloudFail")}
      {detail && <span className="mt-1 block opacity-70">({detail})</span>}
    </div>
  );
}

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { signIn, signUp, backend } = useStore();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t("errorEmail"));
      return;
    }
    if (password.length < 6) {
      setError(t("errorPassword"));
      return;
    }
    setBusy(true);
    try {
      const err =
        mode === "signin"
          ? await signIn(email, password)
          : await signUp(name.trim() || email.split("@")[0], email, password);
      if (err === "auth.checkEmail") {
        setNotice(t("checkEmail"));
        return;
      }
      if (err) {
        // Известные ошибки переводим, неизвестные показываем как есть (для диагностики)
        setError(t.has(err) ? t(err) : err);
        return;
      }
      router.replace(mode === "signup" ? "/onboarding" : "/");
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-10">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-1 text-center font-serif text-6xl">🏛</div>
        <h1 className="text-center font-serif text-4xl font-semibold">{t("appName")}</h1>
        <p className="mb-6 text-center text-sm text-soft">{t("subtitle")}</p>

        {backend === "supabase" && <CloudCheck />}

        <Card className="p-6">
          <h2 className="mb-4 font-serif text-2xl font-semibold">
            {mode === "signin" ? t("signin") : t("signup")}
          </h2>
          <form onSubmit={submit} className="space-y-3.5">
            {mode === "signup" && (
              <Field label={t("name")}>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("namePh")} autoComplete="name" />
              </Field>
            )}
            <Field label={t("email")}>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </Field>
            <Field label={t("password")}>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
              />
            </Field>
            {error && (
              <div className="rounded-md border border-clay bg-clayBg px-3.5 py-2.5 text-sm text-clay">
                {error}
              </div>
            )}
            {notice && (
              <p className="rounded-md bg-sageBg px-3.5 py-2.5 text-sm text-sage">{notice}</p>
            )}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "…" : mode === "signin" ? t("signin") : t("signup")}
            </Button>
          </form>
          <div className="mt-4 flex items-center justify-between text-sm">
            <button className="text-accent" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
              {mode === "signin" ? t("switchToSignup") : t("switchToSignin")}
            </button>
            <span className="text-soft">{t("forgot")}</span>
          </div>
        </Card>

        <p className="mt-5 text-center text-[13px] leading-relaxed text-soft">
          {backend === "supabase" ? t("cloudNote") : t("demoNote")}
        </p>
      </div>
    </div>
  );
}
