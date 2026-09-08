import { test, expect, Page } from "@playwright/test";

/**
 * E2E-01/04/05/06 из docs/08-testing.md.
 * Демо-режим LocalAdapter: каждый тест получает чистый контекст (localStorage изолирован).
 */

async function signupAndLand(page: Page): Promise<void> {
  const email = `e2e+${Date.now()}+${Math.floor(Math.random() * 1e6)}@stoa.test`;
  await page.goto("/ru/login");
  await page.getByRole("button", { name: /Нет аккаунта/ }).click();
  await page.getByPlaceholder("Как к вам обращаться?").fill("Тестер");
  await page.getByPlaceholder("you@example.com").fill(email);
  await page.getByPlaceholder("••••••••").fill("secret123");
  await page.getByRole("button", { name: "Создать аккаунт" }).click();
  await expect(page).toHaveURL(/onboarding/);
  await page.getByRole("button", { name: /Далее/ }).click();
  await page.getByRole("button", { name: /Далее/ }).click();
  await page.getByRole("button", { name: /Начать/ }).click();
  await expect(page).toHaveURL(/\/ru$/);
  await expect(page.getByRole("heading", { name: /Доброе утро/ })).toBeVisible();
}

test.describe("E2E-01 Критический путь нового пользователя", () => {
  test("регистрация → онбординг → утро → задача → вечер → запись в дневнике", async ({ page }) => {
    await signupAndLand(page);

    // Утро: намерение + завершение
    await page.getByPlaceholder("Ради чего этот день?").fill("Спокойно сделать главное");
    await page.getByPlaceholder("Что может помешать? Как я отвечу?").fill("Совещания — отвечу паузой");
    await page.getByRole("button", { name: /Завершить утро/ }).click();
    await expect(page.getByRole("heading", { name: "Утро завершено" })).toBeVisible();

    // Задача дня
    await page.getByRole("link", { name: "Задачи" }).first().click();
    await page.getByPlaceholder("Новая задача…").fill("Написать отчёт");
    await page.getByRole("button", { name: "Добавить" }).click();
    await expect(page.getByText("Написать отчёт").first()).toBeVisible();

    // Вечер: разбор с автоитогами
    await page.getByRole("link", { name: "Сегодня" }).first().click();
    await page.getByRole("button", { name: /Вечер/ }).click();
    await expect(page.getByText(/0 из 1 задач выполнено/)).toBeVisible();
    await page.getByPlaceholder("Главное достижение дня…").fill("Закончил отчёт");
    await page.getByRole("button", { name: /Сохранить разбор/ }).click();
    await expect(page.getByRole("heading", { name: /Разбор сохранён/ })).toBeVisible();

    // Запись появилась в дневнике
    await page.getByRole("link", { name: "Дневник" }).first().click();
    await expect(page.getByText(/Закончил отчёт/)).toBeVisible();
  });
});

test.describe("E2E-04 Язык на лету", () => {
  test("переключение RU → EN меняет интерфейс мгновенно", async ({ page }) => {
    await signupAndLand(page);
    await page.getByRole("button", { name: "RU / EN" }).click();
    await expect(page).toHaveURL(/\/en/);
    await expect(page.getByRole("heading", { name: /Good morning/ })).toBeVisible();
  });
});

test.describe("E2E-05 Тема", () => {
  test("переключение темы применяется к <html data-theme>", async ({ page }) => {
    await signupAndLand(page);
    await page.getByRole("button", { name: "Тема" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    // вторая тема — системная
    await page.getByRole("button", { name: "Тема" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", /dark|light/);
  });
});

test.describe("E2E-06 Практика → дневник", () => {
  test("выполнение практики создаёт связанную запись", async ({ page }) => {
    await signupAndLand(page);
    await page.getByRole("link", { name: "Гид" }).first().click();
    await page.getByRole("link", { name: /Дихотомия контроля/ }).first().click();
    await page.getByRole("button", { name: /Выполнить/ }).click();
    await expect(page).toHaveURL(/journal\/new\?practice=dichotomy-of-control/);
    await page.getByPlaceholder("О чём хочется написать?").fill("Три тревоги из четырёх — вне моей власти.");
    await page.getByRole("button", { name: "Сохранить" }).click();
    await expect(page.getByText(/Три тревоги из четырёх/)).toBeVisible();
    await expect(page.getByText(/🏺 Практика/).first()).toBeVisible();
  });
});
