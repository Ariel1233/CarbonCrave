import { Link } from 'react-router-dom'
import { Star, Leaf } from 'lucide-react'
import { restaurants, getRestaurantsByNeighborhood } from '../data/restaurants'
import { useLanguage } from '../context/LanguageContext'
import type { Neighborhood } from '../types'
import EcoBadge from '../components/EcoBadge'

const neighborhoods: { name: Neighborhood; emoji: string; tagline: string; taglineEs: string; color: string }[] = [
  { name: 'Calle Ocho', emoji: '🇨🇺', tagline: 'Cuban heritage & family kitchens', taglineEs: 'Herencia cubana y cocinas familiares', color: 'from-red-700 to-orange-600' },
  { name: 'Brickell', emoji: '🏙️', tagline: 'Farm-to-table & business dining', taglineEs: 'De granja a mesa y cocina corporativa', color: 'from-blue-700 to-indigo-600' },
  { name: 'Doral', emoji: '🫓', tagline: 'Venezuelan & Latin American flavors', taglineEs: 'Sabores venezolanos y latinoamericanos', color: 'from-yellow-600 to-amber-500' },
  { name: 'Little Haiti', emoji: '🌶️', tagline: 'Haitian community & Caribbean soul', taglineEs: 'Comunidad haitiana y alma caribeña', color: 'from-red-800 to-pink-700' },
  { name: 'Wynwood', emoji: '🎨', tagline: 'Art, street food & plant-based eats', taglineEs: 'Arte, comida callejera y vegetales', color: 'from-lime-700 to-green-600' },
  { name: 'Overtown', emoji: '🎷', tagline: 'Historic Black-owned restaurants', taglineEs: 'Restaurantes históricos afroamericanos', color: 'from-orange-800 to-yellow-700' },
  { name: 'South Beach', emoji: '🌊', tagline: 'Sustainable seafood & ocean dining', taglineEs: 'Mariscos sostenibles frente al mar', color: 'from-cyan-700 to-blue-500' },
  { name: 'Coral Gables', emoji: '🫒', tagline: 'Mediterranean & fine dining', taglineEs: 'Mediterránea y alta cocina', color: 'from-purple-700 to-pink-600' },
]

function avgEcoScore(neighborhood: Neighborhood) {
  const list = getRestaurantsByNeighborhood(neighborhood)
  if (list.length === 0) return 0
  return Math.round(list.reduce((s, r) => s + r.ecoScore.total, 0) / list.length)
}

function topBadge(neighborhood: Neighborhood) {
  const list = getRestaurantsByNeighborhood(neighborhood)
  return list.sort((a, b) => b.ecoScore.total - a.ecoScore.total)[0]?.badge ?? 'starter'
}

export default function NeighborhoodExplorer() {
  const { lang, t } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-20">
      <div className="max-w-lg mx-auto px-4 pt-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">
            {t('Explore Miami', 'Explorar Miami')}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {t('Discover sustainable food by neighborhood', 'Descubre comida sostenible por barrio')}
          </p>
        </div>

        {/* Stats banner */}
        <div className="bg-green-800 text-white rounded-2xl p-4 mb-6 flex items-center gap-4">
          <div className="text-4xl">🗺️</div>
          <div>
            <p className="font-bold text-base">{t('10 Restaurants · 8 Neighborhoods', '10 Restaurantes · 8 Barrios')}</p>
            <p className="text-green-200 text-sm mt-0.5">
              {t('Miami\'s climate-aware food network', 'La red alimentaria climática de Miami')}
            </p>
          </div>
        </div>

        {/* Neighborhood cards */}
        <div className="space-y-3">
          {neighborhoods.map((nb) => {
            const list = getRestaurantsByNeighborhood(nb.name)
            const avg = avgEcoScore(nb.name)
            const best = topBadge(nb.name)

            return (
              <Link
                key={nb.name}
                to={`/explore/${encodeURIComponent(nb.name)}`}
                className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className={`bg-gradient-to-r ${nb.color} p-4 flex items-center gap-3`}>
                  <span className="text-4xl">{nb.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-white font-black text-lg leading-tight">{nb.name}</h2>
                    <p className="text-white/80 text-xs mt-0.5">
                      {lang === 'es' ? nb.taglineEs : nb.tagline}
                    </p>
                  </div>
                  <div className="text-right text-white">
                    <div className="font-black text-2xl">{list.length}</div>
                    <div className="text-xs opacity-80">{t('spots', 'lugares')}</div>
                  </div>
                </div>
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Leaf size={14} className="text-green-600" />
                    <span>{t('Avg EcoScore:', 'EcoScore Prom:')}</span>
                    <span className="font-bold text-gray-900">{avg}/100</span>
                  </div>
                  {list.length > 0 && (
                    <EcoBadge badge={best} lang={lang} size="sm" />
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Collections section */}
        <div className="mt-8">
          <h2 className="text-lg font-black text-gray-900 mb-4">
            {t('🌟 Miami Food Collections', '🌟 Colecciones de Comida Miami')}
          </h2>
          <div className="space-y-2">
            {[
              { icon: '🇨🇺', title: t('Best Eco-Friendly Cuban Spots', 'Mejores Lugares Cubanos Eco'), sub: t('Calle Ocho', 'Calle Ocho') },
              { icon: '🌶️', title: t('Little Haiti Local Eats', 'Comida Local de Little Haiti'), sub: t('Little Haiti', 'Little Haiti') },
              { icon: '💼', title: t('Low-Waste Lunches in Brickell', 'Almuerzos Sin Desperdicio en Brickell'), sub: t('Brickell', 'Brickell') },
              { icon: '🐟', title: t('Sustainable Seafood Near South Beach', 'Mariscos Sostenibles Cerca de South Beach'), sub: t('South Beach', 'South Beach') },
              { icon: '🎷', title: t('Black-Owned Gems in Overtown', 'Joyas Afroamericanas en Overtown'), sub: t('Overtown', 'Overtown') },
              { icon: '🌿', title: t('Creative Plant-Based in Wynwood', 'Comida Vegetal Creativa en Wynwood'), sub: t('Wynwood', 'Wynwood') },
            ].map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100 hover:bg-green-50 cursor-pointer transition-colors"
              >
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{c.title}</p>
                  <p className="text-xs text-gray-400">{c.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
