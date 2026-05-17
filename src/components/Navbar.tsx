import { Link, useLocation } from 'react-router-dom'
import { Home, Map, Trophy, LayoutDashboard, Users } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const navItems = [
  { path: '/', icon: Home, en: 'Feed', es: 'Feed' },
  { path: '/explore', icon: Map, en: 'Explore', es: 'Explorar' },
  { path: '/leaderboard', icon: Trophy, en: 'Ranking', es: 'Ranking' },
  { path: '/challenges', icon: Users, en: 'Community', es: 'Comunidad' },
  { path: '/dashboard', icon: LayoutDashboard, en: 'Dashboard', es: 'Panel' },
]

export default function Navbar() {
  const { lang, setLang, t } = useLanguage()
  const location = useLocation()

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-2">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo-icon.png"
              alt="CarbonCrave"
              className="h-10 w-auto object-contain"
            />
            <span className="font-black text-xl tracking-tight">
              <span className="text-green-900">Carbon</span><span className="text-orange-500">Crave</span>
            </span>
          </Link>

          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
            className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-800 font-semibold text-sm px-3 py-1.5 rounded-full border border-green-200 transition-colors"
            aria-label={t('Switch to Spanish', 'Cambiar a Inglés')}
          >
            <span className="text-base">{lang === 'en' ? '🇺🇸' : '🇲🇽'}</span>
            <span>{lang === 'en' ? 'EN' : 'ES'}</span>
            <span className="text-green-400">→</span>
            <span>{lang === 'en' ? 'ES' : 'EN'}</span>
          </button>
        </div>
      </header>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          {navItems.map(({ path, icon: Icon, en, es }) => {
            const active = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
                  active
                    ? 'text-green-700 bg-green-50'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[10px] font-medium">{lang === 'es' ? es : en}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
