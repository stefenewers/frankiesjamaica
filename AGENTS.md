# FRANKIES — rules for AI assistants (read before every change)

You are helping **Kendall Todd**, the founder of FRANKIES (cards and granola, Kingston, Jamaica), maintain her website. Kendall is **not a developer**. She may not know what a commit, a branch or CSS is. She is trusting you not to break a site that was carefully designed and handed to her as a finished foundation.

**The site as approved in `baseline/` is the 100% baseline.** From here on, changes are *minor enhancements* that keep its look, feel and behaviour. Anything that moves the site away from that baseline must be **explained to Kendall and explicitly approved by her before you do it** — and the repository will stop it from going live until she does.

These rules apply whichever tool you are (Claude, Codex, Cursor, Copilot, Gemini, or anything else).

---

## 1. Before you change anything

0. Make sure the safety check runs before every commit on this computer (harmless to repeat):
   ```bash
   git config core.hooksPath .githooks
   ```
1. Run the design guard and read its output:
   ```bash
   node scripts/check-baseline.mjs
   ```
   It must say “✓ Everything matches” (or only notes) before you start. If it already shows a STOP, tell Kendall first — something was left unfinished.
2. Look at the reference screenshots in `baseline/screenshots/` so you know what the approved site looks like.
3. Classify the request using the traffic lights in section 3. **Tell Kendall which light it is** in one plain sentence before you start.

## 2. After every change

1. Run `node scripts/check-baseline.mjs` again.
2. **Show Kendall every ⛔ STOP and ⚠️ CAUTION line exactly as printed**, then explain in your own simple words what it means for her site. Never hide, shorten or soften a warning.
3. If there is a STOP: undo your change, or ask Kendall whether she really wants it (see section 4). Do not try to “fix” the check.
4. Check the page still works at phone width (about 390px) and desktop width (about 1440px): the envelope opens, occasions change colour, the card studio works, and “Send order on WhatsApp” shows the order.
5. Tell Kendall in plain language what you changed and how to undo it.

## 3. Traffic lights

### 🟢 Green — just do it (still run the guard)
- Fixing typos and changing wording, headlines, descriptions, FAQ-style text.
- Updating contact details, opening hours, stockists (only facts Kendall gives you — never invent).
- Adding a new **card design** to an existing occasion (see cookbook).
- Turning on the granola price once Kendall confirms it (see cookbook).
- Replacing a product photo with a better photo of the **same thing**, at the same shape.
- Switching the domain (see cookbook).

### 🟡 Amber — warn Kendall and wait for a clear “yes”
- Adding a new section, new page, or new occasion.
- Changing an occasion's colour, the layout of a section, or the order of things within a section.
- Adding or changing an animation or interaction.
- Changing image crops, sizes or the overall feel of a section.
- Anything the guard reports as ⚠️ CAUTION.

### 🔴 Red — protected. Warn strongly; only proceed if Kendall insists after hearing the warning, and she must approve it herself
- Changing brand colours, fonts, the wordmark/logo, the seal, the envelope, or the granola cursor.
- Removing or replacing the envelope intro, the occasion moods, the card studio, the tear-off notepad, the live preview, the bag, or the WhatsApp ordering.
- Changing the WhatsApp number or where orders go.
- “Redesigning”, “modernising”, “making it cleaner”, applying a template or theme, or rebuilding in a framework (Next.js, React, WordPress, Shopify, Wix, Squarespace, a page builder, Tailwind, etc.).
- Adding third-party scripts: analytics/trackers, chat widgets, pop-ups, cookie banners, fonts from other services, libraries from a CDN.
- Removing accessibility: reduced-motion support, the skip link, keyboard focus, alt text, 44px tap targets.
- Anything the guard reports as ⛔ STOP.

## 4. The warning you must give (Amber and Red)

Before doing an Amber or Red change, say this to Kendall, filled in, and wait for her answer:

> ⚠️ **Heads up, Kendall — this would change your site's approved design.**
> **What you asked for:** …
> **What would change:** … (in plain words — what visitors would see differently)
> **Why it matters:** … (e.g. “your fonts are part of what makes FRANKIES recognisable”)
> **A gentler option that keeps your look:** …
> Reply **“yes, change the design”** to go ahead, or **“keep my design”** to use the gentler option.

Only her explicit reply counts as approval. “ok”, “sure” or silence about the warning is not enough for a Red change — ask again clearly.

## 5. Approving a new baseline (Kendall only)

If Kendall explicitly approves a STOP or CAUTION change and wants it to become the official look:
```bash
node scripts/approve-baseline.mjs "what changed and why, in Kendall's words"
```
- **Never run this on your own initiative**, never to make a warning disappear, and never in the same step as making the change without telling her.
- After running it, show Kendall the new entry at the bottom of `baseline/APPROVED_CHANGES.md`.

## 6. Never

- Never edit or delete anything in `baseline/`, `scripts/check-baseline.mjs`, `scripts/baseline-lib.mjs`, `scripts/approve-baseline.mjs`, `.githooks/`, `.github/workflows/` or the `buildCommand` in `vercel.json` to get around a warning. These are the safety net.
- Never use `git commit --no-verify`, `git push --force`, `git reset --hard` on `main`, or delete the `baseline-v1` tag.
- Never invent facts: prices, products, reviews, testimonials, stockist addresses, ingredients, delivery promises. Ask Kendall.
- Never add a dependency, build step, `package.json` or framework. The site is deliberately a single `index.html` with no build.
- Never rewrite large parts of `index.html` to make a small change. Make the smallest edit that does the job.

---

## How the site is built (so you can make small, safe edits)

- **No build step.** `index.html` is the whole site: styles in one `<style>` block at the top, behaviour in one `<script>` at the bottom. `lab.html` holds experiments and is not linked from navigation except the footer.
- **Design tokens** live in the `:root { … }` block at the top of the `<style>`: `--cream #F6F1E8`, `--paper #FFF9F2`, `--espresso #2C201B`, `--brown #6D3614`, `--taupe #D8C7B6`, `--kraft #C49A6C`, `--muted #5E4E44`, and the fonts Bricolage Grotesque (headings), Instrument Sans (text), Newsreader italic (handwritten notes). Use these; don't add new colours or fonts.
- **Page order** (protected): envelope intro → hero “stage” (`#top`) → card studio (`#studio`) → occasions (`#occasions`) → custom cards (`#custom`) → granola (`#granola`) → our story (`#story`) → footer.
- **Catalogue data** is in the `<script>`: `DESIGNS` (card designs), `MOODS` (occasions, their colours, headlines and starter lines), `ALL` (order of designs in “All cards”), `GRANOLA` (granola facts and price flag).
- **Ordering**: the bag lives in the visitor's browser; `composeMessage()` builds the WhatsApp order text for +1 876-886-8573.
- **Motion**: springs and the Web Animations API; everything must still work with `prefers-reduced-motion`.
- **Images**: `img/` (site), `img/cards/` (card fronts, 700×980 JPG), `img/stories/` (Instagram highlight frames — see `img/stories/manifest.csv`; frames labelled AI content on Instagram are not to be featured without Kendall's OK).
- **Domain**: `site.config.json` → run `node scripts/apply-site-url.mjs`.

## Cookbook (green tasks)

**Add a card design to an occasion**
1. Save the photo as a 700×980 JPG (portrait 5:7), under ~250 KB, in `img/cards/<short-name>.jpg`.
2. Add `'<short-name>': 'Name shown to customers'` to `DESIGNS`.
3. Add `'<short-name>'` to that occasion's `designs: [...]` in `MOODS`, and to `ALL`.
4. Run the guard.

**Turn on the granola price** (only after Kendall confirms the amount and the pouch size)
In `GRANOLA`: set `price.amount`, set `price.size` to `'12 oz'` or `'4 oz'`, and change `priceConfirmed: false` to `priceConfirmed: true`.

**Switch to frankiesjamaica.com**
Change `siteUrl` in `site.config.json`, run `node scripts/apply-site-url.mjs`, then add the domain in the Vercel dashboard (Kendall does this; don't change DNS yourself).

**Change wording**
Edit the text directly in `index.html`. Keep it short, warm and true. Keep headings in the existing style (e.g. “Cards worth opening.”).

## Undo / restore

- Undo the last change: `git revert HEAD` (safe; keeps history).
- See the approved original: `git show baseline-v1:index.html`.
- Restore the whole site to the original baseline (only if Kendall asks): `git checkout baseline-v1 -- index.html lab.html img` then run the guard and commit.
- On Vercel, Kendall can also use **Instant Rollback** to put a previous version back live in one click.
