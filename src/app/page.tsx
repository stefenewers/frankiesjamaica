import Image from "next/image";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { business, categories, products } from "@/lib/catalog";
import { whatsappUrl } from "@/lib/order";

const featured = products.filter((p) => p.featured && p.available).slice(0, 4);

const moments = [
  { src: "/images/envelope-open-this.jpg", alt: "Kraft envelope sealed with a FRANKIES sticker that reads Open This" },
  { src: "/images/fill-your-cup.jpg", alt: "Hand-lettered card reading fill your cup" },
  { src: "/images/granola-coconut-bowl.jpg", alt: "Granola served in a coconut shell with fresh fruit" },
  { src: "/images/peace-of-mind.jpg", alt: "Card reading peace of mind is the new luxury, resting on palm leaves" },
  { src: "/images/lifestyle-pup-card.jpg", alt: "A small dog on the beach holding a birthday card" },
  { src: "/images/brand-gift-box.jpg", alt: "FRANKIES gift box with illustrated cards" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 md:grid-cols-2 md:gap-16 md:pt-16">
        <div className="order-2 space-y-6 md:order-1">
          <p className="eyebrow">Cards &amp; granola · {business.city}</p>
          <h1 className="text-5xl leading-[1.05] sm:text-6xl">
            Made for every <span className="font-hand text-[1.15em] font-normal">moment</span>
          </h1>
          <p className="max-w-md text-lg leading-relaxed">
            The little things that make life feel a bit more considered &amp; a lot more personal.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappUrl(business.whatsapp, "Hi Frankies! I'd like to place an order.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              <WhatsAppIcon /> Order on WhatsApp
            </a>
            <Link href="/shop" className="btn btn-outline">
              Shop the collection
            </Link>
          </div>
        </div>
        <div className="relative order-1 aspect-square overflow-hidden rounded-2xl bg-paper md:order-2">
          <Image
            src="/images/brand-stone-sign.jpg"
            alt="Stone sign engraved with FRANKIES — the little things that make life feel a bit more considered and a lot more personal — beside a vase of greenery"
            fill
            priority
            sizes="(min-width: 768px) 34rem, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Collections */}
      <section aria-labelledby="collections" className="bg-paper py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="collections" className="mb-8 text-3xl sm:text-4xl">
            Shop the collections
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/shop?category=${c.id}`}
                className="group relative block aspect-[4/3] overflow-hidden rounded-2xl"
              >
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 34rem, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="font-serif text-3xl text-white">{c.name}</h3>
                  <p className="mt-1 max-w-sm text-sm text-white/95">{c.blurb}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section aria-labelledby="featured" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 id="featured" className="text-3xl sm:text-4xl">
              Little favourites
            </h2>
            <Link href="/shop" className="text-sm underline underline-offset-4">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Custom band */}
      <section aria-labelledby="custom" className="bg-mocha text-cream">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:order-2 md:aspect-square">
            <Image
              src="/images/cards-custom.jpg"
              alt="Card in the sand reading custom cards for every occasion"
              fill
              sizes="(min-width: 768px) 34rem, 100vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-5">
            <p className="eyebrow text-cream/90">Made just for you</p>
            <h2 id="custom" className="text-4xl text-cream sm:text-5xl">
              Custom cards for every occasion
            </h2>
            <p className="max-w-md text-lg leading-relaxed text-cream/90">
              For personal moments, professional events, and everything in between. Tell us the occasion and
              we&apos;ll make it yours.
            </p>
            <Link href="/custom" className="btn bg-cream text-espresso hover:bg-sand">
              Request a custom card
            </Link>
          </div>
        </div>
      </section>

      {/* About snippet */}
      <section aria-labelledby="about" className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h2 id="about" className="sr-only">
          About FRANKIES
        </h2>
        <p className="font-serif text-2xl leading-relaxed text-espresso sm:text-3xl">
          “Frankies is a lifestyle brand rooted in the beauty of everyday moments.”
        </p>
        <p className="mt-5 leading-relaxed">
          Thoughtfully designed and effortlessly timeless, with a playful spirit and a minimalist approach.
        </p>
        <Link href="/about" className="mt-6 inline-block text-sm underline underline-offset-4">
          Our story
        </Link>
      </section>

      {/* Social strip */}
      <section aria-labelledby="social" className="pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 id="social" className="text-3xl">
              Everyday moments
            </h2>
            <p className="text-sm">
              Follow along on{" "}
              <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                Instagram
              </a>{" "}
              &amp;{" "}
              <a href={business.pinterest} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                Pinterest
              </a>
            </p>
          </div>
          <ul className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
            {moments.map((m) => (
              <li key={m.src} className="relative aspect-square overflow-hidden rounded-lg bg-paper">
                <Image src={m.src} alt={m.alt} fill sizes="(min-width: 1024px) 11rem, 33vw" className="object-cover" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
