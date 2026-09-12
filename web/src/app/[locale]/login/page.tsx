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
  const { signIn, signUp, resetPassword, setNewPassword, backend } = useStore();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // «Забыли пароль» и «новый пароль» (после ссылки из письма)
  const [showForgot, setShowForgot] = useState(false);
  const [recovery, setRecovery] = useState(false);

  // После перехода по ссылке из письма сброса пароля Supabase добавляет
  // в URL-хэш type=recovery — показываем форму нового пароля (FR-A4)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.includes("type=recovery")) {
      setRecovery(true);
    }
  }, []);

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
        setError(t.has(err) ? t(err) : err);
        return;
      }
      router.replace(mode === "signup" ? "/onboarding" : "/");
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const submitForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t("errorEmail"));
      return;
    }
    setBusy(true);
    try {
      const err = await resetPassword(email);
      if (err) {
        setError(t.has(err) ? t(err) : err);
      } else {
        setNotice(t("checkResetEmail"));
      }
    } finally {
      setBusy(false);
    }
  };

  const submitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (password.length < 6) {
      setError(t("errorPassword"));
      return;
    }
    setBusy(true);
    try {
      const err = await setNewPassword(password);
      if (err) {
        setError(t.has(err) ? t(err) : err);
      } else {
        setRecovery(false);
        setMode("signin");
        setPassword("");
        setNotice(t("passwordChanged"));
      }
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
            {recovery
              ? t("newPasswordTitle")
              : showForgot
                ? t("forgotTitle")
                : mode === "signin"
                  ? t("signin")
                  : t("signup")}
          </h2>

          {recovery ? (
            <form onSubmit={submitNewPassword} className="space-y-3.5">
              <Field label={t("newPassword")}>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
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
                {busy ? "…" : t("saveNewPassword")}
              </Button>
            </form>
          ) : showForgot ? (
            <form onSubmit={submitForgot} className="space-y-3.5">
              <p className="text-sm text-soft">{t("forgotHint")}</p>
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
              {error && (
                <div className="rounded-md border border-clay bg-clayBg px-3.5 py-2.5 text-sm text-clay">
                  {error}
                </div>
              )}
              {notice && (
                <p className="rounded-md bg-sageBg px-3.5 py-2.5 text-sm text-sage">{notice}</p>
              )}
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "…" : t("sendReset")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setShowForgot(false)}
              >
                {t("back")}
              </Button>
            </form>
          ) : (
            <>
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
                <button
                  className="text-soft underline-offset-2 hover:underline"
                  onClick={() => setShowForgot(true)}
                >
                  {t("forgot")}
                </button>
              </div>
            </>
          )}
        </Card>

        <p className="mt-5 text-center text-[13px] leading-relaxed text-soft">
          {backend === "supabase" ? t("cloudNote") : t("demoNote")}
        </p>
      </div>
    </div>
  );
}
