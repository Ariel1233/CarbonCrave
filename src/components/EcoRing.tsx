import { useEffect, useState } from 'react'
import { useCountUp } from '../hooks/useCountUp'

interface Props {
  score: number
  size?: number
  strokeWidth?: number
  delay?: number
  trackColor?: string
  ringColor?: string
}

export default function EcoRing({
  score,
  size = 72,
  strokeWidth = 5,
  delay = 250,
  trackColor = '#dcfce7',
  ringColor = '#16a34a',
}: Props) {
  const r = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * r
  const [offset, setOffset] = useState(circumference)
  const displayScore = useCountUp(score, 1300, delay)

  useEffect(() => {
    setOffset(circumference)
    const t = setTimeout(() => {
      setOffset(circumference * (1 - score / 100))
    }, delay + 80)
    return () => clearTimeout(t)
  }, [score, circumference, delay])

  const center = size / 2

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="absolute inset-0"
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: `stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-bold text-green-700 tabular-nums leading-none"
          style={{ fontSize: Math.round(size * 0.27) }}
        >
          {displayScore}
        </span>
        <span className="text-gray-400 leading-none mt-0.5" style={{ fontSize: Math.round(size * 0.14) }}>
          /100
        </span>
      </div>
    </div>
  )
}
