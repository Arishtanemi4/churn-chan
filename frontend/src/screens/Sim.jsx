import { useState, useEffect, useRef } from 'react'
import { FEED_TEMPLATES } from '../data'
import { easeOutCubic } from '../hooks/useCountUp'
import { api } from '../services/api'
import { configToSimRequest } from '../services/transform'

const fmt = (n) => n.toLocaleString('en-US')

function kindStyle(kind) {
  if (kind === 'ret') return { color: 'var(--green)', bg: 'var(--green-bg)' }
  if (kind === 'chu') return { color: 'var(--red)',   bg: 'var(--red-bg)'   }
  return { color: 'var(--teal)', bg: 'rgba(0,212,180,0.14)' }
}

const DURATION = 3400

export default function Sim({ config, onDone }) {
  const TARGET = config.runs
  const [count,    setCount]    = useState(0)
  const [progress, setProgress] = useState(0)
  const [feed,     setFeed]     = useState([])
  const [metrics,  setMetrics]  = useState({ ret: 0, chu: 0, con: 0 })
  const [waiting,  setWaiting]  = useState(false) // true after animation ends, API still pending
  const feedId     = useRef(0)
  const apiResult  = useRef(undefined) // undefined = in-flight, null = error, object = data
  const animDone   = useRef(false)

  // Fire API call immediately
  useEffect(() => {
    api.simulate(configToSimRequest(config))
      .then((data) => {
        apiResult.current = data
        if (animDone.current) onDone(data)
      })
      .catch(() => {
        apiResult.current = null
        if (animDone.current) onDone(null)
      })
  }, []) // eslint-disable-line

  // Animation loop
  useEffect(() => {
    let raf, t0
    const step = (ts) => {
      if (!t0) t0 = ts
      const p = Math.min((ts - t0) / DURATION, 1)
      const e = easeOutCubic(p)
      setCount(Math.round(TARGET * e))
      setProgress(p)
      setMetrics({
        ret: Math.round(TARGET * 0.62 * e),
        chu: Math.round(TARGET * 0.18 * e),
        con: Math.round(TARGET * 0.20 * e),
      })
      if (p < 1) {
        raf = requestAnimationFrame(step)
      } else {
        animDone.current = true
        if (apiResult.current !== undefined) {
          // API already resolved — proceed immediately
          setTimeout(() => onDone(apiResult.current), 480)
        } else {
          // API still in flight — show waiting state
          setWaiting(true)
        }
      }
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, []) // eslint-disable-line

  // Poll for API resolution while in waiting state
  useEffect(() => {
    if (!waiting) return
    const iv = setInterval(() => {
      if (apiResult.current !== undefined) {
        clearInterval(iv)
        onDone(apiResult.current)
      }
    }, 300)
    return () => clearInterval(iv)
  }, [waiting]) // eslint-disable-line

  // Live feed animation
  useEffect(() => {
    let i = 0
    const iv = setInterval(() => {
      const t = FEED_TEMPLATES[i % FEED_TEMPLATES.length]
      i++
      feedId.current++
      setFeed((prev) => [{ ...t, id: feedId.current }, ...prev].slice(0, 7))
    }, 360)
    return () => clearInterval(iv)
  }, [])

  const apiReady = apiResult.current !== undefined

  return (
    <div className="sim-screen">
      <div className="topprog">
        <i style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="sim-body">
        {/* ── Counter ── */}
        <div className="sim-main">
          <div className="ring" style={{ width: 420, height: 420, opacity: 0.5 }} />
          <div className="ring" style={{ width: 600, height: 600, opacity: 0.25 }} />

          <div className="sim-eyebrow">
            <span className="pulse-dot" />
            <span className="label" style={{ color: 'var(--teal)' }}>
              {waiting ? 'Aggregating results…' : 'Mission Control · Persona Engine Running'}
            </span>
          </div>

          <div className="counter tnum">{fmt(count)}</div>
          <div className="counter-sub mono">
            simulations completed <span className="counter-of">/ {fmt(TARGET)}</span>
          </div>

          <div className="sim-metrics">
            <div className="smetric">
              <div className="num tnum" style={{ color: 'var(--green)' }}>{fmt(metrics.ret)}</div>
              <div className="label">Retained</div>
            </div>
            <div className="smetric">
              <div className="num tnum" style={{ color: 'var(--red)' }}>{fmt(metrics.chu)}</div>
              <div className="label">Churned</div>
            </div>
            <div className="smetric">
              <div className="num tnum" style={{ color: 'var(--teal)' }}>{fmt(metrics.con)}</div>
              <div className="label">Converted</div>
            </div>
          </div>

          <button
            className="ghost-btn"
            style={{ marginTop: 36, opacity: apiReady ? 1 : 0.4, cursor: apiReady ? 'pointer' : 'not-allowed' }}
            disabled={!apiReady}
            onClick={() => apiReady && onDone(apiResult.current)}
          >
            {apiReady ? 'Skip to results →' : 'Processing…'}
          </button>
        </div>

        {/* ── Feed ── */}
        <div className="feed-panel">
          <div className="feed-head">
            <div className="panel-title">Live Decision Feed</div>
            <span className="label" style={{ color: 'var(--teal)' }}>● streaming</span>
          </div>
          <div className="feed-list">
            {feed.map((f) => {
              const ks = kindStyle(f.kind)
              return (
                <div className="feed-item" key={f.id}>
                  <div className="feed-ic" style={{ color: ks.color, background: ks.bg }}>{f.icon}</div>
                  <div className="feed-txt">
                    <span className="feed-name">{f.name} </span>
                    <span className="feed-tag">({f.seg})</span>
                    <br />
                    <span className="feed-action">{f.action} — </span>
                    <span className="feed-out" style={{ color: ks.color }}>{f.out} {f.icon}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
