/** How ordering actually works: bag → WhatsApp → we confirm. */
const steps = [
  { title: "Add to your bag", body: "Choose what you'd like. Nothing is charged on this site." },
  { title: "Send it on WhatsApp", body: "Checkout writes your order out for you — just press send." },
  { title: "We confirm the details", body: "Availability, price, delivery or pickup, and payment — all agreed with you directly." },
];

export function HowToOrder({ id = "how-to-order" }: { id?: string }) {
  return (
    <section aria-labelledby={id} className="bg-stone">
      <div className="page grid gap-8 py-14 md:py-20 lg:grid-cols-12 lg:gap-8">
        <h2 id={id} className="display-m lg:col-span-3">
          How to order
        </h2>
        <ol className="grid md:grid-cols-3 md:gap-8 lg:col-span-8 lg:col-start-5">
          {steps.map((s, i) => (
            <li key={s.title} className="border-t border-rule-strong py-5 md:py-6">
              <span className="meta tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <p className="title mt-2">{s.title}</p>
              <p className="meta mt-2 max-w-xs text-ink">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
