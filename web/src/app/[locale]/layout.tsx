import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { StoreProvider } from "@/lib/store";
import Shell from "@/components/Shell";
import PwaRegister from "@/components/PwaRegister";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Стоя | Stoa — стоический ежедневник",
  description:
    "Стоический ежедневный планировщик, мотивационный гид практик, личный дневник и менеджер задач в одном приложении.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Шрифты: если сеть недоступна, работают системные фолбэки из токенов */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600;700&display=swap"
        />
        {/* PWA: манифест и иконка */}
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="theme-color" content="#A97E4F" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Стоя" />
      </head>
      <body>
        <NextIntlClientProvider>
          <StoreProvider>
            <PwaRegister />
            <Shell>{children}</Shell>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
