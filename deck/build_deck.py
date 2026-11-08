#!/usr/bin/env python3
"""KhataMitra — BUiLDX submission deck. 10 slides, 16:9."""
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GREEN = RGBColor(0x14, 0x53, 0x2D)
GREEN_M = RGBColor(0x16, 0x65, 0x34)
PAPER = RGBColor(0xFA, 0xF6, 0xEF)
INK = RGBColor(0x1C, 0x23, 0x21)
STONE = RGBColor(0x57, 0x50, 0x44)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
SAND = RGBColor(0xEF, 0xE7, 0xD8)
RED = RGBColor(0xB9, 0x1C, 0x1C)
AMBER = RGBColor(0x92, 0x4C, 0x0E)

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]

def slide(bg=PAPER):
    s = prs.slides.add_slide(BLANK)
    r = s.shapes.add_shape(1, 0, 0, prs.slide_width, prs.slide_height)
    r.fill.solid(); r.fill.fore_color.rgb = bg; r.line.fill.background()
    r.shadow.inherit = False
    return s

def text(s, x, y, w, h, txt, size=20, bold=False, color=INK, align=PP_ALIGN.LEFT, spacing=1.12):
    box = s.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = box.text_frame; tf.word_wrap = True
    lines = txt.split('\n')
    for i, ln in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = ln; p.alignment = align; p.line_spacing = spacing
        for run in p.runs:
            run.font.size = Pt(size); run.font.bold = bold; run.font.color.rgb = color
            run.font.name = 'DejaVu Sans'
    return box

def bullets(s, x, y, w, h, items, size=19, color=INK, gap=10):
    box = s.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = box.text_frame; tf.word_wrap = True
    for i, (head, rest) in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.space_after = Pt(gap); p.line_spacing = 1.12
        r = p.add_run(); r.text = '•  ' + head
        r.font.size = Pt(size); r.font.bold = True; r.font.color.rgb = color; r.font.name = 'DejaVu Sans'
        if rest:
            r2 = p.add_run(); r2.text = rest
            r2.font.size = Pt(size); r2.font.bold = False; r2.font.color.rgb = color; r2.font.name = 'DejaVu Sans'
    return box

def heading(s, txt, sub=None):
    text(s, 0.7, 0.5, 12, 0.9, txt, size=32, bold=True, color=GREEN)
    if sub:
        text(s, 0.7, 1.28, 11.9, 0.6, sub, size=17, color=STONE)

# 1 — Title
s = slide(GREEN)
text(s, 0.9, 1.5, 11.5, 1.2, 'KhataMitra', size=66, bold=True, color=WHITE)
text(s, 0.9, 2.75, 11.5, 0.8, 'The paper udhaar notebook, replaced — a digital credit ledger for kirana shops.', size=24, color=RGBColor(0xDC, 0xFC, 0xE7))
text(s, 0.9, 4.3, 11.5, 1.6,
     'BUiLDX — BuildX 36 Hours Online Hackathon · Code-A-Nova\nTrack: FinTech & Digital Economy\nTeam Tech Bro — Pintu Kumar (solo)',
     size=20, color=WHITE, spacing=1.3)
text(s, 0.9, 6.5, 11.5, 0.5, 'Live app: buildx-khatamitra.vercel.app   ·   Code: github.com/pintu544/khatamitra', size=16, color=RGBColor(0xBB, 0xF7, 0xD0))

# 2 — Problem
s = slide()
heading(s, 'The problem: udhaar lives on paper', 'How small kirana shops give credit today — in a notebook')
bullets(s, 0.7, 2.2, 11.9, 4.6, [
    ('No running totals. ', 'The shopkeeper flips pages to guess who owes what — errors are common and disputes have no record to settle them.'),
    ('No overdue view. ', 'A 50-day-old debt looks the same as yesterday\u2019s. Nothing flags which money is stuck the longest.'),
    ('No systematic reminder. ', 'Follow-up depends on memory and awkward face-to-face asks, so recovery is late — or never happens.'),
    ('Real cost. ', 'For a thin-margin shop, unrecovered udhaar is working capital locked up — stock that cannot be re-bought.'),
], size=20)

# 3 — Solution
s = slide()
heading(s, 'The solution: KhataMitra', 'A focused ledger app — not another super-app')
bullets(s, 0.7, 2.2, 11.9, 4.6, [
    ('One khata per customer. ', 'Running balance and a full history of every credit and payment, with dates and notes.'),
    ('Dashboard that answers three questions. ', 'How much is outstanding? What came back this month? Who is overdue?'),
    ('Overdue + risk at a glance. ', 'Rule-based repayment-risk badges sort attention to the accounts that need it first.'),
    ('Reminder drafts, ready to copy. ', 'Polite or firm message drafts built from the real balance — the shopkeeper sends them himself.'),
    ('Local-first. ', 'No sign-up, no backend, works offline; data stays in the shopkeeper\u2019s browser.'),
], size=20)

# 4 — How it works
s = slide()
heading(s, 'How it works', 'A day with KhataMitra')
steps = [
    ('1. Sell on credit', 'Customer takes groceries now, pays later. Shopkeeper taps "+ Add credit", enters amount and a note like "atta, oil".'),
    ('2. Watch the khata', 'The balance updates instantly. The dashboard total, overdue count and top debtors stay current on their own.'),
    ('3. Record payment', 'When the customer pays — cash or UPI — one tap records it against the oldest credit first.'),
    ('4. Nudge, politely', 'For overdue accounts, KhataMitra drafts a reminder from the actual balance and age. Copy, paste into WhatsApp, send.'),
]
y = 2.1
for head, rest in steps:
    text(s, 0.7, y, 3.4, 0.6, head, size=20, bold=True, color=GREEN_M)
    text(s, 4.2, y, 8.4, 1.1, rest, size=18, color=INK)
    y += 1.22

# 5 — Screenshots
s = slide()
heading(s, 'The working app', 'Live and deployed — screenshots from the actual build (synthetic demo data)')
s.shapes.add_picture(os.path.join(ROOT, 'screenshots/01-dashboard.png'), Inches(0.5), Inches(2.0), width=Inches(6.1))
s.shapes.add_picture(os.path.join(ROOT, 'screenshots/03-reminder-draft.png'), Inches(8.6), Inches(2.0), height=Inches(4.9))
text(s, 0.5, 6.62, 6.1, 0.4, 'Dashboard — totals, top debtors, risk badges', size=13, color=STONE, align=PP_ALIGN.CENTER)
text(s, 8.3, 6.98, 4.6, 0.4, 'Customer khata + reminder draft', size=13, color=STONE, align=PP_ALIGN.CENTER)

# 6 — Key features
s = slide()
heading(s, 'Key features', 'Everything in the live demo, nothing vapourware')
bullets(s, 0.7, 2.2, 11.9, 4.6, [
    ('Dashboard: ', 'total outstanding, recovered in last 30 days, customers with balance, overdue accounts, top debtors.'),
    ('Customer list: ', 'search, filters (overdue only / risk band), balances sorted largest-first.'),
    ('Add credit & record payment: ', 'validated forms — amounts must be positive, payments cannot exceed the balance due.'),
    ('Add customer: ', 'name, phone, area — new khata in seconds.'),
    ('Persistence: ', 'localStorage — entries survive reload; one-click reset restores the demo seed.'),
    ('Responsive: ', 'works on the phone a shopkeeper already owns.'),
], size=20)

# 7 — Risk scoring (honest)
s = slide()
heading(s, 'Repayment-risk scoring — rule-based', 'No AI claims. Plain rules, shown to the user with reasons.')
bullets(s, 0.7, 2.2, 11.9, 4.2, [
    ('High: ', 'oldest unpaid credit over 30 days, OR under 40% repaid with a balance above \u20B91,000.'),
    ('Medium: ', 'oldest unpaid 15–30 days, OR 40–70% of total credit repaid.'),
    ('Low: ', 'recent credit and a good repayment history.'),
    ('Always explained: ', 'every badge in the app lists the exact reasons — the shopkeeper can judge for himself. It is a sorting aid, not a credit score and never shared with third parties.'),
], size=20)
text(s, 0.7, 6.15, 11.9, 0.6, 'Example from the demo: a customer 52 days overdue with 13% repaid scores High (95) — and the app says exactly why.', size=16, color=STONE)

# 8 — Architecture
s = slide()
heading(s, 'Architecture & tech stack', 'Deliberately small — a ledger does not need a server')
bullets(s, 0.7, 2.2, 11.9, 4.6, [
    ('Frontend only: ', 'React 19 + TypeScript + Vite + Tailwind CSS, deployed as a static site on Vercel.'),
    ('State: ', 'React context + reducer-style store, persisted to localStorage (versioned key, reset to seed).'),
    ('Scoring engine: ', 'one pure TypeScript function (FIFO payment allocation → oldest-unpaid age → published rules). Deterministic and testable.'),
    ('Reminder generator: ', 'template text filled from ledger facts only — balance and oldest-due age. Drafts only; nothing is auto-sent.'),
    ('Why no backend: ', 'a single shop\u2019s khata is private, offline-first data. Sync is a roadmap item, not a demo requirement.'),
], size=20)

# 9 — Impact + roadmap
s = slide()
heading(s, 'Impact & roadmap', 'Honest scope: a working prototype with synthetic data — no user or revenue claims')
bullets(s, 0.7, 2.2, 11.9, 4.6, [
    ('Who it serves: ', 'neighbourhood kirana shops that already give udhaar and lose track of it on paper.'),
    ('What changes for them: ', 'one clear outstanding total, overdue accounts surfaced early, and a low-awkwardness way to remind.'),
    ('Next, if validated with real shopkeepers: ', 'Hindi UI, UPI payment links inside reminders, printable monthly statements.'),
    ('Then: ', 'optional cloud backup and multi-device sync — only after a real pilot, with real feedback, before any claims are made.'),
], size=20)

# 10 — Links
s = slide(GREEN)
text(s, 0.9, 1.2, 11.5, 1.0, 'Try it, read it', size=44, bold=True, color=WHITE)
text(s, 0.9, 2.5, 11.5, 2.6,
     'Live app:  https://buildx-khatamitra.vercel.app\nGitHub:    https://github.com/pintu544/khatamitra\n\nThe live demo opens with fictional seed data — add a credit, record a payment,\nwatch the risk badge move.',
     size=21, color=WHITE, spacing=1.35)
text(s, 0.9, 5.9, 11.5, 0.9, 'KhataMitra · Team Tech Bro — Pintu Kumar\nBUiLDX (BuildX 36 Hours Online Hackathon), Code-A-Nova · FinTech & Digital Economy\nThank you.', size=17, color=RGBColor(0xBB, 0xF7, 0xD0), spacing=1.3)

out = os.path.join(ROOT, 'deck/KhataMitra-BUiLDX.pptx')
prs.save(out)
print('saved', out, 'slides:', len(prs.slides._sldIdLst))
