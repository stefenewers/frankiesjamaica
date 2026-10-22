import { MAX_QTY, type CartLine } from "./order";

/**
 * Tiny localStorage-backed stores for useSyncExternalStore.
 * Snapshots are cached so React sees a stable reference between changes,
 * and other tabs stay in sync through the `storage` event.
 */
function createLocalStore<T>(key: string, parse: (raw: unknown) => T, empty: T) {
  let cache: T | undefined;
  const listeners = new Set<() => void>();

  function read(): T {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? parse(JSON.parse(raw)) : empty;
    } catch {
      return empty;
    }
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) {
          cache = undefined;
          listener();
        }
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
    getSnapshot(): T {
      if (cache === undefined) cache = read();
      return cache;
    },
    getServerSnapshot(): T {
      return empty;
    },
    set(value: T) {
      cache = value;
      try {
        if (value === empty) window.localStorage.removeItem(key);
        else window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Private mode or storage full: state still works for this page view.
      }
      listeners.forEach((l) => l());
    },
  };
}

/* ── Cart ─────────────────────────────────────────────────────── */

const EMPTY_CART: CartLine[] = [];

function parseLines(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return EMPTY_CART;
  return raw.filter(
    (l): l is CartLine =>
      typeof l?.slug === "string" &&
      (l.variant === null || typeof l.variant === "string") &&
      typeof l.qty === "number",
  );
}

const cart = createLocalStore("frankies.cart.v1", parseLines, EMPTY_CART);

export const subscribe = cart.subscribe;
export const getSnapshot = cart.getSnapshot;
export const getServerSnapshot = cart.getServerSnapshot;

const same = (l: CartLine, slug: string, variant: string | null) =>
  l.slug === slug && l.variant === variant;

export function addItem(slug: string, variant: string | null, qty = 1) {
  const lines = cart.getSnapshot();
  const existing = lines.find((l) => same(l, slug, variant));
  cart.set(
    existing
      ? lines.map((l) => (l === existing ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l))
      : [...lines, { slug, variant, qty: Math.min(MAX_QTY, qty) }],
  );
}

export function setQty(slug: string, variant: string | null, qty: number) {
  const lines = cart.getSnapshot();
  cart.set(
    qty <= 0
      ? lines.filter((l) => !same(l, slug, variant))
      : lines.map((l) => (same(l, slug, variant) ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)),
  );
}

export function clearCart() {
  cart.set(EMPTY_CART);
}

/* ── Pending WhatsApp handoff ─────────────────────────────────── */

/**
 * An order or custom request that has been written out for WhatsApp but not
 * yet confirmed as sent. Opening WhatsApp proves nothing was sent, so the bag
 * is kept until the customer says they've sent it.
 */
export type PendingHandoff = {
  kind: "order" | "custom";
  url: string;
  /** Items in the order (empty for custom requests). */
  lines: CartLine[];
  /** Whether the browser actually opened a WhatsApp window. */
  opened: boolean;
  createdAt: number;
};

function parsePending(raw: unknown): PendingHandoff | null {
  if (typeof raw !== "object" || raw === null) return null;
  const p = raw as Partial<PendingHandoff>;
  if ((p.kind !== "order" && p.kind !== "custom") || typeof p.url !== "string") return null;
  if (!p.url.startsWith("https://wa.me/")) return null;
  return {
    kind: p.kind,
    url: p.url,
    lines: parseLines(p.lines),
    opened: Boolean(p.opened),
    createdAt: typeof p.createdAt === "number" ? p.createdAt : 0,
  };
}

const pending = createLocalStore<PendingHandoff | null>("frankies.pending.v1", parsePending, null);

export const subscribePending = pending.subscribe;
export const getPending = pending.getSnapshot;
export const getServerPending = pending.getServerSnapshot;

/**
 * Open WhatsApp with the prepared message and remember the handoff.
 * Must be called synchronously from a click/submit handler so pop-up blockers allow it.
 */
export function startHandoff(kind: PendingHandoff["kind"], url: string, lines: CartLine[] = []) {
  const win = window.open(url, "_blank");
  if (win) win.opener = null;
  pending.set({ kind, url, lines, opened: Boolean(win), createdAt: Date.now() });
}

/** The customer says they've sent it: remove those items from the bag and clear the handoff. */
export function confirmHandoffSent() {
  const p = pending.getSnapshot();
  if (p?.kind === "order") {
    let lines = cart.getSnapshot();
    for (const sent of p.lines) {
      lines = lines.flatMap((l) => {
        if (!same(l, sent.slug, sent.variant)) return [l];
        const qty = l.qty - sent.qty;
        return qty > 0 ? [{ ...l, qty }] : [];
      });
    }
    cart.set(lines.length ? lines : EMPTY_CART);
  }
  pending.set(null);
}

export function cancelHandoff() {
  pending.set(null);
}
