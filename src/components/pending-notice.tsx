"use client";

import Link from "next/link";
import { useCart } from "./cart-provider";

/** Reminds the customer that a WhatsApp order/request hasn't been confirmed as sent. */
export function PendingNotice({ onNavigate, className = "" }: { onNavigate?: () => void; className?: string }) {
  const { pending } = useCart();
  if (!pending) return null;
  return (
    <p className={`meta border-l-2 border-brown py-1 pl-4 text-ink ${className}`} data-testid="pending-notice">
      {pending.kind === "order" ? "An order" : "A custom request"} is waiting to be sent on WhatsApp.{" "}
      <Link href="/thanks" onClick={onNavigate} className="link whitespace-nowrap">
        Finish sending
      </Link>
    </p>
  );
}
