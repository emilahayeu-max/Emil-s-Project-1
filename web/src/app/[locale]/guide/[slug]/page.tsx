import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { getPracticeById } from "@/lib/practices";
import PracticeDetail from "./PracticeDetail";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    ["dichotomy-of-control", "negative-visualization", "memento-mori", "amor-fati", "view-from-above", "seneca-evening-review"].map(
      (slug) => ({ locale, slug })
    )
  );
}

export default async function PracticePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const practice = getPracticeById(slug);
  if (!practice) notFound();

  return <PracticeDetail id={practice.id} />;
}
