/**
 * Публикация «Стоя» на GitHub Pages (бесплатный публичный хостинг).
 * Запуск:  cd web && node scripts/deploy-github-pages.mjs
 *
 * Что делает:
 *  1. Берёт ключи Supabase из web/.env.local (файл вне git);
 *  2. Собирает статическую версию (next build + output export)
 *     с basePath = /Имя-репозитория;
 *  3. Готовит manifest.webmanifest и redirect-страницы под basePath;
 *  4. Копирует результат в корень репозитория (оттуда GitHub Pages
 *     отдаёт сайт при выборе «Source: ветка → корень»).
 *
 * После запуска — вручную: git add/commit/push текущей ветки.
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, cpSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(webRoot, "..");
const BASE = "/Emil-s-Project-1"; // имя репозитория на GitHub (путь сайта)

// Ключи из .env.local
const envPath = path.join(webRoot, ".env.local");
const envRaw = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
const env = Object.fromEntries(
  envRaw
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

process.env.NEXT_PUBLIC_BASE_PATH = BASE;
process.env.NEXT_PUBLIC_SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || "";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
process.env.STATIC_EXPORT = "1";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error("❌ Нет ключей Supabase в web/.env.local — прерываю.");
  process.exit(1);
}

console.log("📦 Сборка статической версии (next build, output export)...");
execSync("npx next build", { cwd: webRoot, stdio: "inherit", env: process.env });

const out = path.join(webRoot, "out");
if (!existsSync(out)) {
  console.error("❌ out/ не создан — сборка не удалась.");
  process.exit(1);
}

// Манифест PWA с basePath
const manifest = {
  name: "Стоя — стоический ежедневник",
  short_name: "Стоя",
  description: "Стоический ежедневный планировщик, дневник, гид практик и менеджер задач.",
  lang: "ru",
  start_url: `${BASE}/ru`,
  scope: `${BASE}/`,
  display: "standalone",
  orientation: "portrait",
  background_color: "#F5F2EA",
  theme_color: "#A97E4F",
  icons: [
    { src: `${BASE}/icons/icon-192.png`, sizes: "192x192", type: "image/png", purpose: "any" },
    { src: `${BASE}/icons/icon-512.png`, sizes: "512x512", type: "image/png", purpose: "any" },
    { src: `${BASE}/icons/maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
  ],
};
writeFileSync(path.join(out, "manifest.webmanifest"), JSON.stringify(manifest, null, 2));

// Главная страница и 404 → сразу на экран входа
const redirectHtml = (to) =>
  `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><meta http-equiv="refresh" content="0;url=${to}"><script>location.replace("${to}")</script></head><body></body></html>`;
writeFileSync(path.join(out, "index.html"), redirectHtml(`${BASE}/ru/login`));
writeFileSync(path.join(out, "404.html"), redirectHtml(`${BASE}/ru/login`));

// ВАЖНО: .nojekyll отключает обработку Jekyll на GitHub Pages —
// без него страницы Next.js ломаются (белый экран/500).
writeFileSync(path.join(out, ".nojekyll"), "");

// Копируем сайт в корень репозитория
console.log("🚚 Копирую сайт в корень репозитория...");
cpSync(out, repoRoot, { recursive: true });

console.log("✅ Готово. Дальше вручную:");
console.log("   git add ru en _next icons index.html 404.html manifest.webmanifest sw.js offline.html");
console.log("   git commit -m \"Deploy: static build for GitHub Pages\"");
console.log("   git push");
