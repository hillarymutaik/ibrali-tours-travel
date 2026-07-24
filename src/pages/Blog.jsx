import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { BLOG_POSTS } from '../utils/constants'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import useSeo from '../hooks/useSeo'

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

export default function Blog() {
  useSeo({
    title: 'Blog',
    description: 'Safari guides, travel tips, and stories from the road — straight from the Ibrali Tours & Travel desk.',
  })
  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#1C1A17] overflow-x-hidden font-sans">
      <Navbar />

      <PageHero
        image="https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1400&q=60"
        subtitle="Safari guides, travel tips, and stories from the road — straight from our travel desk."
      >
        Stories &amp;<br />
        <span className="heading-accent">travel guides</span>
      </PageHero>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group card-surface !rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <span
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: '#E75A08', color: '#fff' }}
                >
                  {post.category}
                </span>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-lg font-semibold text-[#1C1A17] leading-snug mb-2">
                  {post.title}
                </h2>
                <p className="text-[#7A7268] text-sm leading-relaxed mb-5 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#9C9890] pt-4 border-t border-[#F0EDE8]">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} strokeWidth={1.8} />
                    {formatDate(post.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} strokeWidth={1.8} />
                    {post.readTime}
                  </span>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 text-sm font-medium mt-4"
                  style={{ color: '#C2470A' }}
                >
                  Read article <ArrowRight size={14} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
