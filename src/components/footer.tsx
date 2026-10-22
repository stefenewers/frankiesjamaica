import Link from "next/link";
import { EtsyIcon, InstagramIcon, PinterestIcon, WhatsAppIcon } from "./icons";
import { business } from "@/lib/catalog";
import { whatsappUrl } from "@/lib/order";
import { navLinks, whatsappDisplay } from "@/lib/site";

const socials = [
  { href: whatsappUrl(business.whatsapp), label: "WhatsApp", Icon: WhatsAppIcon },
  { href: business.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: business.pinterest, label: "Pinterest", Icon: PinterestIcon },
  { href: business.etsy, label: "Etsy", Icon: EtsyIcon },
];

export function Footer() {
  return (
    <footer className="bg-mocha pb-24 text-cream md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <p className="wordmark text-2xl">Frankies</p>
          <p className="font-hand text-2xl text-sand">{business.tagline}</p>
          <p className="text-sm text-cream/85">{business.city}</p>
        </div>

        <nav aria-label="Footer">
          <ul className="space-y-2 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-4 text-sm">
          <p>
            Order on WhatsApp:{" "}
            <a href={whatsappUrl(business.whatsapp)} className="underline underline-offset-4">
              {whatsappDisplay}
            </a>
          </p>
          {business.email && (
            <p>
              Email:{" "}
              <a href={`mailto:${business.email}`} className="underline underline-offset-4">
                {business.email}
              </a>
            </p>
          )}
          <ul className="flex gap-2" aria-label="FRANKIES elsewhere">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-11 place-items-center rounded-full border border-cream/40 hover:bg-cream hover:text-mocha focus-visible:outline-cream"
                >
                  <Icon />
                  <span className="sr-only">{label} (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/15">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-cream/80 sm:px-6">
          © {business.founded} {business.name}. Made with love in Kingston.
        </p>
      </div>
    </footer>
  );
}
