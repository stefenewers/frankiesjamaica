/**
 * Canonical site URL. Set NEXT_PUBLIC_SITE_URL once the domain is live
 * (e.g. https://frankiesjamaica.com); Vercel's production URL is used until then.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

export const siteDescription =
  "FRANKIES is a cards and gifting brand from Kingston, Jamaica — greeting cards, custom cards and small-batch granola. Order online and confirm on WhatsApp.";

export const whatsappDisplay = "+1 (876) 886-8573";

export const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/custom", label: "Custom Studio" },
  { href: "/about", label: "About" },
] as const;

export const footerLinks = [
  { href: "/shop?category=cards", label: "Cards" },
  { href: "/shop?category=granola", label: "Granola" },
  { href: "/custom", label: "Custom Studio" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
] as const;

/** Serialise JSON-LD safely for a <script> tag. */
export function jsonLd(data: unknown): { __html: string } {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
