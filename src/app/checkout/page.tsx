import type { Metadata } from "next";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="mb-8 space-y-2">
        <p className="eyebrow">Checkout</p>
        <h1 className="text-4xl sm:text-5xl">Almost there</h1>
        <p className="max-w-xl">
          Fill in your details and we&apos;ll open WhatsApp with your order ready to send. We&apos;ll confirm
          everything — including delivery and payment — with you there.
        </p>
      </header>
      <CheckoutForm />
    </div>
  );
}
