import { useState, useEffect } from 'react'
import { SEGMENTS } from '../data'
import { useCountUp } from '../hooks/useCountUp'
import { simResponseToDisplay } from '../services/transform'

// Fallback mock data used when backend is unavailable
const STRATEGIES = [
  { msg: 'Variant B', offer: '25%', seg: 'At-Risk',         ret: 82.4, red: 34.1, best: true  },
  { msg: 'Variant B', offer: '30%', seg: 'Price-Sensitive', ret: 79.1, red: 29.8, best: false },
  { msg: 'Variant C', offer: '15%', seg: 'Power Users',     ret: 74.6, red: 21.2, best: false },
  { msg: 'Variant A', offer: '20%', seg: 'Casual',          ret: 68.3, red: 17.9, best: false },
]
const TRIGGERS = [
  { name: 'Price too high after trial',   pct: 38, color: '#FF5C6C' },
  { name: 'No perceived feature value',   pct: 24, color: '#FF8A4D' },
  { name: 'Competitor offer',             pct: 19, color: '#FFB84D' },
  { name: 'Poor onboarding completion',   pct: 12, color: '#6B5FFF' },
  { name: 'Support frustration',          pct: 7,  color: '#4D8CFF' },
]
const SEG_RESPONSE = [
  { seg: 'Price-Sens.', ret: 62, chu: 18, con: 20 },
  { seg: 'Power',       ret: 48, chu: 9,  con: 43 },
  { seg: 'At-Risk',     ret: 71, chu: 21, con: 8  },
  { seg: 'Casual',      ret: 58, chu: 27, con: 15 },
]
const INSIGHTS = [
  { name: 'Maya Rodriguez', initials: 'MR', seg: 'atrisk', color: '#FF5C6C', outcome: 'Retained', kind: 'ret',
    why: 'Had logged a downgrade intent twice; the 25% annual discount removed her primary cost objection.',
    msg: 'Variant B — "Your workflow, locked in for less"' },
  { name: 'James Tan', initials: 'JT', seg: 'price', color: '#6B5FFF', outcome: 'Churned', kind: 'chu',
    why: 'Even at 30% off, perceived the tool as redundant with a free alternative he already used.',
    msg: 'Variant B — ignored after open' },
  { name: 'Priya Kapoor', initials: 'PK', seg: 'power', color: '#00D4B4', outcome: 'Converted', kind: 'con',
    why: 'High feature adoption made the annual upgrade an easy yes once savings were quantified for her.',
    msg: 'Variant C — "Power tools deserve a power plan"' },
  { name: 'Sofia Lindqvist', initials: 'SL', seg: 'casual', color: '#FFB84D', outcome: 'Churned', kind: 'chu',
    why: 'Low engagement and no recent value moment; discount alone could not re-establish a habit.',
    msg: 'Variant A — no engagement' },
]

const fmt = (n) => n.toLocaleString('en-US')

function kindStyle(kind) {
  if (kind === 'ret') return { color: 'var(--green)', bg: 'var(--green-bg)' }
  if (kind === 'chu') return { color: 'var(--red)',   bg: 'var(--red-bg)'   }
  return { color: 'var(--teal)', bg: 'rgba(0,212,180,0.14)' }
}

function MetricCard({ label, value, decimals = 0, suffix = '', prefix = '', foot, hero, start }) {
  const v = useCountUp(value, 1500, start, decimals)
  return (
    <div className={`metric-card ${hero ? 'hero' : ''}`}>
      <span className="label">{label}</span>
      <div className="metric-big tnum">{prefix}{v}{suffix}</div>
      {foot && <div className="metric-foot">{foot}</div>}
    </div>
  )
}

function ChurnTriggers({ triggers, start }) {
  const maxPct = Math.max(...triggers.map((t) => t.pct), 1)
  return (
    <div className="card">
      <div className="section-title">Why personas churned</div>
      <div className="section-sub">Top triggers extracted from agent reasoning across all runs</div>
      {triggers.map((t, i) => (
        <div className="trigger" key={i}>
          <div className="trigger-top">
            <span className="tname">{t.name}</span>
            <span className="tpct tnum" style={{ color: t.color }}>{t.pct}%</span>
          </div>
          <div className="trigger-track">
            <div
              className="trigger-fill"
              style={{
                width: start ? `${(t.pct / maxPct) * 100}%` : 0,
                background: t.color,
                transitionDelay: `${i * 0.08}s`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function SegmentChart({ segResponse, start }) {
  const [hover, setHover] = useState(null)
  const W = 320, H = 180, pad = 26
  const gw = (W - pad * 2) / segResponse.length
  const barW = 13, gap = 4
  const series = [
    { key: 'ret', solid: '#2FD78B' },
    { key: 'chu', solid: '#FF5C6C' },
    { key: 'con', solid: '#00D4B4' },
  ]

  return (
    <div className="card">
      <div className="section-title">Segment response breakdown</div>
      <div className="section-sub">How each segment reacted across all tested variants</div>
      <svg width="100%" viewBox={`0 0 ${W} ${H + 24}`} style={{ overflow: 'visible' }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.solid} />
              <stop offset="100%" stopColor={s.solid} stopOpacity="0.65" />
            </linearGradient>
          ))}
        </defs>
        {[0, 25, 50, 75, 100].map((g) => {
          const y = pad + (H - pad) * (1 - g / 100)
          return (
            <line key={g} x1={pad} x2={W - pad / 2} y1={y} y2={y}
              stroke="var(--border)" strokeWidth="1" strokeDasharray="2 4" />
          )
        })}
        {segResponse.map((grp, gi) => {
          const gx = pad + gi * gw
          const totalW = series.length * barW + (series.length - 1) * gap
          const startX = gx + (gw - totalW) / 2
          const active = hover === null || hover === gi
          return (
            <g key={grp.seg}
              onMouseEnter={() => setHover(gi)} onMouseLeave={() => setHover(null)}
              style={{ transition: 'opacity .25s', opacity: active ? 1 : 0.32 }}>
              <rect x={startX - 6} y={pad - 4} width={totalW + 12} height={H - pad + 8}
                rx="6" fill={hover === gi ? 'rgba(255,255,255,0.03)' : 'transparent'} />
              {series.map((s, si) => {
                const h = (H - pad) * (grp[s.key] / 100)
                const x = startX + si * (barW + gap)
                const y = pad + (H - pad) - h
                return (
                  <g key={s.key}>
                    <rect
                      x={x}
                      y={start ? y : pad + H - pad}
                      width={barW}
                      height={start ? h : 0}
                      rx="3"
                      fill={`url(#grad-${s.key})`}
                      style={{
                        transition: `y .8s cubic-bezier(.2,.7,.2,1) ${gi * 0.06 + si * 0.04}s,
                                     height .8s cubic-bezier(.2,.7,.2,1) ${gi * 0.06 + si * 0.04}s`,
                      }}
                    />
                    {hover === gi && start && (
                      <text x={x + barW / 2} y={y - 5} textAnchor="middle" fontSize="9"
                        fontWeight="700" fill={s.solid} style={{ fontFamily: 'var(--mono)' }}>
                        {grp[s.key]}
                      </text>
                    )}
                  </g>
                )
              })}
              <text x={gx + gw / 2} y={H + 14} textAnchor="middle" fontSize="10"
                fill={hover === gi ? 'var(--text)' : 'var(--text-mute)'} fontWeight="600">{grp.seg}</text>
            </g>
          )
        })}
      </svg>
      <div className="chart-legend">
        <span><span className="sw" style={{ background: '#2FD78B' }} />Retained</span>
        <span><span className="sw" style={{ background: '#FF5C6C' }} />Churned</span>
        <span><span className="sw" style={{ background: '#00D4B4' }} />Converted</span>
      </div>
    </div>
  )
}

function InsightCard({ p }) {
  const [open, setOpen] = useState(false)
  const seg = SEGMENTS[p.seg] || { label: p.seg, color: p.color }
  const ks  = kindStyle(p.kind)
  return (
    <div className={`insight ${open ? 'open' : ''}`}>
      <div className="insight-head" onClick={() => setOpen((o) => !o)}>
        <div className="avatar" style={{ background: `linear-gradient(140deg, ${p.color}, ${p.color}99)` }}>
          {p.initials}
        </div>
        <div className="insight-id">
          <div className="insight-name">
            {p.name}
            <span className="outcome-chip" style={{ color: ks.color, background: ks.bg }}>{p.outcome}</span>
          </div>
          <span className="seg-badge" style={{ color: seg.color, background: `${seg.color}22`, display: 'inline-block', marginTop: 6 }}>
            {seg.label}
          </span>
        </div>
        <span className="chev">▼</span>
      </div>
      <div className="insight-body">
        <div className="insight-inner">
          <div className="row">
            <span className="label">Why the agent decided this</span>
            <p>{p.why}</p>
          </div>
          <div className="row">
            <span className="label">Responded to</span>
            <div className="resp-msg">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h16M4 18h10" stroke={seg.color} strokeWidth="2" strokeLinecap="round" />
              </svg>
              {p.msg}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Results({ config, results, onRestart }) {
  const [start, setStart] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setStart(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Compute display data from real API results, or fall back to mock data
  const live = results?.results ? simResponseToDisplay(results.results, config) : null

  const strategies  = live?.strategies  ?? STRATEGIES
  const triggers    = live?.triggers?.length ? live.triggers    : TRIGGERS
  const segResponse = live?.segResponse?.length ? live.segResponse : SEG_RESPONSE
  const insights    = live?.insights?.length    ? live.insights    : INSIGHTS

  const churnRate      = live?.avgChurnPct      ?? 18.4
  const retentionLift  = live?.retentionLift    ?? 12.8
  const bestVariant    = live?.bestVariant       ?? 'Variant B'
  const revenueSaved   = live?.revenueSaved      ?? 142000
  const bestRetRate    = strategies[0]?.ret      ?? 82.4

  return (
    <div className="shell fade-up">
      <div className="res-head">
        <div>
          <div className="res-title">
            Simulation Complete
            <span className="complete-chip">✓ {fmt(config.runs)} runs</span>
          </div>
          <p className="res-sub">
            Decision: "{config.decision || 'Offer at-risk users a discount on annual plans'}" · tested against {fmt(config.runs)} AI personas
          </p>
        </div>
        <button className="ghost-btn" onClick={onRestart}>↺ New simulation</button>
      </div>

      {/* Headline metrics */}
      <div className="metric-row">
        <MetricCard start={start} label="Predicted churn rate" value={churnRate} decimals={1} suffix="%"
          foot={<><span className="delta-down">▼ {Math.abs(retentionLift).toFixed(1)}pt</span> vs baseline {(churnRate + Math.abs(retentionLift)).toFixed(1)}%</>} />
        <MetricCard start={start} label="Retention lift" value={Math.abs(retentionLift)} decimals={1} prefix="+" suffix="pt"
          foot={<><span className="delta-pos">▲</span> projected over 90 days</>} />
        <div className="metric-card hero">
          <span className="label">Best performing message</span>
          <div className="variant-big">{bestVariant}</div>
          <div className="metric-foot"><span className="delta-pos">▲ {bestRetRate}%</span> retention on {strategies[0]?.seg ?? 'At-Risk'}</div>
        </div>
        <MetricCard start={start} label="Est. revenue saved" value={revenueSaved} prefix="$"
          foot={<span style={{ color: 'var(--text-dim)' }}>per month · recurring</span>} />
      </div>

      {/* Strategy matrix */}
      <div className="card" style={{ marginBottom: 22, padding: '22px 10px 14px' }}>
        <div style={{ padding: '0 12px' }}>
          <div className="section-title">Strategy matrix</div>
          <div className="section-sub">Ranked combinations the engine tested — sorted by retention rate</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Message</th>
                <th>Offer</th>
                <th>Segment</th>
                <th>Retention rate</th>
                <th className="r">Churn reduction</th>
                <th className="c">Recommended</th>
              </tr>
            </thead>
            <tbody>
              {strategies.map((s, i) => (
                <tr key={i} className={s.best ? 'best' : ''}>
                  <td>
                    {s.best && <span className="best-tag">★ Best strategy</span>}
                    <span className="vpill">{s.msg}</span>
                  </td>
                  <td className="mono" style={{ fontWeight: 700 }}>{s.offer}</td>
                  <td style={{ color: 'var(--text-dim)' }}>{s.seg}</td>
                  <td>
                    <span className="mini-bar"><i style={{ width: `${s.ret}%` }} /></span>
                    <span className="mono" style={{ fontWeight: 700 }}>{s.ret}%</span>
                  </td>
                  <td className="r mono" style={{ fontWeight: 700, color: s.best ? 'var(--green)' : 'var(--text)' }}>
                    −{s.red}%
                  </td>
                  <td className="c">
                    {s.best ? (
                      <button className="deploy-btn">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Deploy this strategy
                      </button>
                    ) : (
                      <span className="deploy-locked">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="two-col">
        <ChurnTriggers triggers={triggers} start={start} />
        <SegmentChart segResponse={segResponse} start={start} />
      </div>

      {/* Persona insights */}
      <div style={{ marginTop: 6 }}>
        <div className="section-title">Persona insights</div>
        <div className="section-sub">Notable archetypes and the reasoning behind their decisions — click to expand</div>
        <div className="insight-grid">
          {insights.map((p, i) => <InsightCard key={p.name ?? i} p={p} />)}
        </div>
      </div>

      <div className="footer-bar">
        <button className="cta" style={{ maxWidth: 280 }} onClick={onRestart}>
          Run another simulation
        </button>
      </div>
    </div>
  )
}
