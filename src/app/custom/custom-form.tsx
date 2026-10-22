"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { business, customOccasions } from "@/lib/catalog";
import { startHandoff } from "@/lib/cart-store";
import { buildCustomUrl } from "@/lib/order";

function Part({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-8 pt-6 rule-t md:grid-cols-[9rem_1fr] md:gap-8">
      <legend className="sr-only">{title}</legend>
      <p aria-hidden="true" className="kicker">
        <span className="text-ink-muted tabular-nums">{String(n).padStart(2, "0")}</span>
        <span className="mt-2 block">{title}</span>
      </p>
      <div className="space-y-10">{children}</div>
    </fieldset>
  );
}

export function CustomForm() {
  const router = useRouter();
  // Guards against a double tap opening WhatsApp twice (reset when the page is shown again).
  const submitting = useRef(false);
  useEffect(() => {
    submitting.current = false;
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    const form = new FormData(e.currentTarget);
    const url = buildCustomUrl(business.whatsapp, {
      name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      occasion: String(form.get("occasion") ?? ""),
      quantity: Number(form.get("quantity")) || 1,
      message: String(form.get("message") ?? ""),
      dateNeeded: String(form.get("date") ?? ""),
    });
    startHandoff("custom", url);
    router.push("/thanks");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12" aria-label="Custom card brief">
      <Part n={1} title="The occasion">
        <div>
          <label htmlFor="c-occasion" className="label">
            Occasion
          </label>
          <select id="c-occasion" name="occasion" required className="field" defaultValue="">
            <option value="" disabled>
              Choose an occasion
            </option>
            {customOccasions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-8">
          <div>
            <label htmlFor="c-qty" className="label">
              How many cards
            </label>
            <input id="c-qty" name="quantity" type="number" min={1} max={1000} defaultValue={1} required className="field" />
          </div>
          <div>
            <label htmlFor="c-date" className="label">
              Date needed <span className="label-hint">— optional</span>
            </label>
            <input id="c-date" name="date" type="date" className="field" />
          </div>
        </div>
      </Part>

      <Part n={2} title="Your idea">
        <div>
          <label htmlFor="c-message" className="label">
            Wording, style, anything we should know
          </label>
          <textarea
            id="c-message"
            name="message"
            rows={5}
            maxLength={800}
            placeholder="Who it's for, what you'd like it to say, colours, a design you love…"
            className="field"
          />
        </div>
      </Part>

      <Part n={3} title="Your details">
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-8">
          <div>
            <label htmlFor="c-name" className="label">
              Name
            </label>
            <input id="c-name" name="name" required autoComplete="name" maxLength={80} className="field" />
          </div>
          <div>
            <label htmlFor="c-phone" className="label">
              Phone / WhatsApp
            </label>
            <input
              id="c-phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              pattern="[0-9+()\-\s]{7,20}"
              title="Phone number, e.g. 876-555-0123"
              className="field"
            />
          </div>
        </div>
      </Part>

      <div className="flex flex-col gap-4 pt-2 rule-t sm:flex-row sm:items-center sm:justify-between md:pl-[calc(9rem+2rem)]">
        <p className="meta pt-6 sm:max-w-xs">Opens WhatsApp with your brief written out.</p>
        <button type="submit" className="btn btn-primary mt-2 w-full sm:mt-6 sm:w-auto">
          <WhatsAppIcon className="size-4" /> Send your brief
        </button>
      </div>
    </form>
  );
}
