#!/usr/bin/env node
// Records the site as it is now as the new approved FRANKIES baseline.
//
//   node scripts/approve-baseline.mjs "what changed and why"
//
// ONLY run this when Kendall has explicitly approved the change in her own words.
// AI assistants: never run this on your own initiative, and never to make a warning go away.
// Every approval is logged in baseline/APPROVED_CHANGES.md so the history stays visible.
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, compare, fingerprint } from "./baseline-lib.mjs";

const reason = process.argv.slice(2).filter((a) => !a.startsWith("--")).join(" ").trim();
if (reason.length < 8) {
  console.error('Please describe what changed and why, e.g.\n  node scripts/approve-baseline.mjs "Kendall approved a new Easter occasion colour"');
  process.exit(1);
}
const basePath = join(ROOT, "baseline/baseline.json");
const logPath = join(ROOT, "baseline/APPROVED_CHANGES.md");
const prev = existsSync(basePath) ? JSON.parse(readFileSync(basePath, "utf8")) : null;
const now = fingerprint();
const diff = prev ? compare(prev.fingerprint, now) : { blocks: [], warns: [], notes: [] };
const version = prev ? prev.version + 1 : 1;
const approvedAt = new Date().toISOString();

writeFileSync(basePath, JSON.stringify({
  name: `FRANKIES baseline v${version}`,
  version,
  approvedAt,
  reason,
  fingerprint: now,
}, null, 2) + "\n");

const changes = [...diff.blocks, ...diff.warns];
appendFileSync(logPath, `\n## v${version} — ${approvedAt.slice(0, 10)}\n\n**Reason:** ${reason}\n\n${changes.length ? changes.map((c) => `- ${c}`).join("\n") : "- No design-level differences from the previous baseline."}\n`);
console.log(`Approved as FRANKIES baseline v${version}. Logged in baseline/APPROVED_CHANGES.md.`);
