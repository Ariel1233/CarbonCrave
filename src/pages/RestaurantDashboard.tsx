import { useEffect, useState } from 'react'
import {
  Upload, TrendingDown, TrendingUp, Leaf,
  DollarSign, AlertCircle, CheckCircle, BarChart3, ScanLine,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import EcoBadge from '../components/EcoBadge'
import EcoScoreBar from '../components/EcoScoreBar'
import EcoRing from '../components/EcoRing'
import { useCountUp } from '../hooks/useCountUp'

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

type UploadPhase = 'idle' | 'scanning' | 'success'

export default function RestaurantDashboard() {
  const { lang, t } = useLanguage()
  const [selectedOffset, setSelectedOffset] = useState(1)
  const [prevOffset, setPrevOffset]         = useState(1)
  const [wastePct, setWastePct]             = useState(7)
  const [wasteBreakdown, setWasteBreakdown] = useState({ thrown: 0, donated: 0, composted: 0, sold: 0 })
  const [uploadPhase, setUploadPhase]       = useState<UploadPhase>('idle')
  const [scanningItem, setScanningItem]     = useState<string | null>(null)
  const [scoreFlashKey, setScoreFlashKey]   = useState(0)
  const [chartVisible, setChartVisible]     = useState(false)

  const { ecoScore } = mockRestaurant

  /* trigger chart bar animation on mount */
  useEffect(() => {
    const t = setTimeout(() => setChartVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  const totalBreakdownKg = wasteBreakdown.thrown + wasteBreakdown.donated + wasteBreakdown.composted + wasteBreakdown.sold
  const positiveKg       = wasteBreakdown.donated + wasteBreakdown.composted + wasteBreakdown.sold
  const reuseRatio       = totalBreakdownKg > 0 ? positiveKg / totalBreakdownKg : 0
  const reuseBonus       = reuseRatio >= 0.8 ? 5 : reuseRatio >= 0.6 ? 3 : reuseRatio >= 0.4 ? 2 : 0

  const simulatedScore = Math.min(
    100,
    ecoScore.carbonScore +
      offsetOptions[selectedOffset].points +
      (wastePct < 5 ? 25 : wastePct < 10 ? 20 : wastePct < 20 ? 15 : 10) +
      ecoScore.sustainabilityScore +
      ecoScore.transparencyScore +
      reuseBonus,
  )

  const simulatedBadge =
    simulatedScore >= 90 ? 'platinum'
    : simulatedScore >= 75 ? 'gold'
    : simulatedScore >= 60 ? 'silver'
    : simulatedScore >= 40 ? 'bronze'
    : 'starter'

  const handleUpload = (label: string) => {
    if (uploadPhase !== 'idle') return
    setScanningItem(label)
    setUploadPhase('scanning')
    setTimeout(() => {
      setUploadPhase('success')
      setScoreFlashKey((k) => k + 1)
      setTimeout(() => {
        setUploadPhase('idle')
        setScanningItem(null)
      }, 2600)
    }, 1800)
  }

  const handleOffsetSelect = (i: number) => {
    setPrevOffset(selectedOffset)
    setSelectedOffset(i)
  }

  const maxWaste = Math.max(...wasteHistory.map((w) => w.pct))

  /* count-up for hero score and emissions */
  const heroScore      = useCountUp(ecoScore.total,          1300, 200)
  const displayedCO2   = useCountUp(ecoScore.weeklyEmissions, 1200, 400)

  /* score breakdown stagger */
  const breakdownRows = [
    { label: t('Carbon Footprint', 'Huella de Carbono'),        value: ecoScore.carbonScore,        max: 30, color: 'bg-green-500',  delay: 100 },
    { label: t('Carbon Offset', 'Compensación'),                value: ecoScore.offsetScore,        max: 25, color: 'bg-cyan-500',   delay: 200 },
    { label: t('Food Waste', 'Desperdicio'),                    value: ecoScore.wasteScore,         max: 25, color: 'bg-yellow-500', delay: 300 },
    { label: t('Sustainable Practices', 'Prácticas Sostenibles'), value: ecoScore.sustainabilityScore, max: 10, color: 'bg-lime-500', delay: 400 },
    { label: t('Transparency', 'Transparencia'),                value: ecoScore.transparencyScore,  max: 10, color: 'bg-purple-400', delay: 500 },
  ]

  return (
    <div className="min-h-screen bg-[#f5f5f7] pt-14 pb-20">
      <div className="max-w-lg mx-auto px-4 pt-5">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('Dashboard', 'Panel')}</h1>
            <p className="text-gray-500 text-sm mt-0.5">{mockRestaurant.name}</p>
          </div>
          <EcoBadge badge={mockRestaurant.badge} lang={lang} size="md" animate />
        </div>

        {/* EcoScore hero card */}
        <div className="bg-green-800 rounded-2xl p-4 text-white mb-4">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-4">
              <EcoRing
                score={ecoScore.total}
                size={88}
                strokeWidth={6}
                delay={300}
                trackColor="rgba(255,255,255,0.15)"
                ringColor="rgba(255,255,255,0.9)"
              />
              <div>
                <p className="text-white/60 text-xs font-medium mb-0.5">
                  {t('Your EcoScore', 'Tu EcoScore')}
                </p>
                <div
                  key={scoreFlashKey}
                  className={`flex items-baseline gap-1.5 ${scoreFlashKey > 0 ? 'score-update' : ''}`}
                >
                  <span className="text-4xl font-bold tabular-nums">{heroScore}</span>
                  <span className="text-white/50 text-lg">/100</span>
                </div>
              </div>
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
        </div>

        {/* Carbon emissions */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-4">
          <h2 className="font-semibold text-gray-900 text-base mb-3">
            🌍 {t('Weekly Carbon Emissions', 'Emisiones Semanales de Carbono')}
          </h2>
          <div className="bg-gray-50 rounded-xl p-3 mb-4">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900 tabular-nums">
                {displayedCO2}
              </span>
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
                onClick={() => handleOffsetSelect(i)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 ${
                  selectedOffset === i
                    ? 'border-green-500 bg-green-50 scale-[1.015]'
                    : 'border-gray-100 bg-white hover:border-green-200'
                } ${selectedOffset === i && prevOffset !== i ? 'offset-pop' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedOffset === i ? 'border-green-500' : 'border-gray-300'
                    }`}
                  >
                    {selectedOffset === i && (
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                    )}
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

          <button className="mt-4 w-full bg-green-600 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-opacity active:opacity-80 hover:bg-green-700">
            <DollarSign size={15} />
            {t('Purchase Offset', 'Comprar Compensación')}
          </button>
        </div>

        {/* Food waste tracker */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-4">
          <h2 className="font-semibold text-gray-900 text-base mb-3">
            ♻️ {t('Food Waste Tracker', 'Rastreador de Desperdicio')}
          </h2>

          {/* Animated chart */}
          <div className="bg-gray-50 rounded-xl p-3 mb-3.5">
            <p className="text-xs text-gray-500 mb-3">
              {t('Waste % (last 4 weeks)', 'Desperdicio % (últimas 4 semanas)')}
            </p>
            <div className="flex items-end gap-2 h-11">
              {wasteHistory.map((w, i) => (
                <div key={w.week} className="flex-1 h-full flex items-end">
                  {chartVisible && (
                    <div
                      className="w-full rounded-t-md bg-green-400 bar-grow"
                      style={{
                        height: `${(w.pct / maxWaste) * 100}%`,
                        animationDelay: `${i * 110}ms`,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Improvement indicator */}
          <div className="improvement-in flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2 mb-4">
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

          {/* Waste breakdown inputs — feed into score simulator */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {([
              { icon: '🗑️', label: t('Thrown away', 'Tirado'),           key: 'thrown'   as const },
              { icon: '🤝', label: t('Donated', 'Donado'),               key: 'donated'  as const },
              { icon: '🌱', label: t('Composted', 'Compostado'),         key: 'composted' as const },
              { icon: '🏷️', label: t('Sold at discount', 'Vendido con descuento'), key: 'sold' as const },
            ] as const).map((item) => (
              <div key={item.key} className="bg-gray-50 rounded-xl p-2.5">
                <p className="text-[11px] text-gray-500 mb-1.5">
                  {item.icon} {item.label}
                </p>
                <input
                  type="number"
                  placeholder="kg"
                  value={wasteBreakdown[item.key] || ''}
                  onChange={(e) =>
                    setWasteBreakdown((prev) => ({ ...prev, [item.key]: Math.max(0, Number(e.target.value)) }))
                  }
                  className="w-full text-sm font-medium bg-transparent outline-none text-gray-800 placeholder-gray-300"
                  min={0}
                />
              </div>
            ))}
          </div>
          {totalBreakdownKg > 0 && (
            <p className="mt-2 text-[11px] text-gray-400 text-center">
              {reuseBonus > 0
                ? `+${reuseBonus} ${t('bonus pts from reuse ratio', 'pts extra por reutilización')} 🌿`
                : t('Increase donated / composted / sold to earn bonus pts', 'Aumenta donado/compostado/vendido para puntos extra')}
            </p>
          )}
        </div>

        {/* Score simulator */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-4">
          <h2 className="font-semibold text-gray-900 text-base mb-2">
            {t('Score Simulator', 'Simulador de Puntuación')}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {t('Based on your offset, waste %, and breakdown inputs:', 'Según tu compensación, % desperdicio y entradas:')}
          </p>
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 mb-3">
            <div>
              <p className="text-gray-500 text-xs mb-0.5">{t('Projected EcoScore', 'EcoScore Proyectado')}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-green-700 tabular-nums">{simulatedScore}</span>
                <span className="text-gray-400 text-sm">/100</span>
              </div>
            </div>
            <EcoBadge badge={simulatedBadge} lang={lang} size="lg" animate />
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
            ].map((item) => {
              const isScanning = scanningItem === item.label && uploadPhase === 'scanning'
              return (
                <button
                  key={item.label}
                  onClick={() => handleUpload(item.label)}
                  disabled={uploadPhase !== 'idle'}
                  className={`w-full relative flex items-center gap-3 border border-dashed rounded-xl p-3 text-left transition-all overflow-hidden group ${
                    isScanning
                      ? 'border-green-400 bg-green-50 cursor-wait'
                      : uploadPhase !== 'idle'
                      ? 'border-gray-200 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 hover:border-green-400 hover:bg-green-50'
                  }`}
                >
                  <span className={`text-xl ${isScanning ? 'receipt-fly-in' : ''}`}>
                    {item.icon}
                  </span>
                  <span className={`flex-1 text-sm group-hover:text-green-700 transition-colors ${isScanning ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                    {item.label}
                  </span>
                  {isScanning ? (
                    <ScanLine size={14} className="text-green-500 animate-pulse" />
                  ) : (
                    <Upload size={14} className="text-gray-300 group-hover:text-green-500 transition-colors" />
                  )}

                  {/* Scan line overlay */}
                  {isScanning && <div className="scan-line" />}
                </button>
              )
            })}
          </div>

          {uploadPhase === 'success' && (
            <div className="mt-3 improvement-in flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5 text-green-700">
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
              <button className="bg-orange-500 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-opacity active:opacity-80 hover:bg-orange-600">
                {t('Post a Last-Call Deal', 'Publicar una Oferta de Último Minuto')}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
