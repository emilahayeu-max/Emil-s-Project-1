"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { getPracticeById } from "@/lib/practices";
import { Button, Card } from "@/components/ui";

export default function PracticeDetail({ id }: { id: string }) {
  const t = useTranslations("guide");
  const locale = useLocale() as "ru" | "en";
  const router = useRouter();
  const practice = getPracticeById(id);
  if (!practice) return null;

  const complete = () => {
    router.push(`/journal/new?practice=${practice.id}`);
  };

  return (
    <div className="animate-fadeUp">
      <Link href="/guide" className="flex min-h-11 w-fit items-center rounded-md px-2 text-accent">
        ← {t("back")}
      </Link>

      <Card className="mt-3 border-l-4 border-l-accent">
        <div className="text-xs font-semibold uppercase tracking-[.08em] text-soft">
          {practice.icon} {practice.category[locale]} · {practice.durationMin} {t("min")}
        </div>
        <h1 className="mt-2 font-serif text-3xl font-semibold">{practice.title[locale]}</h1>
        <div className="mt-4 text-xs font-semibold uppercase tracking-[.1em] text-soft">{t("why")}</div>
        <p className="mt-1.5 leading-relaxed text-soft">{practice.why[locale]}</p>
      </Card>

      <Card className="mt-4">
        <div className="text-xs font-semibold uppercase tracking-[.1em] text-soft">{t("steps")}</div>
        <div className="mt-3">
          {practice.steps[locale].map((step, i) => (
            <div key={i} className="mb-3.5 flex gap-3.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[1.5px] border-accent text-sm font-semibold text-accent">
                {i + 1}
              </span>
              <p className="pt-1 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-4 bg-surface2 shadow-none">
        <div className="text-xs font-semibold uppercase tracking-[.1em] text-soft">{t("example")}</div>
        <p className="mt-1.5 leading-relaxed text-soft">{practice.example[locale]}</p>
      </Card>

      <Button onClick={complete} className="mt-5 w-full">
        {t("complete")} →
      </Button>
    </div>
  );
}
