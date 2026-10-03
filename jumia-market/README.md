# AbujaMart — Two-Branch E-Commerce Platform

A working e-commerce marketplace (phones, tech gadgets, food, fashion, home
and beauty products) built with **Next.js 16 (App Router) + TypeScript +
Tailwind CSS v4**, styled with Framer Motion animations.

This is not one app pretending to have branches — it's **two independent
Next.js applications**, one per physical branch:

```
jumia-market/
  apps/
    wuse/    ← full Next.js app for the Wuse branch  (runs on :3000)
    garki/   ← full Next.js app for the Garki branch  (runs on :3001)
```

Each app has its own storefront, its own admin dashboard, and its own data
file (`data/store.json`) acting as that branch's live inventory database.
They are wired together over HTTP:

- When a product is **out of stock** at the branch you're browsing, the page
  calls that branch's own `/api/cross-branch/check` endpoint.
- That endpoint reaches out over HTTP to the **sister branch's** API
  (`/api/inventory/[slug]`) to ask if it has stock.
- If the sister branch has it, you're shown a form. Submitting it POSTs your
  contact details to the sister branch's `/api/inquiries` endpoint, where it
  shows up on **that branch's admin dashboard** for staff to call/WhatsApp
  you directly.
- If the sister branch is offline or unreachable, the UI degrades gracefully
  instead of crashing.

## Quick start

You need [Node.js 20+](https://nodejs.org) installed.

Open **two terminals** (one per branch):

```bash
# Terminal 1 — Wuse branch
cd apps/wuse
npm install
npm run dev          # http://localhost:3000

# Terminal 2 — Garki branch
cd apps/garki
npm install
npm run dev          # http://localhost:3001
```

Both need to be running at the same time for the cross-branch feature to
work — try adding an "iPhone 15 Pro" to cart on Wuse (out of stock there) and
you'll see it offer to check Garki, where it's in stock.

If you only run one branch, everything else (browsing, cart, checkout,
admin) still works fine — the cross-branch check just tells you it
couldn't reach the sister branch.

## Admin dashboard

- Wuse: `http://localhost:3000/admin` — password `wuse-admin-2026`
- Garki: `http://localhost:3001/admin` — password `garki-admin-2026`

(Change `ADMIN_PASSWORD` in each app's `.env.local` before using this for
anything real.)

From the dashboard you can see orders, update their status, view incoming
cross-branch inquiries from the sister branch's customers, and check live
inventory.

## Resetting demo data

Each branch reads/writes `data/store.json` as its database (orders placed
and stock purchased will change it over time). To reset a branch back to
the seeded starting catalog:

```bash
cd apps/wuse   # or apps/garki
npm run seed
```

## Tech notes

- **Data layer**: a JSON file (`data/store.json`) read/written with Node's
  `fs` module (`lib/db.ts`), seeded from a shared master catalog
  (`scripts/catalog.mjs`). No database server or native bindings required —
  it just works after `npm install`, including on Windows.
- **Cart**: Zustand, persisted to `localStorage`.
- **Validation**: Zod on every API route that accepts input.
- **Admin auth**: a simple signed cookie (see `lib/auth.ts`) — good enough
  for a demo/internal tool, not hardened for production use with real
  payment data.
- **Images**: product photos are placeholder images from picsum.photos
  (seeded per-product so they're stable), since this is a demo catalog.
- Deploying for real: set `NEXT_PUBLIC_BRANCH`, `BRANCH_PARTNER_URL` (the
  **public URL** of the other branch's deployment) and `ADMIN_PASSWORD` as
  environment variables on your host for each app.

## What's intentionally out of scope

This is a fully working demo/prototype, not a production payment system:
checkout is "pay on delivery" only (no card/Paystack/Flutterwave
integration), and admin auth is single-password rather than per-user
accounts. Both are straightforward to add on top of this foundation.
