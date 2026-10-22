// Shared logic for the FRANKIES design baseline.
// fingerprint() reads the site as it is now; compare() explains, in plain English,
// how it differs from the approved baseline in baseline/baseline.json.
// No dependencies: runs on any Node 18+ (locally, on GitHub, and on Vercel).
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export const ROOT = new URL("../", import.meta.url).pathname;
const read = (p) => readFileSync(join(ROOT, p), "utf8");
const sha = (p) => createHash("sha256").update(readFileSync(join(ROOT, p))).digest("hex").slice(0, 16);

// Brand files that define how FRANKIES looks. Changing one is a brand decision.
export const PROTECTED_ASSETS = [
  "img/wordmark-brown.png",
  "img/wordmark-bone.png",
  "img/envelope.jpg",
  "img/og.jpg",
  "img/icon.png",
  "img/apple-icon.png",
  "img/cursor-granola-32.png",
  "img/cursor-granola-64.png",
  "img/cursor-granola-hover-40.png",
  "img/cursor-granola-hover-80.png",
];

// The design tokens at the top of index.html (:root). These are the brand.
export const PROTECTED_TOKENS = [
  "--cream", "--paper", "--espresso", "--brown", "--taupe", "--kraft", "--muted",
  "--font-display", "--font-ui", "--font-note", "--ease-spring", "--ease-out", "--ease-io", "--seal",
];

// Signature features. Each marker must still exist in index.html.
export const SIGNATURE_FEATURES = {
  'id="intro"': "the “Open This” envelope intro",
  'id="seal"': "the FRANKIES seal you tap to open the envelope",
  'id="tabs"': "the occasion tabs that change the colour of the page",
  'id="studioForm"': "the card studio (pick a design, write a message)",
  'id="sheet"': "the tear-off notepad of first lines",
  'id="miniPreview"': "the live card preview while typing on phones",
  'id="checkout"': "the “Send order on WhatsApp” button in the bag",
  "function composeMessage": "the WhatsApp order message",
  "function tuckIntoBag": "the card tucking into an envelope when added to the bag",
  "cursor-granola-32.png": "the granola mouse cursor",
  "prefers-reduced-motion": "the reduced-motion setting (accessibility)",
  'class="skip"': "the “Skip to the card studio” link (accessibility)",
};

export const WHATSAPP_NUMBER = "18768868573";

function styleOf(html) {
  return (html.match(/<style>([\s\S]*?)<\/style>/) || [, ""])[1];
}
function scriptOf(html) {
  const all = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  return all.join("\n");
}
function tokensOf(css) {
  const root = (css.match(/:root\s*{([\s\S]*?)\n}/) || [, ""])[1];
  const out = {};
  for (const m of root.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) out[m[1]] = m[2].trim().replace(/\s+/g, " ");
  return out;
}
const normHex = (h) => {
  h = h.toLowerCase();
  return h.length === 4 ? "#" + [...h.slice(1)].map((c) => c + c).join("") : h;
};
function linesOf(text) {
  return [...new Set(text.split("\n").map((l) => l.trim()).filter((l) => l.length > 3))];
}
function dirSize(p) {
  let total = 0, largest = { file: null, bytes: 0 };
  const walk = (d) => {
    for (const f of readdirSync(join(ROOT, d))) {
      const rel = join(d, f), st = statSync(join(ROOT, rel));
      if (st.isDirectory()) walk(rel);
      else {
        total += st.size;
        if (st.size > largest.bytes) largest = { file: rel, bytes: st.size };
      }
    }
  };
  walk(p);
  return { total, largest };
}

export function fingerprint() {
  const html = read("index.html");
  const css = styleOf(html), js = scriptOf(html);
  const moods = {};
  const moodBlock = (js.match(/const MOODS = \[([\s\S]*?)\n  \];/) || [, ""])[1];
  for (const m of moodBlock.matchAll(/id: '([^']+)'[^\n]*?bg: '(#[0-9A-Fa-f]{6})', fg: '(#[0-9A-Fa-f]{6})'/g)) moods[m[1]] = { bg: m[2].toUpperCase(), fg: m[3].toUpperCase() };
  return {
    sections: [...html.matchAll(/<section[^>]*\sid="([^"]+)"/g)].map((m) => m[1]),
    tokens: tokensOf(css),
    fonts: (html.match(/fonts\.googleapis\.com\/css2\?([^"]+)"/) || [, ""])[1].replace(/&amp;/g, "&"),
    moods,
    palette: [...new Set((css.match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g) || []).map(normHex))].sort(),
    styleLines: linesOf(css).length,
    scriptLines: linesOf(js).length,
    styleHashes: linesOf(css).map((l) => createHash("md5").update(l).digest("hex").slice(0, 10)),
    scriptHashes: linesOf(js).map((l) => createHash("md5").update(l).digest("hex").slice(0, 10)),
    assets: Object.fromEntries(PROTECTED_ASSETS.filter((p) => existsSync(join(ROOT, p))).map((p) => [p, sha(p)])),
    indexBytes: statSync(join(ROOT, "index.html")).size,
    imgBytes: dirSize("img").total,
  };
}

// Returns { blocks: [], warns: [], notes: [] } — each item is a plain-English message.
export function compare(base, now) {
  const blocks = [], warns = [], notes = [];
  const html = read("index.html");

  // 1. Page structure
  if (JSON.stringify(base.sections) !== JSON.stringify(now.sections)) {
    const removed = base.sections.filter((s) => !now.sections.includes(s));
    const added = now.sections.filter((s) => !base.sections.includes(s));
    if (removed.length) blocks.push(`A main section of the page was removed: ${removed.join(", ")}. The page's structure is part of the approved design.`);
    else if (added.length) warns.push(`A new section was added to the page: ${added.join(", ")}. New sections change the flow of the site; make sure it matches the existing look.`);
    else blocks.push(`The main sections of the page were reordered (now: ${now.sections.join(" → ")}; approved: ${base.sections.join(" → ")}).`);
  }

  // 2. Brand tokens (colours, fonts, motion curves)
  for (const t of PROTECTED_TOKENS) {
    if (base.tokens[t] !== now.tokens[t]) blocks.push(`The brand setting ${t} changed from “${base.tokens[t] ?? "(missing)"}” to “${now.tokens[t] ?? "(removed)"}”. This changes the FRANKIES look everywhere on the site.`);
  }
  if (base.fonts !== now.fonts) blocks.push("The website fonts changed. FRANKIES uses Bricolage Grotesque, Instrument Sans and Newsreader; changing them changes the whole personality of the site.");

  // 3. Occasion colours
  for (const [id, c] of Object.entries(base.moods)) {
    const n = now.moods[id];
    if (!n) warns.push(`The “${id}” occasion was removed or renamed.`);
    else if (n.bg !== c.bg || n.fg !== c.fg) warns.push(`The colour of the “${id}” occasion changed (${c.bg} → ${n.bg}). Occasion colours were tuned together so they feel like one family.`);
  }
  for (const id of Object.keys(now.moods)) if (!base.moods[id]) notes.push(`New occasion added: “${id}”. Check that its colour sits comfortably next to the others.`);

  // 4. New colours creeping into the stylesheet
  const newHex = now.palette.filter((h) => !base.palette.includes(h));
  if (newHex.length) warns.push(`New colours were added to the design: ${newHex.join(", ")}. FRANKIES uses a small, deliberate palette; prefer the existing brand colours.`);

  // 5. Amount of design code changed
  const styleGone = base.styleHashes.filter((h) => !now.styleHashes.includes(h)).length / Math.max(1, base.styleHashes.length);
  const scriptGone = base.scriptHashes.filter((h) => !now.scriptHashes.includes(h)).length / Math.max(1, base.scriptHashes.length);
  const pct = (x) => `${Math.round(x * 100)}%`;
  if (styleGone > 0.25) blocks.push(`About ${pct(styleGone)} of the design styles were rewritten. That is a redesign, not an enhancement.`);
  else if (styleGone > 0.06) warns.push(`About ${pct(styleGone)} of the design styles changed. Small tweaks are fine; this is starting to drift from the approved look.`);
  if (scriptGone > 0.25) blocks.push(`About ${pct(scriptGone)} of the site's interactive code was rewritten. The animations and ordering flow are part of the approved experience.`);
  else if (scriptGone > 0.08) warns.push(`About ${pct(scriptGone)} of the site's interactive code changed. Check the envelope, card studio, bag and WhatsApp order still work exactly as before.`);

  // 6. Signature features must still exist
  for (const [marker, what] of Object.entries(SIGNATURE_FEATURES)) {
    if (!html.includes(marker)) blocks.push(`A signature feature is missing: ${what}.`);
  }

  // 7. Ordering always goes to Kendall's WhatsApp
  const numbers = new Set([...html.matchAll(/wa\.me\/(\d+)/g)].map((m) => m[1]));
  if (!numbers.has(WHATSAPP_NUMBER)) blocks.push(`The WhatsApp ordering link to +1 876-886-8573 is missing. Orders would no longer reach FRANKIES.`);
  for (const n of numbers) if (n !== WHATSAPP_NUMBER) blocks.push(`A different WhatsApp number (${n}) was added. All orders must go to +1 876-886-8573 unless Kendall changes her number on purpose.`);

  // 8. No outside code (trackers, page builders, chat widgets, frameworks)
  for (const f of ["index.html", "lab.html"]) {
    if (!existsSync(join(ROOT, f))) continue;
    const ext = [...read(f).matchAll(/<script[^>]*\ssrc=["']([^"']+)["']/g)].map((m) => m[1]);
    if (ext.length) blocks.push(`Outside code was added to ${f}: ${ext.join(", ")}. FRANKIES deliberately loads no third-party scripts (they slow the site and can break the design).`);
  }
  if (existsSync(join(ROOT, "package.json"))) warns.push("A package.json was added. FRANKIES is a no-build site on purpose; adding a framework or build step is a major change.");

  // 9. Broken images
  for (const f of ["index.html", "lab.html"]) {
    if (!existsSync(join(ROOT, f))) continue;
    for (const m of read(f).matchAll(/["'(\s]((?:img)\/[A-Za-z0-9_\-/.]+\.(?:jpg|jpeg|png|webp|svg|gif))/g)) {
      if (!existsSync(join(ROOT, m[1]))) blocks.push(`${f} points to an image that doesn't exist: ${m[1]} (it would show as broken).`);
    }
  }
  const designIds = [...((html.match(/const DESIGNS = {([\s\S]*?)\n  };/) || [, ""])[1]).matchAll(/'([a-z0-9-]+)':/g)].map((m) => m[1]);
  for (const id of designIds) if (!existsSync(join(ROOT, `img/cards/${id}.jpg`))) blocks.push(`The card design “${id}” has no image at img/cards/${id}.jpg.`);

  // 10. Brand asset files
  for (const [p, h] of Object.entries(base.assets)) {
    if (!existsSync(join(ROOT, p))) blocks.push(`A brand file was deleted: ${p}.`);
    else if (now.assets[p] !== h) warns.push(`A brand file was replaced: ${p}. Make sure Kendall chose the new version.`);
  }

  // 11. Weight (speed on phones)
  if (now.indexBytes > base.indexBytes * 2) blocks.push(`index.html more than doubled in size (${Math.round(base.indexBytes / 1024)} KB → ${Math.round(now.indexBytes / 1024)} KB). The site will feel slower on phones.`);
  else if (now.indexBytes > base.indexBytes * 1.35) warns.push(`index.html grew a lot (${Math.round(base.indexBytes / 1024)} KB → ${Math.round(now.indexBytes / 1024)} KB).`);
  const big = dirSize("img").largest;
  if (big.bytes > 1.2 * 1024 * 1024) warns.push(`A very large image was added (${big.file}, ${(big.bytes / 1048576).toFixed(1)} MB). Resize it to at most 2000px and save as JPG around 80% quality.`);
  if (now.imgBytes > base.imgBytes + 8 * 1024 * 1024) warns.push(`Images grew by more than 8 MB since the baseline. The site will load slower.`);

  // 12. Helpful notes
  if (/priceConfirmed:\s*true\s*\n/.test(html)) notes.push("The granola price is switched on (priceConfirmed: true). Only do this once Kendall has confirmed the price and pouch size.");

  return { blocks, warns, notes };
}
