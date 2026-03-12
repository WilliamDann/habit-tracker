import { test, expect } from "@playwright/test";

test.describe("Buddies", () => {
  test.skip(true, "Requires authenticated session and Supabase setup");

  test("buddies page shows empty state", async ({ page }) => {
    await page.goto("/buddies");
    await expect(
      page.getByText("No buddies yet")
    ).toBeVisible();
  });

  test("add buddy dialog opens", async ({ page }) => {
    await page.goto("/buddies");
    await page.getByText("Add Buddy").click();
    await expect(page.getByText("Search by username")).toBeVisible();
  });

  test("can generate invite link", async ({ page }) => {
    await page.goto("/buddies");
    await page.getByText("Add Buddy").click();
    await page.getByText("Generate Invite Link").click();
    await expect(page.locator("input[readonly]")).toBeVisible();
  });
});
