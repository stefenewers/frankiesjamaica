"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "./cart-provider";
import { CloseIcon } from "./icons";
import { ASK_FOR_PRICE, formatPrice } from "@/lib/catalog";
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
        <div className="flex items-center justify-between border-b border-sand px-5 py-4">
          <h2 id="cart-title" className="text-2xl">
            Your bag {count > 0 && <span className="text-base text-mocha">({count})</span>}
          </h2>
          <button
            type="button"
            onClick={close}
            className="-mr-2 rounded-full p-2 hover:bg-paper"
            aria-label="Close bag"
          >
            <CloseIcon className="size-6" />
          </button>
        </div>

        {resolved.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="font-hand text-3xl text-espresso">Your bag is empty</p>
            <p className="text-sm">Find something for every moment.</p>
            <Link href="/shop" className="btn btn-primary" onClick={close}>
              Browse the shop
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-sand overflow-y-auto px-5" aria-label="Items in your bag">
              {resolved.map((line) => (
                <CartItem key={`${line.product.slug}:${line.variant ?? ""}`} line={line} onNavigate={close} />
              ))}
            </ul>
            <div className="space-y-3 border-t border-sand px-5 py-5">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm">Subtotal</span>
                <span className="text-right font-medium" data-testid="cart-subtotal">
                  {formatSubtotal(subtotal(resolved))}
                </span>
              </div>
              <p className="text-xs text-mocha">
                You&apos;ll confirm your order, delivery and payment with us on WhatsApp.
              </p>
              <Link href="/checkout" className="btn btn-primary w-full" onClick={close}>
                Checkout
              </Link>
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
    <li className="flex gap-4 py-4">
      <Link
        href={`/shop/${product.slug}`}
        onClick={onNavigate}
        className="relative size-20 shrink-0 overflow-hidden rounded-md bg-paper"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image src={product.images[0]} alt="" fill sizes="80px" className="object-cover" />
      </Link>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex justify-between gap-3">
          <div>
            <Link href={`/shop/${product.slug}`} onClick={onNavigate} className="font-medium hover:underline">
              {product.name}
            </Link>
            {variant && <p className="text-sm text-mocha">{variant}</p>}
          </div>
          <p className="text-right text-sm whitespace-nowrap">
            {lineTotal === null ? ASK_FOR_PRICE : formatPrice(lineTotal)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-full border border-latte-dark">
            <button
              type="button"
              className="grid size-9 place-items-center rounded-full text-lg hover:bg-paper"
              onClick={() => setQty(product.slug, variant, qty - 1)}
              aria-label={`Decrease quantity of ${label}`}
            >
              −
            </button>
            <span className="w-7 text-center text-sm tabular-nums" aria-live="polite" aria-label={`Quantity ${qty}`}>
              {qty}
            </span>
            <button
              type="button"
              className="grid size-9 place-items-center rounded-full text-lg hover:bg-paper"
              onClick={() => setQty(product.slug, variant, qty + 1)}
              aria-label={`Increase quantity of ${label}`}
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="text-sm text-mocha underline underline-offset-4 hover:text-espresso"
            onClick={() => setQty(product.slug, variant, 0)}
          >
            Remove<span className="sr-only"> {label}</span>
          </button>
        </div>
      </div>
    </li>
  );
}
