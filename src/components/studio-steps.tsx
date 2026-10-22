/**
 * The custom-card process. Only describes what actually happens today:
 * a brief over WhatsApp, a conversation, then the customer confirms.
 * No promises about proofs, revisions or turnaround until Kendall confirms them.
 */
const steps = [
  {
    title: "Tell us what you have in mind",
    body: "The occasion, how many cards, when you need them and any wording or ideas. Your brief arrives with us on WhatsApp.",
  },
  {
    title: "We work through the details",
    body: "We talk it through with you on WhatsApp — the design, the words, the quantities and the timing.",
  },
  {
    title: "Confirm your order",
    body: "Once everything, including the price, is agreed, you confirm and we get started.",
  },
];

export function StudioSteps({ tone = "ink" }: { tone?: "ink" | "bone" }) {
  const rule = tone === "bone" ? "border-bone/25" : "border-rule";
  const muted = tone === "bone" ? "text-bone/80" : "text-ink-muted";
  return (
    <ol className="grid gap-0 md:grid-cols-3 md:gap-8">
      {steps.map((s, i) => (
        <li key={s.title} className={`border-t py-6 md:py-8 ${rule}`}>
          <span className={`meta tabular-nums ${muted}`}>{String(i + 1).padStart(2, "0")}</span>
          <p className="title mt-3 text-[1.375rem] md:text-2xl">{s.title}</p>
          <p className={`mt-3 max-w-xs text-[0.9375rem] leading-relaxed ${muted}`}>{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
