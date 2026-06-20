export const SEGMENTS = {
  price:  { label: 'Price-Sensitive', short: 'Price-Sens.', color: '#6B5FFF' },
  power:  { label: 'Power Users',     short: 'Power',       color: '#00D4B4' },
  atrisk: { label: 'At-Risk',         short: 'At-Risk',     color: '#FF5C6C' },
  casual: { label: 'Casual',          short: 'Casual',      color: '#FFB84D' },
  newish: { label: 'New / Trial',     short: 'New',         color: '#4D8CFF' },
}

export const SEG_KEYS = Object.keys(SEGMENTS)

export const TARGET_OPTIONS = [
  { id: 'all',    label: 'All Users' },
  { id: 'price',  label: 'Price-Sensitive' },
  { id: 'power',  label: 'Power Users' },
  { id: 'atrisk', label: 'At-Risk' },
  { id: 'casual', label: 'Casual' },
]

export const PREVIEW_PERSONAS = [
  { name: 'Maya Rodriguez', initials: 'MR', seg: 'atrisk', price: 8, eng: 'Low',    risk: 78 },
  { name: 'James Tan',      initials: 'JT', seg: 'price',  price: 9, eng: 'Medium', risk: 64 },
  { name: 'Priya Kapoor',   initials: 'PK', seg: 'power',  price: 3, eng: 'High',   risk: 21 },
]

export const FEED_TEMPLATES = [
  { name: 'Maya R.',   seg: 'At-risk',         action: 'Accepted 30% discount offer',      out: 'Retained',  icon: '✓', kind: 'ret' },
  { name: 'James T.',  seg: 'Price-sensitive', action: 'Ignored message variant B',         out: 'Churned',   icon: '✗', kind: 'chu' },
  { name: 'Priya K.',  seg: 'Power user',      action: 'Upgraded to annual plan',           out: 'Converted', icon: '↑', kind: 'con' },
  { name: 'Devon W.',  seg: 'At-risk',         action: 'Opened variant A, stayed',          out: 'Retained',  icon: '✓', kind: 'ret' },
  { name: 'Sofia L.',  seg: 'Casual',          action: 'No response to re-engagement',      out: 'Churned',   icon: '✗', kind: 'chu' },
  { name: 'Marcus B.', seg: 'Power user',      action: 'Took annual upsell + discount',     out: 'Converted', icon: '↑', kind: 'con' },
  { name: 'Aisha N.',  seg: 'Price-sensitive', action: 'Accepted 20% loyalty credit',       out: 'Retained',  icon: '✓', kind: 'ret' },
  { name: 'Leo F.',    seg: 'Casual',          action: 'Found competitor offer',            out: 'Churned',   icon: '✗', kind: 'chu' },
  { name: 'Hana K.',   seg: 'At-risk',         action: 'Re-engaged via variant C',          out: 'Retained',  icon: '✓', kind: 'ret' },
  { name: 'Owen P.',   seg: 'Power user',      action: 'Expanded seats on annual',          out: 'Converted', icon: '↑', kind: 'con' },
]

export const STRATEGIES = [
  { msg: 'Variant B', offer: '25%', seg: 'At-Risk',         ret: 82.4, red: 34.1, best: true  },
  { msg: 'Variant B', offer: '30%', seg: 'Price-Sensitive', ret: 79.1, red: 29.8, best: false },
  { msg: 'Variant C', offer: '15%', seg: 'Power Users',     ret: 74.6, red: 21.2, best: false },
  { msg: 'Variant A', offer: '20%', seg: 'Casual',          ret: 68.3, red: 17.9, best: false },
  { msg: 'Variant B', offer: '10%', seg: 'All Users',       ret: 64.0, red: 13.4, best: false },
  { msg: 'Variant A', offer: '0%',  seg: 'At-Risk',         ret: 51.2, red: 4.6,  best: false },
]

export const TRIGGERS = [
  { name: 'Price too high after trial',   pct: 38, color: '#FF5C6C' },
  { name: 'No perceived feature value',   pct: 24, color: '#FF8A4D' },
  { name: 'Competitor offer',             pct: 19, color: '#FFB84D' },
  { name: 'Poor onboarding completion',   pct: 12, color: '#6B5FFF' },
  { name: 'Support frustration',          pct: 7,  color: '#4D8CFF' },
]

export const SEG_RESPONSE = [
  { seg: 'Price-Sens.', ret: 62, chu: 18, con: 20 },
  { seg: 'Power',       ret: 48, chu: 9,  con: 43 },
  { seg: 'At-Risk',     ret: 71, chu: 21, con: 8  },
  { seg: 'Casual',      ret: 58, chu: 27, con: 15 },
]

export const INSIGHTS = [
  {
    name: 'Maya Rodriguez', initials: 'MR', seg: 'atrisk', color: '#FF5C6C',
    outcome: 'Retained', kind: 'ret',
    why: 'Had logged a downgrade intent twice; the 25% annual discount removed her primary cost objection.',
    msg: 'Variant B — "Your workflow, locked in for less"',
  },
  {
    name: 'James Tan', initials: 'JT', seg: 'price', color: '#6B5FFF',
    outcome: 'Churned', kind: 'chu',
    why: 'Even at 30% off, perceived the tool as redundant with a free alternative he already used.',
    msg: 'Variant B — ignored after open',
  },
  {
    name: 'Priya Kapoor', initials: 'PK', seg: 'power', color: '#00D4B4',
    outcome: 'Converted', kind: 'con',
    why: 'High feature adoption made the annual upgrade an easy yes once savings were quantified for her.',
    msg: 'Variant C — "Power tools deserve a power plan"',
  },
  {
    name: 'Devon Walsh', initials: 'DW', seg: 'atrisk', color: '#FF5C6C',
    outcome: 'Retained', kind: 'ret',
    why: 'Frustrated by onboarding gaps; a concierge setup offer attached to Variant A rebuilt trust.',
    msg: 'Variant A — "Let us set this up for you"',
  },
  {
    name: 'Sofia Lindqvist', initials: 'SL', seg: 'casual', color: '#FFB84D',
    outcome: 'Churned', kind: 'chu',
    why: 'Low engagement and no recent value moment; discount alone could not re-establish a habit.',
    msg: 'Variant A — no engagement',
  },
  {
    name: 'Marcus Bell', initials: 'MB', seg: 'power', color: '#00D4B4',
    outcome: 'Converted', kind: 'con',
    why: 'Stacked the loyalty credit onto an annual plan to maximize savings on a tool he depends on daily.',
    msg: 'Variant C — "Lock in your stack for 2026"',
  },
]

export const BASE_DIST = { price: 0.26, power: 0.18, atrisk: 0.20, casual: 0.24, newish: 0.12 }
export const TOTAL_PERSONAS = 1000
export const RUN_OPTIONS = [100, 500, 1000, 5000]
