import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCart } from "@/components/add-to-cart";
import { Gallery } from "@/components/gallery";
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
    description: `${product.description} From FRANKIES, Kingston, Jamaica.`,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: { images: [{ url: product.images[0] }] },
  };
}

export default function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  // The slug is URL data: keep it inside Suspense so navigation shows the shell instantly.
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <Product params={params} />
    </Suspense>
  );
}

function ProductSkeleton() {
  return (
    <div className="page pb-[var(--section-y)] pt-6 md:pt-10" aria-busy="true">
      <div className="mb-6 h-4 w-48 bg-stone md:mb-10" />
      <div className="grid gap-10 md:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] md:gap-12 lg:gap-24">
        <div className="frame aspect-[4/5] md:ml-[calc(4.5rem+1.5rem)]" />
        <div className="space-y-6 md:pt-2">
          <div className="h-3 w-16 bg-stone" />
          <div className="h-10 w-3/4 bg-stone" />
          <div className="h-16 w-full bg-stone" />
        </div>
      </div>
    </div>
  );
}

async function Product({ params }: { params: PageProps<"/shop/[slug]">["params"] }) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(productJsonLd)} />
      <div className="page pb-[var(--section-y)] pt-6 md:pt-10">
        <nav aria-label="Breadcrumb" className="mb-6 md:mb-10">
          <ol className="meta flex flex-wrap gap-2">
            <li>
              <Link href="/shop" className="hover:text-ink">
                Shop
              </Link>
            </li>
            {category && (
              <li className="before:mr-2 before:content-['/']">
                <Link href={`/shop?category=${category.id}`} className="hover:text-ink">
                  {category.name}
                </Link>
              </li>
            )}
            <li className="text-ink before:mr-2 before:text-ink-muted before:content-['/']" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-10 md:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] md:gap-12 lg:gap-24">
          <Gallery images={product.images} name={product.name} />

          <div className="md:sticky md:top-[calc(var(--header-h)+2.5rem)] md:self-start md:pt-2">
            {category && <p className="kicker text-ink-muted">{category.name}</p>}
            <h1 className="display-m mt-4">{product.name}</h1>
            <p className="lede mt-6 max-w-md">{product.description}</p>
            <div className="mt-8">
              <AddToCart product={product} />
            </div>
            {product.slug === "custom-cards" && (
              <Link href="/custom" className="link-arrow mt-8">
                Open the Custom Studio
              </Link>
            )}
            <p className="meta mt-10 max-w-sm pt-6 rule-t">
              Every order is confirmed personally on WhatsApp, where we arrange delivery or pickup and payment.
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="rule-t">
          <div className="page section">
            <div className="mb-10 flex items-end justify-between gap-6 md:mb-14">
              <h2 id="related" className="display-m">
                More {category ? category.name.toLowerCase() : "from FRANKIES"}
              </h2>
              <Link href={category ? `/shop?category=${category.id}` : "/shop"} className="link-arrow hidden shrink-0 sm:inline-flex">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-8 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} sizes="(min-width: 1024px) 22vw, 50vw" />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
