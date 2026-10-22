import Link from "next/link";
import { Wordmark } from "./wordmark";
import { business } from "@/lib/catalog";
import { whatsappUrl } from "@/lib/order";
import { footerLinks, whatsappDisplay } from "@/lib/site";

const elsewhere = [
  { href: business.instagram, label: "Instagram" },
  { href: business.pinterest, label: "Pinterest" },
  { href: business.etsy, label: "Etsy" },
];

export function Footer() {
  return (
    <footer className="bg-ink text-bone">
      <div className="page pb-28 pt-20 md:pb-12 md:pt-28">
        <div className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-3 md:gap-8 lg:grid-cols-12">
          <div className="col-span-2 md:col-span-3 lg:col-span-4">
            <Link href="/" aria-label="FRANKIES — home" className="inline-block">
              <Wordmark tone="bone" className="h-7 w-auto md:h-9" />
            </Link>
            <p className="mt-6 max-w-xs font-display text-xl leading-snug text-bone/80">
              {business.tagline}.
            </p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2 lg:col-start-6">
            <p className="kicker mb-5 text-bone/60">Explore</p>
            <ul className="space-y-3 text-[0.9375rem]">
              {footerLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-stone">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <p className="kicker mb-5 text-bone/60">Elsewhere</p>
            <ul className="space-y-3 text-[0.9375rem]">
              {elsewhere.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-stone">
                    {l.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1 lg:col-span-3">
            <p className="kicker mb-5 text-bone/60">Contact</p>
            <ul className="space-y-3 text-[0.9375rem]">
              <li>
                <a href={whatsappUrl(business.whatsapp)} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-stone">
                  WhatsApp
                  <span className="block text-sm text-bone/70">{whatsappDisplay}</span>
                </a>
              </li>
              {business.email && (
                <li>
                  <a href={`mailto:${business.email}`} className="transition-colors hover:text-stone">
                    {business.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-24 flex flex-col gap-2 border-t border-bone/15 pt-6 text-xs tracking-wide text-bone/70 sm:flex-row sm:justify-between">
          <p>{business.name} · {business.city}</p>
          <p>© {business.founded}</p>
        </div>
      </div>
    </footer>
  );
}
