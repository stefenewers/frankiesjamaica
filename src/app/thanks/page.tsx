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
    <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2">
      <div className="space-y-5">
        <p className="font-hand text-4xl text-espresso">Thank you!</p>
        <h1 className="text-4xl sm:text-5xl">Your order is on its way to us</h1>
        <p className="leading-relaxed">
          Just press <strong>send</strong> in WhatsApp and we&apos;ll get back to you to confirm the details,
          delivery or pickup, and payment.
        </p>
        <ReopenWhatsApp />
        <Link href="/shop" className="inline-block text-sm underline underline-offset-4">
          Keep browsing
        </Link>
      </div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-paper">
        <Image
          src="/images/envelope-open-this.jpg"
          alt="Kraft envelope sealed with a FRANKIES sticker that reads Open This"
          fill
          sizes="(min-width: 768px) 30rem, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
