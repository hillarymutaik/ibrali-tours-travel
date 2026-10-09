import navbar from './locales/navbar'
import common from './locales/common'
import footer from './locales/footer'
import home from './locales/home'
import packages from './locales/packages'
import content from './locales/content'
import pages from './locales/pages'
import booking from './locales/booking'
import profile from './locales/profile'

export const LANGUAGES = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
]

// Intl locale used for prices and dates in each language.
// Arabic uses Latin digits (nu-latn) so prices read the same as elsewhere.
export const LOCALES = {
  en: 'en-US',
  fr: 'fr-FR',
  ar: 'ar-u-nu-latn',
}

// Each module exports { en, fr, ar } dictionaries. They are merged into one flat
// lookup per language; keys are namespaced so the modules do not collide.
const modules = [navbar, common, footer, home, packages, content, pages, booking, profile]

const build = (lang) => Object.assign({}, ...modules.map((m) => m[lang]))

export const translations = {
  en: build('en'),
  fr: build('fr'),
  ar: build('ar'),
}
