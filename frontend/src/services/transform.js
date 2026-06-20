const BASE_PLAN_PRICE = 29

// Maps frontend segment → backend persona configs
const SEG_TO_PERSONAS = {
  price: [{ name: 'Price-Sensitive User', archetype: 'freelancer_designer' }],
  power: [{ name: 'Power User', archetype: 'startup_engineer' }],
  atrisk: [
    { name: 'At-Risk Budget User', archetype: 'freelancer_designer' },
    { name: 'At-Risk Enterprise User', archetype: 'procurement_manager' },
  ],
  casual: [
    {
      name: 'Casual User',
      description: 'A casual user with low engagement and moderate price sensitivity.',
      price_sensitivity: 0.5,
      churn_risk: 0.6,
    },
  ],
  all: [
    { name: 'Freelancer', archetype: 'freelancer_designer' },
    { name: 'Engineer', archetype: 'startup_engineer' },
    { name: 'Enterprise Manager', archetype: 'procurement_manager' },
  ],
}

// Maps archetype → frontend segment key for display
const ARCHETYPE_TO_SEG = {
  freelancer_designer: 'price',
  startup_engineer: 'power',
  procurement_manager: 'atrisk',
}

// Maps persona name (as returned by backend) → segment key
function personaToSegKey(personaName) {
  if (personaName.toLowerCase().includes('freelancer') || personaName.toLowerCase().includes('budget')) return 'price'
  if (personaName.toLowerCase().includes('engineer')) return 'power'
  if (personaName.toLowerCase().includes('enterprise') || personaName.toLowerCase().includes('manager')) return 'atrisk'
  if (personaName.toLowerCase().includes('casual')) return 'casual'
  return 'price'
}

function promptIdToLabel(promptId) {
  // variant_A → "Variant A"
  return promptId.replace('variant_', 'Variant ').replace(/_/g, ' ')
}

function avg(arr) {
  return arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0
}

// Build SimRequest from frontend config
export function configToSimRequest(config) {
  const { decision, variants, discount, target, runs } = config
  const price = parseFloat((BASE_PLAN_PRICE * (1 - discount / 100)).toFixed(2))

  const plan = { name: 'Pro Tier', limit: 100, price }

  const personaConfigs = SEG_TO_PERSONAS[target] || SEG_TO_PERSONAS.all
  const personas = personaConfigs.map((p) => ({
    name: p.name,
    description: p.description || '',
    price_sensitivity: p.price_sensitivity ?? 0,
    churn_risk: p.churn_risk ?? 0,
    ...(p.archetype ? { archetype: p.archetype } : {}),
  }))

  const prompts = variants
    .filter((v) => v && v.trim())
    .map((text, i) => ({
      id: `variant_${String.fromCharCode(65 + i)}`,
      text,
      trigger: decision || 'at subscription renewal',
    }))

  // Cap runs_per_combo so local LLM stays responsive
  const runs_per_combo = Math.max(2, Math.min(10, Math.floor(runs / 100)))

  return { plan, personas, prompts, runs_per_combo }
}

// Transform SimResponse results into display-ready shape for Results screen
export function simResponseToDisplay(results, config) {
  if (!results || !results.length) return null

  // ── Strategies ──────────────────────────────────────────────────────────────
  const strategies = results
    .map((r) => ({
      msg: promptIdToLabel(r.prompt_id),
      offer: `${config.discount}%`,
      seg: segKeyToLabel(personaToSegKey(r.persona)),
      ret: parseFloat(((r.wait_pct + r.upgrade_pct) * 100).toFixed(1)),
      red: parseFloat((r.leave_pct * 100).toFixed(1)),
      best: false,
      _retRaw: r.wait_pct + r.upgrade_pct,
    }))
    .sort((a, b) => b._retRaw - a._retRaw)

  strategies.forEach((s) => delete s._retRaw)
  if (strategies.length) strategies[0].best = true

  // ── Headline metrics ─────────────────────────────────────────────────────────
  const BASELINE_CHURN = 31.2
  const avgChurnPct = parseFloat((avg(results.map((r) => r.leave_pct)) * 100).toFixed(1))
  const retentionLift = parseFloat((BASELINE_CHURN - avgChurnPct).toFixed(1))
  const bestResult = results.reduce(
    (best, r) => (r.wait_pct + r.upgrade_pct > best.wait_pct + best.upgrade_pct ? r : best),
    results[0]
  )
  const bestVariant = promptIdToLabel(bestResult.prompt_id)
  const revenueSaved = Math.round(results.reduce((sum, r) => sum + r.expected_uplift, 0) * 1000)

  // ── Churn triggers from sample_reasons ──────────────────────────────────────
  // Weight each reason by its source result's leave_pct
  const reasonPool = []
  results.forEach((r) => {
    if (r.leave_pct > 0 && r.sample_reasons?.length) {
      r.sample_reasons.forEach((reason) => {
        reasonPool.push({ reason, weight: r.leave_pct })
      })
    }
  })

  const TRIGGER_COLORS = ['#FF5C6C', '#FF8A4D', '#FFB84D', '#6B5FFF', '#4D8CFF']
  const triggers = reasonPool
    .slice(0, 5)
    .map((item, i) => ({
      name: item.reason.length > 60 ? item.reason.slice(0, 57) + '…' : item.reason,
      pct: Math.round(item.weight * 100),
      color: TRIGGER_COLORS[i % TRIGGER_COLORS.length],
    }))

  // ── Segment response breakdown ───────────────────────────────────────────────
  const segMap = {}
  results.forEach((r) => {
    const segKey = personaToSegKey(r.persona)
    if (!segMap[segKey]) segMap[segKey] = { ret: [], chu: [], con: [] }
    segMap[segKey].ret.push(r.wait_pct * 100)
    segMap[segKey].chu.push(r.leave_pct * 100)
    segMap[segKey].con.push(r.upgrade_pct * 100)
  })

  const SEG_SHORT = { price: 'Price-Sens.', power: 'Power', atrisk: 'At-Risk', casual: 'Casual', newish: 'New' }
  const segResponse = Object.entries(segMap).map(([key, vals]) => ({
    seg: SEG_SHORT[key] || key,
    ret: Math.round(avg(vals.ret)),
    chu: Math.round(avg(vals.chu)),
    con: Math.round(avg(vals.con)),
  }))

  // ── Persona insights ─────────────────────────────────────────────────────────
  const SEG_COLORS = { price: '#6B5FFF', power: '#00D4B4', atrisk: '#FF5C6C', casual: '#FFB84D', newish: '#4D8CFF' }
  const insights = results.map((r) => {
    const segKey = personaToSegKey(r.persona)
    const dominantPct = Math.max(r.upgrade_pct, r.wait_pct, r.leave_pct)
    let kind, outcome
    if (dominantPct === r.upgrade_pct) { kind = 'con'; outcome = 'Converted' }
    else if (dominantPct === r.wait_pct) { kind = 'ret'; outcome = 'Retained' }
    else { kind = 'chu'; outcome = 'Churned' }

    const initials = r.persona.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    const why = r.sample_reasons?.[0] || 'Decision based on persona traits and offer presented.'

    return {
      name: r.persona,
      initials,
      seg: segKey,
      color: SEG_COLORS[segKey] || '#6B5FFF',
      outcome,
      kind,
      why,
      msg: `${promptIdToLabel(r.prompt_id)} — "${config.variants[promptIdToIndex(r.prompt_id)]?.slice(0, 40) || r.prompt_id}…"`,
    }
  })

  return { strategies, avgChurnPct, retentionLift, bestVariant, revenueSaved, triggers, segResponse, insights }
}

function segKeyToLabel(key) {
  const MAP = { price: 'Price-Sensitive', power: 'Power Users', atrisk: 'At-Risk', casual: 'Casual', newish: 'New / Trial' }
  return MAP[key] || key
}

function promptIdToIndex(promptId) {
  // variant_A → 0, variant_B → 1, variant_C → 2
  return promptId.charCodeAt(promptId.length - 1) - 65
}
