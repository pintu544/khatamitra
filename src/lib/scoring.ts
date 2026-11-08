import type { Entry, RiskResult } from './types'

/**
 * Deterministic, rule-based repayment-risk scoring.
 * NOT machine learning, NOT AI — plain published rules (see SPEC.md):
 *  High:   oldest unpaid > 30 days, OR repaid share < 40% with balance > ₹1,000
 *  Medium: oldest unpaid 15–30 days, OR repaid share 40–70%
 *  Low:    otherwise
 */
export function customerEntries(entries: Entry[], customerId: string): Entry[] {
  return entries
    .filter((e) => e.customerId === customerId)
    .slice()
    .sort((a, b) => b.daysAgo - a.daysAgo) // oldest first
}

export function assessRisk(entries: Entry[], customerId: string): RiskResult {
  const list = customerEntries(entries, customerId)
  const totalCredit = list.filter((e) => e.type === 'credit').reduce((s, e) => s + e.amount, 0)
  const totalPaid = list.filter((e) => e.type === 'payment').reduce((s, e) => s + e.amount, 0)
  const balance = totalCredit - totalPaid
  const repaidShare = totalCredit > 0 ? totalPaid / totalCredit : null

  // FIFO: payments clear the oldest credit first; age = daysAgo of earliest uncleared credit.
  let remainingPayments = totalPaid
  let oldestUnpaidDays = 0
  for (const e of list) {
    if (e.type !== 'credit') continue
    if (remainingPayments >= e.amount) {
      remainingPayments -= e.amount
    } else {
      oldestUnpaidDays = e.daysAgo
      break
    }
  }
  if (balance <= 0) oldestUnpaidDays = 0

  const reasons: string[] = []
  let band: RiskResult['band'] = 'Low'
  let score = 15

  if (balance <= 0) {
    reasons.push('No outstanding balance')
    score = 5
  } else {
    if (oldestUnpaidDays > 30) {
      band = 'High'
      score += 55
      reasons.push(`Oldest unpaid credit is ${oldestUnpaidDays} days old`)
    } else if (oldestUnpaidDays >= 15) {
      band = 'Medium'
      score += 30
      reasons.push(`Oldest unpaid credit is ${oldestUnpaidDays} days old`)
    } else {
      reasons.push(`Oldest unpaid credit is ${oldestUnpaidDays} day(s) old`)
      score += oldestUnpaidDays
    }
    if (repaidShare !== null) {
      const pct = Math.round(repaidShare * 100)
      if (repaidShare < 0.4 && balance > 1000) {
        band = 'High'
        score += 25
        reasons.push(`Only ${pct}% of total credit repaid, balance above ₹1,000`)
      } else if (repaidShare >= 0.4 && repaidShare <= 0.7) {
        if (band === 'Low') band = 'Medium'
        score += 12
        reasons.push(`${pct}% of total credit repaid so far`)
      } else if (repaidShare > 0.7) {
        reasons.push(`${pct}% of total credit repaid — good history`)
      } else {
        reasons.push(`Only ${pct}% of total credit repaid so far`)
        score += 8
      }
    }
  }

  return {
    band,
    score: Math.min(98, score),
    reasons,
    oldestUnpaidDays,
    balance,
    totalCredit,
    totalPaid,
    repaidShare,
  }
}

export const inr = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

export function dateLabel(daysAgo: number): string {
  if (daysAgo === 0) return 'Today'
  if (daysAgo === 1) return 'Yesterday'
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ` (${daysAgo}d ago)`
}
