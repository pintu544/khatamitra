import { inr } from './scoring'

/** Reminder drafts — text only. The shopkeeper copies and sends it himself; nothing is auto-sent. */
export function reminderDraft(
  kind: 'polite' | 'firm',
  shopName: string,
  customerName: string,
  balance: number,
  oldestDays: number,
): string {
  const first = customerName.split(' ')[0]
  if (kind === 'polite') {
    return (
      `Namaste ${first} ji, Sharma Kirana Store se. Aapke khate mein ${inr(balance)} baaki hai` +
      (oldestDays > 0 ? ` (sabse purana udhaar ${oldestDays} din pehle ka hai)` : '') +
      `. Jab samay mile, kripya bhugtan kar dein. Dhanyavaad! — ${shopName}`
    )
  }
  return (
    `Namaste ${first} ji, aapka ${inr(balance)} udhaar ${oldestDays} din se baaki hai. ` +
    `Kripya kal tak bhugtan kar dein, taaki aage udhaar jaari rakh sakein. — ${shopName}`
  )
}
