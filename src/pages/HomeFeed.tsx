import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Star,
  Bookmark,
  MapPin,
  ChevronUp,
  ChevronDown,
  Navigation,
  MessageSquare,
  TrendingUp,
  Leaf,
} from 'lucide-react'
import { restaurants } from '../data/restaurants'
import { useLanguage } from '../context/LanguageContext'
import type { Neighborhood, Restaurant } from '../types'
import EcoBadge from '../components/EcoBadge'

const neighborhoods: Neighborhood[] = [
  'Calle Ocho',
  'Brickell',
  'Doral',
  'Little Haiti',
  'Wynwood',
  'Overtown',
  'South Beach',
  'Coral Gables',
]

const cuisineEmojis: Record<string, string> = {
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
}

function VideoCard({ restaurant, isActive }: { restaurant: Restaurant; isActive: boolean }) {
  const { lang, t } = useLanguage()
  const [saved, setSaved] = useState(false)

  const cuisine = lang === 'es' ? restaurant.cuisineEs : restaurant.cuisine
  const description = lang === 'es' ? restaurant.descriptionEs : restaurant.description
  const featuredDish = lang === 'es' ? restaurant.featuredDishEs : restaurant.featuredDish
  const emoji = cuisineEmojis[restaurant.cuisine] || '🍽️'

  const ecoColor =
    restaurant.badge === 'platinum'
      ? 'text-cyan-400'
      : restaurant.badge === 'gold'
      ? 'text-yellow-400'
      : restaurant.badge === 'silver'
      ? 'text-slate-300'
      : 'text-orange-400'

  return (
    <div
      className={`relative w-full h-full flex flex-col transition-opacity duration-300 ${
        isActive ? 'opacity-100' : 'opacity-60'
      }`}
    >
      {/* Video placeholder */}
      <div className={`absolute inset-0 bg-gradient-to-b ${restaurant.videoColor} to-black`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl opacity-20">{emoji}</span>
        </div>
        {/* Animated play indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm rounded-full p-5 border border-white/20">
          <span className="text-5xl">{emoji}</span>
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 text-white">
        {/* Tags row */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {restaurant.trending && (
            <span className="flex items-center gap-1 bg-orange-500/90 backdrop-blur text-white text-xs font-bold px-2 py-0.5 rounded-full">
              <TrendingUp size={10} />
              {t('Trending', 'Tendencia')}
            </span>
          )}
          {restaurant.risingGreenStar && (
            <span className="flex items-center gap-1 bg-green-500/90 backdrop-blur text-white text-xs font-bold px-2 py-0.5 rounded-full">
              <Leaf size={10} />
              {t('Rising Green Star', 'Estrella Verde')}
            </span>
          )}
        </div>

        {/* Restaurant name and neighborhood */}
        <h2 className="text-2xl font-black leading-tight mb-1">{restaurant.name}</h2>
        <div className="flex items-center gap-1 text-white/80 text-sm mb-2">
          <MapPin size={12} />
          <span>{restaurant.neighborhood}</span>
          <span className="mx-1">·</span>
          <span>{cuisine}</span>
          <span className="mx-1">·</span>
          <span>{restaurant.priceRange}</span>
        </div>

        {/* Featured dish */}
        <p className="text-white/90 text-sm mb-3">
          {emoji} {t('Try: ', 'Prueba: ')}<span className="font-semibold">{featuredDish}</span>
        </p>

        {/* Description */}
        <p className="text-white/70 text-xs mb-4 line-clamp-2">{description}</p>

        {/* Stats row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-sm">{restaurant.rating}</span>
            <span className="text-white/60 text-xs">({restaurant.reviewCount})</span>
          </div>
          <div className={`flex items-center gap-1 ${ecoColor}`}>
            <span className="font-bold text-sm">EcoScore {restaurant.ecoScore.total}</span>
          </div>
          <div>
            <EcoBadge badge={restaurant.badge} lang={lang} size="sm" />
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-4 gap-2">
          <Link
            to={`/restaurant/${restaurant.id}`}
            className="col-span-2 bg-green-500 hover:bg-green-400 text-white font-bold text-sm py-2.5 rounded-xl text-center transition-colors"
          >
            {t('View Menu', 'Ver Menú')}
          </Link>
          <button
            onClick={() => setSaved(!saved)}
            className={`flex items-center justify-center gap-1 font-semibold text-sm py-2.5 rounded-xl border transition-colors ${
              saved
                ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400'
                : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
            }`}
            aria-label={saved ? t('Unsave', 'Eliminar guardado') : t('Save', 'Guardar')}
          >
            <Bookmark size={14} className={saved ? 'fill-yellow-400' : ''} />
          </button>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors"
            aria-label={t('Get Directions', 'Obtener Direcciones')}
          >
            <Navigation size={14} />
          </a>
        </div>
      </div>

      {/* Side actions */}
      <div className="absolute right-3 bottom-32 flex flex-col gap-4">
        <Link
          to={`/restaurant/${restaurant.id}#reviews`}
          className="flex flex-col items-center gap-1 text-white"
        >
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
            <MessageSquare size={18} />
          </div>
          <span className="text-xs text-white/80">{restaurant.reviewCount}</span>
        </Link>
      </div>
    </div>
  )
}

export default function HomeFeed() {
  const { lang, t } = useLanguage()
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | 'All'>('All')

  const filtered =
    selectedNeighborhood === 'All'
      ? restaurants
      : restaurants.filter((r) => r.neighborhood === selectedNeighborhood)

  const current = filtered[activeIndex] ?? filtered[0]

  const goNext = () => setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
  const goPrev = () => setActiveIndex((i) => Math.max(i - 1, 0))

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Neighborhood filter bar */}
      <div className="fixed top-[57px] left-0 right-0 z-40 bg-black/80 backdrop-blur-sm">
        <div className="max-w-lg mx-auto px-3 py-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <button
              onClick={() => { setSelectedNeighborhood('All'); setActiveIndex(0) }}
              className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                selectedNeighborhood === 'All'
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-transparent text-white/70 border-white/30 hover:border-white/60'
              }`}
            >
              {t('All Miami', 'Todo Miami')}
            </button>
            {neighborhoods.map((n) => (
              <button
                key={n}
                onClick={() => { setSelectedNeighborhood(n); setActiveIndex(0) }}
                className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
                  selectedNeighborhood === n
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-transparent text-white/70 border-white/30 hover:border-white/60'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main feed */}
      <div className="flex-1 relative pt-[97px] pb-16">
        <div className="max-w-lg mx-auto h-full relative">
          {filtered.length > 0 && current ? (
            <VideoCard restaurant={current} isActive={true} />
          ) : (
            <div className="flex items-center justify-center h-full text-white/60 text-center px-8">
              <div>
                <p className="text-4xl mb-3">🌿</p>
                <p className="font-semibold">{t('No restaurants in this neighborhood yet.', 'No hay restaurantes en este barrio todavía.')}</p>
              </div>
            </div>
          )}

          {/* Navigation arrows */}
          {filtered.length > 1 && (
            <>
              <button
                onClick={goPrev}
                disabled={activeIndex === 0}
                className="absolute right-3 top-1/3 bg-white/10 backdrop-blur text-white rounded-full p-2 disabled:opacity-30 hover:bg-white/20 transition-colors"
                aria-label={t('Previous restaurant', 'Restaurante anterior')}
              >
                <ChevronUp size={20} />
              </button>
              <button
                onClick={goNext}
                disabled={activeIndex === filtered.length - 1}
                className="absolute right-3 top-1/2 bg-white/10 backdrop-blur text-white rounded-full p-2 disabled:opacity-30 hover:bg-white/20 transition-colors"
                aria-label={t('Next restaurant', 'Siguiente restaurante')}
              >
                <ChevronDown size={20} />
              </button>
            </>
          )}

          {/* Progress dots */}
          {filtered.length > 1 && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
              {filtered.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-1.5 rounded-full transition-all ${
                    i === activeIndex ? 'h-6 bg-green-400' : 'h-1.5 bg-white/30'
                  }`}
                  aria-label={`${t('Restaurant', 'Restaurante')} ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Counter */}
      {filtered.length > 0 && (
        <div className="fixed top-[97px] right-4 z-40">
          <span className="text-white/60 text-xs">
            {activeIndex + 1}/{filtered.length}
          </span>
        </div>
      )}
    </div>
  )
}
