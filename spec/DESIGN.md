# KhataMitra — DESIGN

## Stack decisions
- React + Vite + TypeScript + Tailwind CSS v3: Pintu's core stack, fast build, deployable as a static site on Vercel. Rejected Next.js (no SSR/SEO need for a local-first tool demo).
- State: React context + useReducer, persisted to localStorage under key `khatamitra-v1`. No backend (per SPEC out-of-scope).
- Layout: app code in repo root (`src/`), spec in `spec/`, deck in `deck/`, screenshots in `screenshots/`.

## Architecture (in words)
Single-page app. `src/data/seed.ts` holds fictional seed customers/entries with stable IDs and dates relative to a fixed reference ("today" at runtime, entries offset by days so overdue logic is meaningful). `src/lib/store.tsx` provides LedgerProvider (load seed or localStorage, dispatch add-credit / add-payment / add-customer / reset). `src/lib/scoring.ts` is a pure function: customer + entries + today → { band, score, reasons[] }. `src/lib/reminders.ts` builds polite/firm reminder text from ledger facts. Views in `src/App.tsx`: Dashboard header stats, customer list (search + filter), customer detail panel, add-entry forms, reminder generator modal/section. Currency formatting via Intl.NumberFormat('en-IN').

## Data model
- Customer { id, name, phone, area, createdAt }
- Entry { id, customerId, type: 'credit'|'payment', amount (₹, positive int), date (ISO), note }
- Balance = Σcredit − Σpayments. Oldest unpaid age approximated FIFO: walk entries chronologically, payments clear oldest credit first; age = days since earliest uncleared credit. If balance = 0, age = 0.

## Design direction (Impeccable, Operate mode)
Shopkeeper tool used in bright shop light, often one-handed: light warm paper-like background, deep green primary (ledger/trust), amber for medium risk, red for high/overdue, large tabular numerals, clear Hindi-flavoured English labels (Udhaar, Khata). No gradients-as-decoration, no glass, cards only for customer rows/detail. Focus rings, ≥4.5:1 body contrast.

## Risks
1. localStorage seed staleness → versioned key + Reset demo data button.
2. FIFO age approximation misread as exact accounting → labelled "oldest unpaid (approx.)" in UI.
3. Deck-only judging → screenshots in deck must carry the story without the live link being opened.
