"use client";

import { useId, useState } from "react";
import { useCart } from "./cart-provider";
import { WhatsAppIcon } from "./icons";
import { PRICE_PENDING, business, formatPrice, priceFor, type Product } from "@/lib/catalog";
import { addItem } from "@/lib/cart-store";
import { MAX_QTY, whatsappUrl } from "@/lib/order";

export function AddToCart({ product }: { product: Product }) {
  const { open } = useCart();
  const id = useId();
  const [variant, setVariant] = useState<string | null>(product.variants[0]?.name ?? null);
  const [qty, setQty] = useState(1);
  const price = priceFor(product, variant);
  const clamp = (n: number) => Math.min(MAX_QTY, Math.max(1, n));

  const enquiry = whatsappUrl(
    business.whatsapp,
    `Hi Frankies! I'm interested in ${product.name}${variant ? ` (${variant})` : ""}.`,
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addItem(product.slug, variant, qty);
        open();
      }}
    >
      <p className="text-lg" data-testid="product-price">
        {price === null ? <span className="text-ink-muted">{PRICE_PENDING.long}</span> : formatPrice(price)}
      </p>

      <div className="mt-8 space-y-7 pt-8 rule-t">
        {product.variants.length > 0 && (
          <div>
            <label htmlFor={`${id}-variant`} className="label">
              Option
            </label>
            <select
              id={`${id}-variant`}
              className="field"
              value={variant ?? ""}
              onChange={(e) => setVariant(e.target.value)}
            >
              {product.variants.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name}
                  {v.price !== null ? ` — ${formatPrice(v.price)}` : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-stretch gap-3">
          <div className="flex shrink-0 items-center rounded-full border border-rule-strong px-1">
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full text-lg hover:bg-stone"
              onClick={() => setQty((q) => clamp(q - 1))}
              aria-label="Remove one"
            >
              −
            </button>
            <label htmlFor={`${id}-qty`} className="sr-only">
              Quantity
            </label>
            <input
              id={`${id}-qty`}
              type="number"
              inputMode="numeric"
              min={1}
              max={MAX_QTY}
              value={qty}
              onChange={(e) => setQty(clamp(Number(e.target.value) || 1))}
              className="w-8 bg-transparent text-center tabular-nums [appearance:textfield] focus-visible:outline-offset-4 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full text-lg hover:bg-stone"
              onClick={() => setQty((q) => clamp(q + 1))}
              aria-label="Add one"
            >
              +
            </button>
          </div>
          <button type="submit" className="btn btn-primary flex-1" disabled={!product.available}>
            {product.available ? "Add to bag" : "Sold out"}
          </button>
        </div>

        <div className="space-y-3">
          <a
            href={enquiry}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm transition-colors hover:text-brown"
          >
            <WhatsAppIcon className="size-4" />
            <span className="link">Ask a question on WhatsApp</span>
          </a>
          {product.etsyUrl && (
            <p>
              <a href={product.etsyUrl} target="_blank" rel="noopener noreferrer" className="link text-sm">
                Also available on Etsy
              </a>
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
