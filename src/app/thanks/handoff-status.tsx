"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useCart } from "@/components/cart-provider";
import { WhatsAppIcon } from "@/components/icons";
import { PRICE_PENDING, formatPrice } from "@/lib/catalog";
import {
  bagChangedSince,
  confirmHandoffSent,
  dismissHandoff,
  latestHandoff,
  type HandoffKind,
} from "@/lib/cart-store";
import { resolveLines } from "@/lib/order";

const noopSubscribe = () => () => {};

/**
 * The WhatsApp handoff is only complete when the customer presses send in
 * WhatsApp — which this site can't see. So this page keeps everything,
 * offers to reopen WhatsApp, and treats "I've sent it" as optional tidying.
 */
export function HandoffStatus() {
  const { pending, lines: bag, open } = useCart();
  const [view, setView] = useState<HandoffKind | null>(null);
  const [done, setDone] = useState<{ kind: HandoffKind; action: "sent" | "dismissed" } | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Handoffs live in localStorage, so render nothing until we can read them.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);

  // After an action, move focus to the new heading for keyboard and screen reader users.
  useEffect(() => {
    if (done) headingRef.current?.focus();
  }, [done]);

  if (!hydrated) return <div className="min-h-[50vh]" aria-busy="true" />;

  const handoff = (view && pending[view]) || latestHandoff(pending);
  const other = handoff ? pending[handoff.kind === "order" ? "custom" : "order"] : null;

  if (done && !handoff) {
    return (
      <section aria-labelledby="handoff-title" className="max-w-2xl">
        <h1 id="handoff-title" ref={headingRef} tabIndex={-1} className="display-xl outline-none">
          {done.action === "sent" ? "We'll be in touch." : "All set."}
        </h1>
        <p className="lede mt-8 max-w-md">
          {done.action === "sent"
            ? done.kind === "order"
              ? "We'll reply on WhatsApp to confirm availability, price, delivery or pickup, and payment."
              : "We'll reply on WhatsApp to talk through your custom card."
            : "Your bag is just as you left it."}
        </p>
        <Link href="/shop" className="link-arrow mt-10">
          Keep browsing
        </Link>
      </section>
    );
  }

  if (!handoff) {
    return (
      <section aria-labelledby="handoff-title" className="max-w-2xl">
        <h1 id="handoff-title" ref={headingRef} tabIndex={-1} className="display-l outline-none">
          Nothing waiting to send.
        </h1>
        <p className="lede mt-6 max-w-md">
          When you check out, your order is written out for WhatsApp and kept here until you&apos;ve sent it.
        </p>
        <Link href="/shop" className="link-arrow mt-10">
          Browse the shop
        </Link>
      </section>
    );
  }

  const isOrder = handoff.kind === "order";
  const items = resolveLines(handoff.lines);
  const changed = isOrder && bagChangedSince(handoff, bag);
  const act = (action: "sent" | "dismissed") => {
    if (action === "sent") confirmHandoffSent(handoff.kind);
    else dismissHandoff(handoff.kind);
    setView(null);
    setDone({ kind: handoff.kind, action });
  };

  return (
    <section aria-labelledby="handoff-title" className="grid gap-14 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-7 lg:col-span-6">
        {done && (
          <p role="status" className="meta mb-6">
            {done.action === "sent" ? "Thanks — noted as sent." : "Dismissed. Your bag is unchanged."}
          </p>
        )}
        <p className="kicker text-brown">One more step</p>
        <h1 id="handoff-title" ref={headingRef} tabIndex={-1} className="display-xl mt-6 outline-none">
          {isOrder ? "Your order is ready to send." : "Your request is ready to send."}
        </h1>

        <div role="status" className="lede mt-8 max-w-md" data-testid="handoff-status">
          {handoff.opened ? (
            <p>
              We opened WhatsApp with everything written out. It isn&apos;t {isOrder ? "placed" : "sent"} until you
              press <strong className="font-semibold">send</strong> there.
            </p>
          ) : (
            <p>
              WhatsApp didn&apos;t open — your browser may have blocked it. Nothing is lost: open it below and press{" "}
              <strong className="font-semibold">send</strong>.
            </p>
          )}
        </div>

        {changed && (
          <p className="meta mt-6 max-w-md border-l-2 border-brown py-1 pl-4 text-ink" data-testid="bag-changed">
            Your bag has changed since this order was written out. If you haven&apos;t sent it yet,{" "}
            <Link href="/checkout" className="link">
              check out again
            </Link>{" "}
            to send the updated order.
          </p>
        )}

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <a href={handoff.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <WhatsAppIcon className="size-4" /> {handoff.opened ? "Open WhatsApp again" : "Open WhatsApp"}
          </a>
          <button type="button" className="btn btn-outline" onClick={() => act("sent")}>
            I&apos;ve sent it
          </button>
        </div>

        <div className="meta mt-8 max-w-md space-y-3">
          <p>
            {isOrder
              ? "Confirming is optional — it just clears these items from your bag. Your bag is kept either way."
              : "Confirming is optional — it just clears this reminder."}
          </p>
          <p>
            {isOrder && (
              <>
                <button type="button" className="link text-ink" onClick={open}>
                  Edit your bag
                </button>
                {" · "}
              </>
            )}
            {!isOrder && (
              <>
                <Link href="/custom#brief" className="link text-ink">
                  Edit your brief
                </Link>
                {" · "}
              </>
            )}
            <button type="button" className="link text-ink" onClick={() => act("dismissed")}>
              Not now — dismiss
            </button>
          </p>
          {other && (
            <p data-testid="other-handoff">
              You also have {other.kind === "order" ? "an order" : "a custom request"} waiting.{" "}
              <button type="button" className="link text-ink" onClick={() => setView(other.kind)}>
                View it
              </button>
            </p>
          )}
        </div>
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
