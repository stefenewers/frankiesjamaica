import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { business } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "About",
  description: `FRANKIES was founded in Kingston, Jamaica in ${business.founded} by ${business.founder}. Cards and small gifts made to be given, opened and kept.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="page pb-[var(--section-y)] pt-14 md:pt-24">
        <p className="kicker text-brown">About</p>
        <h1 className="display-xl mt-6 max-w-5xl">The little things are the ones people keep.</h1>

        <div className="mt-16 grid gap-14 md:mt-24 md:grid-cols-12 md:gap-8">
          <div className="frame aspect-[4/5] md:col-span-5">
            <Image
              src="/images/brand-stone-sign-tall.jpg"
              alt="Stone sign engraved with FRANKIES, beside a vase of trailing greenery"
              fill
              preload
              sizes="(min-width: 768px) 38vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="lede space-y-6 md:col-span-5 md:col-start-7 md:self-end">
            <p>
              FRANKIES was founded in {business.city.split(",")[0]} in {business.founded} by {business.founder}.
            </p>
            <p>
              Most of what we say to each other now arrives on a screen and is gone by the evening. FRANKIES is about
              the other kind of thing: cards and small gifts you can hold, give, open, and put somewhere safe.
            </p>
            <p>
              Birthdays and graduations, thank-yous and words of faith, the occasions that deserve more than a
              quick message — and the ordinary days that turn out to matter too.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-stone">
        <div className="page section grid gap-12 md:grid-cols-12 md:items-center md:gap-8">
          <blockquote className="md:col-span-7">
            <p className="display-l">
              “There&apos;s something beautiful about giving a card to someone you love. It turns a fleeting moment
              into something lasting.”
            </p>
            <footer className="meta mt-8">— From FRANKIES on Pinterest</footer>
          </blockquote>
          <div className="frame aspect-[3/4] md:col-span-4 md:col-start-9">
            <Image
              src="/images/lifestyle-gifting.jpg"
              alt="Two friends embracing, one holding an illustrated card"
              fill
              sizes="(min-width: 768px) 30vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="page section grid gap-10 md:grid-cols-12 md:items-end md:gap-8">
        <h2 className="display-m md:col-span-6">Find something worth giving.</h2>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-5 md:col-span-5 md:col-start-8 md:justify-end">
          <Link href="/shop" className="btn btn-primary">
            Visit the shop
          </Link>
          <Link href="/custom" className="link-arrow">
            Custom Studio
          </Link>
        </div>
      </section>
    </>
  );
}
