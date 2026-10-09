import { Globe } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { LANGUAGES } from '../i18n/translations'

export default function LanguageSwitcher({ isTransparent }) {
  const { lang, setLang, t } = useLanguage()

  const tone = isTransparent
    ? 'text-white bg-white/12 border-white/25 hover:bg-white/20'
    : 'text-[#1C1A17] bg-white border-[#E3DCCD] hover:border-[#E75A08]'

  return (
    <label
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm font-medium cursor-pointer transition-all duration-300 ${tone}`}
    >
      <Globe size={15} strokeWidth={2} aria-hidden="true" />
      <span className="sr-only">{t('language')}</span>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="bg-transparent outline-none cursor-pointer"
        style={{ color: 'inherit' }}
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  )
}
