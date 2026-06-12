import React from "react"
import { Link } from "react-router-dom"

const STATS = [
  { num: "50+", label: "Destinations" },
  { num: "4.9", label: "Average rating" },
  { num: "1,200+", label: "Trips completed" },
  { num: "Local", label: "Expert guides" },
]

export default function Hero() {
  return (
    <section className="relative min-h-[88vh] flex flex-col justify-end overflow-hidden font-[Inter]">

      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1800&auto=format&fit=crop&q=80)",
        }}
      />

      {/* WARM EARTH-TONE OVERLAY */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,7,3,0.35) 0%, rgba(10,7,3,0.55) 50%, rgba(10,7,3,0.82) 100%)",
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-6 sm:px-10 pt-24">

        {/* EYEBROW */}
        <div className="inline-flex items-center gap-2 mb-5">
          <span className="w-7 h-px" style={{ background: "#C4962A" }} />
          <span
            className="text-[11px] font-medium uppercase"
            style={{ color: "#C4962A", letterSpacing: "2.5px" }}
          >
            Premium African Travel
          </span>
          <span className="w-7 h-px" style={{ background: "#C4962A" }} />
        </div>

        {/* TITLE */}
        <h1
          className="leading-[1.1] mb-1.5"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            color: "#F5ECD8",
            fontSize: "clamp(36px, 6vw, 58px)",
          }}
        >
          Where every journey
          <br />
          becomes{" "}
          <span style={{ fontStyle: "italic", fontWeight: 400, color: "#EDB84A" }}>
            a story
          </span>
        </h1>

        {/* SUBTITLE */}
        <p
          className="text-[15px] leading-[1.7] max-w-xl mt-4 mb-8"
          style={{ color: "rgba(220,205,180,0.75)" }}
        >
          Safaris, coastlines, highlands, and living cultures — hand-crafted
          itineraries across Africa built around the moments you'll never forget.
        </p>

        {/* CTAS */}
        <div className="flex flex-wrap gap-3 mb-12">
          <Link
            to="/packages"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-[13.5px] font-medium transition-colors"
            style={{ background: "#C4962A", color: "#0A0703" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#EDB84A")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#C4962A")}
          >
            Explore packages <span className="text-sm">→</span>
          </Link>

          <Link
            to="/booking"
            className="inline-flex items-center px-7 py-3 rounded-full text-[13.5px] transition-colors"
            style={{
              color: "#F5ECD8",
              border: "1px solid rgba(245,236,216,0.3)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(245,236,216,0.7)"
              e.currentTarget.style.color = "#fff"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(245,236,216,0.3)"
              e.currentTarget.style.color = "#F5ECD8"
            }}
          >
            Plan your trip
          </Link>
        </div>
      </div>

      {/* STATS BAR */}
      <div
        className="relative z-10 flex"
        style={{
          borderTop: "1px solid rgba(196,150,42,0.2)",
          background: "rgba(10,7,3,0.6)",
        }}
      >
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className="flex-1 px-6 py-4 flex flex-col gap-1"
            style={{
              borderRight:
                i < STATS.length - 1
                  ? "1px solid rgba(196,150,42,0.12)"
                  : "none",
            }}
          >
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "22px",
                fontWeight: 700,
                color: "#EDB84A",
                lineHeight: 1,
              }}
            >
              {s.num}
            </span>
            <span
              className="text-[11px]"
              style={{ color: "rgba(200,185,160,0.65)", letterSpacing: "0.3px" }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}