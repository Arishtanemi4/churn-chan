import { useState } from 'react'
import { SEGMENTS, SEG_KEYS } from '../data'

const R = 66
const C = 2 * Math.PI * R
const SW = 18

export default function DonutChart({ counts, total, highlight }) {
  const [hover, setHover] = useState(null)

  let acc = 0
  const segs = SEG_KEYS.map((k) => {
    const frac = total ? counts[k] / total : 0
    const seg = { k, color: SEGMENTS[k].color, frac, offset: acc, dim: highlight !== 'all' && highlight !== k }
    acc += frac
    return seg
  })

  return (
    <svg width="170" height="170" viewBox="0 0 170 170" style={{ flexShrink: 0, overflow: 'visible' }}>
      <defs>
        {SEG_KEYS.map((k) => (
          <filter key={k} id={`glow-${k}`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={SEGMENTS[k].color} floodOpacity="0.7" />
          </filter>
        ))}
      </defs>
      <g transform="translate(85,85) rotate(-90)">
        <circle r={R} fill="none" stroke="var(--border)" strokeWidth={SW} />
        {segs.map((s) => {
          const isHover = hover === s.k
          const dim = s.dim && !isHover
          return (
            <circle
              key={s.k}
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={isHover ? SW + 4 : SW}
              strokeDasharray={`${s.frac * C} ${C}`}
              strokeDashoffset={`${-s.offset * C}`}
              strokeLinecap="butt"
              filter={isHover ? `url(#glow-${s.k})` : undefined}
              onMouseEnter={() => setHover(s.k)}
              onMouseLeave={() => setHover(null)}
              style={{
                opacity: dim ? 0.18 : 1,
                cursor: 'pointer',
                transition: 'opacity .35s, stroke-width .25s, stroke-dasharray .6s cubic-bezier(.2,.7,.2,1)',
              }}
            />
          )
        })}
      </g>
    </svg>
  )
}
