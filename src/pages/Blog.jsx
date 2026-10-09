import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { BLOG_POSTS } from '../utils/constants'
import { formatDate } from '../utils/helpers'
import { useLanguage } from '../hooks/useLanguage'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import useSeo from '../hooks/useSeo'

export default function Blog() {
  const { t, locale } = useLanguage()
  useSeo({
    title: t('blog.seoTitle'),
    description: t('blog.seoDesc'),
  })
  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#1C1A17] overflow-x-hidden font-sans">
      <Navbar />

      <PageHero
        image="https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1400&q=60"
        subtitle={t('blog.heroSub')}
      >
        {t('blog.hero1')}<br />
        <span className="heading-accent">{t('blog.hero2')}</span>
      </PageHero>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => {
            const title = t(`blog.${post.slug}.title`, post.title)
            return (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group card-surface !rounded-2xl overflow-hidden flex flex-col"
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
                  <img
                    src={post.image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <span
                    className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: '#E75A08', color: '#fff' }}
                  >
                    {t(`blog.${post.slug}.category`, post.category)}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-lg font-semibold text-[#1C1A17] leading-snug mb-2">
                    {title}
                  </h2>
                  <p className="text-[#7A7268] text-sm leading-relaxed mb-5 flex-1">
                    {t(`blog.${post.slug}.excerpt`, post.excerpt)}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-[#9C9890] pt-4 border-t border-[#F0EDE8]">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} strokeWidth={1.8} />
                      {formatDate(post.date, locale)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} strokeWidth={1.8} />
                      {t(`blog.${post.slug}.readTime`, post.readTime)}
                    </span>
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5 text-sm font-medium mt-4"
                    style={{ color: '#C2470A' }}
                  >
                    {t('blog.readArticle')} <ArrowRight size={14} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <Footer />
    </div>
  )
}
