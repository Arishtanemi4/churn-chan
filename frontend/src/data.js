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

export const BASE_DIST = { price: 0.26, power: 0.18, atrisk: 0.20, casual: 0.24, newish: 0.12 }
export const TOTAL_PERSONAS = 1000
export const RUN_OPTIONS = [100, 500, 1000, 5000]
