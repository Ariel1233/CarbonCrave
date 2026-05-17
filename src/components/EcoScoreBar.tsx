import { useEffect, useState } from 'react'

interface Props {
  label: string
  value: number
  max: number
  color: string
  delay?: number
}

export default function EcoScoreBar({ label, value, max, color, delay = 0 }: Props) {
  const pct = Math.round((value / max) * 100)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setWidth(0)
    const t = setTimeout(() => setWidth(pct), delay + 60)
    return () => clearTimeout(t)
  }, [pct, delay])

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{label}</span>
        <span className="font-medium text-gray-700">{value}/{max}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${width}%`, transition: 'width 0.85s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </div>
    </div>
  )
}
