import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { StudioSteps } from "@/components/studio-steps";
import { business, products } from "@/lib/catalog";

const cards = products.filter((p) => p.category === "cards" && p.featured && p.available).slice(0, 4);
const occasions = products.filter((p) => p.category === "cards" && p.available && p.occasion);
const granola = products.filter((p) => p.category === "granola" && p.available).slice(0, 2);

export default function Home() {
  return (
    <>
      {/* 1 — Hero: type-led, asymmetric. */}
      <section aria-labelledby="hero" className="page pb-[var(--section-y)] pt-5 md:pt-12">
        <div className="meta flex justify-between pb-4 rule-b">
          <span>{business.city}</span>
          <span>Est. {business.founded}</span>
        </div>

        <div className="mt-7 grid gap-y-10 md:mt-12 md:grid-cols-12 md:gap-x-8">
          <div className="flex flex-col md:col-span-7 md:pr-4">
            <h1 id="hero" className="display-xl rise">
              Some things deserve more than a&nbsp;text.
            </h1>

            <div className="rise rise-delay mt-6 grid gap-10 md:mt-12 md:flex-1 md:grid-cols-7 md:gap-8">
              <div className="md:col-span-4 md:self-start">
                <p className="lede max-w-sm">
                  Cards and a few small things from Kingston — made to be given, opened and kept.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-5 md:mt-8">
                  <Link href="/shop?category=cards" className="btn btn-primary">
                    Shop cards
                  </Link>
                  <Link href="/custom" className="link-arrow">
                    Custom Studio
                  </Link>
                </div>
              </div>
              <div className="frame hidden aspect-square md:col-span-3 md:block md:self-end">
                <Image
                  src="/images/envelope-open-this.jpg"
                  alt="Kraft envelope closed with the FRANKIES seal, reading Open This"
                  fill
                  sizes="15vw"
                  className="object-cover object-[50%_70%]"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="frame aspect-[4/5]">
              <Image
                src="/images/brand-gift-box.jpg"
                alt="FRANKIES cards with line illustrations, laid out beside a white gift box closed with the FRANKIES seal"
                fill
                preload
                fetchPriority="high"
                sizes="(min-width: 1440px) 540px, (min-width: 768px) 40vw, 100vw"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2 — The Card Shop */}
      <section aria-labelledby="card-shop" className="rule-t">
        <div className="page section">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="kicker text-brown">The Card Shop</p>
              <h2 id="card-shop" className="display-l mt-5">
                Birthdays, milestones, gratitude, faith — and the days in between.
              </h2>
            </div>
            <div className="md:col-span-3 md:col-start-10 md:text-right">
              <Link href="/shop?category=cards" className="link-arrow">
                All cards
              </Link>
            </div>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 md:mt-20 md:gap-x-8 lg:grid-cols-4">
            {cards.map((p) => (
              <ProductCard key={p.slug} product={p} sizes="(min-width: 1024px) 22vw, 50vw" />
            ))}
          </div>

          <nav aria-labelledby="occasions" className="mt-16 grid gap-6 pt-6 rule-t md:mt-24 md:grid-cols-12 md:gap-8">
            <h3 id="occasions" className="kicker md:col-span-3">
              Shop by occasion
            </h3>
            <ul className="flex flex-wrap gap-x-6 gap-y-3 md:col-span-9">
              {occasions.map((p) => (
                <li key={p.slug}>
                  <Link href={`/shop/${p.slug}`} className="font-display text-xl transition-colors hover:text-brown md:text-2xl">
                    {p.slug === "custom-cards" ? "Something custom" : p.occasion}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* 3 — Editorial statement */}
      <section aria-labelledby="statement" className="bg-stone">
        <div className="page section grid gap-12 md:grid-cols-12 md:items-center md:gap-8">
          <div className="frame aspect-[3/4] md:col-span-5">
            <Image
              src="/images/lifestyle-gifting.jpg"
              alt="Two friends embracing, one holding up an illustrated card"
              fill
              sizes="(min-width: 768px) 38vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <h2 id="statement" className="display-l">
              Choose it. Write in it. Seal it. Hand it over.
            </h2>
            <div className="lede mt-10 max-w-md space-y-5">
              <p>
                The best part of a card happens after it leaves us — the minute you take to write something true,
                and the moment someone opens it in front of you.
              </p>
              <p>The card is ours. The rest is yours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 — The Custom Studio */}
      <section aria-labelledby="studio" className="bg-brown text-bone">
        <div className="page section grid gap-14 md:grid-cols-12 md:gap-8">
          <div className="flex flex-col md:col-span-6">
            <p className="kicker text-bone/75">The Custom Studio</p>
            <h2 id="studio" className="display-xl mt-6">
              Made to order, down to the last word.
            </h2>
            <p className="lede mt-10 max-w-md text-bone/90">
              Cards for personal celebrations, events, businesses and gifts — worked out with you, one
              conversation at a time.
            </p>
            <div className="mt-12">
              <Link href="/custom" className="btn btn-inverse">
                Start a custom card
              </Link>
            </div>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <div className="frame aspect-[4/5] bg-brown-deep">
              <Image
                src="/images/cards-custom.jpg"
                alt="A FRANKIES card in the sand: custom cards for every occasion"
                fill
                sizes="(min-width: 768px) 30vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-12 md:mt-8">
            <StudioSteps tone="bone" />
          </div>
        </div>
      </section>

      {/* 5 — From the Kitchen */}
      <section aria-labelledby="kitchen">
        <div className="page section grid gap-14 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5 md:pt-8">
            <p className="kicker text-brown">From the Kitchen</p>
            <h2 id="kitchen" className="display-l mt-5">
              Granola for slower mornings.
            </h2>
            <p className="lede mt-8 max-w-sm">
              For the breakfast table, a gift basket, or a friend who needs a good start.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6">
              {granola.map((p) => (
                <ProductCard key={p.slug} product={p} sizes="(min-width: 768px) 18vw, 50vw" />
              ))}
            </div>
          </div>
          <div className="frame order-first aspect-[4/5] md:order-none md:col-span-6 md:col-start-7">
            <Image
              src="/images/granola-jar.jpg"
              alt="Glass jar overflowing with golden granola, with two fresh strawberries"
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 6 — Story */}
      <section aria-labelledby="story" className="rule-t">
        <div className="page section grid gap-12 md:grid-cols-12 md:items-center md:gap-8">
          <div className="frame aspect-square md:col-span-5">
            <Image
              src="/images/brand-stone-sign.jpg"
              alt="Stone sign engraved with FRANKIES, beside a vase of trailing greenery"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="kicker text-brown">Kingston, {business.founded}</p>
            <blockquote className="mt-6">
              <p id="story" className="display-l">
                “Long after the flowers fade and the celebrations end, the card remains.”
              </p>
              <footer className="meta mt-6">— From FRANKIES on Pinterest</footer>
            </blockquote>
            <p className="mt-8 max-w-sm">
              FRANKIES was founded in Kingston, Jamaica, in {business.founded} by {business.founder}.
            </p>
            <Link href="/about" className="link-arrow mt-8">
              About FRANKIES
            </Link>
          </div>
        </div>
      </section>

      {/* 7 — Images from the FRANKIES world */}
      <section aria-labelledby="world" className="pb-[var(--section-y)]">
        <h2 id="world" className="sr-only">
          From the FRANKIES world
        </h2>
        <div className="page grid grid-cols-12 items-start gap-4 md:gap-8">
          <div className="frame col-span-7 aspect-square md:col-span-4">
            <Image
              src="/images/lifestyle-beach-chairs.jpg"
              alt="Two striped beach chairs under a yellow umbrella facing the sea"
              fill
              sizes="(min-width: 768px) 30vw, 58vw"
              className="object-cover"
            />
          </div>
          <div className="frame col-span-5 mt-24 aspect-[3/4] md:col-span-3 md:col-start-6 md:mt-32">
            <Image
              src="/images/fill-your-cup.jpg"
              alt="Hand-lettered card reading fill your cup"
              fill
              sizes="(min-width: 768px) 22vw, 42vw"
              className="object-cover"
            />
          </div>
          <div className="frame col-span-8 col-start-3 mt-4 aspect-[4/5] md:col-span-3 md:col-start-10 md:mt-0">
            <Image
              src="/images/peace-of-mind.jpg"
              alt="Card reading peace of mind is the new luxury, resting on palm leaves"
              fill
              sizes="(min-width: 768px) 22vw, 66vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="page mt-12 flex flex-wrap items-baseline justify-between gap-4 md:mt-16">
          <a
            href={business.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-3xl transition-colors hover:text-brown md:text-4xl"
          >
            @frankiesjamaica
          </a>
          <a href={business.pinterest} target="_blank" rel="noopener noreferrer" className="link meta">
            Also on Pinterest
          </a>
        </div>
      </section>
    </>
  );
}
