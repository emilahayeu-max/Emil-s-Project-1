"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui";

const STEP_ICONS = ["🌅", "⚖️", "🌙"];

export default function OnboardingPage() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const [step, setStep] = useState(0);
  const last = step === 2;

  const next = () => {
    if (last) {
      router.replace("/");
      router.refresh();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="flex min-h-screen flex-col px-6 py-10">
      <header className="mx-auto flex w-full max-w-md items-center">
        <span className="font-serif text-2xl font-semibold">Стоя</span>
        <button className="ml-auto text-sm text-soft" onClick={() => router.replace("/")}>
          {t("skip")}
        </button>
      </header>

      <div key={step} className="mx-auto mt-16 flex w-full max-w-md animate-fadeUp flex-col text-center">
        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-line bg-gradient-to-br from-surface to-surface2 text-6xl shadow-lift">
          {STEP_ICONS[step]}
        </div>
        <h2 className="mt-8 font-serif text-3xl font-semibold">{t(`step${step + 1}t`)}</h2>
        <p className="mx-auto mt-3 max-w-sm text-soft">{t(`step${step + 1}d`)}</p>

        <div className="mt-8 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${i === step ? "w-6 bg-accent" : "w-2 bg-line"}`}
            />
          ))}
        </div>

        <Button onClick={next} className="mx-auto mt-10 min-w-52">
          {last ? t("start") : t("next")} →
        </Button>
      </div>
    </div>
  );
}
