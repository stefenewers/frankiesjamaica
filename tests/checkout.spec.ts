import { expect, test, type Page } from "@playwright/test";
import { business, products } from "../src/lib/catalog";
import { MAX_WHATSAPP_URL_LENGTH, buildOrderUrl, resolveLines, type Customer } from "../src/lib/order";

const decode = (url: string) => new URL(url).searchParams.get("text") ?? "";
const [first, second] = products;

type Win = Window & { __opened: string[] };

/** Capture window.open instead of leaving the site; optionally simulate a pop-up blocker. */
async function stubWindowOpen(page: Page, { blocked = false } = {}) {
  await page.addInitScript((blocked) => {
    const w = window as unknown as Win;
    w.__opened = [];
    w.open = ((url?: string | URL) => {
      w.__opened.push(String(url));
      return blocked ? null : ({ opener: window } as unknown as Window);
    }) as typeof window.open;
  }, blocked);
}

const opened = (page: Page) => page.evaluate(() => (window as unknown as Win).__opened);

async function fillBagAndCheckout(page: Page) {
  await page.goto(`/shop/${first.slug}`);
  await page.getByLabel("Quantity", { exact: true }).fill("2");
  await page.getByRole("button", { name: "Add to bag" }).click();
  const bag = page.getByRole("dialog", { name: /your bag/i });
  await expect(bag.getByRole("link", { name: first.name })).toBeVisible();
  await bag.getByRole("button", { name: /close bag/i }).click();

  await page.goto(`/shop/${second.slug}`);
  await page.getByRole("button", { name: "Add to bag" }).click();
  await expect(bag.getByRole("link", { name: second.name })).toBeVisible();

  // Bag survives a reload (localStorage).
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
}

test("checkout opens a prefilled WhatsApp order and keeps the bag until it's sent", async ({ page }) => {
  await stubWindowOpen(page);
  await fillBagAndCheckout(page);

  const urls = await opened(page);
  expect(urls).toHaveLength(1);
  const url = urls[0];
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

  // Pending, not confirmed: the bag is still there and WhatsApp can be reopened.
  await expect(page.getByRole("heading", { name: "Your order is ready to send." })).toBeVisible();
  await expect(page.getByTestId("handoff-status")).toContainText("isn't placed until you press send");
  await expect(page.getByRole("link", { name: /open whatsapp again/i })).toHaveAttribute("href", url);
  await expect(page.getByTestId("open-cart")).toHaveAccessibleName(/3 items/);

  // Survives a reload.
  await page.reload();
  await expect(page.getByRole("heading", { name: "Your order is ready to send." })).toBeVisible();

  // The bag reminds the customer too.
  await page.getByTestId("open-cart").click();
  await expect(page.getByTestId("pending-notice")).toBeVisible();
  await page.getByRole("button", { name: /close bag/i }).click();

  // Only once they confirm is the bag cleared.
  await page.getByRole("button", { name: "I've sent it" }).click();
  await expect(page.getByRole("heading", { name: "We'll be in touch." })).toBeFocused();
  await expect(page.getByTestId("open-cart")).toHaveAccessibleName(/0 items/);

  await page.reload();
  await expect(page.getByRole("heading", { name: "Nothing waiting to send." })).toBeVisible();
});

test("if WhatsApp is blocked, the order is kept and can be opened from /thanks", async ({ page }) => {
  await stubWindowOpen(page, { blocked: true });
  await fillBagAndCheckout(page);

  await expect(page.getByTestId("handoff-status")).toContainText("WhatsApp didn't open");
  const link = page.getByRole("link", { name: /^open whatsapp$/i });
  await expect(link).toHaveAttribute("href", (await opened(page))[0]);
  await expect(page.getByTestId("open-cart")).toHaveAccessibleName(/3 items/);
});

test("custom brief hands off to WhatsApp without touching the bag", async ({ page }) => {
  await stubWindowOpen(page);
  await page.goto(`/shop/${first.slug}`);
  await page.getByRole("button", { name: "Add to bag" }).click();
  await page.getByRole("button", { name: /close bag/i }).click();

  await page.goto("/custom");
  await page.getByLabel("Occasion").selectOption("Birthday");
  await page.getByLabel("How many cards").fill("12");
  await page.getByLabel(/wording, style/i).fill("Gold lettering, please");
  await page.getByLabel("Name").fill("Test Customer");
  await page.getByLabel("Phone / WhatsApp").fill("876-555-0123");
  await page.getByRole("button", { name: /send your brief/i }).click();

  await expect(page.getByRole("heading", { name: "Your request is ready to send." })).toBeVisible();
  const text = decode((await opened(page))[0]);
  expect(text).toContain("Custom card request");
  expect(text).toContain("Occasion: Birthday");
  expect(text).toContain("Quantity: 12");

  await page.getByRole("button", { name: "I've sent it" }).click();
  await expect(page.getByRole("heading", { name: "We'll be in touch." })).toBeVisible();
  await expect(page.getByTestId("open-cart")).toHaveAccessibleName(/1 item\b/);
});

test("/thanks with nothing pending says so", async ({ page }) => {
  await page.goto("/thanks");
  await expect(page.getByRole("heading", { name: "Nothing waiting to send." })).toBeVisible();
});

test("keyboard: skip link, bag dialog opens and closes with focus restored", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard navigation is checked on desktop");
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();

  const bagButton = page.getByTestId("open-cart");
  await bagButton.focus();
  await page.keyboard.press("Enter");
  const bag = page.getByRole("dialog", { name: /your bag/i });
  await expect(bag).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(bag).toBeHidden();
  await expect(bagButton).toBeFocused();
});

test("very long carts are shortened to stay under the wa.me limit", () => {
  const customer: Customer = {
    name: "A".repeat(80),
    phone: "876-555-0123",
    method: "pickup",
    area: "",
    notes: "N".repeat(500),
  };
  const lines = resolveLines(
    products
      .map((p) => ({ slug: p.slug, variant: null, qty: 99 }))
      .concat(products.map((p) => ({ slug: p.slug, variant: null, qty: 3 }))),
  );
  const url = buildOrderUrl(business.whatsapp, lines, customer);
  expect(url.length).toBeLessThanOrEqual(MAX_WHATSAPP_URL_LENGTH);
  const text = decode(url);
  expect(text).toContain("Hi Frankies! New order");
  expect(text).toContain("Delivery/Pickup: Pickup");
});
