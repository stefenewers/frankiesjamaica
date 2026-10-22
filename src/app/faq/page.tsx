import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons";
import { business, faq } from "@/lib/catalog";
import { whatsappUrl } from "@/lib/order";
import { jsonLd } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: "How to order from FRANKIES — ordering on WhatsApp, custom cards and more.",
  alternates: { canonical: "/faq" },
};

// Questions without an answer yet stay hidden until they're filled in products.json.
const answered = faq.filter((f): f is { q: string; a: string } => Boolean(f.a));

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: answered.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <div className="page grid gap-14 pb-[var(--section-y)] pt-14 md:grid-cols-12 md:gap-8 md:pt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd)} />
      <header className="md:col-span-4">
        <h1 className="display-l">Questions</h1>
        <p className="meta mt-6 max-w-xs">Anything else, just ask — we reply on WhatsApp.</p>
        <a
          href={whatsappUrl(business.whatsapp, "Hi Frankies! I have a question.")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline mt-8"
        >
          <WhatsAppIcon className="size-4" /> Message us
        </a>
      </header>

      <div className="md:col-span-7 md:col-start-6">
        <div className="rule-t">
          {answered.map((f) => (
            <details key={f.q} className="group rule-b">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-xl transition-colors hover:text-brown md:text-2xl [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="text-xl transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-xl pb-8 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="meta mt-10">
          Looking for something made to order? <Link href="/custom" className="link text-ink">Visit the Custom Studio</Link>.
        </p>
      </div>
    </div>
  );
}
