# FRANKIES — made for every moment

Website for [FRANKIES](https://linktr.ee/frankiesja), a Kingston, Jamaica lifestyle brand making greeting cards, custom cards and granola.

Customers browse the shop, add items to their bag and check out. Checkout opens **WhatsApp** with the order already written out — they press send, and the order arrives in Kendall's WhatsApp just like today. No payments, accounts or database to look after.

Built with Next.js (App Router), TypeScript and Tailwind CSS. Hosted on Vercel.

---

## Editing products (for Kendall)

Everything on the site — products, prices, the WhatsApp number, social links, FAQ answers — lives in one file:

**[`content/products.json`](content/products.json)**

### The easy way: edit on GitHub

1. Open [`content/products.json`](content/products.json) on GitHub and click the ✏️ pencil icon.
2. Make your change (see examples below).
3. Click **Commit changes**. Vercel rebuilds the site automatically — it's live in about a minute.

If something is wrong with the file, Vercel won't publish it and the old version stays up, so you can't break the live site.

### A product looks like this

```json
{
  "slug": "coconut-granola",
  "name": "Coconut Granola",
  "category": "granola",
  "price": 1800,
  "variants": [],
  "images": ["/images/granola-jar.jpg", "/images/granola-coconut.jpg"],
  "description": "Golden, toasty granola with coconut.",
  "available": true,
  "featured": true,
  "etsyUrl": null,
  "reviewed": true
}
```

| Field | What it does |
| --- | --- |
| `slug` | The web address: `/shop/coconut-granola`. Lowercase letters, numbers and dashes. Don't change it after launch. |
| `name` | Product name shown on the site. |
| `category` | `cards` or `granola` (or any `id` you add under `categories`). |
| `price` | Price in **JMD**, numbers only — `1800` means J$1,800. Use `null` to show **"Enquire"** (and "Price confirmed on WhatsApp" on the product page); people can still add it to their bag and you'll quote them on WhatsApp. |
| `variants` | Options like sizes or packs. Leave as `[]` for none. Example: `[{ "name": "Single", "price": 500 }, { "name": "Pack of 5", "price": 2000 }]` |
| `images` | Photos from `public/images/`. The first one is the main photo. |
| `description` | A sentence or two shown on the product page. |
| `available` | `false` shows "Sold out" and hides the Add to bag button. |
| `featured` | `true` shows it under "Little favourites" on the home page (first four). |
| `etsyUrl` | Paste an Etsy listing link to show a "Buy on Etsy" link, or `null`. |
| `reviewed` | Set to `true` once you've checked the product. |

**Adding a product:** copy an existing product block (from `{` to `}`), paste it after a comma, and change the details. Every block except the last needs a comma after its closing `}`.

**Adding photos:** upload them to [`public/images/`](public/images) on GitHub (**Add file → Upload files**), then reference them as `"/images/your-photo.jpg"`. Square or portrait photos, at least 1000px wide, look best.

**FAQ:** answers under `"faq"` that are `null` stay hidden. Write an answer in quotes to show it.

### Check your edits (optional, for developers)

```bash
npm run content:check   # validates products.json and lists anything still to confirm
```

---

## Development

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # production build
npm run lint
npm test               # Playwright: cart → checkout → WhatsApp link (first run: npx playwright install chromium)
```

### How ordering works

- The bag is saved in the browser (`localStorage`), so it survives refreshes.
- `/checkout` collects name, phone, delivery or pickup, area and notes, then opens
  `https://wa.me/18768868573?text=…` with this message:

  ```
  Hi Frankies! New order 🛍️
  Name: {name}  Phone: {phone}
  Items:
  - {qty} x {product} ({variant}) – J${price}
  Subtotal: J${subtotal}
  Delivery/Pickup: {method} – {area}
  Notes: {notes}
  ```

- Very long orders are shortened so the link stays under ~1,900 characters, the limit that opens reliably on iOS, Android and desktop.
- Opening WhatsApp doesn't mean an order was sent, so the site treats it as a **pending handoff** (`src/lib/cart-store.ts`):
  - the bag is never cleared automatically; the handoff is saved in `localStorage` so it survives reloads;
  - orders and custom requests are kept in separate slots, so one never replaces the other;
  - `/thanks` says "Your order is ready to send" and offers **Open WhatsApp (again)** — prominently if a pop-up blocker stopped it. **I've sent it** is optional (it clears the sent items); **Not now — dismiss** stops the reminder and leaves the bag alone;
  - if the bag changes after an order was written out, `/thanks` says so and offers to check out again; checking out again warns that an earlier order may already have been sent;
  - the bag drawer and checkout show a quiet, dismissible reminder; reminders expire after 48 hours;
  - double taps on the submit buttons open WhatsApp only once.
- `/custom` (the Custom Studio) sends a custom card request (occasion, quantity, date needed, message) the same way.

The message builder lives in [`src/lib/order.ts`](src/lib/order.ts).

### Optional: email backup of orders

`/api/order` can email Kendall a copy of every order through [Resend](https://resend.com), so nothing is lost if a customer never presses send. It's **off by default**. To turn it on, set these in Vercel → Project → Settings → Environment Variables (see [`.env.example`](.env.example)):

| Variable | Value |
| --- | --- |
| `ORDER_EMAIL_ENABLED` | `true` |
| `RESEND_API_KEY` | from the Resend dashboard |
| `ORDER_EMAIL_TO` | e.g. `info@frankiesjamaica.com` |
| `ORDER_EMAIL_FROM` | an address on a domain verified in Resend |

Prices in the email are recomputed on the server from `products.json`.

---

## Deploying to Vercel

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com/new), **Import** the repo. The defaults are fine (framework: Next.js).
3. Add `NEXT_PUBLIC_SITE_URL` (e.g. `https://frankiesjamaica.com`) under Environment Variables. Until a domain is set, the Vercel URL is used.
4. Deploy. Every push to `main` redeploys automatically.
5. **Custom domain:** Vercel → Project → Settings → Domains → add `frankiesjamaica.com` and `www.frankiesjamaica.com`, then set the DNS records Vercel shows at the domain registrar. HTTPS is automatic.
6. **Analytics:** enable Web Analytics in the Vercel project. The `<Analytics />` component is already installed.

## Before launch

See [`MERCHANT_HANDOFF.md`](MERCHANT_HANDOFF.md) for everything Kendall needs to confirm (prices, what's included, sizes, delivery, payment, custom process).


- [ ] Kendall confirms the product list, prices, photos and the WhatsApp number (+1 876-886-8573)
- [ ] Confirm the email address (info@frankiesjamaica.com, seen on the business card)
- [ ] Fill the FAQ answers: delivery/pickup, payment, custom-card lead times, international shipping
- [ ] Add Etsy listing links (`etsyUrl`) if Etsy stays a channel
- [ ] Connect the domain and set `NEXT_PUBLIC_SITE_URL`
- [ ] Test checkout on iPhone, Android and desktop WhatsApp
- [ ] Update the Linktree and Instagram bio links to the new site
- [ ] Higher-resolution photos and a vector logo, if available (current images are ~736px from Pinterest)

## Design system

Tokens live at the top of [`src/app/globals.css`](src/app/globals.css):

- **Colour:** `bone` (background), `ink` (text), `brown` (FRANKIES brown), `stone` (pale neutral). Muted text and hairline rules are mixed from these.
- **Type:** Newsreader for display, Inter for text. Use the scale classes `display-xl`, `display-l`, `display-m`, `title`, `kicker`, `lede`, `meta`.
- **Components:** `page` (width + gutter), `section` (vertical rhythm), `btn btn-primary|btn-inverse|btn-outline`, `link`, `link-arrow`, `label`, `field`, `frame` (image container), `rule-t`/`rule-b`.
- **Logo:** `<Wordmark />` renders the wordmark cut from `logo.png`. See [`ASSET_NOTES.md`](ASSET_NOTES.md) for the images and vector logo still needed.

## Project map

```
content/products.json        ← all editable content
public/images/               ← product & brand photos (sources in assets/manifest.csv)
src/app/                     ← pages: / shop shop/[slug] custom about faq checkout thanks api/order
src/components/              ← header, footer, cart drawer, product card, add-to-bag
src/lib/catalog.ts           ← reads products.json, price formatting
src/lib/order.ts             ← WhatsApp message + link builder
src/lib/cart-store.ts        ← localStorage cart
tests/checkout.spec.ts       ← Playwright test
```
