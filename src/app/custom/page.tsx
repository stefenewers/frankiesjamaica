import type { Metadata } from "next";
import Image from "next/image";
import { CustomForm } from "./custom-form";
import { StudioSteps } from "@/components/studio-steps";

export const metadata: Metadata = {
  title: "The Custom Studio",
  description:
    "Commission custom cards from FRANKIES in Kingston, Jamaica — for personal celebrations, events, businesses and gifts.",
  alternates: { canonical: "/custom" },
};

export default function CustomPage() {
  return (
    <>
      <section className="page pb-16 pt-14 md:pb-24 md:pt-24">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <p className="kicker text-brown">The Custom Studio</p>
            <h1 className="display-xl mt-6">Cards made for your occasion.</h1>
            <p className="lede mt-10 max-w-md">
              For personal celebrations, events, businesses and gifts. Tell us what you have in mind and we&apos;ll
              work it out with you, one conversation at a time.
            </p>
            <a href="#brief" className="link-arrow mt-10">
              Start your brief
            </a>
          </div>
          <div className="frame aspect-[4/5] md:col-span-4 md:col-start-9">
            <Image
              src="/images/cards-custom.jpg"
              alt="A FRANKIES card in the sand: custom cards for every occasion — personal moments, professional events and everything in between"
              fill
              preload
              sizes="(min-width: 768px) 30vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="process" className="bg-stone">
        <div className="page py-16 md:py-24">
          <h2 id="process" className="kicker mb-10 md:mb-14">
            How it works
          </h2>
          <StudioSteps />
        </div>
      </section>

      <section id="brief" aria-labelledby="brief-title" className="page section scroll-mt-[var(--header-h)]">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <h2 id="brief-title" className="display-m">
              Your brief
            </h2>
            <p className="meta mt-4 max-w-xs">
              A few details are enough to start. Your brief opens in WhatsApp, ready to send — nothing is ordered
              until you&apos;ve agreed the details with us.
            </p>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <CustomForm />
          </div>
        </div>
      </section>
    </>
  );
}
