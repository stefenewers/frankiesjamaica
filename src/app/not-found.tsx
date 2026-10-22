import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page pb-[var(--section-y)] pt-20 md:pt-32">
      <p className="kicker text-brown">404</p>
      <h1 className="display-xl mt-6 max-w-3xl">This page has gone missing.</h1>
      <Link href="/shop" className="link-arrow mt-12">
        Back to the shop
      </Link>
    </div>
  );
}
