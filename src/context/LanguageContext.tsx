import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Language } from '../types'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: (en: string, es: string) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en')

  const t = (en: string, es: string) => (lang === 'es' ? es : en)

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
