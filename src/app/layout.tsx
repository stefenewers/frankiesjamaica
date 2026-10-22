import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { CartDrawer } from "@/components/cart-drawer";
import { CartProvider } from "@/components/cart-provider";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { StickyWhatsApp } from "@/components/sticky-whatsapp";
import { business } from "@/lib/catalog";
import { jsonLd, siteDescription, siteUrl } from "@/lib/site";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  axes: ["opsz"],
});
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${business.name} — Cards & gifts from Kingston, Jamaica`,
    template: `%s | ${business.name}`,
  },
  description: siteDescription,
  keywords: [
    "greeting cards Kingston",
    "custom cards Jamaica",
    "birthday cards Jamaica",
    "granola Kingston",
    "gifts Kingston Jamaica",
    "FRANKIES",
  ],
  openGraph: {
    type: "website",
    siteName: business.name,
    locale: "en_JM",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#f6f1e9",
};

const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: business.name,
  slogan: business.tagline,
  description: siteDescription,
  url: siteUrl,
  logo: `${siteUrl}/images/logo.png`,
  image: `${siteUrl}/images/brand-stone-sign.jpg`,
  telephone: `+${business.whatsapp}`,
  email: business.email || undefined,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kingston",
    addressCountry: "JM",
  },
  areaServed: "Kingston, Jamaica",
  founder: { "@type": "Person", name: business.founder },
  foundingDate: business.founded,
  currenciesAccepted: business.currency,
  sameAs: [business.instagram, business.pinterest, business.etsy],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(storeJsonLd)} />
        <CartProvider>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <StickyWhatsApp />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
