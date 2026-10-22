"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "./cart-provider";
import { BagIcon, CloseIcon, MenuIcon } from "./icons";
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

  return (
    <header className="sticky top-0 z-30 border-b border-sand/70 bg-cream/95 backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-espresso focus:px-4 focus:py-2 focus:text-cream"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <button
          type="button"
          className="-ml-2 rounded-full p-2 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
        </button>

        <Link href="/" className="wordmark text-xl text-espresso sm:text-2xl" aria-label="FRANKIES home">
          Frankies
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className="underline-offset-8 hover:underline aria-[current=page]:text-espresso aria-[current=page]:underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={open}
          className="relative -mr-2 rounded-full p-2 text-espresso hover:bg-paper"
          aria-label={`Open bag, ${count} ${count === 1 ? "item" : "items"}`}
          data-testid="open-cart"
        >
          <BagIcon className="size-6" />
          {count > 0 && (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-espresso px-1 text-[0.6875rem] font-semibold leading-5 text-cream"
            >
              {count}
            </span>
          )}
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-sand md:hidden">
          <ul className="mx-auto max-w-6xl px-4 py-2">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className="block py-3 font-serif text-xl text-espresso"
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
