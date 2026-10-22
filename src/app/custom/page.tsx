import type { Metadata } from "next";
import Image from "next/image";
import { CustomForm } from "./custom-form";

export const metadata: Metadata = {
  title: "Custom cards",
  description:
    "Custom cards for every occasion — personal moments, professional events, and everything in between. Request yours from FRANKIES in Kingston, Jamaica.",
  alternates: { canonical: "/custom" },
};

export default function CustomPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 md:grid-cols-[1fr_1.1fr]">
      <div className="space-y-6">
        <p className="eyebrow">Custom cards</p>
        <h1 className="text-4xl sm:text-5xl">For every occasion</h1>
        <p className="text-lg leading-relaxed">
          For personal moments, professional events, and everything in between. Share a few details and
          we&apos;ll pick up the conversation on WhatsApp.
        </p>
        <div className="relative hidden aspect-[4/5] overflow-hidden rounded-2xl bg-paper md:block">
          <Image
            src="/images/brand-gift-box.jpg"
            alt="FRANKIES gift box with illustrated custom cards"
            fill
            sizes="30rem"
            className="object-cover"
          />
        </div>
      </div>
      <CustomForm />
    </div>
  );
}
