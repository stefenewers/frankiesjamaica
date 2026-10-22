# FRANKIES

Cards from Kingston, Jamaica. A static, no-build site: open the envelope, explore occasions, write your message inside a real FRANKIES card, and send the order on WhatsApp.

## What's here

| File | What it is |
| --- | --- |
| `index.html` | The site: envelope intro, occasion moods, card studio, occasions, custom cards, granola. All CSS and JS are inline; no libraries. |
| `lab.html` | Paper lab: interaction experiments (scratch to reveal, pencil writing, perforated tear) kept out of the shop. |
| `img/` | Photography and brand marks. `img/cards/` holds card fronts cropped from FRANKIES' own flat-lay photos. |
| `vercel.json` | Tells Vercel to serve the folder as-is, with no build step. |

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Deploy

Push to `main`; Vercel serves the files directly. If the Vercel project still has the old Next.js settings, set **Framework Preset** to "Other" and clear the build command (`vercel.json` already does this).

## How it works

- **Envelope intro** plays on every load so it's always seen. To show it once per visit, have `showIntro()` check `sessionStorage['frankies-intro']`, which `endIntro()` already sets. Skip it with "Skip intro" or Escape. With reduced motion turned on, it's skipped automatically.
- **Catalogue**: `DESIGNS`, `MOODS` (occasions, colours, headlines, starter lines) and `ALL` in the `<script>` at the bottom of `index.html`. Add a design by dropping a 700×980 image in `img/cards/` and adding its id to `DESIGNS` and to an occasion's `designs`.
- **Ordering**: the bag lives in `localStorage`. "Send order on WhatsApp" shows the exact message that would go to FRANKIES (+1 876-886-8573). Nothing is sent from the page yet; wiring it to `https://wa.me/18768868573?text=…` is the next step.
- **Motion** uses hand-written springs (one shared `requestAnimationFrame` loop that sleeps when idle), CSS 3D transforms and the Web Animations API. All of it respects `prefers-reduced-motion`.

## Before launch (needs Kendall)

- Confirm the catalogue: which designs exist, which occasion each belongs to, and prices. The site says "Price confirmed on WhatsApp" everywhere.
- Clean product photos of each card front. The current crops come from styled photos and include props.
- Granola: ingredients and allergens. The "Good Mood Facts" panel is playful and says so.
- Custom-card process, delivery/pickup, payment and lead times.
- Real-device testing on iPhone and Android, including the Instagram and WhatsApp in-app browsers.

The previous Next.js build of the site (cart, checkout, tests, merchant handoff notes) is in git history at commit `cdcd58b`.
