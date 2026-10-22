// Lists what still needs Kendall's input in content/products.json.
// Run with: npm run content:check
import { existsSync, readFileSync } from "node:fs";

const data = JSON.parse(readFileSync(new URL("../content/products.json", import.meta.url), "utf8"));
const problems = [];
const todos = [];

const slugs = new Set();
for (const p of data.products) {
  if (slugs.has(p.slug)) problems.push(`Duplicate slug "${p.slug}"`);
  slugs.add(p.slug);
  if (!/^[a-z0-9-]+$/.test(p.slug)) problems.push(`"${p.slug}": slug should be lowercase-with-dashes`);
  if (!data.categories.some((c) => c.id === p.category)) problems.push(`"${p.slug}": unknown category "${p.category}"`);
  if (/todo/i.test(`${p.name} ${p.description}`)) problems.push(`"${p.slug}": still contains TODO text`);
  if (!p.images?.length) problems.push(`"${p.slug}": needs at least one image`);
  for (const img of p.images ?? []) {
    if (!existsSync(new URL(`../public${img}`, import.meta.url))) problems.push(`"${p.slug}": missing image ${img}`);
  }
  if (p.price === null && !p.variants.some((v) => v.price !== null)) todos.push(`"${p.name}": no price yet (shows "Enquire")`);
  const missing = Object.entries(p.details ?? {}).filter(([, v]) => v === null).map(([k]) => k);
  if (missing.length) todos.push(`"${p.name}": details not confirmed yet (${missing.join(", ")})`);
  if (!p.reviewed) todos.push(`"${p.name}": not reviewed by Kendall yet (set "reviewed": true)`);
}
for (const f of data.faq) if (!f.a) todos.push(`FAQ "${f.q}": no answer yet (hidden on the site)`);

if (todos.length) console.log(`To confirm with Kendall:\n  - ${todos.join("\n  - ")}\n`);
if (problems.length) {
  console.error(`Problems:\n  - ${problems.join("\n  - ")}`);
  process.exit(1);
}
console.log("products.json is valid ✓");
