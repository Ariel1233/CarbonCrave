import type { EcoBadge as EcoBadgeType } from '../types'

const config: Record<EcoBadgeType, { label: string; labelEs: string; color: string; bg: string; border: string; icon: string }> = {
  platinum: {
    label: 'Platinum Leaf',
    labelEs: 'Hoja Platino',
    color: 'text-cyan-700',
    bg: 'bg-cyan-50',
    border: 'border-cyan-300',
    icon: '🌿',
  },
  gold: {
    label: 'Gold Leaf',
    labelEs: 'Hoja de Oro',
    color: 'text-yellow-700',
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    icon: '🍃',
  },
  silver: {
    label: 'Silver Leaf',
    labelEs: 'Hoja de Plata',
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    border: 'border-slate-300',
    icon: '🌱',
  },
  bronze: {
    label: 'Bronze Leaf',
    labelEs: 'Hoja de Bronce',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: '🌾',
  },
  starter: {
    label: 'Starter Leaf',
    labelEs: 'Hoja Inicial',
    color: 'text-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    icon: '🪴',
  },
}

interface Props {
  badge: EcoBadgeType
  lang?: 'en' | 'es'
  size?: 'sm' | 'md' | 'lg'
}

export default function EcoBadge({ badge, lang = 'en', size = 'md' }: Props) {
  const c = config[badge]
  const label = lang === 'es' ? c.labelEs : c.label

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2',
  }

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${c.color} ${c.bg} ${c.border} ${sizeClasses[size]}`}
    >
      <span>{c.icon}</span>
      <span>{label}</span>
    </span>
  )
}
