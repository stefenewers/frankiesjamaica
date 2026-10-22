# Asset notes

The site launches with images collected from FRANKIES' public Linktree and Pinterest. Most are **736px wide** (Pinterest's size), so the layout deliberately keeps them in contained editorial frames rather than full-bleed. Better originals will let the design open up.

Sources for every file are in [`assets/manifest.csv`](assets/manifest.csv).

## Top five photography upgrades

Ranked by how much each would change the site.

1. **Clean product shots of every card design** (2000px+, 4:5, one design per frame, plus one in-hand or envelope shot). Today the `cards-*.jpg` images are mood-board flat-lays that mix several designs (and props), so customers can't tell exactly which cards they're buying. This is the biggest merchandising gap. *Affects: shop, every product page, home Card Shop.*
2. **A high-resolution hero of the cards with their packaging** — the same story as `brand-gift-box.jpg` (cards, box, FRANKIES seal), shot at 3000px+. The home hero now leads with this image at 736px; a sharp original would let it run larger. *Affects: home hero, Custom Cards.*
3. **The envelope and seal, photographed for real.** `envelope-open-this.jpg` reads like a mock-up graphic. A real kraft envelope with the FRANKIES seal, plus a close-up of the paper, would carry the "opening a card" moment. *Affects: home hero, statement spread.*
4. **Custom Studio work in progress / finished commissions** — a stack of custom cards for an event or business, the brief on a desk, hands writing. `cards-custom.jpg` is a sign about custom cards, not an example of one. *Affects: Custom Studio page and home band.*
5. **Granola, styled as part of the same world** — the jar or bag with a FRANKIES label, next to a card or in a gift box, on the same light and surfaces as the cards. Today's granola photos are a different style. *Affects: From the Kitchen, granola product pages.*

Also wanted: **logo as a vector (SVG, AI or PDF)** — the header and footer use a wordmark cut from the 1000×1000 Linktree logo (`wordmark-brown.png`, `wordmark-bone.png`, 780×143). It's sharp at the current sizes but can't be recoloured cleanly. And **a founder photo**, if Kendall would like one on the About page.

## Where each current image is used

| File | Where it's used | Source size | Note |
| --- | --- | --- | --- |
| `brand-gift-box.jpg` | Home hero · Custom Cards | 736×920 | Strongest product image; replace with a high-res original (#2) |
| `envelope-open-this.jpg` | Home hero (small) | 736×981 | Looks like a graphic mock-up (#3) |
| `cards-custom.jpg` | Home Custom Studio band · Custom page | 736×920 | A sign, not a product (#4) |
| `lifestyle-gifting.jpg` | Home statement spread · About | 736×981 | Shown large in two places |
| `granola-jar.jpg` | Home: From the Kitchen | 736×981 | Shown at ~45% of the desktop width (#5) |
| `brand-stone-sign.jpg` | Home story section | 1333×1333 | Sharpest brand image |
| `brand-stone-sign-tall.jpg` | About | 736×981 | A taller crop of the stone sign |
| `cards-*.jpg` | Shop, product pages | 735–736px | Mood-board flat-lays (#1) |
| `granola-*.jpg` | Shop, product pages | 736px | Different style to the cards (#5) |
| `lifestyle-beach-chairs.jpg`, `fill-your-cup.jpg`, `peace-of-mind.jpg` | Home: closing image sequence | 736px | Fine at current size |

## Other assets

- `lifestyle-cheers.jpg` — 1600×1600, not used (doesn't fit the cards/gifting story).
- `logo.png` — 1000×1000, source for the favicon, Open Graph image and wordmark.

## Adding new photos

Put files in `public/images/` and update the paths in `content/products.json` (products) or in the page files under `src/app/` (editorial images). Keep names lowercase-with-dashes.
