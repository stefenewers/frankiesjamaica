import data from "../../content/products.json";

export type Variant = {
  name: string;
  /** Price in whole JMD. `null` shows "Enquire" / "Price confirmed on WhatsApp". */
  price: number | null;
};

/** Facts shown on the product page. `null` = not confirmed yet (see MERCHANT_HANDOFF.md). */
export type ProductDetails = {
  /** e.g. "Six designs, shown above" */
  designs: string | null;
  /** What the customer receives, e.g. "One card with a kraft envelope" */
  includes: string | null;
  size: string | null;
  material: string | null;
  personalisation: string | null;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  /** Who/what it's for, e.g. "Birthdays". `null` for non-card products. */
  occasion: string | null;
  details: ProductDetails;
  /** Price in whole JMD. `null` shows "Enquire" / "Price confirmed on WhatsApp". Ignored when variants have their own price. */
  price: number | null;
  variants: Variant[];
  images: string[];
  description: string;
  available: boolean;
  featured?: boolean;
  etsyUrl: string | null;
  reviewed?: boolean;
};

export type Category = {
  id: string;
  name: string;
  blurb: string;
  image: string;
};

export type Business = (typeof data)["business"];

export type FaqEntry = { q: string; a: string | null };

export const business: Business = data.business;
export const categories: Category[] = data.categories;
export const products: Product[] = data.products as Product[];
export const customOccasions: string[] = data.customOccasions;
export const faq: FaqEntry[] = data.faq;

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function priceFor(product: Product, variantName?: string | null): number | null {
  const variant = variantName ? product.variants.find((v) => v.name === variantName) : undefined;
  if (variant && variant.price !== null) return variant.price;
  return product.price;
}

/** Lowest known price across a product and its variants, for "from J$…" labels. */
export function startingPrice(product: Product): number | null {
  const prices = [product.price, ...product.variants.map((v) => v.price)].filter(
    (p): p is number => p !== null,
  );
  return prices.length ? Math.min(...prices) : null;
}

const jmd = new Intl.NumberFormat("en-JM", { maximumFractionDigits: 0 });

export function formatPrice(amount: number): string {
  return `J$${jmd.format(amount)}`;
}

/** Customer-facing wording when a price is `null` in products.json. */
export const PRICE_PENDING = {
  /** Catalogue grids and the bag: one quiet word. */
  short: "Enquire",
  /** Product pages: explains what happens next. */
  long: "Price confirmed on WhatsApp",
} as const;

/** "J$1,500", "From J$500", or the short enquiry label. */
export function priceLabel(product: Product): string {
  const price = startingPrice(product);
  if (price === null) return PRICE_PENDING.short;
  return `${product.variants.length > 1 ? "From " : ""}${formatPrice(price)}`;
}
