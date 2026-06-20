import { Fragment } from 'react'

const STEPS = [
  { id: 'setup',   n: '1', label: 'Setup' },
  { id: 'sim',     n: '2', label: 'Simulate' },
  { id: 'results', n: '3', label: 'Results' },
]
const ORDER = { setup: 0, sim: 1, results: 2 }

export default function TopBar({ screen }) {
  return (
    <div className="topbar">
      <div className="brand">
        <div className="brand-logo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M3 17l5-6 4 4 8-9" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        Churn<span className="brand-accent">Sim</span>
      </div>

      <div className="steps">
        {STEPS.map((s, i) => {
          const cur = ORDER[screen]
          const state = cur === i ? 'active' : cur > i ? 'done' : ''
          return (
            <Fragment key={s.id}>
              <div className={`step-pill ${state}`}>
                <span className="dot" />
                {s.n} · {s.label}
              </div>
              {i < STEPS.length - 1 && <span className="step-arrow">→</span>}
            </Fragment>
          )
        })}
      </div>

      <div className="label" style={{ color: 'var(--text-mute)' }}>AI PERSONA ENGINE · v2.4</div>
    </div>
  )
}
