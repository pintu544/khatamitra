import type { LedgerState } from '../lib/types'

/**
 * SYNTHETIC DEMO DATA — fictional shop and fictional customers.
 * No real people, no real phone numbers (all 98XXX numbers are invented for demo).
 * Dates are stored as daysAgo offsets so overdue ages are stable whenever the demo is opened.
 */
export const seedState: LedgerState = {
  shopName: 'Sharma Kirana Store (Demo)',
  customers: [
    { id: 'c1', name: 'Ramesh Gupta', phone: '98110 00001', area: 'Block A' },
    { id: 'c2', name: 'Sunita Devi', phone: '98110 00002', area: 'Block B' },
    { id: 'c3', name: 'Mohd. Salim', phone: '98110 00003', area: 'Main Road' },
    { id: 'c4', name: 'Priya Nair', phone: '98110 00004', area: 'Block A' },
    { id: 'c5', name: 'Amit Verma', phone: '98110 00005', area: 'Block C' },
    { id: 'c6', name: 'Kavita Singh', phone: '98110 00006', area: 'Main Road' },
    { id: 'c7', name: 'Deepak Yadav', phone: '98110 00007', area: 'Block B' },
    { id: 'c8', name: 'Farah Khan', phone: '98110 00008', area: 'Block C' },
  ],
  entries: [
    // Ramesh — old, largely unpaid -> High risk
    { id: 'e1', customerId: 'c1', type: 'credit', amount: 2400, daysAgo: 52, note: 'Monthly ration' },
    { id: 'e2', customerId: 'c1', type: 'credit', amount: 850, daysAgo: 38, note: 'Oil, atta, sugar' },
    { id: 'e3', customerId: 'c1', type: 'payment', amount: 500, daysAgo: 30, note: 'Cash' },
    { id: 'e4', customerId: 'c1', type: 'credit', amount: 620, daysAgo: 12, note: 'Vegetables, milk' },
    // Sunita — pays regularly -> Low
    { id: 'e5', customerId: 'c2', type: 'credit', amount: 1100, daysAgo: 20, note: 'Groceries' },
    { id: 'e6', customerId: 'c2', type: 'payment', amount: 1100, daysAgo: 14, note: 'UPI' },
    { id: 'e7', customerId: 'c2', type: 'credit', amount: 430, daysAgo: 3, note: 'Milk, bread, eggs' },
    // Salim — medium: 24 days oldest, partial payment
    { id: 'e8', customerId: 'c3', type: 'credit', amount: 1750, daysAgo: 24, note: 'Ration + toiletries' },
    { id: 'e9', customerId: 'c3', type: 'payment', amount: 750, daysAgo: 10, note: 'Cash' },
    { id: 'e10', customerId: 'c3', type: 'credit', amount: 300, daysAgo: 5, note: 'Tea, snacks' },
    // Priya — fully settled -> balance 0
    { id: 'e11', customerId: 'c4', type: 'credit', amount: 960, daysAgo: 28, note: 'Groceries' },
    { id: 'e12', customerId: 'c4', type: 'payment', amount: 960, daysAgo: 21, note: 'UPI' },
    // Amit — high: 45 days, nothing paid
    { id: 'e13', customerId: 'c5', type: 'credit', amount: 3200, daysAgo: 45, note: 'Festival shopping' },
    { id: 'e14', customerId: 'c5', type: 'credit', amount: 540, daysAgo: 18, note: 'Groceries' },
    // Kavita — low/medium boundary: recent, mostly paid
    { id: 'e15', customerId: 'c6', type: 'credit', amount: 780, daysAgo: 9, note: 'Groceries' },
    { id: 'e16', customerId: 'c6', type: 'payment', amount: 500, daysAgo: 4, note: 'Cash' },
    // Deepak — medium: 19 days
    { id: 'e17', customerId: 'c7', type: 'credit', amount: 1250, daysAgo: 19, note: 'Ration' },
    { id: 'e18', customerId: 'c7', type: 'payment', amount: 400, daysAgo: 6, note: 'UPI' },
    { id: 'e19', customerId: 'c7', type: 'credit', amount: 210, daysAgo: 1, note: 'Cold drink, snacks' },
    // Farah — fresh credit today -> Low
    { id: 'e20', customerId: 'c8', type: 'credit', amount: 350, daysAgo: 0, note: 'Milk, curd, bread' },
    // This-month recoveries (payments with daysAgo <= 30 count toward "recovered this month" demo stat via entries list)
    { id: 'e21', customerId: 'c2', type: 'credit', amount: 600, daysAgo: 33, note: 'Groceries' },
    { id: 'e22', customerId: 'c2', type: 'payment', amount: 600, daysAgo: 26, note: 'UPI' },
  ],
}
