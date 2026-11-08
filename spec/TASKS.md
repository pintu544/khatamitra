# KhataMitra — TASKS

Approval: waived as a waiting gate by Pintu's explicit "build and submit both" (9 Nov 2026); spec written first, then implementation in the same run.

## Slice 1 — Ledger core (demoable: dashboard + customers)
- [ ] Scaffold Vite React-TS + Tailwind; build passes. Done means `npm run build` exits 0.
- [ ] Seed data (fictional shop, 8 customers, ~40 entries) + store with localStorage persistence + reset.
- [ ] Scoring pure function with reasons; unit-sanity via build-time usage (no test framework — verified by manual cases in UI).
- [ ] Dashboard stats + customer list with balances, risk badges, search/filter.

## Slice 2 — Actions (demoable: full flow)
- [ ] Customer detail with entry history.
- [ ] Add credit / record payment forms with validation (amount > 0, required fields).
- [ ] Add customer form.
- [ ] Reminder draft generator (polite/firm, copy button).

## Slice 3 — Ship
- [ ] `npm run build` + `npm run typecheck` clean.
- [ ] Public GitHub repo pintu544/khatamitra with README.
- [ ] Vercel deploy via ~/workspace/bin/vc; live URL 200 + loads.
- [ ] ≥3 screenshots (dashboard, customer detail, reminder).
- [ ] Deck: 10-slide PPTX + PDF via python-pptx + LibreOffice; verify slide count + PDF renders.
- [ ] Pre-submission self-review in final report.
