'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion'
import { FiLinkedin, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { FaQuoteLeft } from 'react-icons/fa'
import { recommendations } from '../../data/recommendations'

export default function Recommendations() {
  const shouldReduceMotion = useReducedMotion()
  const isReducedMotion = !!shouldReduceMotion

  // Track expanded state for each card independently
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Animation variants
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: isReducedMotion ? 0 : 0.16,
      },
    },
  }

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

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: isReducedMotion ? 0 : 32,
      scale: isReducedMotion ? 1 : 0.97,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: isReducedMotion ? 0 : 0.65,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      variants={containerVariants}
      className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mt-16 sm:mt-24"
    >
      {/* Section Header */}
      <div className="flex flex-col items-center justify-center text-center mb-10 sm:mb-14">
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
          A few words from people I’ve had the opportunity to work and learn with.
        </motion.p>
      </div>

      {/* Two-Column Responsive Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
        {recommendations.map((item) => {
          const isExpanded = !!expandedCards[item.id]

          return (
            <motion.div
              key={item.id}
              variants={cardVariants}
              layout
              className="
                group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl
                border border-white/10 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-md shadow-xl
                transition-all duration-300 hover:border-white/20 hover:bg-zinc-900/60
                hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/70 overflow-hidden
              "
            >
              {/* Subtle top ambient glow inside card */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-32 w-64 rounded-full bg-teal-500/[0.04] blur-2xl transition-opacity duration-300 group-hover:opacity-100"
              />

              <div className="relative z-10 flex flex-col space-y-5">
                {/* Header: Author Area + Source Badge */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/10">
                  {/* Author Profile */}
                  <div className="flex items-center gap-3.5">
                    {/* Tasteful Initials Avatar */}
                    <div
                      className="
                        relative shrink-0 w-12 h-12 rounded-full border border-white/15
                        bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center
                        font-display font-bold text-white text-base tracking-wider shadow-inner
                      "
                      aria-hidden="true"
                    >
                      {item.initials}
                    </div>

                    {/* Author Details */}
                    <div className="flex flex-col">
                      <h4 className="font-display text-lg sm:text-xl font-bold text-foreground tracking-wide leading-tight">
                        {item.name}
                      </h4>
                      <p className="font-sans text-xs sm:text-sm text-foreground/75 font-medium leading-snug mt-0.5">
                        {item.role}
                      </p>
                      <p className="font-sans text-xs text-foreground/50 leading-tight">
                        {item.institution}
                      </p>
                    </div>
                  </div>

                  {/* LinkedIn Source Reference Badge */}
                  <div className="shrink-0 self-start sm:self-auto">
                    <span
                      className="
                        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                        border border-white/10 bg-white/5 text-[11px] font-sans font-medium text-foreground/60
                        backdrop-blur-sm select-none
                      "
                      title="Verified LinkedIn Recommendation"
                    >
                      <FiLinkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                      <span>Recommendation</span>
                    </span>
                  </div>
                </div>

                {/* Quote Content */}
                <div className="relative pt-1">
                  <FaQuoteLeft className="w-4 h-4 text-white/15 mb-2.5 select-none" aria-hidden="true" />

                  <div className="font-sans text-xs sm:text-sm leading-relaxed text-foreground/80 space-y-3">
                    <AnimatePresence initial={false} mode="wait">
                      {isExpanded ? (
                        <motion.div
                          key="full"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                          className="space-y-3"
                        >
                          {item.fullText.split('\n\n').map((paragraph, pIdx) => (
                            <p key={pIdx}>“{paragraph}”</p>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="preview"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p>“{item.previewText}...”</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Card Footer: Expand/Collapse Toggle & Date */}
              <div className="relative z-10 flex items-center justify-between pt-5 mt-4 border-t border-white/5">
                <span className="font-mono text-[11px] text-foreground/40 tracking-wider">
                  {item.date}
                </span>

                <button
                  type="button"
                  onClick={() => toggleExpand(item.id)}
                  aria-expanded={isExpanded}
                  className="
                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                    border border-white/15 bg-white/5 text-xs font-sans font-medium text-foreground/80
                    transition-all duration-200 hover:border-white/30 hover:bg-white/10 hover:text-white
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95 cursor-pointer
                  "
                >
                  <span>{isExpanded ? 'Read less' : 'Read more'}</span>
                  {isExpanded ? (
                    <FiChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <FiChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
