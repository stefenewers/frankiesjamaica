"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { categories, products } from "@/lib/catalog";

function Grid({ category }: { category: string | null }) {
  const active = categories.some((c) => c.id === category) ? category : null;
  const shown = active ? products.filter((p) => p.category === active) : products;
  const filters = [{ id: null, name: "All" }, ...categories];

  return (
    <>
      <div className="mb-10 mt-14 flex items-end justify-between gap-6 rule-b md:mb-16 md:mt-20">
        <nav aria-label="Filter by category">
          <ul className="flex gap-8">
            {filters.map((f) => (
              <li key={f.id ?? "all"}>
                <Link
                  href={f.id ? `/shop?category=${f.id}` : "/shop"}
                  scroll={false}
                  aria-current={active === f.id ? "page" : undefined}
                  className="kicker -mb-px block border-b border-transparent pb-4 text-ink-muted transition-colors hover:text-ink aria-[current=page]:border-ink aria-[current=page]:text-ink"
                >
                  {f.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="meta pb-4" aria-live="polite">
          {shown.length} {shown.length === 1 ? "piece" : "pieces"}
        </p>
      </div>
      <h2 className="sr-only">{active ? categories.find((c) => c.id === active)?.name : "All products"}</h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-20 lg:grid-cols-3">
        {shown.map((p, i) => (
          <ProductCard key={p.slug} product={p} priority={i < 2} showCategory={!active} />
        ))}
      </div>
    </>
  );
}

function FilteredGrid() {
  return <Grid category={useSearchParams().get("category")} />;
}

export function ShopGrid({ static: isStatic = false }: { static?: boolean }) {
  return isStatic ? <Grid category={null} /> : <FilteredGrid />;
}
