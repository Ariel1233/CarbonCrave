import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Star, MapPin, Phone, Clock, ArrowLeft,
  Leaf, Recycle, CheckCircle, User, TrendingUp,
} from 'lucide-react'
import { getRestaurantById } from '../data/restaurants'
import { useLanguage } from '../context/LanguageContext'
import EcoBadge from '../components/EcoBadge'
import EcoScoreBar from '../components/EcoScoreBar'
import EcoRing from '../components/EcoRing'
import { useCountUp } from '../hooks/useCountUp'

/* ── helpers ───────────────────────────────────────────────── */

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          className={s <= Math.round(value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  )
}

/* Scroll-triggered wrapper for review cards */
function SlideInCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.12 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={visible ? 'review-slide' : 'opacity-0'}
      style={visible ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

/* ── tab types ──────────────────────────────────────────────── */
type Tab = 'overview' | 'ecoscore' | 'reviews'
const TABS: { id: Tab; label: string; labelEs: string }[] = [
  { id: 'overview',  label: 'Overview',  labelEs: 'Resumen'    },
  { id: 'ecoscore',  label: 'EcoScore',  labelEs: 'EcoScore'   },
  { id: 'reviews',   label: 'Reviews',   labelEs: 'Reseñas'    },
]
const TAB_INDEX: Record<Tab, number> = { overview: 0, ecoscore: 1, reviews: 2 }

/* ── component ─────────────────────────────────────────────── */
export default function RestaurantProfile() {
  const { id } = useParams<{ id: string }>()
  const { lang, t } = useLanguage()
  const restaurant = getRestaurantById(id ?? '')

  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [prevTab, setPrevTab]     = useState<Tab>('overview')
  const [tabKey, setTabKey]       = useState(0)

  const switchTab = (next: Tab) => {
    if (next === activeTab) return
    setPrevTab(activeTab)
    setActiveTab(next)
    setTabKey((k) => k + 1)
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 text-gray-400">
        <div className="text-center">
          <p className="text-4xl mb-3">🍽️</p>
          <p className="text-sm">{t('Restaurant not found.', 'Restaurante no encontrado.')}</p>
          <Link to="/" className="mt-4 inline-block text-green-600 font-medium text-sm">
            {t('Back to Feed', 'Volver al Feed')}
          </Link>
        </div>
      </div>
    )
  }

  const cuisine     = lang === 'es' ? restaurant.cuisineEs    : restaurant.cuisine
  const description = lang === 'es' ? restaurant.descriptionEs : restaurant.description
  const tags        = lang === 'es' ? restaurant.tagsEs       : restaurant.tags
  const hours       = lang === 'es' ? restaurant.hoursEs      : restaurant.hours
  const actions     = lang === 'es' ? restaurant.sustainableActionsEs : restaurant.sustainableActions
  const ownerStory  = lang === 'es' ? restaurant.ownerStoryEs : restaurant.ownerStory

  const { ecoScore } = restaurant

  /* tab slide direction */
  const slideClass =
    TAB_INDEX[activeTab] > TAB_INDEX[prevTab] ? 'tab-slide-right' : 'tab-slide-left'

  /* count-up for quick-stats EcoScore */
  const displayedScore = useCountUp(ecoScore.total, 1200, 400)

  /* eco breakdown rows with stagger */
  const breakdownRows = [
    { label: t('Carbon Footprint', 'Huella de Carbono'),    value: ecoScore.carbonScore,        max: 30,  color: 'bg-green-500',  delay: 80  },
    { label: `${t('Carbon Offset', 'Compensación')} (${ecoScore.offsetPercent}%)`, value: ecoScore.offsetScore, max: 25, color: 'bg-cyan-500',   delay: 180 },
    { label: `${t('Food Waste', 'Desperdicio')} (${ecoScore.wastePercent}%)`,       value: ecoScore.wasteScore,  max: 25, color: 'bg-yellow-500', delay: 280 },
    { label: t('Sustainable Practices', 'Prácticas Sostenibles'), value: ecoScore.sustainabilityScore, max: 10, color: 'bg-lime-500',   delay: 380 },
    { label: t('Transparency', 'Transparencia'),             value: ecoScore.transparencyScore,  max: 10,  color: 'bg-purple-400', delay: 480 },
  ]

  return (
    <div className="min-h-screen bg-[#f5f5f7] pt-14 pb-20">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className={`relative h-52 bg-gradient-to-b ${restaurant.videoColor} overflow-hidden`}>
        {restaurant.videoThumb ? (
          <video
            src={restaurant.videoThumb}
            className="absolute inset-0 w-full h-full object-cover hero-fade-in"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : restaurant.image ? (
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="absolute inset-0 w-full h-full object-cover hero-fade-in"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span
              className="text-white/[0.15] font-black tracking-tighter leading-none"
              style={{ fontSize: 120 }}
            >
              {restaurant.name[0]}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-black/35" />

        <Link
          to="/"
          className="absolute top-4 left-4 w-8 h-8 bg-black/20 backdrop-blur rounded-full flex items-center justify-center text-white"
          aria-label={t('Back', 'Volver')}
        >
          <ArrowLeft size={16} />
        </Link>

        <div className="absolute bottom-4 left-5 right-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h1 className="text-white text-xl font-bold leading-tight">{restaurant.name}</h1>
              <div className="flex items-center gap-1 text-white/75 text-xs mt-1">
                <MapPin size={10} />
                <span>{restaurant.neighborhood}</span>
                <span className="mx-1 text-white/40">·</span>
                <span>{cuisine}</span>
                <span className="mx-1 text-white/40">·</span>
                <span>{restaurant.priceRange}</span>
              </div>
            </div>
            <EcoBadge badge={restaurant.badge} lang={lang} size="sm" animate />
          </div>
        </div>
      </div>

      {/* ── Quick stats ───────────────────────────────────────── */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-white rounded-2xl p-3 text-center border border-gray-100 hover:-translate-y-0.5 transition-transform duration-200">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Star size={13} className="text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-lg text-gray-900">{restaurant.rating}</span>
            </div>
            <p className="text-[11px] text-gray-400">{restaurant.reviewCount} {t('reviews', 'reseñas')}</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center border border-gray-100 hover:-translate-y-0.5 transition-transform duration-200">
            <div className="font-bold text-2xl text-green-700 tabular-nums">{displayedScore}</div>
            <p className="text-[11px] text-gray-400">EcoScore</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center border border-gray-100 hover:-translate-y-0.5 transition-transform duration-200">
            <div className="font-bold text-lg text-sky-600">{ecoScore.wastePercent}%</div>
            <p className="text-[11px] text-gray-400">{t('food waste', 'desperdicio')}</p>
          </div>
        </div>
      </div>

      {/* ── Tabs ──────────────────────────────────────────────── */}
      <div className="sticky top-14 z-20 bg-[#f5f5f7]/90 backdrop-blur border-b border-gray-200/60 mt-3">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-green-700'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {lang === 'es' ? tab.labelEs : tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-green-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab content ───────────────────────────────────────── */}
      <div className="max-w-lg mx-auto px-4 py-4">
        <div key={tabKey} className={`space-y-4 ${slideClass}`}>

          {/* ── OVERVIEW tab ───────────────────────────────────── */}
          {activeTab === 'overview' && (
            <>
              {/* About */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] bg-gray-50 text-gray-500 border border-gray-200 px-2.5 py-0.5 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Owner story */}
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                <div className="flex gap-3">
                  <span className="text-lg mt-0.5 flex-shrink-0">📖</span>
                  <div>
                    <h3 className="font-semibold text-amber-900 text-sm mb-1">
                      {t('Our Story', 'Nuestra Historia')}
                    </h3>
                    <p className="text-amber-800 text-sm leading-relaxed">{ownerStory}</p>
                  </div>
                </div>
              </div>

              {/* Sustainable actions */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-3.5">
                  <Recycle size={16} className="text-green-600" />
                  <h2 className="font-semibold text-gray-900 text-base">
                    {t('Sustainability Actions', 'Acciones de Sostenibilidad')}
                  </h2>
                </div>
                <div className="space-y-2.5">
                  {actions.map((action, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 leading-snug">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <h2 className="font-semibold text-gray-900 text-base mb-3.5">
                  {t('Visit Us', 'Visítanos')}
                </h2>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-start gap-2.5 text-gray-600">
                    <MapPin size={15} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>{restaurant.address}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-gray-600">
                    <Phone size={15} className="text-gray-400 flex-shrink-0" />
                    <a href={`tel:${restaurant.phone}`} className="text-green-700 font-medium hover:underline">
                      {restaurant.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5 text-gray-600">
                    <Clock size={15} className="text-gray-400 flex-shrink-0" />
                    <span>{hours}</span>
                  </div>
                </div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="directions-pulse mt-4 w-full block text-center bg-green-600 text-white font-semibold py-3 rounded-xl text-sm transition-opacity active:opacity-80"
                >
                  {t('Get Directions', 'Obtener Direcciones')}
                </a>
              </div>
            </>
          )}

          {/* ── ECOSCORE tab ───────────────────────────────────── */}
          {activeTab === 'ecoscore' && (
            <>
              {/* Circular ring + improvement indicator */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-5">
                <EcoRing score={ecoScore.total} size={96} strokeWidth={6} delay={100} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Leaf size={15} className="text-green-600" />
                    <h2 className="font-semibold text-gray-900 text-base">EcoScore</h2>
                  </div>
                  <EcoBadge badge={restaurant.badge} lang={lang} size="md" animate />
                  {/* Improvement indicator */}
                  <div className="improvement-in flex items-center gap-1 mt-2.5 text-green-700 bg-green-50 rounded-lg px-2.5 py-1.5">
                    <TrendingUp size={13} />
                    <span className="text-xs font-semibold">+8 EcoScore {t('this month', 'este mes')}</span>
                  </div>
                </div>
              </div>

              {/* Breakdown bars */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <h3 className="font-semibold text-gray-800 text-sm mb-4">
                  {t('Score Breakdown', 'Desglose de Puntuación')}
                </h3>
                <div className="space-y-3.5">
                  {breakdownRows.map(({ label, value, max, color, delay }) => (
                    <div
                      key={label}
                      className="eco-reveal"
                      style={{ animationDelay: `${delay}ms` }}
                    >
                      <EcoScoreBar label={label} value={value} max={max} color={color} delay={delay} />
                    </div>
                  ))}
                </div>

                {/* Emissions row */}
                <div className="mt-4 pt-3.5 border-t border-gray-100 grid grid-cols-2 gap-2.5">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[11px] text-gray-400 mb-1">{t('Weekly Emissions', 'Emisiones Semanales')}</p>
                    <p className="font-semibold text-gray-800 text-sm">{ecoScore.weeklyEmissions} kg CO₂e</p>
                  </div>
                  <div className="bg-sky-50 rounded-xl p-3">
                    <p className="text-[11px] text-gray-400 mb-1">{t('Offset', 'Compensado')}</p>
                    <p className="font-semibold text-sky-700 text-sm">
                      {Math.round(ecoScore.weeklyEmissions * (ecoScore.offsetPercent / 100))} kg CO₂e
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── REVIEWS tab ────────────────────────────────────── */}
          {activeTab === 'reviews' && (
            <div id="reviews" className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-green-600" />
                  <h2 className="font-semibold text-gray-900 text-base">
                    {t('Reviews', 'Reseñas')}
                  </h2>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={13} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-sm text-gray-700">{restaurant.rating}</span>
                </div>
              </div>

              <div className="space-y-5">
                {restaurant.reviews.map((review, idx) => (
                  <SlideInCard key={review.id} delay={idx * 80}>
                    <div className="border-b border-gray-50 pb-5 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-green-100 text-green-800 font-semibold text-xs rounded-full flex items-center justify-center flex-shrink-0">
                            {review.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-900">{review.author}</p>
                            <p className="text-[11px] text-gray-400">{review.date}</p>
                          </div>
                        </div>
                        <StarRating value={review.rating} />
                      </div>
                      <p className="text-sm text-gray-700 mb-2.5 pl-10 leading-relaxed">
                        {lang === 'es' ? review.commentEs : review.comment}
                      </p>
                      <div className="ml-10 bg-green-50 rounded-xl px-3 py-2.5">
                        <div className="flex items-center gap-1 mb-1">
                          <Leaf size={11} className="text-green-600" />
                          <span className="text-[11px] font-medium text-green-700">
                            {t('Eco Note', 'Nota Eco')}
                          </span>
                          <div className="flex gap-0.5 ml-auto">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <span
                                key={s}
                                className={`text-[10px] ${s <= review.packagingRating ? 'text-green-500' : 'text-gray-200'}`}
                              >
                                ●
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-green-800 leading-snug">
                          {lang === 'es' ? review.sustainabilityNoteEs : review.sustainabilityNote}
                        </p>
                      </div>
                    </div>
                  </SlideInCard>
                ))}
              </div>

              <button className="mt-4 w-full border border-dashed border-green-200 text-green-600 font-medium py-3 rounded-xl text-sm hover:bg-green-50 transition-colors">
                {t('+ Write a Review', '+ Escribir una Reseña')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
