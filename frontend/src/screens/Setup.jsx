import { useMemo } from 'react'
import { SEGMENTS, SEG_KEYS, TARGET_OPTIONS, PREVIEW_PERSONAS, BASE_DIST, TOTAL_PERSONAS, RUN_OPTIONS } from '../data'
import DonutChart from '../components/DonutChart'
import { useTween } from '../hooks/useCountUp'

const fmt = (n) => n.toLocaleString('en-US')

export default function Setup({ config, setConfig, onRun }) {
  const counts = useMemo(() => {
    const c = {}
    SEG_KEYS.forEach((k) => (c[k] = Math.round(BASE_DIST[k] * TOTAL_PERSONAS)))
    return c
  }, [])

  const highlight = config.target
  const focusCount = highlight === 'all' ? TOTAL_PERSONAS : counts[highlight]
  const animFocus = Math.round(useTween(focusCount))
  const runIdx = RUN_OPTIONS.indexOf(config.runs)

  const setVariant = (i, v) => {
    const nv = [...config.variants]
    nv[i] = v
    setConfig({ ...config, variants: nv })
  }

  return (
    <div className="shell fade-up">
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>Run a Simulation</h1>
        <p className="res-sub">
          Define a retention decision and stress-test it against 1,000 AI user personas before it touches a real customer.
        </p>
      </div>

      <div className="setup-grid">
        {/* ── Left: form ── */}
        <div className="panel">
          <div className="field">
            <span className="label">What decision are you testing?</span>
            <textarea
              rows="3"
              value={config.decision}
              onChange={(e) => setConfig({ ...config, decision: e.target.value })}
              placeholder="e.g. We want to offer at-risk users a 30% discount on annual plans to reduce churn before renewal."
            />
            <div className="hint">Describe the proposed change in plain language. The persona engine infers intent and context.</div>
          </div>

          <div className="field">
            <span className="label">Message variants</span>
            {config.variants.map((v, i) => (
              <div className="variant-row" key={i}>
                <div className="variant-tag">{String.fromCharCode(65 + i)}</div>
                <input
                  className="text-input"
                  value={v}
                  onChange={(e) => setVariant(i, e.target.value)}
                  placeholder={`Subject line / message for variant ${String.fromCharCode(65 + i)}`}
                />
              </div>
            ))}
            <div className="hint">2–3 messages tested head-to-head against every persona.</div>
          </div>

          <div className="field">
            <span className="label">Discount / offer lever</span>
            <div className="slider-wrap">
              <input
                type="range" min="0" max="70" value={config.discount}
                onChange={(e) => setConfig({ ...config, discount: +e.target.value })}
              />
              <div className="readout">{config.discount}%</div>
            </div>
            <div className="hint">Maximum discount the simulated offer is allowed to extend.</div>
          </div>

          <div className="field">
            <span className="label">Target segment</span>
            <div className="pills" style={{ marginTop: 2 }}>
              {TARGET_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  className={`pill ${config.target === o.id ? 'on' : ''}`}
                  onClick={() => setConfig({ ...config, target: o.id })}
                >
                  {o.id !== 'all' && (
                    <span className="seg-dot" style={{ background: SEGMENTS[o.id].color }} />
                  )}
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <span className="label">Simulation runs</span>
            <div className="slider-wrap">
              <input
                type="range" min="0" max="3" step="1" value={runIdx}
                onChange={(e) => setConfig({ ...config, runs: RUN_OPTIONS[+e.target.value] })}
              />
              <div className="readout" style={{ fontSize: 18 }}>{fmt(config.runs)}</div>
            </div>
            <div className="runs-ticks">
              {RUN_OPTIONS.map((r) => (
                <span key={r} className={config.runs === r ? 'on' : ''}>{fmt(r)}</span>
              ))}
            </div>
          </div>

          <button className="cta" onClick={onRun}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 4l14 8-14 8V4z" fill="#fff" />
            </svg>
            Run Simulation · {fmt(config.runs)} personas
          </button>
        </div>

        {/* ── Right: population + persona cards ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">Persona Population</div>
              <span className="label">{fmt(TOTAL_PERSONAS)} agents</span>
            </div>
            <div className="donut-wrap">
              <div style={{ position: 'relative', display: 'grid', placeItems: 'center' }}>
                <DonutChart counts={counts} total={TOTAL_PERSONAS} highlight={highlight} />
                <div className="donut-center" style={{ position: 'absolute' }}>
                  <div className="donut-total tnum">{fmt(animFocus)}</div>
                  <div className="label" style={{ marginTop: 4 }}>
                    {highlight === 'all' ? 'Total' : SEGMENTS[highlight]?.short}
                  </div>
                </div>
              </div>
              <div className="legend">
                {SEG_KEYS.map((k) => {
                  const v = counts[k]
                  const muted = highlight !== 'all' && highlight !== k
                  return (
                    <div className={`legend-row ${muted ? 'muted' : ''}`} key={k}>
                      <span className="sw" style={{ background: SEGMENTS[k].color }} />
                      <span className="lname">{SEGMENTS[k].label}</span>
                      <span className="lval tnum">{fmt(v)}</span>
                      <span className="lpct">{Math.round((v / TOTAL_PERSONAS) * 100)}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">Example Agents</div>
              <span className="label">Sampled live</span>
            </div>
            <div className="pcards">
              {PREVIEW_PERSONAS.map((p) => {
                const seg = SEGMENTS[p.seg]
                const riskColor = p.risk >= 66 ? 'var(--red)' : p.risk >= 40 ? 'var(--amber)' : 'var(--green)'
                const riskBg   = p.risk >= 66 ? 'var(--red-bg)' : p.risk >= 40 ? 'var(--amber-bg)' : 'var(--green-bg)'
                return (
                  <div className="pcard" key={p.name}>
                    <div className="avatar" style={{ background: `linear-gradient(140deg, ${seg.color}, ${seg.color}99)` }}>
                      {p.initials}
                    </div>
                    <div className="pcard-mid">
                      <div className="pcard-name">
                        {p.name}
                        <span className="seg-badge" style={{ color: seg.color, background: `${seg.color}22` }}>
                          {seg.short}
                        </span>
                      </div>
                      <div className="pcard-meta">
                        <div className="meta-i">
                          <span className="label">Price sens.</span>
                          <span className="mv">{p.price}/10</span>
                          <span className="score-bar">
                            <i style={{ width: `${p.price * 10}%`, background: seg.color }} />
                          </span>
                        </div>
                        <div className="meta-i">
                          <span className="label">Engagement</span>
                          <span className="mv">{p.eng}</span>
                        </div>
                      </div>
                    </div>
                    <div className="risk-badge" style={{ color: riskColor, background: riskBg }}>
                      {p.risk}
                      <span className="rl">RISK</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
