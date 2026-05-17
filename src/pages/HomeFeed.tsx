import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Star,
  Bookmark,
  MapPin,
  Navigation,
  MessageSquare,
  Leaf,
  TrendingUp,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  Play,
  Pause,
  UtensilsCrossed,
  X,
} from 'lucide-react'
import { restaurants } from '../data/restaurants'
import { useLanguage } from '../context/LanguageContext'
import type { Neighborhood, Restaurant } from '../types'
import EcoBadge from '../components/EcoBadge'

// ─── Constants ────────────────────────────────────────────────────────────────

const NEIGHBORHOODS: Neighborhood[] = [
  'Calle Ocho',
  'Brickell',
  'Doral',
  'Little Haiti',
  'Wynwood',
  'Overtown',
  'Coral Gables',
]

const BADGE_OPTIONS = [
  { value: 'All',      labelEn: 'All badges',  labelEs: 'Todas' },
  { value: 'platinum', labelEn: '⚡ Platinum',  labelEs: '⚡ Platino' },
  { value: 'gold',     labelEn: '🌿 Gold',      labelEs: '🌿 Oro' },
  { value: 'silver',   labelEn: 'Silver',       labelEs: 'Plata' },
  { value: 'bronze',   labelEn: 'Bronze',       labelEs: 'Bronce' },
]

const CUISINE_EMOJI: Record<string, string> = {
  Cuban: '🇨🇺',
  American: '🍔',
  Venezuelan: '🫓',
  Haitian: '🌶️',
  'Plant-Based Fusion': '🌿',
  'Soul Food': '❤️',
  Seafood: '🐟',
  Mediterranean: '🫒',
  'Puerto Rican': '🇵🇷',
  'Haitian Fusion': '🌺',
  Italian: '🇮🇹',
  'Latin American': '🌎',
  'Craft Burgers': '🍔',
  'Nikkei Fusion': '🍣',
}

// ─── VideoCard ────────────────────────────────────────────────────────────────

function VideoCard({
  restaurant,
  onVisible,
}: {
  restaurant: Restaurant
  onVisible: () => void
}) {
  const { lang, t } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const onVisibleRef = useRef(onVisible)
  onVisibleRef.current = onVisible

  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [flashIcon, setFlashIcon] = useState<'play' | 'pause' | null>(null)
  const [saved, setSaved] = useState(false)

  const cuisine = lang === 'es' ? restaurant.cuisineEs : restaurant.cuisine
  const featuredDish = lang === 'es' ? restaurant.featuredDishEs : restaurant.featuredDish
  const emoji = CUISINE_EMOJI[restaurant.cuisine] ?? '🍽️'
  const hasVideo = Boolean(restaurant.videoThumb)

  const ecoTextColor =
    restaurant.badge === 'platinum' ? 'text-cyan-400'
    : restaurant.badge === 'gold'   ? 'text-yellow-400'
    : restaurant.badge === 'silver' ? 'text-slate-300'
    : 'text-orange-400'

  // Auto-play/pause via IntersectionObserver
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          onVisibleRef.current()
          if (videoRef.current) {
            videoRef.current.play().then(() => setPlaying(true)).catch(() => {})
          }
        } else {
          if (videoRef.current) {
            videoRef.current.pause()
            setPlaying(false)
          }
        }
      },
      { threshold: 0.6 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleTap = () => {
    if (!hasVideo || !videoRef.current) return
    if (playing) {
      videoRef.current.pause()
      setPlaying(false)
      setFlashIcon('pause')
    } else {
      videoRef.current.play().then(() => setPlaying(true)).catch(() => {})
      setFlashIcon('play')
    }
    setTimeout(() => setFlashIcon(null), 650)
  }

  const handleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current) return
    videoRef.current.muted = !muted
    setMuted(m => !m)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full flex-shrink-0 snap-start overflow-hidden bg-black"
      style={{ height: 'calc(100dvh - 57px)' }}
    >
      {/* ── Background: video or gradient ───────────── */}
      {hasVideo ? (
        <video
          ref={videoRef}
          src={restaurant.videoThumb}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          muted={muted}
          playsInline
          preload="metadata"
          onClick={handleTap}
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-b ${restaurant.videoColor} to-black cursor-pointer`}
          onClick={handleTap}
        >
          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
            <span className="text-[11rem] opacity-[0.08]">{emoji}</span>
          </div>
        </div>
      )}

      {/* ── Bottom-heavy gradient scrim ──────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.55) 32%, rgba(0,0,0,0.1) 60%, transparent 100%)',
        }}
      />

      {/* ── Play / Pause flash ──────────────────────── */}
      {flashIcon && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="play-flash bg-black/45 rounded-full p-5 backdrop-blur-sm">
            {flashIcon === 'play'
              ? <Play size={36} className="text-white fill-white ml-1" />
              : <Pause size={36} className="text-white fill-white" />}
          </div>
        </div>
      )}

      {/* ── Top badges ──────────────────────────────── */}
      <div className="absolute top-3 left-3 z-10 flex gap-2 pointer-events-none">
        {restaurant.trending && (
          <span className="flex items-center gap-1 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
            <TrendingUp size={10} /> {t('Trending', 'Tendencia')}
          </span>
        )}
        {restaurant.risingGreenStar && (
          <span className="flex items-center gap-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
            <Leaf size={10} /> {t('Rising Green Star', 'Estrella Verde')}
          </span>
        )}
      </div>

      {/* ── Mute toggle ─────────────────────────────── */}
      {hasVideo && (
        <button
          onClick={handleMute}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          aria-label={muted ? t('Unmute', 'Activar sonido') : t('Mute', 'Silenciar')}
        >
          {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>
      )}

      {/* ── Side action buttons (TikTok-style) ──────── */}
      <div
        className="absolute right-3 z-10 flex flex-col items-center gap-5"
        style={{ bottom: 'calc(8rem + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Save */}
        <button
          onClick={() => setSaved(s => !s)}
          className="flex flex-col items-center gap-1"
          aria-label={saved ? t('Unsave', 'Eliminar') : t('Save', 'Guardar')}
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-sm border transition-colors ${
              saved
                ? 'bg-yellow-400/20 border-yellow-400/60'
                : 'bg-black/50 border-white/25 hover:bg-black/70'
            }`}
          >
            <Bookmark
              size={18}
              className={saved ? 'fill-yellow-400 text-yellow-400' : 'text-white'}
            />
          </div>
          <span className="text-white/60 text-[11px]">{t('Save', 'Guardar')}</span>
        </button>

        {/* Reviews */}
        <Link
          to={`/restaurant/${restaurant.id}#reviews`}
          className="flex flex-col items-center gap-1"
          onClick={e => e.stopPropagation()}
        >
          <div className="w-11 h-11 bg-black/50 border border-white/25 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
            <MessageSquare size={18} className="text-white" />
          </div>
          <span className="text-white/60 text-[11px]">{restaurant.reviewCount}</span>
        </Link>

        {/* Directions */}
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1"
          onClick={e => e.stopPropagation()}
        >
          <div className="w-11 h-11 bg-black/50 border border-white/25 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
            <Navigation size={18} className="text-white" />
          </div>
          <span className="text-white/60 text-[11px]">{t('Map', 'Mapa')}</span>
        </a>
      </div>

      {/* ── Bottom info overlay ──────────────────────── */}
      <div
        className="absolute bottom-0 left-0 z-10 px-4 pt-6"
        style={{
          right: '72px',
          paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px) + 64px)',
        }}
      >
        {/* Restaurant name */}
        <Link
          to={`/restaurant/${restaurant.id}`}
          onClick={e => e.stopPropagation()}
          className="block mb-1"
        >
          <h2 className="text-[1.65rem] font-bold text-white leading-tight hover:underline underline-offset-2">
            {restaurant.name}
          </h2>
        </Link>

        {/* Location · cuisine · price */}
        <div className="flex items-center flex-wrap gap-x-1.5 gap-y-0.5 text-white/75 text-[13px] mb-2.5">
          <MapPin size={11} className="shrink-0" />
          <span>{restaurant.neighborhood}</span>
          <span className="text-white/35">·</span>
          <span>{cuisine}</span>
          <span className="text-white/35">·</span>
          <span className="text-white/55">{restaurant.priceRange}</span>
        </div>

        {/* Featured dish */}
        <p className="text-[13px] text-white/85 mb-3 leading-snug">
          {emoji}{' '}
          <span className="text-white/50">{t('Try:', 'Prueba:')}</span>{' '}
          <span className="font-semibold">{featuredDish}</span>
        </p>

        {/* Rating + EcoScore + Badge */}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 mb-3">
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-white font-semibold text-[13px]">{restaurant.rating}</span>
            <span className="text-white/45 text-[11px]">({restaurant.reviewCount})</span>
          </div>
          <div className={`flex items-center gap-1 ${ecoTextColor}`}>
            <Leaf size={12} />
            <span className="font-semibold text-[13px]">EcoScore {restaurant.ecoScore.total}</span>
          </div>
          <EcoBadge badge={restaurant.badge} lang={lang} size="sm" />
        </div>

        {/* Eco stats pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="bg-green-950/80 backdrop-blur-sm border border-green-700/40 text-green-300 text-[11px] font-medium px-2.5 py-1 rounded-full">
            ♻️ {restaurant.ecoScore.offsetPercent}%{' '}
            {t('carbon offset', 'carbono offset')}
          </span>
          <span className="bg-emerald-950/80 backdrop-blur-sm border border-emerald-700/40 text-emerald-300 text-[11px] font-medium px-2.5 py-1 rounded-full">
            🗑️ {restaurant.ecoScore.wastePercent}%{' '}
            {t('food waste', 'desperdicio')}
          </span>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-2">
          <Link
            to={`/restaurant/${restaurant.id}`}
            className="flex-1 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-semibold text-sm py-2.5 rounded-xl text-center transition-colors"
            onClick={e => e.stopPropagation()}
          >
            {t('View Restaurant', 'Ver Restaurante')}
          </Link>
          <Link
            to={`/restaurant/${restaurant.id}`}
            className="flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-colors"
            onClick={e => e.stopPropagation()}
          >
            <UtensilsCrossed size={14} />
            {t('Menu', 'Menú')}
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── HomeFeed ─────────────────────────────────────────────────────────────────

export default function HomeFeed() {
  const { lang, t } = useLanguage()
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedHood, setSelectedHood] = useState<Neighborhood | 'All'>('All')
  const [selectedCuisine, setSelectedCuisine] = useState('All')
  const [selectedBadge, setSelectedBadge] = useState('All')
  const [showFilters, setShowFilters] = useState(false)

  const allCuisines = ['All', ...Array.from(new Set(restaurants.map(r => r.cuisine)))]

  const filtered = restaurants.filter(r => {
    if (selectedHood !== 'All' && r.neighborhood !== selectedHood) return false
    if (selectedCuisine !== 'All' && r.cuisine !== selectedCuisine) return false
    if (selectedBadge !== 'All' && r.badge !== selectedBadge) return false
    return true
  })

  const activeFilterCount =
    (selectedHood !== 'All' ? 1 : 0) +
    (selectedCuisine !== 'All' ? 1 : 0) +
    (selectedBadge !== 'All' ? 1 : 0)

  const clearFilters = () => {
    setSelectedHood('All')
    setSelectedCuisine('All')
    setSelectedBadge('All')
    setActiveIndex(0)
  }

  const applyAndClose = () => {
    setActiveIndex(0)
    setShowFilters(false)
  }

  return (
    <div className="bg-black" style={{ height: '100dvh' }}>

      {/* ── Neighborhood filter bar ──────────────────── */}
      <div className="fixed top-[57px] left-0 right-0 z-40 bg-black/85 backdrop-blur-md border-b border-white/[0.07]">
        <div className="max-w-lg mx-auto px-3 py-2 flex items-center gap-2">
          <div className="flex-1 flex gap-1.5 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => { setSelectedHood('All'); setActiveIndex(0) }}
              className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                selectedHood === 'All'
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-transparent text-white/60 border-white/25 hover:border-white/50 hover:text-white/80'
              }`}
            >
              {t('All Miami', 'Todo Miami')}
            </button>
            {NEIGHBORHOODS.map(n => (
              <button
                key={n}
                onClick={() => { setSelectedHood(n); setActiveIndex(0) }}
                className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
                  selectedHood === n
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-transparent text-white/60 border-white/25 hover:border-white/50 hover:text-white/80'
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          {/* More filters button */}
          <button
            onClick={() => setShowFilters(s => !s)}
            className={`relative flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border transition-colors ${
              activeFilterCount > 0
                ? 'bg-green-600 border-green-600 text-white'
                : 'bg-transparent border-white/25 text-white/60 hover:border-white/50 hover:text-white/80'
            }`}
            aria-label={t('More filters', 'Más filtros')}
          >
            <SlidersHorizontal size={14} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 rounded-full text-[9px] font-bold flex items-center justify-center text-white leading-none">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Counter ──────────────────────────────────── */}
      {filtered.length > 0 && (
        <div className="fixed top-[57px] right-4 z-50 pt-2.5 pointer-events-none">
          <span className="text-white/35 text-[11px] tabular-nums">
            {activeIndex + 1} / {filtered.length}
          </span>
        </div>
      )}

      {/* ── Filter panel (bottom sheet) ──────────────── */}
      {showFilters && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm"
          onClick={() => setShowFilters(false)}
        >
          <div
            className="bg-gray-950 border-t border-white/10 rounded-t-3xl px-5 pt-5 pb-8 max-w-lg w-full mx-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-base">
                {t('Filter Feed', 'Filtrar Feed')}
              </h3>
              <div className="flex items-center gap-4">
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-green-400 text-sm hover:text-green-300 transition-colors"
                  >
                    {t('Clear all', 'Limpiar todo')}
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Cuisine */}
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2.5">
              {t('Cuisine Type', 'Tipo de cocina')}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {allCuisines.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCuisine(c)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                    selectedCuisine === c
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-transparent text-white/60 border-white/20 hover:border-white/40'
                  }`}
                >
                  {c === 'All'
                    ? t('All cuisines', 'Todas las cocinas')
                    : `${CUISINE_EMOJI[c] ?? '🍽️'} ${c}`}
                </button>
              ))}
            </div>

            {/* Eco badge */}
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2.5">
              {t('Eco Badge', 'Insignia Eco')}
            </p>
            <div className="flex flex-wrap gap-2 mb-7">
              {BADGE_OPTIONS.map(b => (
                <button
                  key={b.value}
                  onClick={() => setSelectedBadge(b.value)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                    selectedBadge === b.value
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-transparent text-white/60 border-white/20 hover:border-white/40'
                  }`}
                >
                  {lang === 'es' ? b.labelEs : b.labelEn}
                </button>
              ))}
            </div>

            {/* Apply button */}
            <button
              onClick={applyAndClose}
              className={`w-full font-semibold text-sm py-3.5 rounded-2xl transition-colors ${
                filtered.length > 0
                  ? 'bg-green-600 hover:bg-green-500 text-white'
                  : 'bg-white/10 text-white/40 cursor-default'
              }`}
            >
              {filtered.length > 0
                ? t(
                    `Show ${filtered.length} restaurant${filtered.length !== 1 ? 's' : ''}`,
                    `Ver ${filtered.length} restaurante${filtered.length !== 1 ? 's' : ''}`,
                  )
                : t('No results', 'Sin resultados')}
            </button>
          </div>
        </div>
      )}

      {/* ── Scroll feed ──────────────────────────────── */}
      <div
        className="fixed left-0 right-0 bottom-0 overflow-y-scroll scrollbar-hide"
        style={{
          top: '97px',
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {filtered.length > 0 ? (
          filtered.map((restaurant, i) => (
            <VideoCard
              key={restaurant.id}
              restaurant={restaurant}
              onVisible={() => setActiveIndex(i)}
            />
          ))
        ) : (
          <div
            className="flex items-center justify-center text-center px-8"
            style={{ height: 'calc(100dvh - 97px)' }}
          >
            <div>
              <p className="text-5xl mb-4">🌿</p>
              <p className="text-white/70 font-medium text-lg mb-3">
                {t('No restaurants match your filters.', 'Ningún restaurante coincide.')}
              </p>
              <button
                onClick={clearFilters}
                className="text-green-400 underline underline-offset-2 text-sm hover:text-green-300 transition-colors"
              >
                {t('Clear all filters', 'Limpiar filtros')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
