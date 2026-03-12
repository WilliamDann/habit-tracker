import { test, expect } from "@playwright/test";

test.describe("Habits", () => {
  // These tests require a logged-in user with a seeded Supabase project
  test.skip(true, "Requires authenticated session and Supabase setup");

  test("create habit appears in list", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByText("Add Habit").click();
    await page.fill("#habit-name", "Morning Run");
    await page.getByText("Create").click();
    await expect(page.getByText("Morning Run")).toBeVisible();
  });

  test("toggle completion fills dot", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByText("Mark Done").first().click();
    await expect(page.getByText("Done").first()).toBeVisible();
  });

  test("delete habit removes from list", async ({ page }) => {
    await page.goto("/dashboard");
    page.on("dialog", (dialog) => dialog.accept());
    await page.getByText("Delete").first().click();
    await expect(page.getByText("Morning Run")).not.toBeVisible();
  });
});
