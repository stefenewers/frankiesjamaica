import data from "../../content/products.json";

export type Variant = {
  name: string;
  /** Price in whole JMD. `null` means "Ask for price". */
  price: number | null;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  /** Price in whole JMD. `null` means "Ask for price". Ignored when variants have their own price. */
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

export const ASK_FOR_PRICE = "Ask for price";
