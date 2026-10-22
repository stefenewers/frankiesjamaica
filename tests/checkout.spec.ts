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
  await submitCheckout(page);
}

async function submitCheckout(page: Page, notes = "Happy birthday, Mum & Dad!") {
  await page.getByLabel("Name").fill("Test Customer");
  await page.getByLabel("Phone / WhatsApp").fill("876-555-0123");
  await page.getByLabel("Delivery area").fill("New Kingston");
  await page.getByLabel(/notes/i).fill(notes);
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

test("dismissing a pending order keeps the bag", async ({ page }) => {
  await stubWindowOpen(page);
  await fillBagAndCheckout(page);
  await page.getByRole("button", { name: /not now/i }).click();
  await expect(page.getByRole("heading", { name: "All set." })).toBeFocused();
  await expect(page.getByTestId("open-cart")).toHaveAccessibleName(/3 items/);
  await page.getByTestId("open-cart").click();
  await expect(page.getByTestId("pending-notice")).toHaveCount(0);
});

test("editing the bag after writing out an order is flagged", async ({ page }) => {
  await stubWindowOpen(page);
  await fillBagAndCheckout(page);
  await expect(page.getByTestId("bag-changed")).toHaveCount(0);
  await page.getByTestId("open-cart").click();
  await page.getByRole("button", { name: `Increase quantity of ${second.name}` }).click();
  await page.getByRole("button", { name: /close bag/i }).click();
  await expect(page.getByTestId("bag-changed")).toBeVisible();
  await expect(page.getByTestId("bag-changed").getByRole("link", { name: "check out again" })).toHaveAttribute(
    "href",
    "/checkout",
  );
});

test("checking out a second time warns about duplicates and replaces the pending order", async ({ page }) => {
  await stubWindowOpen(page);
  await fillBagAndCheckout(page);
  await page.goto("/checkout");
  await expect(page.getByRole("form", { name: "Your details" }).getByTestId("pending-notice")).toContainText(
    "no need to send it again",
  );
  await submitCheckout(page, "Second attempt");

  // (page.goto reloaded the page, so only the second window.open is recorded.)
  const latest = (await opened(page)).at(-1)!;
  expect(decode(latest)).toContain("Notes: Second attempt");
  await expect(page.getByRole("link", { name: /open whatsapp again/i })).toHaveAttribute("href", latest);
});

test("a custom request doesn't replace a waiting order", async ({ page }) => {
  await stubWindowOpen(page);
  await fillBagAndCheckout(page);
  await page.goto("/custom");
  await page.getByLabel("Occasion").selectOption("Wedding");
  await page.getByLabel("Name").fill("Test Customer");
  await page.getByLabel("Phone / WhatsApp").fill("876-555-0123");
  await page.getByRole("button", { name: /send your brief/i }).click();

  await expect(page.getByRole("heading", { name: "Your request is ready to send." })).toBeVisible();
  await page.getByTestId("other-handoff").getByRole("button", { name: "View it" }).click();
  await expect(page.getByRole("heading", { name: "Your order is ready to send." })).toBeVisible();
});

test("double-tapping checkout opens WhatsApp once", async ({ page }) => {
  await stubWindowOpen(page);
  await page.goto(`/shop/${first.slug}`);
  await page.getByRole("button", { name: "Add to bag" }).click();
  await page.goto("/checkout");
  await page.getByLabel("Name").fill("Test Customer");
  await page.getByLabel("Phone / WhatsApp").fill("876-555-0123");
  await page.getByLabel("Delivery area").fill("New Kingston");
  await page.getByRole("button", { name: /send order on whatsapp/i }).dblclick();
  await expect(page).toHaveURL(/\/thanks$/);
  expect(await opened(page)).toHaveLength(1);
});

test("reminders expire after 48 hours but the bag is kept", async ({ page }) => {
  await page.addInitScript(
    ({ slug }) => {
      const old = Date.now() - 49 * 60 * 60 * 1000;
      const lines = [{ slug, variant: null, qty: 2 }];
      localStorage.setItem("frankies.cart.v1", JSON.stringify(lines));
      localStorage.setItem(
        "frankies.pending.v2",
        JSON.stringify({ order: { url: "https://wa.me/1?text=x", lines, opened: true, createdAt: old } }),
      );
    },
    { slug: first.slug },
  );
  await page.goto("/thanks");
  await expect(page.getByRole("heading", { name: "Nothing waiting to send." })).toBeVisible();
  await expect(page.getByTestId("open-cart")).toHaveAccessibleName(/2 items/);
});

test("every 'Shop by occasion' link opens a real product", async ({ page }) => {
  await page.goto("/");
  const links = page.getByRole("navigation", { name: "Shop by occasion" }).getByRole("link");
  const hrefs = await links.evaluateAll((els) => els.map((e) => e.getAttribute("href")!));
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) {
    const slug = href.replace("/shop/", "");
    const product = products.find((p) => p.slug === slug);
    expect(product, href).toBeDefined();
    expect(product!.available).toBe(true);
    const res = await page.goto(href);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: product!.name })).toBeVisible();
  }
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
