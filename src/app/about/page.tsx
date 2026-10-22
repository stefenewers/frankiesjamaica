import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { business } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "About",
  description: business.statement,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 md:grid-cols-2">
        <div className="space-y-6">
          <p className="eyebrow">About FRANKIES</p>
          <h1 className="text-4xl sm:text-5xl">Rooted in the beauty of everyday moments</h1>
          <p className="text-lg leading-relaxed">{business.statement}</p>
          <p className="leading-relaxed">
            Founded in {business.city.split(",")[0]} in {business.founded} by {business.founder}.
          </p>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-paper">
          <Image
            src="/images/brand-stone-sign-tall.jpg"
            alt="Stone sign engraved with FRANKIES beside a vase of greenery"
            fill
            priority
            sizes="(min-width: 768px) 34rem, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:order-2">
            <Image
              src="/images/lifestyle-gifting.jpg"
              alt="Two friends embracing, one holding an illustrated FRANKIES card"
              fill
              sizes="(min-width: 768px) 34rem, 100vw"
              className="object-cover"
            />
          </div>
          <blockquote className="space-y-4">
            <p className="font-serif text-2xl leading-relaxed text-espresso sm:text-3xl">
              “There&apos;s something beautiful about giving a card to someone you love. It turns a fleeting
              moment into something lasting.”
            </p>
            <p className="leading-relaxed">
              Long after the flowers fade and the celebrations end, the card remains — ready to be reopened,
              bringing the feeling back all over again.
            </p>
          </blockquote>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <p className="font-hand text-4xl text-espresso">fill your cup.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/shop" className="btn btn-primary">
            Visit the shop
          </Link>
          <Link href="/custom" className="btn btn-outline">
            Request a custom card
          </Link>
        </div>
      </section>
    </>
  );
}
