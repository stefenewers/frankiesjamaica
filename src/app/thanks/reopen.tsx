"use client";

import { useSyncExternalStore } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { lastOrderUrl } from "@/lib/cart-store";

const noop = () => () => {};

/** Offers the WhatsApp link again in case the pop-up was blocked or closed. */
export function ReopenWhatsApp() {
  const url = useSyncExternalStore(noop, lastOrderUrl, () => null);

  if (!url) return null;
  return (
    <div className="rounded-xl bg-paper p-5">
      <p className="mb-3 text-sm">WhatsApp didn&apos;t open?</p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
        <WhatsAppIcon /> Open WhatsApp again
      </a>
    </div>
  );
}
