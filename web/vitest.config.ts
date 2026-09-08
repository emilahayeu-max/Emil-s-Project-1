import { defineConfig } from "vitest/config";

/** Юнит-тесты бизнес-логики (docs/08-testing.md). E2E — отдельно, Playwright. */
export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
