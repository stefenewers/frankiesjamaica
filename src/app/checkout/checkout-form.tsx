"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { WhatsAppIcon } from "@/components/icons";
import { ASK_FOR_PRICE, business, formatPrice } from "@/lib/catalog";
import { clearCart, rememberOrderUrl } from "@/lib/cart-store";
import { buildOrderUrl, formatSubtotal, subtotal, type Customer, type DeliveryMethod } from "@/lib/order";

export function CheckoutForm() {
  const { resolved, lines } = useCart();
  const router = useRouter();
  const [method, setMethod] = useState<DeliveryMethod>("delivery");

  if (resolved.length === 0) {
    return (
      <div className="rounded-2xl bg-paper p-8 text-center">
        <p className="font-hand text-3xl text-espresso">Your bag is empty</p>
        <Link href="/shop" className="btn btn-primary mt-5">
          Browse the shop
        </Link>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const customer: Customer = {
      name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      method,
      area: String(form.get("area") ?? ""),
      notes: String(form.get("notes") ?? ""),
    };
    const url = buildOrderUrl(business.whatsapp, resolved, customer);
    rememberOrderUrl(url);

    // Optional backup copy of the order (disabled unless ORDER_EMAIL_ENABLED=true).
    fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer, lines }),
      keepalive: true,
    }).catch(() => {});

    // Open WhatsApp synchronously inside the submit handler so pop-up blockers allow it.
    window.open(url, "_blank", "noopener,noreferrer");
    clearCart();
    router.push("/thanks");
  }

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_22rem]">
      <form onSubmit={handleSubmit} className="space-y-5" aria-label="Your details">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="label">
              Name
            </label>
            <input id="name" name="name" required autoComplete="name" className="field" maxLength={80} />
          </div>
          <div>
            <label htmlFor="phone" className="label">
              Phone / WhatsApp
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              placeholder="876-555-0123"
              pattern="[0-9+()\-\s]{7,20}"
              title="Phone number, e.g. 876-555-0123"
              className="field"
            />
          </div>
        </div>

        <fieldset>
          <legend className="label">Delivery or pickup?</legend>
          <div className="grid grid-cols-2 gap-3">
            {(["delivery", "pickup"] as const).map((m) => (
              <label
                key={m}
                className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-latte-dark bg-[#fffdfa] px-4 has-[:checked]:border-espresso has-[:checked]:ring-1 has-[:checked]:ring-espresso"
              >
                <input
                  type="radio"
                  name="method"
                  value={m}
                  checked={method === m}
                  onChange={() => setMethod(m)}
                  className="accent-espresso"
                />
                {m === "delivery" ? "Delivery" : "Pickup"}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="area" className="label">
            {method === "delivery" ? "Delivery area" : "Preferred pickup day/time"}{" "}
            <span className="font-normal text-mocha">{method === "delivery" ? "" : "(optional)"}</span>
          </label>
          <input
            id="area"
            name="area"
            required={method === "delivery"}
            placeholder={method === "delivery" ? "e.g. New Kingston, Half Way Tree" : "e.g. Saturday morning"}
            className="field"
            maxLength={120}
          />
        </div>

        <div>
          <label htmlFor="notes" className="label">
            Notes <span className="font-normal text-mocha">(optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            maxLength={500}
            placeholder="A message for the card, the date you need it, anything else…"
            className="field"
          />
        </div>

        <button type="submit" className="btn btn-whatsapp w-full sm:w-auto">
          <WhatsAppIcon /> Send order on WhatsApp
        </button>
        <p className="text-sm text-mocha">
          This opens WhatsApp with your order written out — just press send. Nothing is charged here.
        </p>
      </form>

      <aside aria-labelledby="summary" className="h-fit rounded-2xl bg-paper p-6">
        <h2 id="summary" className="mb-4 text-2xl">
          Your order
        </h2>
        <ul className="space-y-3 text-sm">
          {resolved.map((l) => (
            <li key={`${l.product.slug}:${l.variant ?? ""}`} className="flex justify-between gap-4">
              <span>
                {l.qty} × {l.product.name}
                {l.variant && <span className="text-mocha"> ({l.variant})</span>}
              </span>
              <span className="whitespace-nowrap">{l.lineTotal === null ? ASK_FOR_PRICE : formatPrice(l.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between gap-4 border-t border-sand pt-4 font-medium">
          <span>Subtotal</span>
          <span className="text-right">{formatSubtotal(subtotal(resolved))}</span>
        </div>
      </aside>
    </div>
  );
}
