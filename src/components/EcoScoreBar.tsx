interface Props {
  label: string
  value: number
  max: number
  color: string
}

export default function EcoScoreBar({ label, value, max, color }: Props) {
  const pct = Math.round((value / max) * 100)

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-600">
        <span>{label}</span>
        <span className="font-semibold">
          {value}/{max}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
