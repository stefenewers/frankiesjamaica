"use client";

import { usePathname } from "next/navigation";
import { useCart } from "./cart-provider";
import { WhatsAppIcon } from "./icons";
import { business } from "@/lib/catalog";
import { whatsappUrl } from "@/lib/order";

/** Mobile-only bottom bar. Hidden where a form already ends in WhatsApp. */
export function StickyWhatsApp() {
  const pathname = usePathname();
  const { count, open } = useCart();
  if (pathname === "/checkout" || pathname === "/custom") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-sand bg-cream/95 px-4 py-3 backdrop-blur md:hidden">
      {count > 0 ? (
        <button type="button" onClick={open} className="btn btn-primary w-full">
          View bag ({count}) &amp; order
        </button>
      ) : (
        <a
          href={whatsappUrl(business.whatsapp, "Hi Frankies! I'd like to place an order.")}
          className="btn btn-whatsapp w-full"
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon /> Order on WhatsApp
        </a>
      )}
    </div>
  );
}
