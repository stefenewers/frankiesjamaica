import Image from "next/image";
import Link from "next/link";
import { getCategory, priceLabel, type Product } from "@/lib/catalog";

type Props = {
  product: Product;
  priority?: boolean;
  /** Show the category above the name (useful in mixed grids). */
  showCategory?: boolean;
  sizes?: string;
};

export function ProductCard({
  product,
  priority = false,
  showCategory = false,
  sizes = "(min-width: 1024px) 30vw, 50vw",
}: Props) {
  const [primary, secondary] = product.images;

  return (
    <article className="group relative">
      <div className="frame aspect-[4/5]">
        <Image src={primary} alt="" fill preload={priority} sizes={sizes} className="object-cover" />
        {secondary && (
          // Second photo crossfades in on hover (pointer devices only).
          <Image
            src={secondary}
            alt=""
            fill
            sizes={sizes}
            className="object-cover opacity-0 transition-opacity duration-700 ease-[var(--ease-out-soft)] [@media(hover:hover)]:group-hover:opacity-100"
          />
        )}
        {!product.available && (
          <span className="kicker absolute left-3 top-3 bg-bone px-2.5 py-1.5">Sold out</span>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-1 md:mt-5 lg:flex-row lg:items-baseline lg:justify-between lg:gap-4">
        <div>
          {showCategory && <p className="kicker mb-1.5 text-ink-muted">{getCategory(product.category)?.name}</p>}
          <h3 className="title">
            <Link
              href={`/shop/${product.slug}`}
              className="transition-colors after:absolute after:inset-0 group-hover:text-brown"
            >
              {product.name}
            </Link>
          </h3>
        </div>
        <p className="meta shrink-0 whitespace-nowrap">{priceLabel(product)}</p>
      </div>
    </article>
  );
}
