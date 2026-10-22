import { business } from "@/lib/catalog";
import { buildOrderMessage, resolveLines, type CartLine, type Customer } from "@/lib/order";

/**
 * Optional backup of each order by email (via Resend), so nothing is lost if a
 * customer never presses "send" in WhatsApp. Disabled unless ORDER_EMAIL_ENABLED=true.
 *
 * Env: ORDER_EMAIL_ENABLED, RESEND_API_KEY, ORDER_EMAIL_TO, ORDER_EMAIL_FROM
 */
export async function POST(request: Request) {
  if (process.env.ORDER_EMAIL_ENABLED !== "true") {
    return Response.json({ enabled: false }, { status: 202 });
  }

  const { RESEND_API_KEY, ORDER_EMAIL_TO, ORDER_EMAIL_FROM } = process.env;
  if (!RESEND_API_KEY || !ORDER_EMAIL_TO || !ORDER_EMAIL_FROM) {
    console.error("ORDER_EMAIL_ENABLED is true but RESEND_API_KEY / ORDER_EMAIL_TO / ORDER_EMAIL_FROM are missing");
    return Response.json({ error: "Email not configured" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parseOrder(body);
  if (!parsed) return Response.json({ error: "Invalid order" }, { status: 400 });

  // Prices come from the catalog on the server, never from the client.
  const lines = resolveLines(parsed.lines);
  if (lines.length === 0) return Response.json({ error: "Empty order" }, { status: 400 });
  const text = buildOrderMessage(lines, parsed.customer);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: ORDER_EMAIL_FROM,
      to: ORDER_EMAIL_TO.split(",").map((s) => s.trim()),
      subject: `New ${business.name} order – ${parsed.customer.name}`,
      text: `${text}\n\nWhatsApp the customer: https://wa.me/${parsed.customer.phone.replace(/\D/g, "")}`,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return Response.json({ error: "Email failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");

function parseOrder(body: unknown): { customer: Customer; lines: CartLine[] } | null {
  if (typeof body !== "object" || body === null) return null;
  const { customer, lines } = body as { customer?: Record<string, unknown>; lines?: unknown };
  if (!customer || !Array.isArray(lines) || lines.length > 100) return null;

  const parsedCustomer: Customer = {
    name: str(customer.name, 80),
    phone: str(customer.phone, 30),
    method: customer.method === "pickup" ? "pickup" : "delivery",
    area: str(customer.area, 120),
    notes: str(customer.notes, 500),
  };
  if (!parsedCustomer.name.trim() || !parsedCustomer.phone.trim()) return null;

  const parsedLines: CartLine[] = lines.flatMap((l) =>
    typeof l === "object" && l !== null && typeof l.slug === "string" && typeof l.qty === "number"
      ? [{ slug: l.slug, variant: typeof l.variant === "string" ? l.variant : null, qty: l.qty }]
      : [],
  );
  return { customer: parsedCustomer, lines: parsedLines };
}
