# KhataMitra — SPEC

**Event:** BUiLDX (BuildX 36 Hours Online Hackathon), Code-A-Nova, Unstop
**Track:** FinTech & Digital Economy
**Team:** Tech Bro (solo) — Pintu Kumar
**Deadline:** Submission closes 10 Nov 2026, 12:43 AM IST. Submission = one track + one PDF/PPTX deck. No template.

## Problem
Small kirana shopkeepers in India give informal credit (udhaar) tracked in paper notebooks. There are no running totals, no overdue view, and no systematic reminder — so money is recovered late, disputed, or never recovered. Existing digital khata apps exist, but a focused, offline-first ledger with a clear overdue/risk view is the core need this prototype demonstrates.

## Users
- Kirana shopkeeper (primary): records credit and payments, checks who owes what, sends reminders.
- Shop customer: not a direct user in this prototype; receives a reminder message drafted by the shopkeeper.

## Functional requirements
1. The system SHALL show a dashboard with total outstanding, amount recovered in the current month, number of customers with a balance, and number of overdue accounts.
2. The system SHALL list customers with current balance, oldest unpaid age, and a rule-based repayment-risk badge (Low / Medium / High).
3. The system SHALL show a customer detail view with a chronological entry history (credit and payment entries with dates and notes).
4. The system SHALL allow adding a credit entry and recording a payment entry for a customer, updating the balance immediately.
5. The system SHALL allow adding a new customer (name, phone, area).
6. The system SHALL generate a copy-ready reminder message draft for a customer, in polite and firm variants, using only that customer's real balance and oldest-due age from the ledger.
7. The system SHALL support search by customer name and filtering by risk / overdue status.
8. The system SHALL persist all entries in browser localStorage and survive a page reload.
9. The system SHALL seed with clearly labelled synthetic demo data (fictional shop and customers) on first load, with a one-click reset to the seed.

## Repayment-risk scoring (honest, rule-based)
Score is deterministic rules, NOT machine learning and NOT AI:
- Base on days since oldest unpaid credit and on payment behaviour (share of credit repaid, count of payments in last 60 days, number of overdue entries).
- High: oldest unpaid > 30 days OR repaid share < 40% with balance > ₹1,000.
- Medium: oldest unpaid 15–30 days OR repaid share 40–70%.
- Low: otherwise.
The UI SHALL label this "Rule-based score" everywhere it appears.

## Non-functional
- No backend, no account, no network calls for core flows; works offline after load.
- Build: Vite production build, typecheck clean.
- All demo numbers are synthetic and labelled as such in the app and deck.

## Out of scope
- Real WhatsApp/SMS sending (drafts only, shopkeeper copies and sends himself).
- Real payments / UPI collection, KYC, lending, interest calculation.
- Multi-shop, staff roles, cloud sync, real customer data.
- Any AI/ML claim for scoring.

## Judging fit (deck-only judging, open theme)
- Problem clarity: a daily, concrete pain for millions of small shops.
- Working product: live deployed app + public repo, not just slides.
- Honesty: synthetic data labelled, scoring described as rules, no invented users or revenue.
