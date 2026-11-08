# KhataMitra — TASKS

Approval: waived as a waiting gate by Pintu's explicit "build and submit both" (9 Nov 2026); spec written first, then implementation in the same run.

## Slice 1 — Ledger core (demoable: dashboard + customers)
- [x] Scaffold Vite React-TS + Tailwind; build passes. Done means `npm run build` exits 0.
- [x] Seed data (fictional shop, 8 customers, ~40 entries) + store with localStorage persistence + reset.
- [x] Scoring pure function with reasons; unit-sanity via build-time usage (no test framework — verified by manual cases in UI).
- [x] Dashboard stats + customer list with balances, risk badges, search/filter.

## Slice 2 — Actions (demoable: full flow)
- [x] Customer detail with entry history.
- [x] Add credit / record payment forms with validation (amount > 0, required fields).
- [x] Add customer form.
- [x] Reminder draft generator (polite/firm, copy button).

## Slice 3 — Ship
- [x] `npm run build` + `npm run typecheck` clean.
- [x] Public GitHub repo pintu544/khatamitra with README.
- [x] Vercel deploy via ~/workspace/bin/vc; live URL 200 + loads.
- [x] ≥3 screenshots (dashboard, customer detail, reminder).
- [x] Deck: 10-slide PPTX + PDF via python-pptx + LibreOffice; verify slide count + PDF renders.
- [x] Pre-submission self-review in final report.
