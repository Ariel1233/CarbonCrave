import { useState } from 'react'
import {
  Upload, TrendingDown, TrendingUp, Leaf,
  DollarSign, AlertCircle, CheckCircle, BarChart3,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import EcoBadge from '../components/EcoBadge'
import EcoScoreBar from '../components/EcoScoreBar'

const mockRestaurant = {
  name: 'Verde Havana',
  badge: 'gold' as const,
  ecoScore: {
    total: 76,
    carbonScore: 22,
    offsetScore: 17,
    wasteScore: 20,
    sustainabilityScore: 8,
    transparencyScore: 9,
    offsetPercent: 75,
    wastePercent: 7,
    weeklyEmissions: 420,
  },
}

const offsetOptions = [
  { pct: 50,  label: 'Basic Offset',  labelEs: 'Compensación Básica',  points: 10, co2: 210 },
  { pct: 75,  label: 'Strong Offset', labelEs: 'Compensación Fuerte',  points: 17, co2: 315 },
  { pct: 100, label: 'Full Offset',   labelEs: 'Compensación Total',   points: 25, co2: 420 },
]

const wasteHistory = [
  { week: 'Apr 21', pct: 18 },
  { week: 'Apr 28', pct: 14 },
  { week: 'May 5',  pct: 11 },
  { week: 'May 12', pct: 7  },
]

export default function RestaurantDashboard() {
  const { lang, t } = useLanguage()
  const [selectedOffset, setSelectedOffset]       = useState(1)
  const [wastePct, setWastePct]                   = useState(7)
  const [showUploadSuccess, setShowUploadSuccess] = useState(false)

  const { ecoScore } = mockRestaurant

  const simulatedScore = Math.min(
    100,
    ecoScore.carbonScore +
      offsetOptions[selectedOffset].points +
      (wastePct < 5 ? 25 : wastePct < 10 ? 20 : wastePct < 20 ? 15 : 10) +
      ecoScore.sustainabilityScore +
      ecoScore.transparencyScore,
  )

  const simulatedBadge =
    simulatedScore >= 90 ? 'platinum'
    : simulatedScore >= 75 ? 'gold'
    : simulatedScore >= 60 ? 'silver'
    : simulatedScore >= 40 ? 'bronze'
    : 'starter'

  const handleUpload = () => {
    setShowUploadSuccess(true)
    setTimeout(() => setShowUploadSuccess(false), 3000)
  }

  const maxWaste = Math.max(...wasteHistory.map((w) => w.pct))

  return (
    <div className="min-h-screen bg-[#f5f5f7] pt-14 pb-20">
      <div className="max-w-lg mx-auto px-4 pt-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('Dashboard', 'Panel')}</h1>
            <p className="text-gray-500 text-sm mt-0.5">{mockRestaurant.name}</p>
          </div>
          <EcoBadge badge={mockRestaurant.badge} lang={lang} size="md" />
        </div>

        {/* EcoScore hero card */}
        <div className="bg-green-800 rounded-2xl p-4 text-white mb-4">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <p className="text-white/60 text-xs font-medium mb-0.5">
                {t('Your EcoScore', 'Tu EcoScore')}
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-bold">{ecoScore.total}</span>
                <span className="text-white/50 text-lg">/100</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Leaf size={24} className="text-white" />
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-sm">
            <p className="font-medium mb-1 flex items-center gap-1.5 text-white/90">
              <AlertCircle size={13} />
              {t('Next Level Tip', 'Consejo para subir de nivel')}
            </p>
            <p className="text-white/65 text-xs leading-relaxed">
              {t(
                'Reduce reported food waste below 5% or increase offset to 100% to reach Platinum Leaf.',
                'Reduce el desperdicio a menos del 5% o aumenta la compensación al 100% para llegar a Hoja Platino.',
              )}
            </p>
          </div>
        </div>

        {/* Score breakdown */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-4">
          <h2 className="font-semibold text-gray-900 text-base mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-green-600" />
            {t('Score Breakdown', 'Desglose de Puntuación')}
          </h2>
          <div className="space-y-3.5">
            <EcoScoreBar label={t('Carbon Footprint', 'Huella de Carbono')}      value={ecoScore.carbonScore}        max={30} color="bg-green-500" />
            <EcoScoreBar label={t('Carbon Offset', 'Compensación')}              value={ecoScore.offsetScore}        max={25} color="bg-cyan-500" />
            <EcoScoreBar label={t('Food Waste', 'Desperdicio')}                  value={ecoScore.wasteScore}         max={25} color="bg-yellow-500" />
            <EcoScoreBar label={t('Sustainable Practices', 'Prácticas Sostenibles')} value={ecoScore.sustainabilityScore} max={10} color="bg-lime-500" />
            <EcoScoreBar label={t('Transparency', 'Transparencia')}              value={ecoScore.transparencyScore}  max={10} color="bg-purple-400" />
          </div>
        </div>

        {/* Carbon emissions */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-4">
          <h2 className="font-semibold text-gray-900 text-base mb-3">
            🌍 {t('Weekly Carbon Emissions', 'Emisiones Semanales de Carbono')}
          </h2>
          <div className="bg-gray-50 rounded-xl p-3 mb-4">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">{ecoScore.weeklyEmissions}</span>
              <span className="text-gray-500 text-sm">kg CO₂e</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {t('Estimated based on ingredient purchases', 'Estimado basado en compras de ingredientes')}
            </p>
          </div>

          <h3 className="font-medium text-sm text-gray-700 mb-2.5">
            {t('Choose your offset level:', 'Elige tu nivel de compensación:')}
          </h3>
          <div className="space-y-2">
            {offsetOptions.map((opt, i) => (
              <button
                key={opt.pct}
                onClick={() => setSelectedOffset(i)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                  selectedOffset === i
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-100 bg-white hover:border-green-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedOffset === i ? 'border-green-500' : 'border-gray-300'
                    }`}
                  >
                    {selectedOffset === i && <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm text-gray-900">
                      {lang === 'es' ? opt.labelEs : opt.label} ({opt.pct}%)
                    </p>
                    <p className="text-xs text-gray-400">{opt.co2} kg CO₂e offset</p>
                  </div>
                </div>
                <span className="text-xs text-green-600 font-medium">+{opt.points} pts</span>
              </button>
            ))}
          </div>

          <button className="mt-4 w-full bg-green-600 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-opacity active:opacity-80">
            <DollarSign size={15} />
            {t('Purchase Offset', 'Comprar Compensación')}
          </button>
        </div>

        {/* Food waste tracker */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-4">
          <h2 className="font-semibold text-gray-900 text-base mb-3">
            ♻️ {t('Food Waste Tracker', 'Rastreador de Desperdicio')}
          </h2>

          {/* Chart */}
          <div className="bg-gray-50 rounded-xl p-3 mb-3.5">
            <p className="text-xs text-gray-500 mb-3">
              {t('Waste % (last 4 weeks)', 'Desperdicio % (últimas 4 semanas)')}
            </p>
            <div className="flex items-end gap-2 h-14">
              {wasteHistory.map((w) => (
                <div key={w.week} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center" style={{ height: '44px' }}>
                    <div
                      className="w-full rounded-t-md bg-green-400 transition-all"
                      style={{ height: `${(w.pct / maxWaste) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500">{w.pct}%</span>
                  <span className="text-[10px] text-gray-300">{w.week.split(' ')[1]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2 mb-4">
            <TrendingDown size={14} className="text-green-600" />
            <p className="text-xs text-green-800 font-medium">
              {t('Reduced from 18% to 7% — EcoScore +8 pts!', '¡Reducción del 18% al 7% — EcoScore +8 pts!')}
            </p>
          </div>

          {/* Waste slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="font-medium text-gray-700">
                {t("Report this week's waste:", 'Reportar desperdicio esta semana:')}
              </label>
              <span className="font-semibold text-green-700">{wastePct}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              value={wastePct}
              onChange={(e) => setWastePct(Number(e.target.value))}
              className="w-full accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0% {t('(excellent)', '(excelente)')}</span>
              <span>30%+ {t('(needs work)', '(necesita mejora)')}</span>
            </div>
          </div>

          {/* Waste breakdown inputs */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { icon: '🗑️', label: t('Thrown away', 'Tirado') },
              { icon: '🤝', label: t('Donated', 'Donado') },
              { icon: '🌱', label: t('Composted', 'Compostado') },
              { icon: '🏷️', label: t('Sold at discount', 'Vendido con descuento') },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-2.5">
                <p className="text-[11px] text-gray-500 mb-1.5">
                  {item.icon} {item.label}
                </p>
                <input
                  type="number"
                  placeholder="kg"
                  className="w-full text-sm font-medium bg-transparent outline-none text-gray-800 placeholder-gray-300"
                  min={0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Score simulator */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-4">
          <h2 className="font-semibold text-gray-900 text-base mb-2">
            🎯 {t('Score Simulator', 'Simulador de Puntuación')}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {t('With your current selections:', 'Con tus selecciones actuales:')}
          </p>
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 mb-3">
            <div>
              <p className="text-gray-500 text-xs mb-0.5">{t('Projected EcoScore', 'EcoScore Proyectado')}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-green-700">{simulatedScore}</span>
                <span className="text-gray-400 text-sm">/100</span>
              </div>
            </div>
            <EcoBadge badge={simulatedBadge} lang={lang} size="lg" />
          </div>
          {simulatedScore > ecoScore.total ? (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-xl px-3 py-2.5">
              <TrendingUp size={14} />
              <p className="text-sm font-medium">
                +{simulatedScore - ecoScore.total} {t('points improvement!', '¡puntos de mejora!')}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500 bg-gray-50 rounded-xl px-3 py-2.5">
              <CheckCircle size={14} />
              <p className="text-sm">{t('Great! Keep up the good work.', '¡Genial! Sigue con el buen trabajo.')}</p>
            </div>
          )}
        </div>

        {/* Upload section */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-4">
          <h2 className="font-semibold text-gray-900 text-base mb-1">
            📤 {t('Upload Verification Data', 'Subir Datos de Verificación')}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {t(
              'Upload receipts, invoices, and waste logs to improve your Transparency score.',
              'Sube recibos, facturas y registros de desperdicio para mejorar tu puntuación de Transparencia.',
            )}
          </p>
          <div className="space-y-2">
            {[
              { icon: '🧾', label: t('Ingredient Receipts', 'Recibos de Ingredientes') },
              { icon: '📦', label: t('Supplier Invoices', 'Facturas de Proveedores') },
              { icon: '♻️', label: t('Waste Log (PDF or photo)', 'Registro de Desperdicio (PDF o foto)') },
              { icon: '🍽️', label: t('Menu Item Recipes', 'Recetas del Menú') },
            ].map((item) => (
              <button
                key={item.label}
                onClick={handleUpload}
                className="w-full flex items-center gap-3 border border-dashed border-gray-200 hover:border-green-400 hover:bg-green-50 rounded-xl p-3 text-left transition-all group"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="flex-1 text-sm text-gray-600 group-hover:text-green-700">{item.label}</span>
                <Upload size={14} className="text-gray-300 group-hover:text-green-500" />
              </button>
            ))}
          </div>

          {showUploadSuccess && (
            <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5 text-green-700">
              <CheckCircle size={14} />
              <p className="text-sm font-medium">
                {t('Upload successful! Score updated.', '¡Carga exitosa! Puntuación actualizada.')}
              </p>
            </div>
          )}
        </div>

        {/* Last-call meals */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">🏷️</span>
            <div>
              <h3 className="font-semibold text-amber-900 text-sm mb-1">
                {t('Last-Call Meals', 'Comidas de Último Minuto')}
              </h3>
              <p className="text-amber-700 text-xs mb-3 leading-relaxed">
                {t(
                  'Post discounted meals near closing time to reduce waste and earn extra points.',
                  'Publica comidas con descuento cerca del cierre para reducir desperdicios y ganar puntos.',
                )}
              </p>
              <button className="bg-orange-500 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-opacity active:opacity-80">
                {t('Post a Last-Call Deal', 'Publicar una Oferta de Último Minuto')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
