"use client";

import { createContext, useContext, useMemo, useState, useSyncExternalStore } from "react";
import {
  getPending,
  getServerPending,
  getServerSnapshot,
  getSnapshot,
  subscribe,
  subscribePending,
  type PendingHandoff,
} from "@/lib/cart-store";
import { resolveLines, type CartLine, type ResolvedLine } from "@/lib/order";

type CartContextValue = {
  lines: CartLine[];
  resolved: ResolvedLine[];
  count: number;
  /** An order/request written out for WhatsApp but not yet confirmed as sent. */
  pending: PendingHandoff | null;
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const pending = useSyncExternalStore(subscribePending, getPending, getServerPending);
  const [isOpen, setOpen] = useState(false);

  const value = useMemo<CartContextValue>(() => {
    const resolved = resolveLines(lines);
    return {
      lines,
      resolved,
      count: resolved.reduce((n, l) => n + l.qty, 0),
      pending,
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
    };
  }, [lines, pending, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
