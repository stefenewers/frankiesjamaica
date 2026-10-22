# Asset notes

The site launches with images collected from FRANKIES' public Linktree and Pinterest. Most are **736px wide** (Pinterest's size), so the layout deliberately keeps them in contained editorial frames rather than full-bleed. Better originals will let the design open up.

Sources for every file are in [`assets/manifest.csv`](assets/manifest.csv).

## What to ask Kendall for

1. **Logo as a vector (SVG, AI or PDF).** The header and footer use a wordmark cut from the 1000×1000 Linktree logo (`public/images/wordmark-brown.png`, `wordmark-bone.png`, 780×143). It's sharp at the current sizes but will soften on very large displays and can't be recoloured cleanly.
2. **Original product photography**, at least 2000px on the long edge, ideally 4:5 portrait, one product per frame on a quiet background:
   - each card design (front, plus one detail or in-hand shot)
   - each granola flavour (jar or bag, plus one serving shot)
3. **3–5 high-resolution brand / lifestyle photographs** (3000px+) for the hero, the "Not everything should disappear in a text" spread, and the Custom Studio band.
4. **Detail photography**: paper texture, envelopes and the FRANKIES seal, packaging, gift boxes, granola close-ups.
5. **A founder photo**, if Kendall would like one on the About page.

## Images to replace first

| File | Where it's used | Source size | Why replace |
| --- | --- | --- | --- |
| `brand-gift-box.jpg` | Home: Custom Studio · Custom page · Custom Cards | 736×920 | Largest editorial use of a low-res file |
| `lifestyle-gifting.jpg` | Home: statement spread · About | 736×981 | Shown large in two places |
| `granola-jar.jpg` | Home: From the Kitchen | 736×981 | Shown at ~45% of the desktop width |
| `envelope-open-this.jpg` | Home hero (small) · Thanks page | 736×981 | Strong brand image, worth a sharp original |
| `brand-stone-sign-tall.jpg` | About | 736×981 | A higher-res version of `brand-stone-sign.jpg` (1333px) already exists |
| `cards-*.jpg` | Shop, product pages | 735–736px | Mood-board style; replace with clean product shots |
| `granola-*.jpg` | Shop, product pages | 736px | As above |
| `lifestyle-beach-chairs.jpg`, `fill-your-cup.jpg`, `peace-of-mind.jpg` | Home: closing image sequence | 736px | Fine at current size; nice to have originals |

## Best current assets

- `brand-stone-sign.jpg` — 1333×1333, the sharpest brand image, used as the home hero.
- `lifestyle-cheers.jpg` — 1600×1600, not used yet (doesn't fit the cards/gifting story as well).
- `logo.png` — 1000×1000, source for the favicon, Open Graph image and wordmark.

## Adding new photos

Put files in `public/images/` and update the paths in `content/products.json` (products) or in the page files under `src/app/` (editorial images). Keep names lowercase-with-dashes.
