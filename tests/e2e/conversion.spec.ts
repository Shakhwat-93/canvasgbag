import { expect, test } from "@playwright/test";

test("COD conversion flow works in demo mode", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /The active trip starts here/i })).toBeVisible();

  await page.goto("/product/urban-canvas-tote");
  await expect(page.getByRole("heading", { name: "Active Bottle Canvas Bag" })).toBeVisible();
  await page.getByRole("button", { name: "Add to cart" }).click();

  await page.getByRole("link", { name: "Open cart" }).click();
  await expect(page.getByRole("heading", { name: "Cart" })).toBeVisible();
  await expect(page.getByText("Active Bottle Canvas Bag").first()).toBeVisible();

  await page.getByRole("link", { name: "Checkout with COD" }).click();
  await expect(page.getByRole("heading", { name: "Complete your order" })).toBeVisible();

  await page.getByLabel("Full name").fill("Nusrat Jahan");
  await page.getByLabel("Phone number").fill("01712345678");
  await page.getByLabel("City").fill("Dhaka");
  await page.getByLabel("Area").fill("Dhanmondi");
  await page.getByLabel("Full delivery address").fill("House 12, Road 8, Dhanmondi, Dhaka");
  await page.getByRole("button", { name: "Place COD order" }).click();

  await expect(page).toHaveURL(/\/order\/success\/demo-/);
  await expect(page.getByRole("heading", { name: "We will call to confirm." })).toBeVisible();
});
