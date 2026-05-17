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
    <div className="min-h-screen bg-gray-50 pt-16 pb-20">
      <div className="max-w-lg mx-auto px-4 pt-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <Users size={24} className="text-green-600" />
          <h1 className="text-2xl font-black text-gray-900">
            {t('Community Challenges', 'Retos Comunitarios')}
          </h1>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          {t('Explore Miami, support local restaurants, earn eco-points', 'Explora Miami, apoya restaurantes locales, gana eco-puntos')}
        </p>

        {/* User points card */}
        <div className="bg-gradient-to-br from-green-700 to-teal-600 rounded-3xl p-5 text-white mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/70 text-sm">{t('Your Eco-Points', 'Tus Eco-Puntos')}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">{userPoints}</span>
                <span className="text-white/60">pts</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
              <Zap size={28} className="text-yellow-300" />
            </div>
          </div>

          <div>
            <p className="text-white/70 text-xs mb-2">{t('Your Badges', 'Tus Insignias')}</p>
            <div className="flex flex-wrap gap-2">
              {userBadges.map((badge) => (
                <span
                  key={badge}
                  className="bg-yellow-400/20 border border-yellow-400/40 text-yellow-200 text-xs font-semibold px-3 py-1 rounded-full"
                >
                  ⭐ {badge}
                </span>
              ))}
              <span className="bg-white/10 border border-white/20 text-white/50 text-xs px-3 py-1 rounded-full">
                {t('+ more to earn', '+ más por ganar')}
              </span>
            </div>
          </div>
        </div>

        {/* Active challenges */}
        <h2 className="font-black text-gray-900 text-base mb-3">
          {t('Active Challenges', 'Retos Activos')}
        </h2>
        <div className="space-y-3 mb-6">
          {challenges.map((challenge) => {
            const isJoined = joined[challenge.id] || challenge.completed

            return (
              <div
                key={challenge.id}
                className={`bg-white rounded-2xl border transition-all ${
                  challenge.locked
                    ? 'border-gray-100 opacity-60'
                    : challenge.completed || isJoined
                    ? 'border-green-200 bg-green-50/50'
                    : 'border-gray-100 hover:shadow-md'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                        challenge.locked ? 'bg-gray-100' : 'bg-green-50'
                      }`}
                    >
                      {challenge.locked ? <Lock size={20} className="text-gray-400" /> : challenge.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-gray-900 text-sm leading-tight">
                          {lang === 'es' ? challenge.titleEs : challenge.title}
                        </h3>
                        <span className="flex items-center gap-0.5 bg-yellow-50 text-yellow-700 font-bold text-xs px-2 py-0.5 rounded-full border border-yellow-100 flex-shrink-0">
                          <Star size={10} className="fill-yellow-500 text-yellow-500" />
                          {challenge.points}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {lang === 'es' ? challenge.descriptionEs : challenge.description}
                      </p>

                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span>{challenge.neighborhood}</span>
                        <span>·</span>
                        <span>
                          {t('Ends', 'Termina')} {challenge.deadline}
                        </span>
                        <span>·</span>
                        <span>{challenge.participants} {t('joined', 'unidos')}</span>
                      </div>

                      {challenge.badge && (
                        <div className="mt-2 flex items-center gap-1">
                          <Trophy size={12} className="text-yellow-500" />
                          <span className="text-xs text-yellow-700 font-semibold">
                            {t('Badge:', 'Insignia:')} {lang === 'es' ? challenge.badgeEs : challenge.badge}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {!challenge.locked && (
                    <div className="mt-3">
                      {challenge.completed ? (
                        <div className="flex items-center gap-2 text-green-700 font-semibold text-sm">
                          <CheckCircle size={16} className="fill-green-100" />
                          {t('Completed! Badge earned.', '¡Completado! Insignia obtenida.')}
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleJoin(challenge.id)}
                          className={`w-full py-2.5 rounded-xl font-bold text-sm transition-colors ${
                            isJoined
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : 'bg-green-600 hover:bg-green-700 text-white'
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
          <h2 className="font-black text-gray-900 text-base mb-3">
            {t('How It Works', 'Cómo Funciona')}
          </h2>
          <div className="space-y-3">
            {[
              {
                step: '1',
                icon: '🍽️',
                en: 'Join a challenge and visit participating restaurants',
                es: 'Únete a un reto y visita los restaurantes participantes',
              },
              {
                step: '2',
                icon: '✍️',
                en: 'Leave a review with eco-sustainability feedback',
                es: 'Deja una reseña con comentarios de sostenibilidad',
              },
              {
                step: '3',
                icon: '⭐',
                en: 'Earn eco-points and unlock community badges',
                es: 'Gana eco-puntos y desbloquea insignias comunitarias',
              },
              {
                step: '4',
                icon: '📢',
                en: 'Share your impact and help Miami eat greener',
                es: 'Comparte tu impacto y ayuda a Miami a comer más verde',
              },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">
                  {item.step}
                </div>
                <div className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <p className="text-sm text-gray-700">{lang === 'es' ? item.es : item.en}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
