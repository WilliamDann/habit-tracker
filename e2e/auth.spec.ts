import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("unauthenticated user is redirected to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login page has email and password fields", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("can toggle between sign in and sign up", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("Sign In")).toBeVisible();
    await page.getByText("Don't have an account?").click();
    await expect(page.getByText("Sign Up")).toBeVisible();
  });
});
