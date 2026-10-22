import Image from "next/image";
import Link from "next/link";
import { ASK_FOR_PRICE, formatPrice, startingPrice, type Product } from "@/lib/catalog";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const price = startingPrice(product);
  const hasRange = product.variants.length > 1;

  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-paper">
        <Image
          src={product.images[0]}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {!product.available && (
          <span className="absolute left-3 top-3 rounded-full bg-cream px-3 py-1 text-xs font-medium">
            Sold out
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="font-serif text-lg leading-snug">
          <Link href={`/shop/${product.slug}`} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-mocha">
          {price === null ? ASK_FOR_PRICE : `${hasRange ? "From " : ""}${formatPrice(price)}`}
        </p>
      </div>
    </article>
  );
}
