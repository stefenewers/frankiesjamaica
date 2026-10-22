"use client";

import { usePathname } from "next/navigation";
import { useCart } from "./cart-provider";
import { WhatsAppIcon } from "./icons";
import { business } from "@/lib/catalog";
import { whatsappUrl } from "@/lib/order";

const barClass =
  "flex h-13 w-full items-center justify-between rounded-[var(--radius-xs)] bg-ink px-5 text-bone";

/**
 * Mobile-only quick action: the bag when it has items, otherwise a small
 * WhatsApp button. Hidden on pages that already end in WhatsApp, and while
 * the bag is open. (Unsent-order reminders live in the bag and at checkout,
 * so this bar never nags.)
 */
export function StickyWhatsApp() {
  const pathname = usePathname();
  const { count, open, isOpen } = useCart();
  if (["/checkout", "/custom", "/thanks"].includes(pathname) || isOpen) return null;

  if (count > 0) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-20 p-3 md:hidden">
        <button type="button" onClick={open} className={barClass}>
          <span className="kicker">
            Bag · {count} {count === 1 ? "item" : "items"}
          </span>
          <span className="kicker">Checkout →</span>
        </button>
      </div>
    );
  }

  return (
    <a
      href={whatsappUrl(business.whatsapp, "Hi Frankies! I'd like to place an order.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message FRANKIES on WhatsApp (opens in a new tab)"
      className="fixed bottom-4 right-4 z-20 grid size-12 place-items-center rounded-full bg-ink text-bone shadow-[0_6px_20px_-8px_rgb(36_23_15/0.5)] md:hidden"
    >
      <WhatsAppIcon className="size-[22px]" />
    </a>
  );
}
