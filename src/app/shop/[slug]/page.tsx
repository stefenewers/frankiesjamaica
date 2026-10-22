import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";
import { business, getCategory, getProduct, products, startingPrice } from "@/lib/catalog";
import { jsonLd, siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.description} Order from FRANKIES in Kingston, Jamaica.`,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: { images: [{ url: product.images[0] }] },
  };
}

export default async function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3);
  const price = startingPrice(product);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((src) => `${siteUrl}${src}`),
    brand: { "@type": "Brand", name: business.name },
    category: category?.name,
    url: `${siteUrl}/shop/${product.slug}`,
    ...(price !== null && {
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: business.currency,
        availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        url: `${siteUrl}/shop/${product.slug}`,
      },
    }),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(productJsonLd)} />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm">
        <ol className="flex flex-wrap gap-2 text-mocha">
          <li>
            <Link href="/shop" className="hover:underline">
              Shop
            </Link>
          </li>
          {category && (
            <li className="before:mr-2 before:content-['/']">
              <Link href={`/shop?category=${category.id}`} className="hover:underline">
                {category.name}
              </Link>
            </li>
          )}
          <li className="before:mr-2 before:content-['/']" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-10 md:grid-cols-2 md:gap-14">
        {/* Swipeable row on mobile so the buy button stays near the top; stacked on desktop. */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 md:mx-0 md:block md:space-y-3 md:overflow-visible md:px-0">
          {product.images.map((src, i) => (
            <div
              key={src}
              className={`relative aspect-[4/5] shrink-0 snap-center overflow-hidden rounded-2xl bg-paper md:w-auto ${product.images.length > 1 ? "w-[82%]" : "w-full"}`}
            >
              <Image
                src={src}
                alt={i === 0 ? product.name : `${product.name}, photo ${i + 1}`}
                fill
                priority={i === 0}
                sizes="(min-width: 768px) 34rem, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="space-y-6 md:sticky md:top-24 md:self-start">
          <div className="space-y-3">
            {category && <p className="eyebrow">{category.name}</p>}
            <h1 className="text-4xl sm:text-5xl">{product.name}</h1>
            <p className="text-lg leading-relaxed">{product.description}</p>
          </div>
          <AddToCart product={product} />
          <p className="border-t border-sand pt-5 text-sm text-mocha">
            Orders are confirmed on WhatsApp — we&apos;ll sort out delivery or pickup and payment with you there.
          </p>
          {product.slug === "custom-cards" && (
            <Link href="/custom" className="btn btn-outline">
              Tell us about your custom card
            </Link>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="mt-20">
          <h2 id="related" className="mb-6 text-3xl">
            You might also like
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 lg:gap-x-6">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
