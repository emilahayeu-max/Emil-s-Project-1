import { defineConfig, devices } from "@playwright/test";

/**
 * E2E-сценарии по тест-плану docs/08-testing.md:
 * критический путь, смена языка и темы, практика → дневник.
 * Запуск: npm run test:e2e (локально нужен `npx playwright install chromium`).
 * В CI (GitHub Actions) прогоняется автоматически — .github/workflows/ci.yml.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: "npm run dev -- -p 3000",
    url: "http://localhost:3000/ru/login",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
