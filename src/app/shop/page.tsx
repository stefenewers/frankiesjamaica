import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopGrid } from "./shop-grid";

export const metadata: Metadata = {
  title: "Shop",
  description: "Greeting cards, custom cards and granola from FRANKIES in Kingston, Jamaica. Order on WhatsApp.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-8 space-y-2">
        <p className="eyebrow">The shop</p>
        <h1 className="text-4xl sm:text-5xl">Made for every moment</h1>
      </header>
      {/* The filter reads ?category=, which is only known at request time. */}
      <Suspense fallback={<ShopGrid static />}>
        <ShopGrid />
      </Suspense>
    </div>
  );
}
