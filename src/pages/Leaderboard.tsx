import { Link } from 'react-router-dom'
import { Trophy, Star, TrendingUp, Leaf } from 'lucide-react'
import { getSortedByEcoScore } from '../data/restaurants'
import { useLanguage } from '../context/LanguageContext'
import EcoBadge from '../components/EcoBadge'

const medalEmojis = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const { lang, t } = useLanguage()
  const sorted = getSortedByEcoScore()
  const top3 = sorted.slice(0, 3)
  const rest = sorted.slice(3)

  return (
    <div className="min-h-screen bg-[#f5f5f7] pt-14 pb-20">
      <div className="max-w-lg mx-auto px-4 pt-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={22} className="text-yellow-500" />
          <h1 className="text-2xl font-bold text-gray-900">
            {t('Eco Leaderboard', 'Ranking Ecológico')}
          </h1>
        </div>
        <p className="text-gray-500 text-sm mb-5">
          {t("Miami's most sustainable restaurants, ranked by EcoScore", "Los restaurantes más sostenibles de Miami, clasificados por EcoScore")}
        </p>

        {/* Top 3 podium */}
        <div className="bg-green-800 rounded-2xl p-4 mb-5">
          <p className="text-white/60 font-medium text-xs text-center uppercase tracking-wider mb-3">
            {t('Top 3 This Week', 'Top 3 Esta Semana')}
          </p>
          <div className="space-y-2.5">
            {top3.map((r, i) => (
              <Link
                key={r.id}
                to={`/restaurant/${r.id}`}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/15 rounded-xl px-3.5 py-3 transition-colors"
              >
                <span className="text-xl w-7 text-center flex-shrink-0">{medalEmojis[i]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm leading-tight truncate">{r.name}</p>
                  <p className="text-white/50 text-xs">{r.neighborhood}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-white font-bold text-xl leading-none">{r.ecoScore.total}</div>
                  <div className="mt-1">
                    <EcoBadge badge={r.badge} lang={lang} size="sm" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Highlight cards */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <div className="bg-white border border-gray-100 rounded-2xl p-3.5">
            <p className="text-[11px] text-sky-600 font-medium mb-1">
              {t('Most Carbon Offset', 'Más Compensación')}
            </p>
            {(() => {
              const best = [...sorted].sort((a, b) => b.ecoScore.offsetPercent - a.ecoScore.offsetPercent)[0]
              return (
                <Link to={`/restaurant/${best.id}`}>
                  <p className="font-semibold text-gray-900 text-sm">{best.name}</p>
                  <p className="text-sky-600 font-bold text-lg">{best.ecoScore.offsetPercent}%</p>
                </Link>
              )
            })()}
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-3.5">
            <p className="text-[11px] text-amber-600 font-medium mb-1">
              {t('Least Food Waste', 'Menos Desperdicio')}
            </p>
            {(() => {
              const best = [...sorted].sort((a, b) => a.ecoScore.wastePercent - b.ecoScore.wastePercent)[0]
              return (
                <Link to={`/restaurant/${best.id}`}>
                  <p className="font-semibold text-gray-900 text-sm">{best.name}</p>
                  <p className="text-amber-600 font-bold text-lg">{best.ecoScore.wastePercent}%</p>
                </Link>
              )
            })()}
          </div>
        </div>

        {/* Full ranking */}
        <h2 className="font-semibold text-gray-900 text-base mb-3">
          {t('Full Ranking', 'Clasificación Completa')}
        </h2>
        <div className="space-y-2">
          {sorted.map((r, i) => {
            const isTop3 = i < 3
            return (
              <Link
                key={r.id}
                to={`/restaurant/${r.id}`}
                className={`flex items-center gap-3 bg-white rounded-2xl p-3 border transition-all hover:shadow-sm ${
                  isTop3 ? 'border-amber-100 bg-amber-50/40' : 'border-gray-100'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                    isTop3 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {isTop3 ? medalEmojis[i] : i + 1}
                </div>
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.videoColor} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-white text-sm font-bold">{r.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-medium text-gray-900 text-sm truncate">{r.name}</p>
                    {r.trending && <TrendingUp size={11} className="text-orange-500 flex-shrink-0" />}
                    {r.risingGreenStar && <Leaf size={11} className="text-green-500 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-400">{r.neighborhood}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-0.5">
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-gray-500">{r.rating}</span>
                    </div>
                    <span className="text-gray-200">·</span>
                    <span className="text-xs text-green-600">{r.ecoScore.offsetPercent}% offset</span>
                    <span className="text-gray-200">·</span>
                    <span className="text-xs text-sky-600">{r.ecoScore.wastePercent}% waste</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-xl text-green-700">{r.ecoScore.total}</div>
                  <EcoBadge badge={r.badge} lang={lang} size="sm" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Score legend */}
        <div className="mt-5 bg-white rounded-2xl p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">
            {t('EcoScore Tiers', 'Niveles de EcoScore')}
          </h3>
          <div className="space-y-2">
            {[
              { range: '90–100', label: t('Platinum Leaf', 'Hoja Platino'), icon: '🌿' },
              { range: '75–89',  label: t('Gold Leaf',     'Hoja de Oro'),  icon: '🍃' },
              { range: '60–74',  label: t('Silver Leaf',   'Hoja de Plata'), icon: '🌱' },
              { range: '40–59',  label: t('Bronze Leaf',   'Hoja de Bronce'), icon: '🌾' },
              { range: 'Under 40', label: t('Starter Leaf', 'Hoja Inicial'), icon: '🪴' },
            ].map((tier) => (
              <div key={tier.range} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span>{tier.icon}</span>
                  <span className="text-gray-700 text-sm">{tier.label}</span>
                </div>
                <span className="text-gray-400 text-xs">{tier.range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
