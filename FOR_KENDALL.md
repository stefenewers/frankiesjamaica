# Kendall, start here

This is your FRANKIES website. It was designed carefully: the envelope you open, the colours that change with each occasion, the card studio, the granola cursor, the way orders go to your WhatsApp. **That design is saved as your official baseline.** You can keep improving the site with an AI assistant (Claude, ChatGPT/Codex, Cursor, Copilot or similar), and the site is set up to protect its look while you do.

## How the protection works

1. **Your AI assistant gets the rules automatically.** This folder contains a rulebook (`AGENTS.md`) that the main AI tools read on their own. It tells them what's safe to change, and to warn you before anything that would change your design.
2. **A design check runs on every change.** It compares your site with the approved baseline and explains differences in plain English:
   - **✓** all good.
   - **⚠️ CAUTION**: allowed, but it's moving away from your look. Make sure you actually want it.
   - **⛔ STOP**: this would break your brand, your ordering, or the site itself.
3. **A STOP can't go live.** Before your site updates, the same check runs on Vercel and GitHub. If it finds a STOP, the update is cancelled and **your live site stays exactly as it was**. You'll see a red ✗ on GitHub or a failed deploy on Vercel; nothing on your site breaks.

## What's safe to ask for (go ahead)

- Fix wording, typos, descriptions, headlines.
- Update contact details, stockists, opening hours.
- “Add this new card design to Birthdays” (send a straight-on photo of the card).
- “Turn on the granola price: J$____ for the ___ oz pouch.”
- “Swap this product photo for a better one of the same thing.”

## What will get a warning (be sure first)

New sections or pages, new occasions, different colours or fonts, changing the logo or envelope, new animations, removing features, “redesign/modernise/clean it up”, adding chat widgets, pop-ups or trackers, or moving the site to Shopify, Wix, WordPress and so on.

When you see **“⚠️ Heads up, Kendall — this would change your site's approved design”**, read it. Reply **“keep my design”** to go the safer way, or **“yes, change the design”** if you really want it.

## A good way to start every conversation with your AI assistant

Copy and paste this:

> I'm Kendall, the owner of the FRANKIES website. I'm not technical. Please read AGENTS.md first and follow it. Run the design check before and after any change, show me every warning, and explain things simply. Here's what I'd like: …

## If something looks wrong

- Ask your assistant: **“Undo the last change.”**
- Or: **“Restore my site to the FRANKIES baseline.”** (The original is saved as `baseline-v1`.)
- Or, in Vercel: open your project → **Deployments** → pick the last good one → **Instant Rollback**. One click, and the old version is live again.

## Things that need your answer

- **Granola price**: your stories say $2000. Which pouch size is that for? (It stays hidden until you confirm.)
- **Card designs**: which designs are current, and clean photos of each.
- **Four card photos marked “AI content” on Instagram** (collection grid, Grad 2026, Father's Day, Thinking of you) aren't shown on the site. Tell us if you'd like them used.
- **Domain**: when you're ready, the site can move to frankiesjamaica.com.
