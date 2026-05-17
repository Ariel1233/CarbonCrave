import { useParams, Link } from 'react-router-dom'
import { Star, ArrowLeft, Leaf } from 'lucide-react'
import { restaurants } from '../data/restaurants'
import { useLanguage } from '../context/LanguageContext'
import EcoBadge from '../components/EcoBadge'

export default function NeighborhoodDetail() {
  const { name } = useParams<{ name: string }>()
  const { lang, t } = useLanguage()

  const decodedName = decodeURIComponent(name ?? '')
  const list = restaurants.filter((r) => r.neighborhood === decodedName)

  return (
    <div className="min-h-screen bg-[#f5f5f7] pt-14 pb-20">
      <div className="max-w-lg mx-auto px-4 pt-4">
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-green-700 font-medium text-sm mb-4 hover:text-green-900 transition-colors"
        >
          <ArrowLeft size={15} />
          {t('Back to Explore', 'Volver a Explorar')}
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-0.5">{decodedName}</h1>
        <p className="text-gray-500 text-sm mb-5">
          {list.length} {t('restaurants', 'restaurantes')}
        </p>

        {list.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="text-sm">{t('No restaurants listed yet.', 'No hay restaurantes listados todavía.')}</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {list
              .sort((a, b) => b.ecoScore.total - a.ecoScore.total)
              .map((r) => (
                <Link
                  key={r.id}
                  to={`/restaurant/${r.id}`}
                  className="flex gap-3 bg-white rounded-2xl p-3 border border-gray-100 hover:shadow-sm active:scale-[0.99] transition-all"
                >
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${r.videoColor} flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-white text-xl font-bold">{r.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug">{r.name}</h3>
                      <EcoBadge badge={r.badge} lang={lang} size="sm" />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {lang === 'es' ? r.cuisineEs : r.cuisine} · {r.priceRange}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1">
                        <Star size={11} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-medium text-gray-700">{r.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-700">
                        <Leaf size={11} />
                        <span className="text-xs font-medium">EcoScore {r.ecoScore.total}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
