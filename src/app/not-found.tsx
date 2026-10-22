import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="font-hand text-4xl text-espresso">Oops</p>
      <h1 className="mt-2 text-4xl">We couldn&apos;t find that page</h1>
      <p className="mt-4">It may have moved — but there&apos;s still something for every moment.</p>
      <Link href="/shop" className="btn btn-primary mt-8">
        Browse the shop
      </Link>
    </div>
  );
}
