import type { Metadata } from "next";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div className="page pb-[var(--section-y)] pt-14 md:pt-20">
      <header className="mb-12 pb-8 rule-b md:mb-16">
        <h1 className="display-l">Checkout</h1>
        <p className="meta mt-4">Your order will open in WhatsApp for final confirmation.</p>
      </header>
      <CheckoutForm />
    </div>
  );
}
