'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion'
import { FiLinkedin, FiChevronLeft, FiChevronRight, FiChevronUp } from 'react-icons/fi'
import { FaQuoteLeft } from 'react-icons/fa'
import { recommendations, type Recommendation } from '../../data/recommendations'

/* ─────────────────────────────────────────────
   Avatar – circular profile with fallback
   ───────────────────────────────────────────── */
function Avatar({
  src,
  alt,
  initials,
}: {
  src?: string
  alt: string
  initials: string
}) {
  const [failed, setFailed] = useState(false)

  return (
    <div
      className="
        relative shrink-0 w-12 h-12 sm:w-[52px] sm:h-[52px] md:w-14 md:h-14 rounded-full
        ring-1 ring-white/10 overflow-hidden
        flex items-center justify-center
        bg-gradient-to-br from-zinc-800 to-zinc-900
        transition-transform duration-300 group-hover:scale-105
      "
      aria-hidden="true"
    >
      {src && !failed ? (
        <Image
          src={src}
          alt={alt}
          width={56}
          height={56}
          onError={() => setFailed(true)}
          className="w-full h-full object-cover object-center select-none pointer-events-none"
          unoptimized
        />
      ) : (
        <span className="font-display font-bold text-white/90 text-sm tracking-wider select-none">
          {initials}
        </span>
      )}
    </div>
  )
}

/*
 * Collapsed quote height constant.
 * All cards use this exact height for the quote region when collapsed,
 * guaranteeing identical card dimensions regardless of text length.
 * 120px ≈ ~5 lines of text at 13-14px / 1.75 line-height.
 */
const COLLAPSED_QUOTE_HEIGHT = 120

/* ─────────────────────────────────────────────
   Single Recommendation Card
   ───────────────────────────────────────────── */
function RecommendationCard({
  item,
  isExpanded,
  onToggle,
  isFocused = false,
}: {
  item: Recommendation
  isExpanded: boolean
  onToggle: () => void
  isFocused?: boolean
}) {
  return (
    <article
      className={`
        group relative flex flex-col overflow-hidden
        rounded-2xl md:rounded-3xl
        border transition-all duration-300
        ${isExpanded
          ? 'border-white/20 bg-zinc-900/85 shadow-2xl shadow-black/50'
          : isFocused
            ? 'border-white/20 bg-zinc-900/70 shadow-xl shadow-black/40 ring-1 ring-white/10'
            : 'border-white/[0.07] bg-zinc-900/50 hover:border-white/15 hover:bg-zinc-900/70'
        }
        p-5 sm:p-6 md:p-7
        shadow-lg shadow-black/30
        hover:shadow-xl hover:shadow-black/40
        hover:-translate-y-0.5
      `}
    >
      {/* ── Ambient top glow ── */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2
          h-40 w-72 rounded-full
          bg-teal-500/[0.03] blur-3xl
          opacity-0 group-hover:opacity-100 transition-opacity duration-500
        "
      />

      {/* ── Decorative quote mark ── */}
      <FaQuoteLeft
        aria-hidden="true"
        className="
          absolute top-5 right-6 w-10 h-10 sm:w-12 sm:h-12
          text-white/[0.03] select-none pointer-events-none
          transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5
        "
      />

      {/* ── Header: avatar + author info ── */}
      <div className="relative z-10 flex items-center gap-3.5 mb-5">
        <Avatar src={item.avatar} alt={item.name} initials={item.initials} />

        <div className="flex flex-col min-w-0 flex-1">
          <h4 className="font-display text-[15px] sm:text-base md:text-lg font-bold text-foreground tracking-wide leading-tight truncate">
            {item.name}
          </h4>
          <p className="font-sans text-[11px] sm:text-xs text-foreground/60 font-medium leading-snug truncate mt-0.5">
            {item.role}
          </p>
          <p className="font-sans text-[10px] sm:text-[11px] text-foreground/40 leading-tight truncate">
            {item.institution}
          </p>
        </div>
      </div>

      {/* ── Thin separator ── */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent mb-4" />

      {/* ── Quote body with fixed collapsed height ── */}
      <div className="relative z-10 mb-4">
        <div className="font-sans text-[13px] sm:text-sm leading-[1.75] text-foreground/75 tracking-[0.01em]">
          <AnimatePresence initial={false} mode="wait">
            {isExpanded ? (
              <motion.div
                key={`full-${item.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-3"
              >
                {item.fullText.split('\n\n').map((paragraph, i) => (
                  <p key={i}>&ldquo;{paragraph}&rdquo;</p>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={`preview-${item.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden relative"
                style={{ height: COLLAPSED_QUOTE_HEIGHT }}
              >
                <p>&ldquo;{item.previewText}…&rdquo;</p>
                {/* Subtle bottom fade to indicate truncation */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to bottom, transparent 0%, rgba(24, 24, 27, 0.95) 100%)',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Footer: date + LinkedIn badge + Read more ── */}
      <div className="relative z-10 flex items-center justify-between gap-3 pt-4 border-t border-white/[0.05] mt-auto">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono text-[10px] sm:text-[11px] text-foreground/35 tracking-wider whitespace-nowrap">
            {item.date}
          </span>

          <span
            className="
              inline-flex items-center gap-1 px-2 py-0.5 rounded-full
              border border-white/[0.07] bg-white/[0.03]
              text-[10px] font-sans font-medium text-foreground/40
              select-none
            "
            title="Verified LinkedIn Recommendation"
          >
            <FiLinkedin className="w-2.5 h-2.5 text-[#0A66C2]/80" />
            <span className="hidden min-[400px]:inline">LinkedIn</span>
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggle()
          }}
          aria-expanded={isExpanded}
          className="
            inline-flex items-center gap-1 px-3 py-1.5 rounded-full
            border border-white/10 bg-white/[0.04]
            text-[11px] font-sans font-medium text-foreground/70
            transition-all duration-200
            hover:border-white/20 hover:bg-white/[0.08] hover:text-foreground/90
            focus:outline-none focus-visible:ring-1 focus-visible:ring-white/50
            active:scale-95 cursor-pointer
          "
        >
          <span>{isExpanded ? 'Read less' : 'Read more'}</span>
          {isExpanded ? (
            <FiChevronUp className="w-3 h-3" />
          ) : (
            <FiChevronRight className="w-3 h-3" />
          )}
        </button>
      </div>
    </article>
  )
}

/* ─────────────────────────────────────────────
   Main export
   ───────────────────────────────────────────── */
export default function Recommendations() {
  const shouldReduceMotion = useReducedMotion()
  const isReducedMotion = !!shouldReduceMotion

  /*
   * Per-card expanded state keyed by recommendation id.
   * Each card toggles independently — expanding one
   * never affects the other.
   */
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})

  // Active recommendation index (0, 1, or 2)
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [timerResetKey, setTimerResetKey] = useState(0)
  const [isTouched, setIsTouched] = useState(false)

  const desktopRailRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const isAnyExpanded = useMemo(
    () => Object.values(expandedCards).some(Boolean),
    [expandedCards]
  )

  const toggleExpand = useCallback((id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const handlePrev = useCallback(() => {
    setDirection(-1)
    setActiveIndex((prev) => (prev - 1 + recommendations.length) % recommendations.length)
    setTimerResetKey((prev) => prev + 1)
  }, [])

  const handleNext = useCallback(() => {
    setDirection(1)
    setActiveIndex((prev) => (prev + 1) % recommendations.length)
    setTimerResetKey((prev) => prev + 1)
  }, [])

  const handleSelectIndex = useCallback((index: number) => {
    setDirection(index >= activeIndex ? 1 : -1)
    setActiveIndex(index)
    setTimerResetKey((prev) => prev + 1)
  }, [activeIndex])

  // Sync desktop rail horizontal scroll position with active card
  useEffect(() => {
    const cardEl = cardRefs.current[activeIndex]
    const railEl = desktopRailRef.current
    if (!cardEl || !railEl) return

    const railRect = railEl.getBoundingClientRect()
    const cardRect = cardEl.getBoundingClientRect()

    let targetScrollLeft = 0
    if (activeIndex === 0) {
      targetScrollLeft = 0
    } else if (activeIndex === recommendations.length - 1) {
      targetScrollLeft = railEl.scrollWidth - railEl.clientWidth
    } else {
      const cardOffset = cardRect.left - railRect.left + railEl.scrollLeft
      targetScrollLeft = Math.max(0, cardOffset - (railRect.width - cardRect.width) / 2)
    }

    railEl.scrollTo({ left: targetScrollLeft, behavior: 'smooth' })
  }, [activeIndex])

  // ── Header animation ──
  const headingVariants: Variants = {
    hidden: {
      opacity: 0,
      y: isReducedMotion ? 0 : 28,
      scale: isReducedMotion ? 1 : 0.95,
      filter: isReducedMotion ? 'none' : 'blur(6px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: isReducedMotion ? 0 : 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const subtitleVariants: Variants = {
    hidden: {
      opacity: 0,
      y: isReducedMotion ? 0 : 16,
      filter: isReducedMotion ? 'none' : 'blur(4px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: isReducedMotion ? 0 : 0.5,
        delay: isReducedMotion ? 0 : 0.14,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  // ── Auto-scroll: pauses when any card is expanded or touched; resets on manual button click ──
  useEffect(() => {
    if (isReducedMotion || isAnyExpanded || isTouched) return

    const timer = setInterval(() => {
      setDirection(1)
      setActiveIndex((prev) => (prev + 1) % recommendations.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [isReducedMotion, isAnyExpanded, isTouched, timerResetKey])

  return (
    <div className="relative z-10 w-full mt-16 sm:mt-24 select-none">
      {/* ── Section heading ── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="flex flex-col items-center justify-center text-center mb-10 sm:mb-14 px-4 sm:px-6"
      >
        <div className="overflow-hidden py-1">
          <motion.h3
            variants={headingVariants}
            className="font-display text-3xl sm:text-5xl md:text-6xl tracking-wider uppercase font-bold text-foreground leading-none text-center"
          >
            WHAT PEOPLE SAY
          </motion.h3>
        </div>

        <motion.p
          variants={subtitleVariants}
          className="font-sans text-xs min-[360px]:text-sm sm:text-base text-foreground/60 mt-3 max-w-xl mx-auto tracking-wide text-center px-2"
        >
          A few words from people I&apos;ve had the opportunity to work and learn with.
        </motion.p>
      </motion.div>

      {/* ── DESKTOP (md+): Premium Horizontal Carousel Rail (Preserves identical card dimensions) ── */}
      <div className="hidden md:block w-full max-w-6xl mx-auto px-6 relative">
        <div
          ref={desktopRailRef}
          className="
            works-scrollbar-hidden
            w-full overflow-x-auto overflow-y-hidden
            flex flex-nowrap gap-6 lg:gap-8
            pb-4 pt-1 items-start
            scroll-smooth
          "
        >
          {recommendations.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => {
                cardRefs.current[index] = el
              }}
              onClick={() => handleSelectIndex(index)}
              className="w-[calc(50%-14px)] min-w-[380px] max-w-[500px] shrink-0"
            >
              <RecommendationCard
                item={item}
                isExpanded={!!expandedCards[item.id]}
                isFocused={activeIndex === index}
                onToggle={() => toggleExpand(item.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── MOBILE (<md): Single card visible + directional auto-scroll ── */}
      <div
        className="md:hidden relative w-full overflow-hidden px-4 sm:px-6"
        onTouchStart={() => setIsTouched(true)}
        onTouchEnd={() => setIsTouched(false)}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={recommendations[activeIndex].id}
            initial={isReducedMotion ? false : { opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={isReducedMotion ? undefined : { opacity: 0, x: direction * -40 }}
            transition={{
              x: { type: 'spring', stiffness: 260, damping: 28 },
              opacity: { duration: 0.25 },
            }}
            className="w-full max-w-[420px] mx-auto"
          >
            <RecommendationCard
              item={recommendations[activeIndex]}
              isExpanded={!!expandedCards[recommendations[activeIndex].id]}
              onToggle={() => toggleExpand(recommendations[activeIndex].id)}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Carousel Navigation Controls (Shared across Desktop & Mobile) ── */}
      <div className="flex items-center justify-center gap-3.5 sm:gap-4 mt-8 sm:mt-10">
        {/* Previous Recommendation Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous recommendation"
          className="
            group relative flex items-center justify-center
            w-9 h-9 sm:w-10 sm:h-10
            rounded-xl
            border border-white/10 bg-zinc-900/60
            text-white/80 hover:text-white
            hover:border-white/25 hover:bg-zinc-800/80
            backdrop-blur-md shadow-md shadow-black/40 hover:shadow-lg hover:shadow-black/60
            transition-all duration-200 ease-out
            hover:-translate-y-0.5 hover:scale-[1.03]
            active:translate-y-0 active:scale-95
            focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40
            cursor-pointer
            motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 motion-reduce:transition-none
          "
        >
          <FiChevronLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:group-hover:translate-x-0" />
        </button>

        {/* Active Indicators (Dot pills) */}
        <div className="flex items-center gap-2 px-1" aria-hidden="true">
          {recommendations.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectIndex(i)}
              className={`
                h-1.5 rounded-full transition-all duration-300 cursor-pointer
                ${i === activeIndex
                  ? 'bg-white/75 w-5'
                  : 'bg-white/20 w-1.5 hover:bg-white/40'
                }
              `}
              aria-label={`View recommendation from ${item.name}`}
            />
          ))}
        </div>

        {/* Next Recommendation Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next recommendation"
          className="
            group relative flex items-center justify-center
            w-9 h-9 sm:w-10 sm:h-10
            rounded-xl
            border border-white/10 bg-zinc-900/60
            text-white/80 hover:text-white
            hover:border-white/25 hover:bg-zinc-800/80
            backdrop-blur-md shadow-md shadow-black/40 hover:shadow-lg hover:shadow-black/60
            transition-all duration-200 ease-out
            hover:-translate-y-0.5 hover:scale-[1.03]
            active:translate-y-0 active:scale-95
            focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40
            cursor-pointer
            motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 motion-reduce:transition-none
          "
        >
          <FiChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0" />
        </button>
      </div>
    </div>
  )
}
