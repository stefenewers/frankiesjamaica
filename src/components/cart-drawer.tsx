"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "./cart-provider";
import { CloseIcon } from "./icons";
import { PRICE_PENDING, formatPrice } from "@/lib/catalog";
import { setQty } from "@/lib/cart-store";
import { formatSubtotal, subtotal, type ResolvedLine } from "@/lib/order";

export function CartDrawer() {
  const { resolved, count, isOpen, close } = useCart();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={ref}
      className="drawer"
      aria-labelledby="cart-title"
      onClose={close}
      onClick={(e) => {
        // Clicking the backdrop (the dialog element itself) closes the drawer.
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-[var(--header-h)] items-center justify-between px-6 rule-b">
          <h2 id="cart-title" className="kicker">
            Your bag {count > 0 && <span className="text-ink-muted">({count})</span>}
          </h2>
          <button type="button" onClick={close} className="icon-btn -mr-2.5" aria-label="Close bag">
            <CloseIcon className="size-[22px]" />
          </button>
        </div>

        {resolved.length === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center gap-6 px-6">
            <p className="display-m">Your bag is empty.</p>
            <Link href="/shop" className="link-arrow" onClick={close}>
              Browse the shop
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6" aria-label="Items in your bag">
              {resolved.map((line) => (
                <CartItem key={`${line.product.slug}:${line.variant ?? ""}`} line={line} onNavigate={close} />
              ))}
            </ul>
            <div className="space-y-5 px-6 pb-6 pt-5 rule-t">
              <div className="flex items-baseline justify-between gap-4">
                <span className="kicker">Subtotal</span>
                <span className="text-right" data-testid="cart-subtotal">
                  {formatSubtotal(subtotal(resolved))}
                </span>
              </div>
              <Link href="/checkout" className="btn btn-primary w-full" onClick={close}>
                Checkout
              </Link>
              <p className="meta text-center">Your order is confirmed with us on WhatsApp.</p>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}

function CartItem({ line, onNavigate }: { line: ResolvedLine; onNavigate: () => void }) {
  const { product, variant, qty, lineTotal } = line;
  const label = `${product.name}${variant ? `, ${variant}` : ""}`;

  return (
    <li className="flex gap-5 py-6 rule-b last:border-b-0">
      <Link
        href={`/shop/${product.slug}`}
        onClick={onNavigate}
        className="frame aspect-[4/5] w-20 shrink-0"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image src={product.images[0]} alt="" fill sizes="80px" className="object-cover" />
      </Link>
      <div className="flex flex-1 flex-col justify-between gap-3">
        <div className="flex justify-between gap-3">
          <div>
            <Link href={`/shop/${product.slug}`} onClick={onNavigate} className="title text-lg hover:text-brown">
              {product.name}
            </Link>
            {variant && <p className="meta">{variant}</p>}
          </div>
          <p className="meta whitespace-nowrap text-right">
            {lineTotal === null ? PRICE_PENDING.short : formatPrice(lineTotal)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-full border border-rule-strong">
            <button
              type="button"
              className="grid size-9 place-items-center rounded-full hover:bg-stone"
              onClick={() => setQty(product.slug, variant, qty - 1)}
              aria-label={`Decrease quantity of ${label}`}
            >
              −
            </button>
            <span className="w-6 text-center text-sm tabular-nums" aria-live="polite" aria-label={`Quantity ${qty}`}>
              {qty}
            </span>
            <button
              type="button"
              className="grid size-9 place-items-center rounded-full hover:bg-stone"
              onClick={() => setQty(product.slug, variant, qty + 1)}
              aria-label={`Increase quantity of ${label}`}
            >
              +
            </button>
          </div>
          <button type="button" className="meta link" onClick={() => setQty(product.slug, variant, 0)}>
            Remove<span className="sr-only"> {label}</span>
          </button>
        </div>
      </div>
    </li>
  );
}
