import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, User, ArrowLeft, Search } from 'lucide-react'
import { BLOG_POSTS } from '../utils/constants'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import useSeo from '../hooks/useSeo'

const serif = { fontFamily: "'Playfair Display', serif" }

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

export default function BlogPost() {
  const { slug } = useParams()
  const post = BLOG_POSTS.find((p) => p.slug === slug)

  useSeo({
    title: post ? post.title : 'Article not found',
    description: post ? post.excerpt : 'This article may have moved or no longer exists.',
    image: post?.image,
  })

  if (!post) {
    return (
      <div className="min-h-screen bg-[#FAF7F1]">
        <Navbar />
        <div className="max-w-4xl mx-auto text-center py-32 px-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: '#FFF4ED', border: '0.5px solid #FFD9B3' }}>
            <Search size={26} strokeWidth={1.6} color="#C2470A" />
          </div>
          <h1 className="text-3xl text-[#1C1A17] mb-3" style={{ ...serif, fontWeight: 700 }}>Article not found</h1>
          <p className="text-[#6B6560] mb-8">This post may have moved or no longer exists.</p>
          <Link to="/blog" className="btn btn-dark px-8 py-4">
            <ArrowLeft size={16} strokeWidth={2} /> Back to blog
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#1C1A17] font-sans overflow-x-hidden">
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative h-[60vh] overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(56,44,28,0.9), rgba(56,44,28,0.25) 60%, transparent)' }} />

        <Link
          to="/blog"
          className="absolute top-24 left-6 md:left-10 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-white/20 transition"
        >
          <ArrowLeft size={14} strokeWidth={2} /> All articles
        </Link>

        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-4xl mx-auto px-6 md:px-10 pb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: '#E75A08', color: '#fff' }}>
              {post.category}
            </span>
            <h1 className="text-white leading-[1.05] max-w-3xl" style={{ ...serif, fontWeight: 700, fontSize: 'clamp(30px, 5vw, 52px)' }}>
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* ── META ROW ──────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 pt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#9C9890] border-b border-[#F0EDE8] pb-8">
        <span className="flex items-center gap-1.5"><User size={15} strokeWidth={1.8} /> {post.author}</span>
        <span className="flex items-center gap-1.5"><Calendar size={15} strokeWidth={1.8} /> {formatDate(post.date)}</span>
        <span className="flex items-center gap-1.5"><Clock size={15} strokeWidth={1.8} /> {post.readTime}</span>
      </div>

      {/* ── ARTICLE BODY ──────────────────────────────────────── */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        {post.content.map((paragraph, i) => (
          <p key={i} className="text-[#4A4540] text-base leading-[1.9] mb-6">
            {paragraph}
          </p>
        ))}

        <div className="mt-10 p-7 rounded-2xl" style={{ background: '#FFF1E6' }}>
          <p className="heading text-xl text-[#1C1A17] mb-2">Ready to start planning?</p>
          <p className="text-[#6B6560] text-sm mb-5">Tell us what you have in mind and our travel desk will put together an itinerary within 24 hours.</p>
          <Link to="/contact" className="btn btn-gold px-7 py-3.5">
            Talk to an expert
          </Link>
        </div>
      </article>

      {/* ── RELATED POSTS ─────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="eyebrow mb-6">More from the blog</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((p) => (
              <Link key={p.slug} to={`/blog/${p.slug}`} className="group card-surface !rounded-2xl overflow-hidden flex flex-col">
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                </div>
                <div className="p-5">
                  <h3 className="text-[15px] font-semibold text-[#1C1A17] leading-snug">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
