import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Публикация на GitHub Pages: STATIC_EXPORT=1 + NEXT_PUBLIC_BASE_PATH=/Имя-репозитория
// (см. scripts/deploy-github-pages.mjs). В обычном режиме (предпросмотр/локально)
// переменные не заданы — приложение работает как прежде.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(basePath ? { basePath } : {}),
  ...(process.env.STATIC_EXPORT ? { output: "export" } : {}),
};

export default withNextIntl(nextConfig);
