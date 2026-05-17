import { useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, X, Star, Navigation2, Heart, List,
  ChevronDown, Leaf, ArrowUpDown, Map as MapIcon,
  SlidersHorizontal,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { restaurants } from '../data/restaurants'
import EcoBadge from '../components/EcoBadge'
import type { Restaurant, EcoBadge as EcoBadgeType, Neighborhood } from '../types'

// ─── Colours per badge ────────────────────────────────────────────────────────
const BADGE_COLOR: Record<EcoBadgeType, { bg: string; border: string; text: string }> = {
  platinum: { bg: '#0891b2', border: '#e0f7fa', text: '#fff' },
  gold:     { bg: '#d97706', border: '#fff9c4', text: '#fff' },
  silver:   { bg: '#64748b', border: '#eceff1', text: '#fff' },
  bronze:   { bg: '#c2410c', border: '#fbe9e7', text: '#fff' },
  starter:  { bg: '#6b7280', border: '#f3f4f6', text: '#fff' },
}

const BADGE_PILL: Record<EcoBadgeType, string> = {
  platinum: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  gold:     'bg-amber-100 text-amber-800 border-amber-200',
  silver:   'bg-slate-100 text-slate-700 border-slate-200',
  bronze:   'bg-orange-100 text-orange-800 border-orange-200',
  starter:  'bg-gray-100 text-gray-600 border-gray-200',
}

// ─── SVG map zones ────────────────────────────────────────────────────────────
type Zone = {
  id: Neighborhood
  x: number; y: number; w: number; h: number; rx: number
  fill: string; stroke: string
  cx: number; cy: number
}

const ZONES: Zone[] = [
  { id: 'Doral',        x: 4,   y: 74,  w: 88,  h: 82,  rx: 8,  fill: '#d1fae5', stroke: '#34d399', cx: 48,  cy: 115 },
  { id: 'Calle Ocho',   x: 94,  y: 108, w: 92,  h: 78,  rx: 8,  fill: '#fef3c7', stroke: '#fbbf24', cx: 140, cy: 142 },
  { id: 'Little Haiti', x: 126, y: 16,  w: 88,  h: 68,  rx: 8,  fill: '#fee2e2', stroke: '#f87171', cx: 170, cy: 50  },
  { id: 'Wynwood',      x: 150, y: 86,  w: 72,  h: 60,  rx: 8,  fill: '#ede9fe', stroke: '#a78bfa', cx: 186, cy: 116 },
  { id: 'Overtown',     x: 164, y: 148, w: 64,  h: 66,  rx: 8,  fill: '#ffedd5', stroke: '#fb923c', cx: 196, cy: 181 },
  { id: 'Brickell',     x: 230, y: 128, w: 64,  h: 82,  rx: 8,  fill: '#dbeafe', stroke: '#60a5fa', cx: 262, cy: 169 },
  { id: 'Coral Gables', x: 88,  y: 186, w: 94,  h: 76,  rx: 8,  fill: '#fae8ff', stroke: '#e879f9', cx: 135, cy: 224 },
  { id: 'South Beach',  x: 292, y: 82,  w: 48,  h: 172, rx: 12, fill: '#cffafe', stroke: '#22d3ee', cx: 316, cy: 168 },
]

const MAP_VB = '0 0 350 276'

const PIN_POS: Record<string, [number, number]> = {
  '1':  [130, 144],
  '2':  [252, 164],
  '3':  [46,  122],
  '4':  [148, 42],
  '5':  [184, 110],
  '6':  [188, 170],
  '7':  [310, 164],
  '8':  [124, 214],
  '9':  [108, 156],
  '10': [172, 58],
}

const NEIGHBORHOODS: Neighborhood[] = [
  'Doral', 'Calle Ocho', 'Little Haiti', 'Wynwood',
  'Overtown', 'Brickell', 'Coral Gables', 'South Beach',
]

const ECO_FILTERS = [
  { id: 'all',         en: 'All EcoScores',     es: 'Todos'             },
  { id: 'platinum',    en: 'Platinum Leaf',      es: 'Hoja Platino'     },
  { id: 'gold',        en: 'Gold Leaf+',         es: 'Hoja Oro+'        },
  { id: 'silver',      en: 'Silver Leaf+',       es: 'Hoja Plata+'      },
  { id: 'low-waste',   en: 'Low Food Waste',     es: 'Bajo Desperdicio' },
  { id: 'high-offset', en: '75%+ Carbon Offset', es: 'Offset 75%+'     },
]

const SORT_OPTIONS = [
  { id: 'ecoscore', en: 'Highest EcoScore',   es: 'Mayor EcoScore'    },
  { id: 'rating',   en: 'Highest Rating',     es: 'Mayor Rating'      },
  { id: 'waste',    en: 'Lowest Food Waste',  es: 'Menor Desperdicio' },
  { id: 'offset',   en: 'Most Carbon Offset', es: 'Mayor Offset'      },
  { id: 'popular',  en: 'Most Popular',       es: 'Más Popular'       },
]

function passesEcoFilter(r: Restaurant, f: string) {
  if (f === 'all')         return true
  if (f === 'platinum')    return r.ecoScore.total >= 90
  if (f === 'gold')        return r.ecoScore.total >= 75
  if (f === 'silver')      return r.ecoScore.total >= 60
  if (f === 'low-waste')   return r.ecoScore.wastePercent < 10
  if (f === 'high-offset') return r.ecoScore.offsetPercent >= 75
  return true
}

function EcoScorePill({ score, badge }: { score: number; badge: EcoBadgeType }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${BADGE_PILL[badge]}`}>
      <Leaf size={9} />
      {score}
    </span>
  )
}

// ─── SVG zone label ───────────────────────────────────────────────────────────
function ZoneLabel({ z, isActive }: { z: Zone; isActive: boolean }) {
  const words  = z.id.split(' ')
  const fill   = isActive ? '#fff' : '#374151'
  const weight = isActive ? '700' : '600'

  if (words.length === 1) {
    return (
      <text x={z.cx} y={z.cy + 2.5} textAnchor="middle" fontSize="7.5" fontWeight={weight} fill={fill} style={{ pointerEvents: 'none' }}>
        {z.id}
      </text>
    )
  }
  return (
    <text x={z.cx} y={z.cy} textAnchor="middle" fontSize="7.5" fontWeight={weight} fill={fill} style={{ pointerEvents: 'none' }}>
      <tspan x={z.cx} dy="-4">{words[0]}</tspan>
      <tspan x={z.cx} dy="9.5">{words[1]}</tspan>
    </text>
  )
}

// ─── Restaurant pin ───────────────────────────────────────────────────────────
function RestaurantPin({
  r, isSelected, isVisible, onClick,
}: {
  r: Restaurant
  isSelected: boolean
  isVisible: boolean
  onClick: () => void
}) {
  const pos = PIN_POS[r.id]
  if (!pos) return null
  const [px, py] = pos
  const { bg, border } = BADGE_COLOR[r.badge]
  const R = isSelected ? 14 : 11
  const cy = py - R - 2

  return (
    <g
      style={{ cursor: 'pointer', opacity: isVisible ? 1 : 0.15, transition: 'opacity 0.25s' }}
      onClick={e => { e.stopPropagation(); onClick() }}
    >
      {isSelected && (
        <circle cx={px} cy={cy} r={R + 6} fill={border} opacity="0.75" className="pin-pulse" />
      )}
      <circle cx={px} cy={cy} r={R + 2.5} fill="white" />
      <circle cx={px} cy={cy} r={R} fill={bg} />
      <text
        x={px} y={cy + (isSelected ? 3.5 : 4)}
        textAnchor="middle"
        fontSize={isSelected ? '8.5' : '9'}
        fontWeight="bold"
        fill="white"
        style={{ pointerEvents: 'none' }}
      >
        {isSelected ? r.ecoScore.total : r.name[0]}
      </text>
      <path d={`M${px - 3},${py - 5} L${px + 3},${py - 5} L${px},${py}`} fill="white" />
      <path d={`M${px - 2.5},${py - 4.5} L${px + 2.5},${py - 4.5} L${px},${py - 1}`} fill={bg} />
      {isSelected && (
        <g>
          <rect x={px - 14} y={cy - R - 14} width="28" height="11" rx="5.5" fill={bg} />
          <text x={px} y={cy - R - 6} textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="white" style={{ pointerEvents: 'none' }}>
            🌿 {r.ecoScore.total}
          </text>
        </g>
      )}
    </g>
  )
}

// ─── Apple Maps-style bottom preview card ─────────────────────────────────────
function PreviewCard({
  r, lang, saved, onSave, onView, onClose,
}: {
  r: Restaurant
  lang: 'en' | 'es'
  saved: boolean
  onSave: () => void
  onView: () => void
  onClose: () => void
}) {
  const te = (en: string, es: string) => lang === 'es' ? es : en

  return (
    <div className="bg-white rounded-t-2xl shadow-lg border-t border-gray-100 overflow-hidden">
      {/* Handle */}
      <div className="pt-2.5 pb-1 flex justify-center">
        <div className="w-8 h-1 bg-gray-200 rounded-full" />
      </div>

      <div className="px-4 pb-4 pt-1">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          {/* Thumbnail */}
          <div
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${r.videoColor} flex items-center justify-center flex-shrink-0 cursor-pointer`}
            onClick={onView}
          >
            <span className="text-white text-xl font-bold opacity-90">{r.name[0]}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className="font-semibold text-gray-900 text-base leading-tight cursor-pointer"
                onClick={onView}
              >
                {r.name}
              </h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={e => { e.stopPropagation(); onSave() }}
                  aria-label={saved ? te('Unsave', 'Quitar') : te('Save', 'Guardar')}
                >
                  <Heart
                    size={17}
                    className={saved ? 'text-red-500 fill-red-500' : 'text-gray-300 hover:text-red-400'}
                    fill={saved ? 'currentColor' : 'none'}
                  />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onClose() }}
                  aria-label="Close"
                  className="text-gray-300 hover:text-gray-500"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-0.5">
              {lang === 'es' ? r.cuisineEs : r.cuisine} · {r.neighborhood} · {r.priceRange}
            </p>

            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-0.5">
                <Star size={11} className="fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-semibold text-gray-700">{r.rating.toFixed(1)}</span>
                <span className="text-xs text-gray-400">({r.reviewCount})</span>
              </span>
              <EcoBadge badge={r.badge} lang={lang} size="sm" />
            </div>
          </div>
        </div>

        {/* Eco stats row — clean horizontal dividers */}
        <div className="flex items-center bg-gray-50 rounded-xl overflow-hidden mb-3 divide-x divide-gray-200">
          <div className="flex-1 py-2 text-center">
            <div className="text-sm font-bold text-green-700">{r.ecoScore.total}</div>
            <div className="text-xs text-gray-400">EcoScore</div>
          </div>
          <div className="flex-1 py-2 text-center">
            <div className="text-sm font-bold text-amber-600">{r.ecoScore.wastePercent}%</div>
            <div className="text-xs text-gray-400">{te('waste', 'desp.')}</div>
          </div>
          <div className="flex-1 py-2 text-center">
            <div className="text-sm font-bold text-sky-600">{r.ecoScore.offsetPercent}%</div>
            <div className="text-xs text-gray-400">{te('offset', 'CO₂')}</div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={onView}
            className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
          >
            {te('View Restaurant', 'Ver Restaurante')}
          </button>
          <button
            onClick={() =>
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(r.address)}`,
                '_blank',
              )
            }
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 active:bg-sky-200 transition-colors flex-shrink-0"
            aria-label={te('Directions', 'Cómo llegar')}
          >
            <Navigation2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── List view row ────────────────────────────────────────────────────────────
function ListRow({
  r, lang, saved, onSave, onClick,
}: {
  r: Restaurant
  lang: 'en' | 'es'
  saved: boolean
  onSave: (e: React.MouseEvent) => void
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:shadow active:scale-[0.99] transition-all"
    >
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.videoColor} flex items-center justify-center flex-shrink-0`}
      >
        <span className="text-white text-lg font-bold">{r.name[0]}</span>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-sm truncate">{r.name}</h4>
        <p className="text-xs text-gray-500 mt-0.5">
          {r.neighborhood} · {lang === 'es' ? r.cuisineEs : r.cuisine} · {r.priceRange}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="inline-flex items-center gap-0.5">
            <Star size={10} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold text-gray-700">{r.rating.toFixed(1)}</span>
          </span>
          <EcoBadge badge={r.badge} lang={lang} size="sm" />
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
          {r.ecoScore.total}/100
        </span>
        <button
          onClick={onSave}
          className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
            saved ? 'text-red-500' : 'text-gray-300 hover:text-red-400'
          }`}
          aria-label={saved ? 'Unsave' : 'Save'}
        >
          <Heart size={13} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function MiamiMapExplore() {
  const { lang, t } = useLanguage()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery]               = useState('')
  const [activeNeighborhood, setActiveNeighborhood] = useState<Neighborhood | 'All'>('All')
  const [activeCuisine, setActiveCuisine]           = useState('all')
  const [activeEcoFilter, setActiveEcoFilter]       = useState('all')
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [showListView, setShowListView]             = useState(false)
  const [savedIds, setSavedIds]                     = useState<Set<string>>(new Set())
  const [sortBy, setSortBy]                         = useState('ecoscore')
  const [showEcoPanel, setShowEcoPanel]             = useState(false)
  const [showFilterSheet, setShowFilterSheet]       = useState(false)
  const [showSortPanel, setShowSortPanel]           = useState(false)

  // ─── Map pan state ────────────────────────────────────────────────────────
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging]                 = useState(false)
  const svgRef                                       = useRef<SVGSVGElement>(null)
  const dragRef                                      = useRef<{
    startX: number; startY: number; panX: number; panY: number; moved: boolean
  } | null>(null)
  const didDragRef                                   = useRef(false)

  const PAN_X_MIN = -65
  const PAN_X_MAX = 15
  const PAN_Y_MIN = -20
  const PAN_Y_MAX = 20

  const startDrag = (clientX: number, clientY: number) => {
    dragRef.current = { startX: clientX, startY: clientY, panX: panOffset.x, panY: panOffset.y, moved: false }
    setIsDragging(true)
    didDragRef.current = false
  }

  const moveDrag = (clientX: number, clientY: number) => {
    if (!dragRef.current || !svgRef.current) return
    const dx = clientX - dragRef.current.startX
    const dy = clientY - dragRef.current.startY
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      dragRef.current.moved = true
      didDragRef.current = true
    }
    const rect = svgRef.current.getBoundingClientRect()
    const scaleX = 350 / rect.width
    const scaleY = 276 / rect.height
    setPanOffset({
      x: Math.max(PAN_X_MIN, Math.min(PAN_X_MAX, dragRef.current.panX + dx * scaleX)),
      y: Math.max(PAN_Y_MIN, Math.min(PAN_Y_MAX, dragRef.current.panY + dy * scaleY)),
    })
  }

  const endDrag = () => {
    dragRef.current = null
    setIsDragging(false)
    setTimeout(() => { didDragRef.current = false }, 50)
  }

  const cuisines = useMemo(() => {
    const seen = new Set<string>()
    restaurants.forEach(r => seen.add(lang === 'es' ? r.cuisineEs : r.cuisine))
    return Array.from(seen)
  }, [lang])

  const filtered = useMemo(() => {
    return restaurants.filter(r => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const hit =
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.cuisineEs.toLowerCase().includes(q) ||
          r.neighborhood.toLowerCase().includes(q) ||
          r.badge.includes(q) ||
          r.tags.some(tag => tag.toLowerCase().includes(q)) ||
          r.tagsEs.some(tag => tag.toLowerCase().includes(q))
        if (!hit) return false
      }
      if (activeNeighborhood !== 'All' && r.neighborhood !== activeNeighborhood) return false
      const cuisine = lang === 'es' ? r.cuisineEs : r.cuisine
      if (activeCuisine !== 'all' && cuisine !== activeCuisine) return false
      if (!passesEcoFilter(r, activeEcoFilter)) return false
      return true
    })
  }, [searchQuery, activeNeighborhood, activeCuisine, activeEcoFilter, lang])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortBy === 'ecoscore') return b.ecoScore.total - a.ecoScore.total
      if (sortBy === 'rating')   return b.rating - a.rating
      if (sortBy === 'waste')    return a.ecoScore.wastePercent - b.ecoScore.wastePercent
      if (sortBy === 'offset')   return b.ecoScore.offsetPercent - a.ecoScore.offsetPercent
      if (sortBy === 'popular')  return b.reviewCount - a.reviewCount
      return 0
    })
  }, [filtered, sortBy])

  const filteredIds = useMemo(() => new Set(filtered.map(r => r.id)), [filtered])

  const toggleSave = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setSavedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handlePinClick = (r: Restaurant) => {
    setSelectedRestaurant(prev => (prev?.id === r.id ? null : r))
    setShowListView(false)
    setShowEcoPanel(false)
    setShowFilterSheet(false)
  }

  const handleZoneClick = (n: Neighborhood) => {
    setActiveNeighborhood(prev => (prev === n ? 'All' : n))
    setSelectedRestaurant(null)
  }

  const closeAll = () => {
    setShowEcoPanel(false)
    setShowFilterSheet(false)
    setShowSortPanel(false)
  }

  const ecoLabel = (id: string) => ECO_FILTERS.find(f => f.id === id)?.[lang] ?? ''
  const sortLabel = (id: string) => SORT_OPTIONS.find(s => s.id === id)?.[lang] ?? ''

  const activeFilterCount = [
    activeNeighborhood !== 'All',
    activeCuisine !== 'all',
    activeEcoFilter !== 'all',
  ].filter(Boolean).length

  const cardVisible = !!selectedRestaurant

  return (
    <div
      className="fixed left-0 right-0 bg-gray-200 flex justify-center"
      style={{ top: 56, bottom: 52 }}
    >
    <div
      className="relative w-full max-w-xl overflow-hidden bg-[#5fbfcf] shadow-xl"
      onClick={closeAll}
    >
      {/* ─── Search + filter bar ──────────────────────────────────────────── */}
      <div
        className="absolute top-0 left-0 right-0 z-40"
        onClick={e => e.stopPropagation()}
      >
        {/* Search row */}
        <div className="px-3 pt-2.5 pb-2 flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            <input
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setSelectedRestaurant(null) }}
              placeholder={t('Search restaurants, cuisine…', 'Busca restaurantes, cocina…')}
              className="w-full pl-9 pr-8 py-2.5 bg-white rounded-xl text-sm border-0 outline-none shadow focus:ring-2 focus:ring-green-300 transition-shadow"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter icon button */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => { setShowFilterSheet(v => !v); setShowEcoPanel(false) }}
              className={`w-10 h-10 rounded-xl shadow flex items-center justify-center transition-colors ${
                activeFilterCount > 0 ? 'bg-green-600 text-white' : 'bg-white text-gray-500'
              }`}
            >
              <SlidersHorizontal size={15} />
            </button>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center pointer-events-none">
                {activeFilterCount}
              </span>
            )}
          </div>
        </div>

        {/* Neighbourhood quick chips */}
        <div className="flex gap-1.5 overflow-x-auto px-3 pb-2.5 scrollbar-hide">
          <button
            onClick={() => { setActiveNeighborhood('All'); setSelectedRestaurant(null) }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm whitespace-nowrap transition-all ${
              activeNeighborhood === 'All'
                ? 'bg-green-600 text-white shadow'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t('All Areas', 'Todo Miami')}
          </button>

          {NEIGHBORHOODS.map(n => (
            <button
              key={n}
              onClick={() => { setActiveNeighborhood(prev => prev === n ? 'All' : n); setSelectedRestaurant(null) }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm whitespace-nowrap transition-all ${
                activeNeighborhood === n
                  ? 'bg-green-600 text-white shadow'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Filter sheet dropdown */}
      {showFilterSheet && (
        <div
          className="absolute left-3 right-3 z-50 bg-white rounded-2xl shadow-xl p-4"
          style={{ top: 108 }}
          onClick={e => e.stopPropagation()}
        >
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
            {t('Cuisine', 'Cocina')}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            <button
              onClick={() => setActiveCuisine('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                activeCuisine === 'all'
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-gray-50 text-gray-600 border-gray-200'
              }`}
            >
              {t('All', 'Todas')}
            </button>
            {cuisines.map(c => (
              <button
                key={c}
                onClick={() => setActiveCuisine(prev => prev === c ? 'all' : c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  activeCuisine === c
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-amber-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
            {t('EcoScore', 'EcoScore')}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {ECO_FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveEcoFilter(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  activeEcoFilter === f.id
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-100 hover:border-emerald-300'
                }`}
              >
                {lang === 'es' ? f.es : f.en}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveCuisine('all')
                setActiveEcoFilter('all')
                setActiveNeighborhood('All')
                setSearchQuery('')
              }}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {t('Clear all', 'Limpiar todo')}
            </button>
            <button
              onClick={() => setShowFilterSheet(false)}
              className="flex-1 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors"
            >
              {t('Apply', 'Aplicar')} {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>
        </div>
      )}

      {/* ─── Map area ─────────────────────────────────────────────────────── */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{ top: 112 }}
        onClick={closeAll}
      >
        <div className="absolute inset-0 flex items-start justify-center pt-0">
          <svg
            ref={svgRef}
            viewBox={MAP_VB}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
            style={{ display: 'block', cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
            onMouseDown={e => { e.preventDefault(); startDrag(e.clientX, e.clientY) }}
            onMouseMove={e => moveDrag(e.clientX, e.clientY)}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            onTouchStart={e => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={e => { e.preventDefault(); moveDrag(e.touches[0].clientX, e.touches[0].clientY) }}
            onTouchEnd={endDrag}
            onClickCapture={e => { if (didDragRef.current) { e.stopPropagation(); e.preventDefault() } }}
          >
            <g transform={`translate(${panOffset.x} ${panOffset.y})`}>
            <image
              href="/miami-map.png"
              x="0"
              y="0"
              width="350"
              height="276"
              preserveAspectRatio="xMidYMid slice"
            />

            {ZONES.map(z => {
              const isActive  = activeNeighborhood === z.id
              const hasResult = filtered.some(r => r.neighborhood === z.id)

              const fillOpacity = isActive
                ? 0.55
                : activeNeighborhood !== 'All' && !isActive
                  ? 0.08
                  : hasResult
                    ? 0.28
                    : 0.12

              const strokeOpacity = activeNeighborhood !== 'All' && !isActive ? 0.2 : 1

              return (
                <g key={z.id} onClick={e => { e.stopPropagation(); handleZoneClick(z.id) }} style={{ cursor: 'pointer' }}>
                  <rect
                    x={z.x} y={z.y} width={z.w} height={z.h} rx={z.rx}
                    fill={isActive ? z.stroke : z.fill}
                    fillOpacity={fillOpacity}
                    stroke={z.stroke}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    strokeOpacity={strokeOpacity}
                    style={{ transition: 'all 0.2s' }}
                  />
                  <ZoneLabel z={z} isActive={isActive} />
                </g>
              )
            })}

            {[...restaurants]
              .sort((a, b) => a.ecoScore.total - b.ecoScore.total)
              .map(r => (
                <RestaurantPin
                  key={r.id}
                  r={r}
                  isSelected={selectedRestaurant?.id === r.id}
                  isVisible={filteredIds.has(r.id)}
                  onClick={() => handlePinClick(r)}
                />
              ))}

            <rect x="80" y="263" width="190" height="11" rx="5.5" fill="rgba(0,0,0,0.30)" />
            <text x="175" y="271" textAnchor="middle" fontSize="6.5" fontWeight="500" fill="white" style={{ pointerEvents: 'none' }}>
              {t('Drag to explore · Tap a pin or zone', 'Arrastra para explorar · Toca un pin')}
            </text>
            </g>
          </svg>
        </div>

        {/* Result count chip */}
        <div
          className="absolute left-4 z-30 transition-all duration-300"
          style={{ bottom: cardVisible ? 260 : 16 }}
        >
          <span className="bg-white/90 backdrop-blur-sm text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm border border-white/60">
            {filtered.length} {t('spots', 'lugares')}
          </span>
        </div>

        {/* List / Map toggle button */}
        <div
          className="absolute right-4 z-30 transition-all duration-300"
          style={{ bottom: cardVisible ? 260 : 16 }}
        >
          <button
            onClick={e => { e.stopPropagation(); setShowListView(v => !v); setSelectedRestaurant(null) }}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full shadow font-semibold text-sm transition-all active:scale-95 ${
              showListView
                ? 'bg-gray-800 text-white'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {showListView
              ? <><MapIcon size={14} />{t('Map', 'Mapa')}</>
              : <><List size={14} />{t('List', 'Lista')}</>
            }
          </button>
        </div>

        {/* Preview card */}
        <div
          className="absolute left-0 right-0 bottom-0 z-30 transition-transform duration-300 ease-out"
          style={{ transform: cardVisible ? 'translateY(0)' : 'translateY(110%)' }}
          onClick={e => e.stopPropagation()}
        >
          {selectedRestaurant && (
            <PreviewCard
              r={selectedRestaurant}
              lang={lang}
              saved={savedIds.has(selectedRestaurant.id)}
              onSave={() => toggleSave(selectedRestaurant.id)}
              onView={() => navigate(`/restaurant/${selectedRestaurant.id}`)}
              onClose={() => setSelectedRestaurant(null)}
            />
          )}
        </div>

        {/* List view panel */}
        <div
          className="absolute left-0 right-0 bottom-0 z-40 bg-white rounded-t-2xl shadow-xl flex flex-col transition-transform duration-300 ease-out"
          style={{ top: 0, transform: showListView ? 'translateY(0)' : 'translateY(100%)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Handle + header */}
          <div className="px-4 pt-3 pb-2 border-b border-gray-100 flex-shrink-0">
            <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto mb-3" />
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900">
                  {t('Restaurants', 'Restaurantes')}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {sorted.length} {t('results in Miami', 'resultados en Miami')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSortPanel(v => !v)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full"
                >
                  <ArrowUpDown size={11} />
                  {sortLabel(sortBy)}
                  <ChevronDown size={11} className={showSortPanel ? 'rotate-180' : ''} style={{ transition: 'transform 0.2s' }} />
                </button>
                <button
                  onClick={() => setShowListView(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {showSortPanel && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {SORT_OPTIONS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setSortBy(s.id); setShowSortPanel(false) }}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      sortBy === s.id
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-green-300'
                    }`}
                  >
                    {lang === 'es' ? s.es : s.en}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
            {sorted.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-semibold text-gray-700">{t('No restaurants match', 'Sin resultados')}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {t('Try adjusting your filters', 'Intenta ajustar los filtros')}
                </p>
                <button
                  onClick={() => { setActiveCuisine('all'); setActiveEcoFilter('all'); setActiveNeighborhood('All'); setSearchQuery('') }}
                  className="mt-4 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-full"
                >
                  {t('Clear filters', 'Limpiar filtros')}
                </button>
              </div>
            ) : (
              sorted.map(r => (
                <ListRow
                  key={r.id}
                  r={r}
                  lang={lang}
                  saved={savedIds.has(r.id)}
                  onSave={e => toggleSave(r.id, e)}
                  onClick={() => { setShowListView(false); navigate(`/restaurant/${r.id}`) }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
