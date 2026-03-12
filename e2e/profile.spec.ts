import { test, expect } from "@playwright/test";

test.describe("Profile", () => {
  test.skip(true, "Requires authenticated session and Supabase setup");

  test("profile page shows form fields", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.locator("#username")).toBeVisible();
    await expect(page.locator("#display-name")).toBeVisible();
    await expect(page.locator("#bio")).toBeVisible();
  });

  test("can update display name", async ({ page }) => {
    await page.goto("/profile");
    await page.fill("#display-name", "Test User");
    await page.getByText("Save").click();
    await expect(page.getByText("Profile updated!")).toBeVisible();
  });
});
