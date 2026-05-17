import { useParams, Link } from 'react-router-dom'
import {
  Star, MapPin, Phone, Clock, ArrowLeft,
  Leaf, Recycle, CheckCircle, User,
} from 'lucide-react'
import { getRestaurantById } from '../data/restaurants'
import { useLanguage } from '../context/LanguageContext'
import EcoBadge from '../components/EcoBadge'
import EcoScoreBar from '../components/EcoScoreBar'

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

export default function RestaurantProfile() {
  const { id } = useParams<{ id: string }>()
  const { lang, t } = useLanguage()
  const restaurant = getRestaurantById(id ?? '')

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

  const cuisine    = lang === 'es' ? restaurant.cuisineEs    : restaurant.cuisine
  const description = lang === 'es' ? restaurant.descriptionEs : restaurant.description
  const tags       = lang === 'es' ? restaurant.tagsEs       : restaurant.tags
  const hours      = lang === 'es' ? restaurant.hoursEs      : restaurant.hours
  const actions    = lang === 'es' ? restaurant.sustainableActionsEs : restaurant.sustainableActions
  const ownerStory = lang === 'es' ? restaurant.ownerStoryEs : restaurant.ownerStory

  const { ecoScore } = restaurant

  return (
    <div className="min-h-screen bg-[#f5f5f7] pt-14 pb-20">
      {/* Hero */}
      <div className={`relative h-52 bg-gradient-to-b ${restaurant.videoColor} overflow-hidden`}>
        {restaurant.image ? (
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="absolute inset-0 w-full h-full object-cover"
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
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-black/35" />

        {/* Back button */}
        <Link
          to="/"
          className="absolute top-4 left-4 w-8 h-8 bg-black/20 backdrop-blur rounded-full flex items-center justify-center text-white"
          aria-label={t('Back', 'Volver')}
        >
          <ArrowLeft size={16} />
        </Link>

        {/* Name + meta */}
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
            <EcoBadge badge={restaurant.badge} lang={lang} size="sm" />
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-white rounded-2xl p-3 text-center border border-gray-100">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Star size={13} className="text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-lg text-gray-900">{restaurant.rating}</span>
            </div>
            <p className="text-[11px] text-gray-400">{restaurant.reviewCount} {t('reviews', 'reseñas')}</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center border border-gray-100">
            <div className="font-bold text-2xl text-green-700">{ecoScore.total}</div>
            <p className="text-[11px] text-gray-400">EcoScore</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center border border-gray-100">
            <div className="font-bold text-lg text-sky-600">{ecoScore.wastePercent}%</div>
            <p className="text-[11px] text-gray-400">{t('food waste', 'desperdicio')}</p>
          </div>
        </div>

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

        {/* EcoScore breakdown */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Leaf size={16} className="text-green-600" />
              <h2 className="font-semibold text-gray-900 text-base">EcoScore</h2>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-bold text-green-700">{ecoScore.total}</span>
              <span className="text-gray-400 text-sm">/100</span>
            </div>
          </div>

          <div className="space-y-3.5">
            <EcoScoreBar
              label={t('Carbon Footprint', 'Huella de Carbono')}
              value={ecoScore.carbonScore}
              max={30}
              color="bg-green-500"
            />
            <EcoScoreBar
              label={`${t('Carbon Offset', 'Compensación')} (${ecoScore.offsetPercent}%)`}
              value={ecoScore.offsetScore}
              max={25}
              color="bg-cyan-500"
            />
            <EcoScoreBar
              label={`${t('Food Waste', 'Desperdicio')} (${ecoScore.wastePercent}%)`}
              value={ecoScore.wasteScore}
              max={25}
              color="bg-yellow-500"
            />
            <EcoScoreBar
              label={t('Sustainable Practices', 'Prácticas Sostenibles')}
              value={ecoScore.sustainabilityScore}
              max={10}
              color="bg-lime-500"
            />
            <EcoScoreBar
              label={t('Transparency', 'Transparencia')}
              value={ecoScore.transparencyScore}
              max={10}
              color="bg-purple-400"
            />
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

        {/* Contact info */}
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
            className="mt-4 w-full block text-center bg-green-600 text-white font-semibold py-3 rounded-xl text-sm transition-opacity active:opacity-80"
          >
            {t('Get Directions', 'Obtener Direcciones')}
          </a>
        </div>

        {/* Reviews */}
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
            {restaurant.reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-50 pb-5 last:border-0 last:pb-0">
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
            ))}
          </div>

          <button className="mt-4 w-full border border-dashed border-green-200 text-green-600 font-medium py-3 rounded-xl text-sm hover:bg-green-50 transition-colors">
            {t('+ Write a Review', '+ Escribir una Reseña')}
          </button>
        </div>
      </div>
    </div>
  )
}
