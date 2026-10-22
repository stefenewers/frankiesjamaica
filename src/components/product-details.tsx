import Link from "next/link";
import type { Product } from "@/lib/catalog";

/**
 * What the customer is buying. Only facts from products.json are stated;
 * anything not yet confirmed says so plainly instead of guessing.
 */
export function ProductDetails({ product }: { product: Product }) {
  const { details, occasion } = product;
  const isCard = product.category === "cards";
  const isCustom = product.slug === "custom-cards";

  const rows: { term: string; value: React.ReactNode }[] = [];
  if (occasion) rows.push({ term: "Occasion", value: occasion });
  if (isCard && !isCustom) {
    rows.push({
      term: "Designs",
      value: details.designs ?? "The photos show designs from this collection. We’ll confirm what’s available when you order.",
    });
  }
  rows.push({ term: "What you receive", value: details.includes ?? "Confirmed with you when you order." });
  if (details.size) rows.push({ term: "Size", value: details.size });
  if (details.material) rows.push({ term: "Paper & materials", value: details.material });
  if (isCard) {
    rows.push({
      term: "Personalise it",
      value: details.personalisation ?? (
        <>
          Want your own wording or design?{" "}
          <Link href="/custom" className="link text-ink">
            Commission it in the Custom Studio
          </Link>
          .
        </>
      ),
    });
  }

  return (
    <dl className="rule-t">
      {rows.map((r) => (
        <div key={r.term} className="grid gap-1.5 py-4 rule-b sm:grid-cols-[8.5rem_1fr] sm:gap-4">
          <dt className="kicker pt-0.5">{r.term}</dt>
          <dd className="text-[0.9375rem] leading-relaxed text-ink-muted">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
