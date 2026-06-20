import { useState, useEffect, useRef } from 'react'

export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Smoothly tweens FROM the previously displayed value TO a new target
 * whenever `target` changes — unlike useCountUp which always starts at 0.
 * Used for live number transitions (e.g. donut centre on segment toggle).
 */
export function useTween(target, duration = 650) {
  const [val, setVal] = useState(target)
  const fromRef = useRef(target)
  const rafRef = useRef()
  useEffect(() => {
    cancelAnimationFrame(rafRef.current)
    const from = fromRef.current
    const to = target
    if (from === to) return
    let t0
    const step = (ts) => {
      if (!t0) t0 = ts
      const p = Math.min((ts - t0) / duration, 1)
      const v = from + (to - from) * easeOutCubic(p)
      fromRef.current = v
      setVal(v)
      if (p < 1) rafRef.current = requestAnimationFrame(step)
      else { fromRef.current = to; setVal(to) }
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])
  return val
}

export function useCountUp(target, duration = 1400, start = true, decimals = 0) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!start) return
    let raf, t0
    const step = (ts) => {
      if (!t0) t0 = ts
      const p = Math.min((ts - t0) / duration, 1)
      setVal(target * easeOutCubic(p))
      if (p < 1) raf = requestAnimationFrame(step)
      else setVal(target)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, start])
  return decimals ? Number(val).toFixed(decimals) : Math.round(val)
}
