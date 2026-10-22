import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons";
import { business, faq } from "@/lib/catalog";
import { whatsappUrl } from "@/lib/order";
import { jsonLd } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: "How to order from FRANKIES — WhatsApp ordering, custom cards and more.",
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
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd)} />
      <header className="mb-10 space-y-2">
        <p className="eyebrow">Good to know</p>
        <h1 className="text-4xl sm:text-5xl">Questions &amp; answers</h1>
      </header>

      <div className="divide-y divide-sand border-y border-sand">
        {answered.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl text-espresso [&::-webkit-details-marker]:hidden">
              {f.q}
              <span aria-hidden="true" className="text-2xl transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-paper p-8 text-center">
        <p className="font-serif text-2xl text-espresso">Still have a question?</p>
        <p className="mt-2">We&apos;re happy to help — just send us a message.</p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={whatsappUrl(business.whatsapp, "Hi Frankies! I have a question.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
          >
            <WhatsAppIcon /> Message us on WhatsApp
          </a>
          <Link href="/custom" className="btn btn-outline">
            Custom cards
          </Link>
        </div>
      </div>
    </div>
  );
}
