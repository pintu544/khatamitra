import { useMemo, useState } from 'react'
import { LedgerProvider, useLedger } from './lib/store'
import { assessRisk, customerEntries, dateLabel, inr } from './lib/scoring'
import { reminderDraft } from './lib/reminders'
import type { RiskBand } from './lib/types'

const bandStyle: Record<RiskBand, string> = {
  High: 'bg-red-100 text-red-800 border border-red-300',
  Medium: 'bg-amber-100 text-amber-900 border border-amber-300',
  Low: 'bg-green-100 text-green-800 border border-green-300',
}

function RiskBadge({ band, score }: { band: RiskBand; score: number }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${bandStyle[band]}`}>
      {band} risk · {score}
    </span>
  )
}

function Dashboard() {
  const { state, resetDemo } = useLedger()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'overdue' | RiskBand>('all')
  const [showAddCustomer, setShowAddCustomer] = useState(false)

  const rows = useMemo(
    () =>
      state.customers
        .map((c) => ({ customer: c, risk: assessRisk(state.entries, c.id) }))
        .sort((a, b) => b.risk.balance - a.risk.balance),
    [state],
  )

  const totalOutstanding = rows.reduce((s, r) => s + Math.max(0, r.risk.balance), 0)
  const recoveredThisMonth = state.entries
    .filter((e) => e.type === 'payment' && e.daysAgo <= 30)
    .reduce((s, e) => s + e.amount, 0)
  const withBalance = rows.filter((r) => r.risk.balance > 0).length
  const overdue = rows.filter((r) => r.risk.balance > 0 && r.risk.oldestUnpaidDays > 14)
  const topDebtors = rows.filter((r) => r.risk.balance > 0).slice(0, 3)

  const visible = rows.filter(({ customer, risk }) => {
    if (query && !customer.name.toLowerCase().includes(query.toLowerCase())) return false
    if (filter === 'overdue') return risk.balance > 0 && risk.oldestUnpaidDays > 14
    if (filter !== 'all') return risk.band === filter
    return true
  })

  const selected = rows.find((r) => r.customer.id === selectedId) ?? null

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="bg-leaf-dark text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">KhataMitra</h1>
            <p className="mt-1 text-sm text-green-100">
              Digital udhaar khata for {state.shopName} — balances, overdue tracking and reminder drafts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">Demo · Synthetic data</span>
            <button onClick={resetDemo} className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-leaf-dark hover:bg-green-50">
              Reset demo data
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Stats — ledger summary, not a hero template */}
        <section aria-label="Ledger summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: 'Total outstanding', value: inr(totalOutstanding), sub: 'across all customers' },
            { label: 'Recovered (last 30 days)', value: inr(recoveredThisMonth), sub: 'payments recorded' },
            { label: 'Customers with balance', value: String(withBalance), sub: `of ${state.customers.length} customers` },
            { label: 'Overdue accounts', value: String(overdue.length), sub: 'unpaid for more than 14 days' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white p-4 shadow-[0_2px_10px_rgba(28,35,33,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">{s.label}</p>
              <p className="tnum mt-1 text-2xl font-bold text-ink">{s.value}</p>
              <p className="mt-0.5 text-xs text-stone-500">{s.sub}</p>
            </div>
          ))}
        </section>

        {topDebtors.length > 0 && (
          <section aria-label="Top debtors" className="mt-4 rounded-xl bg-sand p-4">
            <h2 className="text-sm font-bold">Top debtors</h2>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
              {topDebtors.map(({ customer, risk }) => (
                <button key={customer.id} onClick={() => setSelectedId(customer.id)} className="underline decoration-leaf decoration-2 underline-offset-4 hover:text-leaf-dark">
                  {customer.name} — <span className="tnum font-semibold">{inr(risk.balance)}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_420px]">
          {/* Customer list */}
          <section aria-label="Customers">
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search customer…"
                aria-label="Search customer"
                className="min-w-[180px] flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                aria-label="Filter customers"
                className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
              >
                <option value="all">All customers</option>
                <option value="overdue">Overdue only</option>
                <option value="High">High risk</option>
                <option value="Medium">Medium risk</option>
                <option value="Low">Low risk</option>
              </select>
              <button onClick={() => setShowAddCustomer((v) => !v)} className="rounded-lg bg-leaf px-3 py-2 text-sm font-semibold text-white hover:bg-leaf-dark">
                + New customer
              </button>
            </div>

            {showAddCustomer && <AddCustomerForm onDone={(id) => { setShowAddCustomer(false); setSelectedId(id) }} />}

            <ul className="mt-3 divide-y divide-stone-200 rounded-xl bg-white shadow-[0_2px_10px_rgba(28,35,33,0.08)]">
              {visible.map(({ customer, risk }) => (
                <li key={customer.id}>
                  <button
                    onClick={() => setSelectedId(customer.id)}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-green-50 ${selectedId === customer.id ? 'bg-green-50' : ''}`}
                    aria-current={selectedId === customer.id}
                  >
                    <span>
                      <span className="block font-semibold">{customer.name}</span>
                      <span className="block text-xs text-stone-500">
                        {customer.area} · {risk.balance > 0 ? `oldest unpaid ${risk.oldestUnpaidDays}d (approx.)` : 'settled'}
                      </span>
                    </span>
                    <span className="flex items-center gap-3">
                      <RiskBadge band={risk.band} score={risk.score} />
                      <span className={`tnum text-lg font-bold ${risk.balance > 0 ? 'text-red-700' : 'text-leaf'}`}>
                        {risk.balance > 0 ? inr(risk.balance) : 'Clear'}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
              {visible.length === 0 && <li className="px-4 py-8 text-center text-sm text-stone-500">No customers match this search/filter.</li>}
            </ul>
            <p className="mt-3 text-xs text-stone-500">
              Risk badges use a <strong>rule-based score</strong> (days outstanding + repayment history). Not AI, not a credit score.
            </p>
          </section>

          {/* Detail */}
          <section aria-label="Customer detail">
            {selected ? (
              <CustomerDetail key={selected.customer.id} customerId={selected.customer.id} />
            ) : (
              <div className="rounded-xl bg-white p-6 text-sm text-stone-600 shadow-[0_2px_10px_rgba(28,35,33,0.08)]">
                <h2 className="text-base font-bold text-ink">Select a customer</h2>
                <p className="mt-2">Tap any customer to see the full khata — every credit and payment entry, the rule-based risk reasons, and a ready-to-copy reminder draft.</p>
              </div>
            )}
          </section>
        </div>

        <footer className="mt-10 border-t border-stone-300 pt-4 pb-6 text-xs text-stone-500">
          KhataMitra — built for BUiLDX (BuildX 36 Hours Online Hackathon), Code-A-Nova · Track: FinTech &amp; Digital Economy · Team Tech Bro.
          All customers, amounts and phone numbers on this page are fictional demo data stored only in your browser.
        </footer>
      </main>
    </div>
  )
}

function AddCustomerForm({ onDone }: { onDone: (id: string) => void }) {
  const { addCustomer } = useLedger()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [area, setArea] = useState('')
  const [err, setErr] = useState('')
  return (
    <form
      className="mt-3 rounded-xl bg-white p-4 shadow-[0_2px_10px_rgba(28,35,33,0.08)]"
      onSubmit={(e) => {
        e.preventDefault()
        if (!name.trim()) { setErr('Customer name is required.'); return }
        onDone(addCustomer(name.trim(), phone.trim() || '—', area.trim() || '—'))
      }}
    >
      <h3 className="text-sm font-bold">New customer</h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name *" aria-label="Customer name" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" aria-label="Phone" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
        <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Area / block" aria-label="Area" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
      </div>
      {err && <p className="mt-2 text-xs font-medium text-red-700">{err}</p>}
      <button className="mt-3 rounded-lg bg-leaf px-4 py-2 text-sm font-semibold text-white hover:bg-leaf-dark">Add customer</button>
    </form>
  )
}

function CustomerDetail({ customerId }: { customerId: string }) {
  const { state, addEntry } = useLedger()
  const customer = state.customers.find((c) => c.id === customerId)!
  const risk = assessRisk(state.entries, customerId)
  const history = customerEntries(state.entries, customerId).slice().reverse() // newest first for display
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [err, setErr] = useState('')
  const [copied, setCopied] = useState('')
  const [draftKind, setDraftKind] = useState<'polite' | 'firm'>('polite')

  const submit = (type: 'credit' | 'payment') => {
    const n = Number(amount)
    if (!Number.isFinite(n) || n <= 0) { setErr('Enter an amount greater than ₹0.'); return }
    if (type === 'payment' && n > risk.balance) { setErr(`Payment is more than the balance due (${inr(risk.balance)}).`); return }
    setErr('')
    addEntry(customerId, type, Math.round(n), note.trim())
    setAmount(''); setNote('')
  }

  const draft = reminderDraft(draftKind, state.shopName, customer.name, Math.max(0, risk.balance), risk.oldestUnpaidDays)

  return (
    <div className="rounded-xl bg-white p-5 shadow-[0_2px_10px_rgba(28,35,33,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">{customer.name}</h2>
          <p className="text-xs text-stone-500">{customer.phone} · {customer.area}</p>
        </div>
        <RiskBadge band={risk.band} score={risk.score} />
      </div>

      <p className="tnum mt-3 text-3xl font-bold text-ink">{risk.balance > 0 ? inr(risk.balance) : 'All clear'}</p>
      <p className="text-xs text-stone-500">
        Total credit {inr(risk.totalCredit)} · Paid {inr(risk.totalPaid)}
        {risk.repaidShare !== null && <> · {Math.round(risk.repaidShare * 100)}% repaid</>}
      </p>

      <div className="mt-3 rounded-lg bg-sand p-3">
        <p className="text-xs font-bold uppercase tracking-wide text-stone-600">Rule-based score — why</p>
        <ul className="mt-1 list-disc pl-4 text-xs leading-5 text-stone-700">
          {risk.reasons.map((r) => <li key={r}>{r}</li>)}
        </ul>
      </div>

      <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
        <h3 className="text-sm font-bold">Add entry</h3>
        <div className="mt-2 flex gap-2">
          <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min="1" placeholder="Amount ₹" aria-label="Amount in rupees" className="tnum w-28 rounded-lg border border-stone-300 px-3 py-2 text-sm" />
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (e.g. atta, oil)" aria-label="Note" className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm" />
        </div>
        {err && <p className="mt-2 text-xs font-medium text-red-700">{err}</p>}
        <div className="mt-2 flex gap-2">
          <button onClick={() => submit('credit')} className="flex-1 rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold text-white hover:bg-red-800">+ Add credit (udhaar)</button>
          <button onClick={() => submit('payment')} className="flex-1 rounded-lg bg-leaf px-3 py-2 text-sm font-semibold text-white hover:bg-leaf-dark">Record payment</button>
        </div>
      </form>

      {risk.balance > 0 && (
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Reminder draft</h3>
            <div className="flex gap-1" role="tablist" aria-label="Reminder tone">
              {(['polite', 'firm'] as const).map((k) => (
                <button key={k} onClick={() => setDraftKind(k)} className={`rounded-full px-3 py-1 text-xs font-semibold ${draftKind === k ? 'bg-leaf text-white' : 'bg-stone-200 text-stone-700'}`}>
                  {k === 'polite' ? 'Polite' : 'Firm'}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-2 rounded-lg border border-stone-200 bg-paper p-3 text-sm leading-6">{draft}</p>
          <button
            onClick={async () => { try { await navigator.clipboard.writeText(draft); setCopied('Copied — paste it into WhatsApp/SMS yourself.') } catch { setCopied('Copy failed — select the text and copy manually.') } }}
            className="mt-2 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800"
          >
            Copy reminder
          </button>
          {copied && <p className="mt-2 text-xs font-medium text-leaf-dark">{copied}</p>}
          <p className="mt-1 text-xs text-stone-500">Draft only — KhataMitra never sends messages itself.</p>
        </div>
      )}

      <h3 className="mt-5 text-sm font-bold">Khata history</h3>
      <ul className="mt-2 divide-y divide-stone-100">
        {history.map((e) => (
          <li key={e.id} className="flex items-center justify-between py-2 text-sm">
            <span>
              <span className={`font-semibold ${e.type === 'credit' ? 'text-red-700' : 'text-leaf'}`}>{e.type === 'credit' ? 'Credit' : 'Payment'}</span>
              <span className="text-stone-600"> · {e.note}</span>
              <span className="block text-xs text-stone-500">{dateLabel(e.daysAgo)}</span>
            </span>
            <span className="tnum font-semibold">{e.type === 'credit' ? '+' : '−'}{inr(e.amount)}</span>
          </li>
        ))}
        {history.length === 0 && <li className="py-3 text-sm text-stone-500">No entries yet. Add the first credit above.</li>}
      </ul>
    </div>
  )
}

export default function App() {
  return (
    <LedgerProvider>
      <Dashboard />
    </LedgerProvider>
  )
}
