import type { Metadata } from "next";
import Image from "next/image";
import { CustomForm } from "./custom-form";

export const metadata: Metadata = {
  title: "The Custom Studio",
  description:
    "Custom cards from FRANKIES in Kingston, Jamaica — for personal celebrations, events, businesses and gifts.",
  alternates: { canonical: "/custom" },
};

const steps = [
  { title: "Tell us the occasion", body: "Who it's for, how many you need, and when." },
  { title: "We talk it through", body: "We pick up the conversation on WhatsApp and confirm the details." },
  { title: "Your cards are made", body: "Designed around your occasion, ready to give." },
];

export default function CustomPage() {
  return (
    <div className="page pb-[var(--section-y)] pt-14 md:pt-24">
      <header className="grid gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <p className="kicker text-brown">The Custom Studio</p>
          <h1 className="display-xl mt-6">Cards made for your occasion.</h1>
        </div>
        <p className="lede max-w-md md:col-span-4 md:col-start-9 md:self-end">
          Personal celebrations, events, businesses, gifts — tell us what you have in mind, and we&apos;ll make it
          yours.
        </p>
      </header>

      <div className="mt-16 grid gap-16 md:mt-24 md:grid-cols-12 md:gap-8">
        <aside className="md:col-span-5">
          <div className="frame aspect-[4/5]">
            <Image
              src="/images/brand-gift-box.jpg"
              alt="FRANKIES gift box with illustrated cards laid out on a wooden table"
              fill
              preload
              sizes="(min-width: 768px) 38vw, 100vw"
              className="object-cover"
            />
          </div>
          <ol className="mt-12 rule-t">
            {steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[2.5rem_1fr] py-5 rule-b">
                <span className="meta tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="title">{s.title}</p>
                  <p className="meta mt-1">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>

        <div className="md:col-span-6 md:col-start-7">
          <h2 className="display-m">Start a custom card</h2>
          <p className="meta mt-3">Takes a minute. Your request opens in WhatsApp, ready to send.</p>
          <CustomForm />
        </div>
      </div>
    </div>
  );
}
