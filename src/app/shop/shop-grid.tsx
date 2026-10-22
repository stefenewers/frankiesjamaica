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
      <nav aria-label="Filter by category" className="mb-8">
        <ul className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <li key={f.id ?? "all"}>
              <Link
                href={f.id ? `/shop?category=${f.id}` : "/shop"}
                scroll={false}
                aria-current={active === f.id ? "page" : undefined}
                className="inline-flex min-h-11 items-center rounded-full border border-espresso px-5 text-sm text-espresso hover:bg-paper aria-[current=page]:bg-espresso aria-[current=page]:text-cream"
              >
                {f.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className="sr-only" aria-live="polite">
        Showing {shown.length} products
      </p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-6">
        {shown.map((p, i) => (
          <ProductCard key={p.slug} product={p} priority={i < 2} />
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
