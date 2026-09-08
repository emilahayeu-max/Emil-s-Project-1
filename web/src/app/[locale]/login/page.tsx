"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useStore } from "@/lib/store";
import { Button, Card, Field, Input } from "@/components/ui";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { signIn, signUp } = useStore();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t("errorEmail"));
      return;
    }
    if (password.length < 6) {
      setError(t("errorPassword"));
      return;
    }
    const err =
      mode === "signin" ? signIn(email, password) : signUp(name.trim() || email.split("@")[0], email, password);
    if (err) {
      setError(t(err));
      return;
    }
    router.replace(mode === "signup" ? "/onboarding" : "/");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-10">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-1 text-center font-serif text-6xl">🏛</div>
        <h1 className="text-center font-serif text-4xl font-semibold">{t("appName")}</h1>
        <p className="mb-8 text-center text-sm text-soft">{t("subtitle")}</p>

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
            {error && <p className="text-sm text-clay">{error}</p>}
            <Button type="submit" className="w-full">
              {mode === "signin" ? t("signin") : t("signup")}
            </Button>
          </form>
          <div className="mt-4 flex items-center justify-between text-sm">
            <button className="text-accent" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
              {mode === "signin" ? t("switchToSignup") : t("switchToSignin")}
            </button>
            <span className="text-soft">{t("forgot")}</span>
          </div>
        </Card>

        <p className="mt-5 text-center text-[13px] leading-relaxed text-soft">{t("demoNote")}</p>
      </div>
    </div>
  );
}
