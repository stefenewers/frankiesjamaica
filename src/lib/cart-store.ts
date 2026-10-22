import { MAX_QTY, type CartLine } from "./order";

/**
 * A tiny localStorage-backed cart store for useSyncExternalStore.
 * Snapshots are cached so React sees a stable reference between changes.
 */
const KEY = "frankies.cart.v1";
const LAST_ORDER_KEY = "frankies.lastOrderUrl";
const EMPTY: CartLine[] = [];

let cache: CartLine[] | null = null;
const listeners = new Set<() => void>();

function read(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter(
      (l): l is CartLine =>
        typeof l?.slug === "string" &&
        (l.variant === null || typeof l.variant === "string") &&
        typeof l.qty === "number",
    );
  } catch {
    return EMPTY;
  }
}

function write(lines: CartLine[]) {
  cache = lines;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    // Private mode or storage full: the cart still works for this page view.
  }
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function getSnapshot(): CartLine[] {
  if (cache === null) cache = read();
  return cache;
}

export function getServerSnapshot(): CartLine[] {
  return EMPTY;
}

const same = (l: CartLine, slug: string, variant: string | null) =>
  l.slug === slug && l.variant === variant;

export function addItem(slug: string, variant: string | null, qty = 1) {
  const lines = getSnapshot();
  const existing = lines.find((l) => same(l, slug, variant));
  write(
    existing
      ? lines.map((l) => (l === existing ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l))
      : [...lines, { slug, variant, qty: Math.min(MAX_QTY, qty) }],
  );
}

export function setQty(slug: string, variant: string | null, qty: number) {
  const lines = getSnapshot();
  write(
    qty <= 0
      ? lines.filter((l) => !same(l, slug, variant))
      : lines.map((l) => (same(l, slug, variant) ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)),
  );
}

export function clearCart() {
  write([]);
}

/** Remember the last WhatsApp link so /thanks can offer to reopen it. */
export function rememberOrderUrl(url: string) {
  try {
    window.sessionStorage.setItem(LAST_ORDER_KEY, url);
  } catch {}
}

export function lastOrderUrl(): string | null {
  try {
    return window.sessionStorage.getItem(LAST_ORDER_KEY);
  } catch {
    return null;
  }
}
