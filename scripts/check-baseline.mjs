#!/usr/bin/env node
// FRANKIES design guard. Run before and after every change:
//
//   node scripts/check-baseline.mjs
//
// It compares the site with the approved baseline (baseline/baseline.json) and explains,
// in plain English, anything that drifts from the FRANKIES look and experience.
//   STOP     – protected brand/design/ordering rule broken. Exit code 1. Vercel will not
//              deploy, so the live site stays as it was.
//   CAUTION  – allowed, but Kendall should knowingly agree to it.
//   NOTE     – just so you know.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, compare, fingerprint } from "./baseline-lib.mjs";

const ci = process.argv.includes("--ci");
const basePath = join(ROOT, "baseline/baseline.json");
if (!existsSync(basePath)) {
  console.error("No baseline found (baseline/baseline.json). Restore it from git — never delete it.");
  process.exit(1);
}
const base = JSON.parse(readFileSync(basePath, "utf8"));
const { blocks, warns, notes } = compare(base.fingerprint, fingerprint());

const line = "─".repeat(64);
console.log(`\n${line}\n FRANKIES design guard · baseline “${base.name}” (approved ${base.approvedAt.slice(0, 10)})\n${line}`);
if (!blocks.length && !warns.length) {
  console.log("\n ✓ Everything matches the approved FRANKIES design.");
} else {
  if (blocks.length) {
    console.log(`\n ⛔ STOP — ${blocks.length} change(s) break the approved FRANKIES design:\n`);
    blocks.forEach((m) => console.log(`   • ${m}`));
  }
  if (warns.length) {
    console.log(`\n ⚠️  CAUTION — ${warns.length} change(s) move away from the approved look:\n`);
    warns.forEach((m) => console.log(`   • ${m}`));
  }
}
if (notes.length) {
  console.log("\n ℹ️  Notes:\n");
  notes.forEach((m) => console.log(`   • ${m}`));
}
if (blocks.length) {
  console.log(`
 What to do:
   • To undo:  ask your AI assistant to “undo these changes and restore the FRANKIES baseline”.
   • To keep it on purpose (Kendall only), approve it as the new baseline:
       node scripts/approve-baseline.mjs "what changed and why"
   Until then${ci ? " this deploy is stopped and the live site stays as it was" : " the change cannot be committed or deployed"}.`);
} else if (warns.length) {
  console.log(`
 These cautions don't stop anything, but Kendall should agree to them knowingly.
 To make them part of the official look: node scripts/approve-baseline.mjs "reason"`);
}
console.log(`${line}\n`);
process.exit(blocks.length ? 1 : 0);
