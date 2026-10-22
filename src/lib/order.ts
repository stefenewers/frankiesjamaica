import { formatPrice, getProduct, priceFor, type Product } from "./catalog";

export type CartLine = {
  slug: string;
  variant: string | null;
  qty: number;
};

export type DeliveryMethod = "delivery" | "pickup";

export type Customer = {
  name: string;
  phone: string;
  method: DeliveryMethod;
  area: string;
  notes: string;
};

export type ResolvedLine = {
  product: Product;
  variant: string | null;
  qty: number;
  unitPrice: number | null;
  lineTotal: number | null;
};

export const MAX_QTY = 99;

/** Turn raw cart lines into priced lines, dropping anything no longer in the catalog. */
export function resolveLines(lines: CartLine[]): ResolvedLine[] {
  const out: ResolvedLine[] = [];
  for (const line of lines) {
    const product = getProduct(line.slug);
    if (!product) continue;
    const qty = Math.min(MAX_QTY, Math.max(1, Math.floor(line.qty) || 1));
    const variant =
      line.variant && product.variants.some((v) => v.name === line.variant) ? line.variant : null;
    const unitPrice = priceFor(product, variant);
    out.push({
      product,
      variant,
      qty,
      unitPrice,
      lineTotal: unitPrice === null ? null : unitPrice * qty,
    });
  }
  return out;
}

export type Subtotal = { known: number; hasUnpriced: boolean };

export function subtotal(lines: ResolvedLine[]): Subtotal {
  return {
    known: lines.reduce((sum, l) => sum + (l.lineTotal ?? 0), 0),
    hasUnpriced: lines.some((l) => l.lineTotal === null),
  };
}

export function formatSubtotal({ known, hasUnpriced }: Subtotal): string {
  if (!hasUnpriced) return formatPrice(known);
  if (known === 0) return "To be confirmed";
  return `${formatPrice(known)} + items priced on request`;
}

function itemLine(l: ResolvedLine, withPrice = true): string {
  const variant = l.variant ? ` (${l.variant})` : "";
  const price = l.lineTotal === null ? "price on request" : formatPrice(l.lineTotal);
  return `- ${l.qty} x ${l.product.name}${variant}${withPrice ? ` – ${price}` : ""}`;
}

function methodLabel(c: Customer): string {
  const method = c.method === "pickup" ? "Pickup" : "Delivery";
  return c.area.trim() ? `${method} – ${c.area.trim()}` : method;
}

/**
 * The WhatsApp order message from HANDOFF §5. `itemLines` lets the URL builder
 * shorten very long carts without changing the rest of the template.
 */
export function buildOrderMessage(
  lines: ResolvedLine[],
  customer: Customer,
  itemLines: string[] = lines.map((l) => itemLine(l)),
): string {
  return [
    "Hi Frankies! New order 🛍️",
    `Name: ${customer.name.trim()}  Phone: ${customer.phone.trim()}`,
    "Items:",
    ...itemLines,
    `Subtotal: ${formatSubtotal(subtotal(lines))}`,
    `Delivery/Pickup: ${methodLabel(customer)}`,
    `Notes: ${customer.notes.trim() || "–"}`,
  ].join("\n");
}

/**
 * Keep wa.me links comfortably under ~2000 characters so they open reliably on
 * iOS, Android and desktop.
 */
export const MAX_WHATSAPP_URL_LENGTH = 1900;

export function whatsappUrl(number: string, text?: string): string {
  const base = `https://wa.me/${number.replace(/\D/g, "")}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Build the order link, shortening long carts so the URL stays under the limit. */
export function buildOrderUrl(number: string, lines: ResolvedLine[], customer: Customer): string {
  const attempts: string[][] = [
    lines.map((l) => itemLine(l)),
    lines.map((l) => itemLine(l, false)),
  ];
  for (const items of attempts) {
    const url = whatsappUrl(number, buildOrderMessage(lines, customer, items));
    if (url.length <= MAX_WHATSAPP_URL_LENGTH) return url;
  }
  // Still too long: list as many items as fit and summarise the rest.
  const all = attempts[1];
  for (let keep = all.length - 1; keep >= 0; keep--) {
    const rest = lines.slice(keep).reduce((n, l) => n + l.qty, 0);
    const items = [...all.slice(0, keep), `- …and ${rest} more item(s) – full list to follow`];
    const url = whatsappUrl(number, buildOrderMessage(lines, customer, items));
    if (url.length <= MAX_WHATSAPP_URL_LENGTH) return url;
  }
  return whatsappUrl(number, buildOrderMessage(lines, { ...customer, notes: "" }, []));
}

export type CustomRequest = {
  name: string;
  phone: string;
  occasion: string;
  quantity: number;
  message: string;
  dateNeeded: string;
};

export function buildCustomMessage(r: CustomRequest): string {
  return [
    "Hi Frankies! Custom card request ✉️",
    `Name: ${r.name.trim()}  Phone: ${r.phone.trim()}`,
    `Occasion: ${r.occasion}`,
    `Quantity: ${r.quantity}`,
    `Date needed: ${r.dateNeeded || "Flexible"}`,
    `Message/idea: ${r.message.trim() || "–"}`,
  ].join("\n");
}

export function buildCustomUrl(number: string, r: CustomRequest): string {
  let message = r.message.trim();
  let url = whatsappUrl(number, buildCustomMessage({ ...r, message }));
  while (url.length > MAX_WHATSAPP_URL_LENGTH && message.length > 0) {
    message = message.slice(0, Math.floor(message.length * 0.8));
    url = whatsappUrl(number, buildCustomMessage({ ...r, message: `${message}… (more to follow)` }));
  }
  return url;
}
