# Merchant handoff — what we need from Kendall

The site only states what we know. Everything below is currently shown as "Enquire", "Confirmed with you when you order", or hidden. Each answer can go straight into [`content/products.json`](content/products.json) — no code changes needed. `npm run content:check` lists anything still missing.

## 1. For every product

| Field in `products.json` | Question | Where it shows |
| --- | --- | --- |
| `price` | What does it cost (JMD)? Per card, or per pack? | Shop, product page, bag, WhatsApp message |
| `variants` | Are there options — single card vs. pack, sizes, flavours, jar vs. bag? Price for each? | Product page option picker |
| `details.designs` | How many designs are in this collection right now? Which photos are current? | Product page → Designs |
| `details.includes` | What exactly does the customer receive? (e.g. "One folded card with a kraft envelope", "250g jar") | Product page → What you receive |
| `details.size` | Card size / jar weight | Product page → Size (hidden until filled) |
| `details.material` | Paper stock, finish, envelope; for granola, ingredients/allergens | Product page → Paper & materials (hidden until filled) |
| `details.personalisation` | Can a ready-made card be personalised (name, message inside)? | Product page → Personalise it |
| `available` | Is it in stock now? Is granola a current product? | "Sold out" label |
| `etsyUrl` | Is this listed on Etsy? Link? | "Also available on Etsy" link |

Current products (all `price: null`, all `details` empty): Birthday, Everyday, Faith, Graduation, Father's Day, Teacher Appreciation, Valentine's and Custom Cards; Coconut and Chocolate Granola.

## 2. Ordering & fulfilment (FAQ answers — hidden until filled)

- Delivery: which areas, what fee, how it's arranged?
- Pickup: where and when?
- Payment: bank transfer, cash, card, other?
- Lead times for ready-made orders.
- International shipping — yes/no, or Etsy only?

## 3. Custom Studio

The site describes only this process: brief on WhatsApp → talk through the details → customer confirms (including price). Please confirm, and tell us if we can add:

- Minimum or typical quantities.
- Typical lead time for custom cards (e.g. "allow two weeks").
- Whether customers see a proof before printing, and how many revisions are included.
- Starting prices or a price range.
- Business / event examples we can show (with permission).

## 4. Brand & accounts

- Is +1 876-886-8573 the right WhatsApp number for orders?
- Is info@frankiesjamaica.com live? (Seen on the business card in the stone-sign photo.)
- Who owns the domain frankiesjamaica.com?
- Vector logo and original photography — see [ASSET_NOTES.md](ASSET_NOTES.md).

## How the WhatsApp handoff works (for Kendall)

1. The customer checks out; WhatsApp opens with the order written out.
2. The site does **not** treat that as an order. The bag is kept, and the customer sees "Your order is ready to send" with a button to reopen WhatsApp.
3. Only when the customer taps **I've sent it** is the bag cleared.
4. Every order is confirmed by Kendall in the WhatsApp chat — availability, price, delivery or pickup, payment.

If `ORDER_EMAIL_ENABLED` is turned on, Kendall also gets an email copy at step 1 — useful for following up on orders that were written out but never sent.
