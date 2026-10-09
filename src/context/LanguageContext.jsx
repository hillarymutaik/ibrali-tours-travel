import { useCallback, useEffect, useMemo, useState } from 'react'
import { LANGUAGES, LOCALES, translations } from '../i18n/translations'
import { LanguageContext } from './languageContextObject'

const STORAGE_KEY = 'ibrali-lang'
const DEFAULT_LANG = 'en'

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return translations[saved] ? saved : DEFAULT_LANG
  })

  // Keep <html lang> and <html dir> in sync so Arabic renders right-to-left
  useEffect(() => {
    const current = LANGUAGES.find((l) => l.code === lang)
    document.documentElement.lang = lang
    document.documentElement.dir = current.dir
    localStorage.setItem(STORAGE_KEY, lang)
  }, [lang])

  // t(key, fallback, vars): looks up the active language, then English, then
  // the fallback (used for data such as packages), then the key itself.
  // {name} placeholders are filled from vars.
  const t = useCallback(
    (key, fallback, vars) => {
      let str = translations[lang][key] ?? translations[DEFAULT_LANG][key] ?? fallback ?? key
      if (vars) str = str.replace(/\{(\w+)\}/g, (match, name) => vars[name] ?? match)
      return str
    },
    [lang]
  )

  const value = useMemo(
    () => ({ lang, setLang, t, locale: LOCALES[lang] }),
    [lang, t]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export default LanguageProvider
