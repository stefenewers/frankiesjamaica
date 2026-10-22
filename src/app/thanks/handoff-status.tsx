"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useCart } from "@/components/cart-provider";
import { WhatsAppIcon } from "@/components/icons";
import { PRICE_PENDING, formatPrice } from "@/lib/catalog";
import { cancelHandoff, confirmHandoffSent } from "@/lib/cart-store";
import { resolveLines } from "@/lib/order";

/**
 * The WhatsApp handoff is only complete when the customer presses send in
 * WhatsApp — which this site can't see. So this page keeps the order, offers
 * to reopen WhatsApp, and only clears the bag once the customer confirms.
 */
const noopSubscribe = () => () => {};

export function HandoffStatus() {
  const { pending, open } = useCart();
  const [sent, setSent] = useState<"order" | "custom" | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  // The handoff lives in localStorage, so render nothing until we can read it.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);

  // After "I've sent it", move focus to the new heading for keyboard and screen reader users.
  useEffect(() => {
    if (sent) headingRef.current?.focus();
  }, [sent]);

  if (!hydrated) return <div className="min-h-[50vh]" aria-busy="true" />;

  if (sent) {
    return (
      <section aria-labelledby="handoff-title" className="max-w-2xl">
        <p className="kicker text-brown">Thank you</p>
        <h1 id="handoff-title" ref={headingRef} tabIndex={-1} className="display-xl mt-6 outline-none">
          We&apos;ll be in touch.
        </h1>
        <p className="lede mt-8 max-w-md">
          {sent === "order"
            ? "We'll reply on WhatsApp to confirm availability, price, delivery or pickup, and payment."
            : "We'll reply on WhatsApp to talk through your custom card."}
        </p>
        <Link href="/shop" className="link-arrow mt-10">
          Keep browsing
        </Link>
      </section>
    );
  }

  if (!pending) {
    return (
      <section aria-labelledby="handoff-title" className="max-w-2xl">
        <h1 id="handoff-title" ref={headingRef} tabIndex={-1} className="display-l outline-none">
          Nothing waiting to send.
        </h1>
        <p className="lede mt-6 max-w-md">When you check out, your order is written out for WhatsApp and kept here until you&apos;ve sent it.</p>
        <Link href="/shop" className="link-arrow mt-10">
          Browse the shop
        </Link>
      </section>
    );
  }

  const isOrder = pending.kind === "order";
  const items = resolveLines(pending.lines);

  return (
    <section aria-labelledby="handoff-title" className="grid gap-14 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-6">
        <p className="kicker text-brown">One more step</p>
        <h1 id="handoff-title" ref={headingRef} tabIndex={-1} className="display-xl mt-6 outline-none">
          {isOrder ? "Your order is ready to send." : "Your request is ready to send."}
        </h1>

        <div role="status" className="lede mt-8 max-w-md" data-testid="handoff-status">
          {pending.opened ? (
            <p>
              We&apos;ve opened WhatsApp with everything written out. It isn&apos;t {isOrder ? "placed" : "sent"} until
              you press <strong className="font-semibold">send</strong> there.
            </p>
          ) : (
            <p>
              WhatsApp didn&apos;t open — your browser may have blocked it. Nothing is lost: open it below and press{" "}
              <strong className="font-semibold">send</strong>.
            </p>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <a href={pending.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <WhatsAppIcon className="size-4" /> {pending.opened ? "Open WhatsApp again" : "Open WhatsApp"}
          </a>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              confirmHandoffSent();
              setSent(pending.kind);
            }}
          >
            I&apos;ve sent it
          </button>
        </div>

        <p className="meta mt-8 max-w-md">
          {isOrder ? (
            <>
              Your bag is saved until you confirm you&apos;ve sent it. Need to change something?{" "}
              <button type="button" className="link text-ink" onClick={open}>
                Edit your bag
              </button>{" "}
              and check out again.
            </>
          ) : (
            <>
              Want to change your request?{" "}
              <Link href="/custom" className="link text-ink" onClick={cancelHandoff}>
                Start again
              </Link>
              .
            </>
          )}
        </p>
      </div>

      {isOrder && items.length > 0 && (
        <aside aria-labelledby="pending-summary" className="md:col-span-5 md:col-start-8">
          <h2 id="pending-summary" className="kicker pb-4 rule-b">
            In this order
          </h2>
          <ul>
            {items.map((l) => (
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
        </aside>
      )}
    </section>
  );
}
