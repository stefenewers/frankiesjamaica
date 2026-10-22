"use client";

import { useRouter } from "next/navigation";
import { WhatsAppIcon } from "@/components/icons";
import { business, customOccasions } from "@/lib/catalog";
import { rememberOrderUrl } from "@/lib/cart-store";
import { buildCustomUrl } from "@/lib/order";

export function CustomForm() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const url = buildCustomUrl(business.whatsapp, {
      name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      occasion: String(form.get("occasion") ?? ""),
      quantity: Number(form.get("quantity")) || 1,
      message: String(form.get("message") ?? ""),
      dateNeeded: String(form.get("date") ?? ""),
    });
    rememberOrderUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
    router.push("/thanks");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-paper p-6 sm:p-8" aria-label="Custom card request">
      <div className="grid gap-5 sm:grid-cols-2">
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

      <div className="grid gap-5 sm:grid-cols-2">
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
        <div>
          <label htmlFor="c-qty" className="label">
            How many cards?
          </label>
          <input id="c-qty" name="quantity" type="number" min={1} max={1000} defaultValue={1} required className="field" />
        </div>
      </div>

      <div>
        <label htmlFor="c-date" className="label">
          Date needed <span className="font-normal text-mocha">(optional)</span>
        </label>
        <input id="c-date" name="date" type="date" className="field" />
      </div>

      <div>
        <label htmlFor="c-message" className="label">
          Your message or idea
        </label>
        <textarea
          id="c-message"
          name="message"
          rows={5}
          maxLength={800}
          placeholder="Who it's for, what you'd like it to say, colours, style…"
          className="field"
        />
      </div>

      <button type="submit" className="btn btn-whatsapp w-full">
        <WhatsAppIcon /> Send request on WhatsApp
      </button>
    </form>
  );
}
