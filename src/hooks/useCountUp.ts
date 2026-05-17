import { useEffect, useRef, useState } from 'react'

export function useCountUp(target: number, duration = 1200, startDelay = 0): number {
  const [count, setCount] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    startTimeRef.current = null
    setCount(0)

    const timer = setTimeout(() => {
      const tick = (now: number) => {
        if (!startTimeRef.current) startTimeRef.current = now
        const elapsed = now - startTimeRef.current
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.round(eased * target))
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick)
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }, startDelay)

    return () => {
      clearTimeout(timer)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration, startDelay])

  return count
}
