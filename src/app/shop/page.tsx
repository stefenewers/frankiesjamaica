import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopGrid } from "./shop-grid";

export const metadata: Metadata = {
  title: "Shop",
  description: "Greeting cards, custom cards and small-batch granola from FRANKIES in Kingston, Jamaica.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <div className="page pb-[var(--section-y)] pt-14 md:pt-24">
      <header className="grid gap-6 md:grid-cols-12 md:items-end">
        <h1 className="display-xl md:col-span-7">The Shop</h1>
        <p className="lede max-w-md md:col-span-4 md:col-start-9">
          Cards for the occasions that matter, and a few small things to go with them.
        </p>
      </header>
      {/* The filter reads ?category=, which is only known at request time. */}
      <Suspense fallback={<ShopGrid static />}>
        <ShopGrid />
      </Suspense>
    </div>
  );
}
