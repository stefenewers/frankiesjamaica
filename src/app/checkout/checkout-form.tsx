"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { WhatsAppIcon } from "@/components/icons";
import { PendingNotice } from "@/components/pending-notice";
import { PRICE_PENDING, business, formatPrice } from "@/lib/catalog";
import { startHandoff } from "@/lib/cart-store";
import { buildOrderUrl, formatSubtotal, subtotal, type Customer, type DeliveryMethod } from "@/lib/order";

export function CheckoutForm() {
  const { resolved, lines } = useCart();
  const router = useRouter();
  const [method, setMethod] = useState<DeliveryMethod>("delivery");

  if (resolved.length === 0) {
    return (
      <div className="py-10">
        <p className="display-m">Your bag is empty.</p>
        <Link href="/shop" className="link-arrow mt-8">
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

    // Optional backup copy of the order (disabled unless ORDER_EMAIL_ENABLED=true).
    fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer, lines }),
      keepalive: true,
    }).catch(() => {});

    // Opens WhatsApp (synchronously, so pop-up blockers allow it) and keeps the bag
    // until the customer confirms they've sent the message on /thanks.
    startHandoff("order", url, lines);
    router.push("/thanks");
  }

  return (
    <div className="grid gap-16 md:grid-cols-12 md:gap-8">
      <form onSubmit={handleSubmit} className="space-y-10 md:col-span-6" aria-label="Your details">
        <PendingNotice />
        <p className="kicker">Your details</p>
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-8">
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
          <legend className="label mb-3">Delivery or pickup</legend>
          <div className="grid grid-cols-2 gap-3">
            {(["delivery", "pickup"] as const).map((m) => (
              <label
                key={m}
                className="flex min-h-12 cursor-pointer items-center gap-3 rounded-[var(--radius-xs)] border border-rule-strong px-4 transition-colors hover:border-ink has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-bone has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brown"
              >
                <input
                  type="radio"
                  name="method"
                  value={m}
                  checked={method === m}
                  onChange={() => setMethod(m)}
                  className="sr-only"
                />
                <span className="kicker">{m === "delivery" ? "Delivery" : "Pickup"}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="area" className="label">
            {method === "delivery" ? "Delivery area" : "Preferred pickup day/time"}
            {method === "pickup" && <span className="label-hint"> — optional</span>}
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
            Notes <span className="label-hint">— optional</span>
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

        <div className="space-y-4 pt-2">
          <button type="submit" className="btn btn-primary w-full">
            <WhatsAppIcon className="size-4" /> Send order on WhatsApp
          </button>
          <p className="meta">
            WhatsApp opens with your order written out — press send and we&apos;ll confirm delivery and payment with
            you there. Nothing is charged on this site.
          </p>
        </div>
      </form>

      <aside aria-labelledby="summary" className="md:col-span-5 md:col-start-8">
        <div className="md:sticky md:top-[calc(var(--header-h)+2.5rem)]">
          <h2 id="summary" className="kicker pb-4 rule-b">
            Order summary
          </h2>
          <ul>
            {resolved.map((l) => (
              <li key={`${l.product.slug}:${l.variant ?? ""}`} className="flex gap-4 py-5 rule-b">
                <div className="frame aspect-[4/5] w-14 shrink-0">
                  <Image src={l.product.images[0]} alt="" fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex flex-1 justify-between gap-4">
                  <div>
                    <p className="title text-lg">{l.product.name}</p>
                    <p className="meta">
                      Qty {l.qty}
                      {l.variant && ` · ${l.variant}`}
                    </p>
                  </div>
                  <p className="meta whitespace-nowrap">
                    {l.lineTotal === null ? PRICE_PENDING.short : formatPrice(l.lineTotal)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-baseline justify-between gap-4 pt-5">
            <span className="kicker">Subtotal</span>
            <span className="text-right">{formatSubtotal(subtotal(resolved))}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
