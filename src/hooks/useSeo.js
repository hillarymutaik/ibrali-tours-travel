import { useEffect } from 'react'

const SITE_NAME = 'Ibrali Tours & Travel'

function setMeta(name, content) {
  if (!content) return
  let tag = document.querySelector(`meta[name="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setOgMeta(property, content) {
  if (!content) return
  let tag = document.querySelector(`meta[property="${property}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('property', property)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

/**
 * Sets the document title + meta description/Open Graph tags for the current
 * page. No extra dependency (react-helmet et al.) — just a couple of DOM
 * writes on mount, which is all a client-rendered SPA like this needs.
 */
export default function useSeo({ title, description, image }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Exploring the World, Protecting Its Wonders`
    document.title = fullTitle

    if (description) {
      setMeta('description', description)
      setOgMeta('og:description', description)
    }
    setOgMeta('og:title', fullTitle)
    setOgMeta('og:type', 'website')
    if (image) setOgMeta('og:image', image)
  }, [title, description, image])
}
