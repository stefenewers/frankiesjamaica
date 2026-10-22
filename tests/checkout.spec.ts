import { expect, test } from "@playwright/test";
import { business, products } from "../src/lib/catalog";
import { MAX_WHATSAPP_URL_LENGTH, buildOrderUrl, resolveLines, type Customer } from "../src/lib/order";

const decode = (url: string) => new URL(url).searchParams.get("text") ?? "";

test("cart → checkout opens a prefilled WhatsApp order", async ({ page }) => {
  const [first, second] = products;

  // Capture the WhatsApp URL instead of leaving the site.
  await page.addInitScript(() => {
    (window as unknown as { __opened: string[] }).__opened = [];
    window.open = (url?: string | URL) => {
      (window as unknown as { __opened: string[] }).__opened.push(String(url));
      return null;
    };
  });

  await page.goto(`/shop/${first.slug}`);
  await page.getByLabel("Quantity").fill("2");
  await page.getByRole("button", { name: /add to bag/i }).click();
  const bag = page.getByRole("dialog", { name: /your bag/i });
  await expect(bag).toBeVisible();
  await expect(bag.getByRole("link", { name: first.name })).toBeVisible();
  await bag.getByRole("button", { name: /close bag/i }).click();

  await page.goto(`/shop/${second.slug}`);
  await page.getByRole("button", { name: /add to bag/i }).click();
  await expect(bag.getByRole("link", { name: second.name })).toBeVisible();

  // Cart survives a reload (localStorage).
  await page.reload();
  await page.getByTestId("open-cart").click();
  await expect(bag.getByRole("link", { name: second.name })).toBeVisible();
  await bag.getByRole("link", { name: "Checkout" }).click();

  await expect(page).toHaveURL(/\/checkout$/);
  await page.getByLabel("Name").fill("Test Customer");
  await page.getByLabel("Phone / WhatsApp").fill("876-555-0123");
  await page.getByLabel("Delivery area").fill("New Kingston");
  await page.getByLabel(/notes/i).fill("Happy birthday, Mum & Dad!");
  await page.getByRole("button", { name: /send order on whatsapp/i }).click();

  await expect(page).toHaveURL(/\/thanks$/);
  const opened = await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);
  expect(opened).toHaveLength(1);

  const url = opened[0];
  expect(url.startsWith(`https://wa.me/${business.whatsapp}?text=`)).toBe(true);
  expect(url.length).toBeLessThanOrEqual(MAX_WHATSAPP_URL_LENGTH);

  const text = decode(url);
  expect(text).toContain("Hi Frankies! New order 🛍️");
  expect(text).toContain("Name: Test Customer  Phone: 876-555-0123");
  expect(text).toContain(`- 2 x ${first.name}`);
  expect(text).toContain(`- 1 x ${second.name}`);
  expect(text).toMatch(/Subtotal: /);
  expect(text).toContain("Delivery/Pickup: Delivery – New Kingston");
  expect(text).toContain("Notes: Happy birthday, Mum & Dad!");

  // Bag is emptied and /thanks offers the link again.
  await expect(page.getByRole("link", { name: /open whatsapp again/i })).toHaveAttribute("href", url);
  await expect(page.getByTestId("open-cart")).toHaveAccessibleName(/0 items/);
});

test("very long carts are shortened to stay under the wa.me limit", () => {
  const customer: Customer = {
    name: "A".repeat(80),
    phone: "876-555-0123",
    method: "pickup",
    area: "",
    notes: "N".repeat(500),
  };
  const lines = resolveLines(products.map((p) => ({ slug: p.slug, variant: null, qty: 99 })).concat(
    products.map((p) => ({ slug: p.slug, variant: null, qty: 3 })),
  ));
  const url = buildOrderUrl(business.whatsapp, lines, customer);
  expect(url.length).toBeLessThanOrEqual(MAX_WHATSAPP_URL_LENGTH);
  const text = decode(url);
  expect(text).toContain("Hi Frankies! New order");
  expect(text).toContain("Delivery/Pickup: Pickup");
});
