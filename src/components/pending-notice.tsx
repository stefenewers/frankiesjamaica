"use client";

import Link from "next/link";
import { useCart } from "./cart-provider";
import { dismissHandoff } from "@/lib/cart-store";

/**
 * Quiet reminder that an order was written out for WhatsApp but not confirmed
 * as sent. Dismissing only stops the reminder; the bag is untouched.
 * On checkout it also warns that sending again could duplicate the order.
 */
export function PendingNotice({ onNavigate, atCheckout = false }: { onNavigate?: () => void; atCheckout?: boolean }) {
  const { pending } = useCart();
  const order = pending.order;
  if (!order) return null;
  return (
    <div className="meta border-l-2 border-brown py-1 pl-4 text-ink" data-testid="pending-notice">
      <p>
        {atCheckout
          ? "You wrote out an order for WhatsApp earlier. If you already sent it, there's no need to send it again."
          : "You have an order written out for WhatsApp."}{" "}
        <Link href="/thanks" onClick={onNavigate} className="link whitespace-nowrap">
          {atCheckout ? "View it" : "Finish sending"}
        </Link>
        {" · "}
        <button type="button" className="link" onClick={() => dismissHandoff("order")}>
          Dismiss
        </button>
      </p>
    </div>
  );
}
