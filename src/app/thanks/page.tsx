import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ReopenWhatsApp } from "./reopen";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false },
};

export default function ThanksPage() {
  return (
    <div className="page grid gap-14 pb-[var(--section-y)] pt-14 md:grid-cols-12 md:items-center md:gap-8 md:pt-24">
      <div className="md:col-span-6">
        <p className="kicker text-brown">Thank you</p>
        <h1 className="display-xl mt-6">Nearly there.</h1>
        <p className="lede mt-8 max-w-md">
          Press <strong className="font-semibold">send</strong> in WhatsApp and we&apos;ll be in touch to confirm the
          details, delivery or pickup, and payment.
        </p>
        <div className="mt-10">
          <ReopenWhatsApp />
        </div>
        <Link href="/shop" className="link-arrow mt-10">
          Keep browsing
        </Link>
      </div>
      <div className="frame aspect-[4/5] md:col-span-4 md:col-start-9">
        <Image
          src="/images/envelope-open-this.jpg"
          alt="Kraft envelope closed with a FRANKIES seal reading Open This"
          fill
          sizes="(min-width: 768px) 30vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
