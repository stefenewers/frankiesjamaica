import type { Metadata } from "next";
import { HandoffStatus } from "./handoff-status";

export const metadata: Metadata = {
  title: "Send your order",
  robots: { index: false },
};

export default function ThanksPage() {
  return (
    <div className="page pb-[var(--section-y)] pt-14 md:pt-24">
      <HandoffStatus />
    </div>
  );
}
