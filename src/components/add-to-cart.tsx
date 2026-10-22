"use client";

import { useId, useState } from "react";
import { useCart } from "./cart-provider";
import { WhatsAppIcon } from "./icons";
import { ASK_FOR_PRICE, business, formatPrice, priceFor, type Product } from "@/lib/catalog";
import { addItem } from "@/lib/cart-store";
import { MAX_QTY, whatsappUrl } from "@/lib/order";

export function AddToCart({ product }: { product: Product }) {
  const { open } = useCart();
  const id = useId();
  const [variant, setVariant] = useState<string | null>(product.variants[0]?.name ?? null);
  const [qty, setQty] = useState(1);
  const price = priceFor(product, variant);

  const enquiry = whatsappUrl(
    business.whatsapp,
    `Hi Frankies! I'm interested in ${product.name}${variant ? ` (${variant})` : ""}.`,
  );

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        addItem(product.slug, variant, qty);
        open();
      }}
    >
      <p className="text-xl" data-testid="product-price">
        {price === null ? ASK_FOR_PRICE : formatPrice(price)}
      </p>

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

      <div>
        <label htmlFor={`${id}-qty`} className="label">
          Quantity
        </label>
        <input
          id={`${id}-qty`}
          type="number"
          inputMode="numeric"
          min={1}
          max={MAX_QTY}
          value={qty}
          onChange={(e) => setQty(Math.min(MAX_QTY, Math.max(1, Number(e.target.value) || 1)))}
          className="field w-28"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="submit" className="btn btn-primary flex-1" disabled={!product.available}>
          {product.available ? (price === null ? "Add to bag & ask for price" : "Add to bag") : "Sold out"}
        </button>
        <a href={enquiry} target="_blank" rel="noopener noreferrer" className="btn btn-outline flex-1">
          <WhatsAppIcon /> Ask on WhatsApp
        </a>
      </div>

      {product.etsyUrl && (
        <a
          href={product.etsyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm underline underline-offset-4 hover:text-espresso"
        >
          Or buy on Etsy (opens in a new tab)
        </a>
      )}
    </form>
  );
}
