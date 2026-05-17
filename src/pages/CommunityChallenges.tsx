import { useState } from 'react'
import { Users, Star, CheckCircle, Lock, Trophy, Zap } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

interface Challenge {
  id: string
  icon: string
  title: string
  titleEs: string
  description: string
  descriptionEs: string
  neighborhood: string
  points: number
  participants: number
  completed: boolean
  locked: boolean
  deadline: string
  badge?: string
  badgeEs?: string
}

const challenges: Challenge[] = [
  {
    id: '1',
    icon: '🇨🇺',
    title: 'Calle Ocho Explorer',
    titleEs: 'Explorador de Calle Ocho',
    description: 'Visit 3 Cuban restaurants in Calle Ocho and leave eco-reviews.',
    descriptionEs: 'Visita 3 restaurantes cubanos en Calle Ocho y deja reseñas ecológicas.',
    neighborhood: 'Calle Ocho',
    points: 150,
    participants: 428,
    completed: true,
    locked: false,
    deadline: 'May 31, 2026',
    badge: 'Calle Ocho Explorer',
    badgeEs: 'Explorador de Calle Ocho',
  },
  {
    id: '2',
    icon: '🌿',
    title: 'Low-Waste Diner',
    titleEs: 'Comensal Sin Desperdicio',
    description: 'Visit 5 restaurants with less than 8% food waste and review their packaging.',
    descriptionEs: 'Visita 5 restaurantes con menos del 8% de desperdicio y revisa su empaque.',
    neighborhood: 'All Miami',
    points: 200,
    participants: 312,
    completed: false,
    locked: false,
    deadline: 'Jun 7, 2026',
    badge: 'Low-Waste Diner',
    badgeEs: 'Comensal Sin Desperdicio',
  },
  {
    id: '3',
    icon: '🌶️',
    title: 'Little Haiti Food Supporter',
    titleEs: 'Apoyo a Little Haiti',
    description: 'Dine at 2 Little Haiti restaurants and write a sustainability review.',
    descriptionEs: 'Come en 2 restaurantes de Little Haiti y escribe una reseña de sostenibilidad.',
    neighborhood: 'Little Haiti',
    points: 120,
    participants: 189,
    completed: false,
    locked: false,
    deadline: 'Jun 14, 2026',
    badge: 'Little Haiti Food Supporter',
    badgeEs: 'Apoyo a Little Haiti',
  },
  {
    id: '4',
    icon: '🏆',
    title: 'Miami Climate Foodie',
    titleEs: 'Foodie Climático de Miami',
    description: 'Visit at least one restaurant in 5 different Miami neighborhoods and review each.',
    descriptionEs: 'Visita al menos un restaurante en 5 barrios de Miami y reseña cada uno.',
    neighborhood: 'All Miami',
    points: 500,
    participants: 97,
    completed: false,
    locked: false,
    deadline: 'Jun 30, 2026',
    badge: 'Miami Climate Foodie',
    badgeEs: 'Foodie Climático de Miami',
  },
  {
    id: '5',
    icon: '🐟',
    title: 'Sustainable Seafood Week',
    titleEs: 'Semana de Mariscos Sostenibles',
    description: 'Visit Oceano and report on sustainable packaging. Coming soon.',
    descriptionEs: 'Visita Oceano y reporta sobre empaque sostenible. Próximamente.',
    neighborhood: 'South Beach',
    points: 100,
    participants: 0,
    completed: false,
    locked: true,
    deadline: 'Jul 4, 2026',
  },
  {
    id: '6',
    icon: '🌱',
    title: 'Plant-Based Pioneer',
    titleEs: 'Pionero Vegetal',
    description: 'Try plant-based dishes at 3 different Miami restaurants.',
    descriptionEs: 'Prueba platos veganos en 3 restaurantes diferentes de Miami.',
    neighborhood: 'All Miami',
    points: 180,
    participants: 254,
    completed: false,
    locked: false,
    deadline: 'Jun 21, 2026',
  },
]

const userPoints = 150
const userBadges = ['Calle Ocho Explorer']

export default function CommunityChallenges() {
  const { lang, t } = useLanguage()
  const [joined, setJoined] = useState<Record<string, boolean>>({})

  const toggleJoin = (id: string) => {
    setJoined((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] pt-14 pb-20">
      <div className="max-w-lg mx-auto px-4 pt-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <Users size={22} className="text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            {t('Community Challenges', 'Retos Comunitarios')}
          </h1>
        </div>
        <p className="text-gray-500 text-sm mb-5">
          {t('Explore Miami, support local restaurants, earn eco-points', 'Explora Miami, apoya restaurantes locales, gana eco-puntos')}
        </p>

        {/* User points card */}
        <div className="bg-green-800 rounded-2xl p-4 text-white mb-5">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <p className="text-white/60 text-xs font-medium mb-0.5">
                {t('Your Eco-Points', 'Tus Eco-Puntos')}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{userPoints}</span>
                <span className="text-white/50 text-sm">pts</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Zap size={24} className="text-yellow-300" />
            </div>
          </div>

          <div>
            <p className="text-white/60 text-xs mb-2">{t('Your Badges', 'Tus Insignias')}</p>
            <div className="flex flex-wrap gap-2">
              {userBadges.map((badge) => (
                <span
                  key={badge}
                  className="bg-white/10 border border-white/20 text-white/90 text-xs font-medium px-3 py-1 rounded-full"
                >
                  ⭐ {badge}
                </span>
              ))}
              <span className="bg-white/5 border border-white/10 text-white/40 text-xs px-3 py-1 rounded-full">
                {t('+ more to earn', '+ más por ganar')}
              </span>
            </div>
          </div>
        </div>

        {/* Active challenges */}
        <h2 className="font-semibold text-gray-900 text-base mb-3">
          {t('Active Challenges', 'Retos Activos')}
        </h2>
        <div className="space-y-2.5 mb-5">
          {challenges.map((challenge) => {
            const isJoined = joined[challenge.id] || challenge.completed

            return (
              <div
                key={challenge.id}
                className={`bg-white rounded-2xl border transition-all ${
                  challenge.locked
                    ? 'border-gray-100 opacity-55'
                    : challenge.completed || isJoined
                    ? 'border-green-100 bg-green-50/30'
                    : 'border-gray-100'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                        challenge.locked ? 'bg-gray-100' : 'bg-gray-50'
                      }`}
                    >
                      {challenge.locked ? <Lock size={18} className="text-gray-400" /> : challenge.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 text-sm leading-snug">
                          {lang === 'es' ? challenge.titleEs : challenge.title}
                        </h3>
                        <span className="flex items-center gap-0.5 bg-amber-50 text-amber-700 font-semibold text-xs px-2 py-0.5 rounded-full border border-amber-100 flex-shrink-0">
                          <Star size={9} className="fill-amber-500 text-amber-500" />
                          {challenge.points}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {lang === 'es' ? challenge.descriptionEs : challenge.description}
                      </p>

                      <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-400">
                        <span>{challenge.neighborhood}</span>
                        <span className="text-gray-200">·</span>
                        <span>{t('Ends', 'Termina')} {challenge.deadline}</span>
                        <span className="text-gray-200">·</span>
                        <span>{challenge.participants} {t('joined', 'unidos')}</span>
                      </div>

                      {challenge.badge && (
                        <div className="mt-2 flex items-center gap-1">
                          <Trophy size={11} className="text-amber-500" />
                          <span className="text-[11px] text-amber-600 font-medium">
                            {t('Badge:', 'Insignia:')} {lang === 'es' ? challenge.badgeEs : challenge.badge}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {!challenge.locked && (
                    <div className="mt-3">
                      {challenge.completed ? (
                        <div className="flex items-center gap-1.5 text-green-700 font-medium text-sm">
                          <CheckCircle size={15} />
                          {t('Completed! Badge earned.', '¡Completado! Insignia obtenida.')}
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleJoin(challenge.id)}
                          className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                            isJoined
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-green-600 text-white'
                          }`}
                        >
                          {isJoined
                            ? `✓ ${t('Joined', 'Unido')}`
                            : t('Join Challenge', 'Unirse al Reto')}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <h2 className="font-semibold text-gray-900 text-base mb-3.5">
            {t('How It Works', 'Cómo Funciona')}
          </h2>
          <div className="space-y-3">
            {[
              {
                step: '1', icon: '🍽️',
                en: 'Join a challenge and visit participating restaurants',
                es: 'Únete a un reto y visita los restaurantes participantes',
              },
              {
                step: '2', icon: '✍️',
                en: 'Leave a review with eco-sustainability feedback',
                es: 'Deja una reseña con comentarios de sostenibilidad',
              },
              {
                step: '3', icon: '⭐',
                en: 'Earn eco-points and unlock community badges',
                es: 'Gana eco-puntos y desbloquea insignias comunitarias',
              },
              {
                step: '4', icon: '📢',
                en: 'Share your impact and help Miami eat greener',
                es: 'Comparte tu impacto y ayuda a Miami a comer más verde',
              },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-3">
                <div className="w-7 h-7 bg-green-100 text-green-800 rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0">
                  {item.step}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">{item.icon}</span>
                  <p className="text-sm text-gray-600">{lang === 'es' ? item.es : item.en}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
