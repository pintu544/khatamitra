export interface Customer {
  id: string
  name: string
  phone: string
  area: string
}

export interface Entry {
  id: string
  customerId: string
  type: 'credit' | 'payment'
  amount: number
  /** days ago from today (0 = today) — stored as offset so demo ages stay meaningful */
  daysAgo: number
  note: string
}

export interface LedgerState {
  shopName: string
  customers: Customer[]
  entries: Entry[]
}

export type RiskBand = 'Low' | 'Medium' | 'High'

export interface RiskResult {
  band: RiskBand
  score: number
  reasons: string[]
  oldestUnpaidDays: number
  balance: number
  totalCredit: number
  totalPaid: number
  repaidShare: number | null
}
