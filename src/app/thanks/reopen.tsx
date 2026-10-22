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
    <div className="max-w-md py-6 rule-t rule-b">
      <p className="meta mb-4">WhatsApp didn&apos;t open?</p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
        <WhatsAppIcon className="size-4" /> Open WhatsApp again
      </a>
    </div>
  );
}
