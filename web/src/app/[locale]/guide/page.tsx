"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PRACTICES } from "@/lib/practices";
import { Card } from "@/components/ui";

export default function GuidePage() {
  const t = useTranslations("guide");
  const locale = useLocale() as "ru" | "en";

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">{t("title")}</h1>
      <p className="mb-5 mt-2 text-sm text-soft">{t("subtitle")}</p>

      <div className="grid gap-3.5 md:grid-cols-2">
        {PRACTICES.map((p) => (
          <Link key={p.id} href={`/guide/${p.id}`}>
            <Card className="h-full animate-fadeUp transition-shadow hover:shadow-lift">
              <div className="text-[11.5px] font-semibold uppercase tracking-[.08em] text-soft">
                {p.icon} {p.category[locale]} · {p.durationMin} {t("min")}
              </div>
              <h3 className="mt-1.5 font-serif text-xl font-semibold">{p.title[locale]}</h3>
              <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-soft">{p.why[locale]}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
