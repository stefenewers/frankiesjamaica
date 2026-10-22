"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "./cart-provider";
import { BagIcon, CloseIcon, MenuIcon } from "./icons";
import { Wordmark } from "./wordmark";
import { business } from "@/lib/catalog";
import { whatsappUrl } from "@/lib/order";
import { navLinks } from "@/lib/site";

export function Header() {
  const { count, open } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  // Close the mobile menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const bagLabel = `Open bag, ${count} ${count === 1 ? "item" : "items"}`;

  return (
    <header className="sticky top-0 z-30 bg-bone/92 backdrop-blur-md rule-b">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-bone"
      >
        Skip to content
      </a>
      <div className="page grid h-[var(--header-h)] grid-cols-[1fr_auto_1fr] items-center">
        {/* Left: desktop nav / mobile menu toggle */}
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-10">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className="kicker relative py-2 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:text-brown hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className="icon-btn -ml-2.5 lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <CloseIcon className="size-[22px]" /> : <MenuIcon className="size-[22px]" />}
        </button>

        <Link href="/" aria-label="FRANKIES — home" className="justify-self-center">
          <Wordmark priority className="h-[17px] w-auto md:h-[19px] lg:h-[21px]" />
        </Link>

        {/* Right: bag */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={open}
            aria-label={bagLabel}
            data-testid="open-cart"
            className="group -mr-2.5 flex items-center gap-2.5 p-2.5 transition-colors hover:text-brown"
          >
            <span className="kicker hidden lg:inline" aria-hidden="true">
              Bag
            </span>
            <span className="relative" aria-hidden="true">
              <BagIcon className="size-[22px]" />
              {count > 0 && (
                <span className="absolute -right-2 -top-1.5 grid min-w-[18px] place-items-center rounded-full bg-brown px-1 text-[10px] font-semibold leading-[18px] text-bone tabular-nums">
                  {count}
                </span>
              )}
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-nav" className="rule-t lg:hidden">
          <nav aria-label="Main" className="page pb-10 pt-6">
            <ul>
              {navLinks.map((l) => (
                <li key={l.href} className="rule-b">
                  <Link
                    href={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className="flex items-center justify-between py-4 font-display text-[2rem] leading-tight aria-[current=page]:text-brown"
                    onClick={() => setMenuOpen(false)}
                  >
                    {l.label}
                    <span aria-hidden="true" className="text-base">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <Link href="/faq" className="link">
                FAQ
              </Link>
              <a href={whatsappUrl(business.whatsapp)} target="_blank" rel="noopener noreferrer" className="link">
                WhatsApp
              </a>
              <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="link">
                Instagram
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
