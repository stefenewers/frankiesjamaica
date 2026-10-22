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

/* ── Pending WhatsApp handoffs ────────────────────────────────── */

/**
 * An order or custom request written out for WhatsApp but not confirmed as
 * sent. Opening WhatsApp proves nothing was sent, so the bag is never cleared
 * automatically — confirming ("I've sent it") is optional and only tidies up.
 */
export type HandoffKind = "order" | "custom";

export type PendingHandoff = {
  kind: HandoffKind;
  url: string;
  /** Items in the order (empty for custom requests). */
  lines: CartLine[];
  /** Whether the browser actually opened a WhatsApp window. */
  opened: boolean;
  createdAt: number;
};

/** One slot per kind, so a custom request never replaces a waiting order. */
export type PendingHandoffs = { order: PendingHandoff | null; custom: PendingHandoff | null };

/** Reminders stop after this long. Only the reminder goes — the bag is untouched. */
export const PENDING_TTL_MS = 48 * 60 * 60 * 1000;

const NO_PENDING: PendingHandoffs = { order: null, custom: null };

function parseHandoff(raw: unknown, kind: HandoffKind): PendingHandoff | null {
  if (typeof raw !== "object" || raw === null) return null;
  const p = raw as Partial<PendingHandoff>;
  if (typeof p.url !== "string" || !p.url.startsWith("https://wa.me/")) return null;
  const createdAt = typeof p.createdAt === "number" ? p.createdAt : 0;
  if (Date.now() - createdAt > PENDING_TTL_MS) return null;
  return { kind, url: p.url, lines: parseLines(p.lines), opened: Boolean(p.opened), createdAt };
}

function parsePending(raw: unknown): PendingHandoffs {
  if (typeof raw !== "object" || raw === null) return NO_PENDING;
  const r = raw as Record<string, unknown>;
  const order = parseHandoff(r.order, "order");
  const custom = parseHandoff(r.custom, "custom");
  return order || custom ? { order, custom } : NO_PENDING;
}

const pending = createLocalStore<PendingHandoffs>("frankies.pending.v2", parsePending, NO_PENDING);

export const subscribePending = pending.subscribe;
export const getPending = pending.getSnapshot;
export const getServerPending = pending.getServerSnapshot;

function setSlot(kind: HandoffKind, value: PendingHandoff | null) {
  const next = { ...pending.getSnapshot(), [kind]: value };
  pending.set(next.order || next.custom ? next : NO_PENDING);
}

/** The most recently written-out handoff, if any. */
export function latestHandoff(p: PendingHandoffs): PendingHandoff | null {
  if (p.order && p.custom) return p.order.createdAt >= p.custom.createdAt ? p.order : p.custom;
  return p.order ?? p.custom;
}

/** True if the bag no longer matches what was written out for WhatsApp. */
export function bagChangedSince(handoff: PendingHandoff, bag: CartLine[]): boolean {
  const key = (lines: CartLine[]) =>
    lines
      .map((l) => `${l.slug}|${l.variant ?? ""}|${l.qty}`)
      .sort()
      .join(",");
  return key(handoff.lines) !== key(bag);
}

/**
 * Open WhatsApp with the prepared message and remember the handoff.
 * Must be called synchronously from a click/submit handler so pop-up blockers allow it.
 * A new order replaces an older unsent order (the bag holds the same items).
 */
export function startHandoff(kind: HandoffKind, url: string, lines: CartLine[] = []) {
  const win = window.open(url, "_blank");
  if (win) win.opener = null;
  setSlot(kind, { kind, url, lines, opened: Boolean(win), createdAt: Date.now() });
}

/** Optional: the customer says they've sent it. Removes those items from the bag. */
export function confirmHandoffSent(kind: HandoffKind) {
  const p = pending.getSnapshot()[kind];
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
  setSlot(kind, null);
}

/** Stop reminding about a handoff. The bag is left exactly as it is. */
export function dismissHandoff(kind: HandoffKind) {
  setSlot(kind, null);
}
