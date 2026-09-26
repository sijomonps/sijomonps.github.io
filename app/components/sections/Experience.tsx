'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'
import GradientBackground from '../common/GradientBackground'
import HighlightModal from './HighlightModal'
import { highlights, type Highlight } from '../../data/highlights'

type ScreenSize = 'mobile' | 'tablet' | 'desktop'

export default function Experience() {
  const shouldReduceMotion = useReducedMotion()
  const isReducedMotion = !!shouldReduceMotion

  // Interaction & modal state
  const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(null)
  const [hoveredHighlight, setHoveredHighlight] = useState<Highlight | null>(null)
  const [hoveredOrbitIndex, setHoveredOrbitIndex] = useState<number | null>(null)

  // Assembly & entrance animation state
  const [isInView, setIsInView] = useState(false)
  const [isAssembled, setIsAssembled] = useState(false)

  // Responsive layout state
  const [screenSize, setScreenSize] = useState<ScreenSize>('desktop')

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth
      if (w < 640) {
        setScreenSize('mobile')
      } else if (w < 1024) {
        setScreenSize('tablet')
      } else {
        setScreenSize('desktop')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Start continuous orbit only after entrance sequence settles
  useEffect(() => {
    if (!isInView || isReducedMotion) {
      return
    }

    const timer = setTimeout(() => {
      setIsAssembled(true)
    }, 1400)

    return () => clearTimeout(timer)
  }, [isInView, isReducedMotion])

  const handleViewportEnter = useCallback(() => {
    setIsInView(true)
  }, [])

  const handleViewportLeave = useCallback(() => {
    setIsInView(false)
    setIsAssembled(false)
  }, [])

  // Split highlights into Center (1), Inner (4), Middle (7), Outer (8)
  const centerItem = useMemo(
    () => highlights.find((h) => h.featured) || highlights[0],
    []
  )
  const innerItems = useMemo(() => highlights.slice(1, 5), [])
  const middleItems = useMemo(() => highlights.slice(5, 12), [])
  const outerItems = useMemo(() => highlights.slice(12, 20), [])

  // Responsive radii and node dimensions
  const dims = useMemo(() => {
    if (screenSize === 'mobile') {
      return {
        stageHeight: 330,
        centerSize: 66,
        orbits: [
          { radius: 60, nodeSize: 42, ringOpacity: 0.07 },
          { radius: 95, nodeSize: 36, ringOpacity: 0.055 },
          { radius: 135, nodeSize: 30, ringOpacity: 0.045 },
        ],
      }
    }
    if (screenSize === 'tablet') {
      return {
        stageHeight: 490,
        centerSize: 92,
        orbits: [
          { radius: 96, nodeSize: 58, ringOpacity: 0.07 },
          { radius: 152, nodeSize: 50, ringOpacity: 0.055 },
          { radius: 215, nodeSize: 42, ringOpacity: 0.045 },
        ],
      }
    }
    return {
      stageHeight: 630,
      centerSize: 116,
      orbits: [
        { radius: 128, nodeSize: 72, ringOpacity: 0.07 },
        { radius: 200, nodeSize: 62, ringOpacity: 0.055 },
        { radius: 280, nodeSize: 52, ringOpacity: 0.045 },
      ],
    }
  }, [screenSize])

  // Framer Motion entrance variants matching WORKS section language
  const headingVariants: Variants = {
    hidden: {
      opacity: 0,
      y: isReducedMotion ? 0 : 36,
      scale: isReducedMotion ? 1 : 0.94,
      filter: isReducedMotion ? 'none' : 'blur(8px)',
    },
    visible: {
      opacity: [0, 1, 1],
      y: isReducedMotion ? 0 : [36, -2, 0],
      scale: isReducedMotion ? 1 : [0.94, 1.015, 1],
      filter: isReducedMotion ? 'none' : ['blur(8px)', 'blur(0px)', 'blur(0px)'],
      transition: {
        duration: isReducedMotion ? 0 : 0.65,
        times: [0, 0.7, 1],
        ease: ['easeOut', 'easeInOut'],
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
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: isReducedMotion ? 0 : 0.5,
        delay: isReducedMotion ? 0 : 0.18,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const footerVariants: Variants = {
    hidden: {
      opacity: 0,
      y: isReducedMotion ? 0 : 16,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isReducedMotion ? 0 : 0.5,
        delay: isReducedMotion ? 0 : 1.1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  // Animation play states
  const isInnerPaused =
    !isAssembled ||
    isReducedMotion ||
    hoveredOrbitIndex === 0 ||
    Boolean(selectedHighlight)
  const isMiddlePaused =
    !isAssembled ||
    isReducedMotion ||
    hoveredOrbitIndex === 1 ||
    Boolean(selectedHighlight)
  const isOuterPaused =
    !isAssembled ||
    isReducedMotion ||
    hoveredOrbitIndex === 2 ||
    Boolean(selectedHighlight)

  const handleOpenHighlight = useCallback((item: Highlight) => {
    setSelectedHighlight(item)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedHighlight(null)
  }, [])

  const certificatesUrl =
    'https://www.linkedin.com/in/sijomonps/details/certifications/'

  return (
    <motion.section
      id="experience"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.12 }}
      onViewportEnter={handleViewportEnter}
      onViewportLeave={handleViewportLeave}
      className="w-full py-20 sm:py-28 relative overflow-hidden"
    >
      {/* Ambient background lighting */}
      <GradientBackground
        sectionId="experience"
        gradientColors={{
          start: '#1E3A8A',
          end: '#0F766E',
        }}
      />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-12 text-center relative z-10 mb-10 sm:mb-14">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="overflow-hidden py-1">
            <motion.h2
              variants={headingVariants}
              className="font-display text-5xl sm:text-7xl md:text-8xl tracking-wider uppercase font-bold text-foreground leading-none text-center"
            >
              HIGHLIGHTS
            </motion.h2>
          </div>

          <motion.p
            variants={subtitleVariants}
            className="font-sans text-sm sm:text-base text-foreground/60 mt-3 max-w-xl mx-auto tracking-wide text-center"
          >
            Moments, milestones, and experiences along the way.
          </motion.p>
        </div>
      </div>

      {/* Orbital Globe Canvas Container */}
      <div
        className="relative mx-auto w-full max-w-5xl flex items-center justify-center select-none"
        style={{ height: `${dims.stageHeight}px` }}
      >
        {/* Subtle Center Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-3xl z-0"
          style={{
            width: `${dims.centerSize * 2.2}px`,
            height: `${dims.centerSize * 2.2}px`,
          }}
        />

        {/* 1. Subtle Orbital Guide Rings */}
        {dims.orbits.map((orbit, idx) => (
          <div
            key={`ring-${idx}`}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white z-0 transition-opacity duration-700"
            style={{
              width: `${orbit.radius * 2}px`,
              height: `${orbit.radius * 2}px`,
              borderColor: `rgba(255, 255, 255, ${orbit.ringOpacity})`,
              opacity: isInView || isReducedMotion ? 1 : 0.6,
            }}
          />
        ))}

        {/* 2. Outer Orbit (8 items, Clockwise) */}
        <div
          className="absolute left-1/2 top-1/2 pointer-events-none z-10 animate-orbit-cw-outer"
          style={{
            width: `${dims.orbits[2].radius * 2}px`,
            height: `${dims.orbits[2].radius * 2}px`,
            marginLeft: `-${dims.orbits[2].radius}px`,
            marginTop: `-${dims.orbits[2].radius}px`,
            animationPlayState: isOuterPaused ? 'paused' : 'running',
          }}
        >
          {outerItems.map((item, idx) => {
            const angle = 10 + (idx / outerItems.length) * 360
            const rad = (angle * Math.PI) / 180
            const x = dims.orbits[2].radius + dims.orbits[2].radius * Math.cos(rad)
            const y = dims.orbits[2].radius + dims.orbits[2].radius * Math.sin(rad)
            const seqIndex = 11 + idx

            return (
              <div
                key={item.id}
                className="absolute pointer-events-auto"
                style={{
                  width: `${dims.orbits[2].nodeSize}px`,
                  height: `${dims.orbits[2].nodeSize}px`,
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Counter-rotation to keep photograph upright */}
                <div
                  className="animate-counter-cw-outer w-full h-full"
                  style={{
                    animationPlayState: isOuterPaused ? 'paused' : 'running',
                  }}
                >
                  <div
                    className="relative w-full h-full transition-all duration-500 ease-out"
                    style={{
                      opacity: isInView || isReducedMotion ? 1 : 0.85,
                      transform: isInView || isReducedMotion ? 'scale(1)' : 'scale(0.85)',
                      transitionDelay: isReducedMotion ? '0s' : `${0.2 + seqIndex * 0.035}s`,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleOpenHighlight(item)}
                      onMouseEnter={() => {
                        setHoveredHighlight(item)
                        setHoveredOrbitIndex(2)
                      }}
                      onMouseLeave={() => {
                        setHoveredHighlight(null)
                        setHoveredOrbitIndex(null)
                      }}
                      aria-label={`View highlight: ${item.title}`}
                      className="
                        group relative flex items-center justify-center rounded-full
                        overflow-hidden border border-white/20 bg-zinc-950/80 shadow-lg
                        transition-all duration-300 ease-out hover:scale-115 hover:border-white/80
                        hover:shadow-2xl hover:shadow-cyan-900/30 hover:z-50 focus:outline-none
                        focus-visible:ring-2 focus-visible:ring-white active:scale-95
                        w-full h-full
                      "
                      style={{ opacity: 0.82 }}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes={`${dims.orbits[2].nodeSize}px`}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </button>

                    {/* Small Hover Label with Connector */}
                    {hoveredHighlight?.id === item.id && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none z-50 whitespace-nowrap">
                        <div className="flex flex-col items-center">
                          <div className="rounded-full border border-white/20 bg-zinc-950/92 px-2.5 py-0.5 text-[11px] font-medium text-foreground backdrop-blur-md shadow-xl flex items-center gap-1.5">
                            <span className="font-semibold text-white">
                              {item.title}
                            </span>
                            {item.year && (
                              <span className="text-white/40">· {item.year}</span>
                            )}
                          </div>
                          <div className="w-[1px] h-1.5 bg-white/40" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 3. Middle Orbit (7 items, Counter-Clockwise) */}
        <div
          className="absolute left-1/2 top-1/2 pointer-events-none z-20 animate-orbit-ccw-middle"
          style={{
            width: `${dims.orbits[1].radius * 2}px`,
            height: `${dims.orbits[1].radius * 2}px`,
            marginLeft: `-${dims.orbits[1].radius}px`,
            marginTop: `-${dims.orbits[1].radius}px`,
            animationPlayState: isMiddlePaused ? 'paused' : 'running',
          }}
        >
          {middleItems.map((item, idx) => {
            const angle = 25 + (idx / middleItems.length) * 360
            const rad = (angle * Math.PI) / 180
            const x = dims.orbits[1].radius + dims.orbits[1].radius * Math.cos(rad)
            const y = dims.orbits[1].radius + dims.orbits[1].radius * Math.sin(rad)
            const seqIndex = 4 + idx

            return (
              <div
                key={item.id}
                className="absolute pointer-events-auto"
                style={{
                  width: `${dims.orbits[1].nodeSize}px`,
                  height: `${dims.orbits[1].nodeSize}px`,
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Counter-rotation to keep photograph upright */}
                <div
                  className="animate-counter-ccw-middle w-full h-full"
                  style={{
                    animationPlayState: isMiddlePaused ? 'paused' : 'running',
                  }}
                >
                  <div
                    className="relative w-full h-full transition-all duration-500 ease-out"
                    style={{
                      opacity: isInView || isReducedMotion ? 1 : 0.85,
                      transform: isInView || isReducedMotion ? 'scale(1)' : 'scale(0.85)',
                      transitionDelay: isReducedMotion ? '0s' : `${0.2 + seqIndex * 0.035}s`,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleOpenHighlight(item)}
                      onMouseEnter={() => {
                        setHoveredHighlight(item)
                        setHoveredOrbitIndex(1)
                      }}
                      onMouseLeave={() => {
                        setHoveredHighlight(null)
                        setHoveredOrbitIndex(null)
                      }}
                      aria-label={`View highlight: ${item.title}`}
                      className="
                        group relative flex items-center justify-center rounded-full
                        overflow-hidden border border-white/25 bg-zinc-950/85 shadow-lg
                        transition-all duration-300 ease-out hover:scale-112 hover:border-white/85
                        hover:shadow-2xl hover:shadow-cyan-900/40 hover:z-50 focus:outline-none
                        focus-visible:ring-2 focus-visible:ring-white active:scale-95
                        w-full h-full
                      "
                      style={{ opacity: 0.9 }}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes={`${dims.orbits[1].nodeSize}px`}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </button>

                    {/* Small Hover Label with Connector */}
                    {hoveredHighlight?.id === item.id && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none z-50 whitespace-nowrap">
                        <div className="flex flex-col items-center">
                          <div className="rounded-full border border-white/20 bg-zinc-950/92 px-2.5 py-0.5 text-[11px] font-medium text-foreground backdrop-blur-md shadow-xl flex items-center gap-1.5">
                            <span className="font-semibold text-white">
                              {item.title}
                            </span>
                            {item.year && (
                              <span className="text-white/40">· {item.year}</span>
                            )}
                          </div>
                          <div className="w-[1px] h-1.5 bg-white/40" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 4. Inner Orbit (4 items, Clockwise) */}
        <div
          className="absolute left-1/2 top-1/2 pointer-events-none z-30 animate-orbit-cw-inner"
          style={{
            width: `${dims.orbits[0].radius * 2}px`,
            height: `${dims.orbits[0].radius * 2}px`,
            marginLeft: `-${dims.orbits[0].radius}px`,
            marginTop: `-${dims.orbits[0].radius}px`,
            animationPlayState: isInnerPaused ? 'paused' : 'running',
          }}
        >
          {innerItems.map((item, idx) => {
            const angle = 45 + (idx / innerItems.length) * 360
            const rad = (angle * Math.PI) / 180
            const x = dims.orbits[0].radius + dims.orbits[0].radius * Math.cos(rad)
            const y = dims.orbits[0].radius + dims.orbits[0].radius * Math.sin(rad)
            const seqIndex = idx

            return (
              <div
                key={item.id}
                className="absolute pointer-events-auto"
                style={{
                  width: `${dims.orbits[0].nodeSize}px`,
                  height: `${dims.orbits[0].nodeSize}px`,
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Counter-rotation to keep photograph upright */}
                <div
                  className="animate-counter-cw-inner w-full h-full"
                  style={{
                    animationPlayState: isInnerPaused ? 'paused' : 'running',
                  }}
                >
                  <div
                    className="relative w-full h-full transition-all duration-500 ease-out"
                    style={{
                      opacity: isInView || isReducedMotion ? 1 : 0.85,
                      transform: isInView || isReducedMotion ? 'scale(1)' : 'scale(0.85)',
                      transitionDelay: isReducedMotion ? '0s' : `${0.2 + seqIndex * 0.035}s`,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleOpenHighlight(item)}
                      onMouseEnter={() => {
                        setHoveredHighlight(item)
                        setHoveredOrbitIndex(0)
                      }}
                      onMouseLeave={() => {
                        setHoveredHighlight(null)
                        setHoveredOrbitIndex(null)
                      }}
                      aria-label={`View highlight: ${item.title}`}
                      className="
                        group relative flex items-center justify-center rounded-full
                        overflow-hidden border border-white/30 bg-zinc-950/90 shadow-xl
                        transition-all duration-300 ease-out hover:scale-110 hover:border-white/90
                        hover:shadow-2xl hover:shadow-cyan-900/50 hover:z-50 focus:outline-none
                        focus-visible:ring-2 focus-visible:ring-white active:scale-95
                        w-full h-full
                      "
                      style={{ opacity: 0.96 }}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes={`${dims.orbits[0].nodeSize}px`}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </button>

                    {/* Small Hover Label with Connector */}
                    {hoveredHighlight?.id === item.id && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none z-50 whitespace-nowrap">
                        <div className="flex flex-col items-center">
                          <div className="rounded-full border border-white/20 bg-zinc-950/92 px-2.5 py-0.5 text-[11px] font-medium text-foreground backdrop-blur-md shadow-xl flex items-center gap-1.5">
                            <span className="font-semibold text-white">
                              {item.title}
                            </span>
                            {item.year && (
                              <span className="text-white/40">· {item.year}</span>
                            )}
                          </div>
                          <div className="w-[1px] h-1.5 bg-white/40" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 5. Center Featured Image Anchor */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 transition-transform duration-700 ease-out"
          style={{
            transform: `translate(-50%, -50%) ${isInView || isReducedMotion ? 'scale(1)' : 'scale(0.85)'}`,
          }}
        >
          <div className="relative">
            <button
              type="button"
              onClick={() => handleOpenHighlight(centerItem)}
              onMouseEnter={() => setHoveredHighlight(centerItem)}
              onMouseLeave={() => setHoveredHighlight(null)}
              aria-label={`Featured highlight: ${centerItem.title}`}
              className="
                group relative flex items-center justify-center rounded-full
                overflow-hidden border-2 border-white/40 bg-zinc-950 shadow-2xl
                transition-all duration-300 ease-out hover:scale-108 hover:border-white
                hover:shadow-cyan-900/60 focus:outline-none focus-visible:ring-2
                focus-visible:ring-white active:scale-95
              "
              style={{
                width: `${dims.centerSize}px`,
                height: `${dims.centerSize}px`,
              }}
            >
              <Image
                src={centerItem.image}
                alt={centerItem.title}
                fill
                priority
                sizes={`${dims.centerSize}px`}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>

            {/* Small Hover Label with Connector for Center */}
            {hoveredHighlight?.id === centerItem.id && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none z-50 whitespace-nowrap">
                <div className="flex flex-col items-center">
                  <div className="rounded-full border border-white/20 bg-zinc-950/95 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-md shadow-xl flex items-center gap-1.5">
                    <span className="font-semibold text-white">
                      {centerItem.title}
                    </span>
                    {centerItem.year && (
                      <span className="text-white/40">· {centerItem.year}</span>
                    )}
                  </div>
                  <div className="w-[1px] h-2 bg-white/40" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global LinkedIn Certificates Action Link */}
      <motion.div
        variants={footerVariants}
        className="mt-10 sm:mt-14 flex justify-center px-6 relative z-10"
      >
        <a
          href={certificatesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3
            font-sans text-xs font-semibold uppercase tracking-widest text-foreground
            transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:-translate-y-0.5
          "
          aria-label="View all certifications on LinkedIn"
        >
          <span>View More Certificates</span>
          <FiArrowUpRight className="h-4 w-4" />
        </a>
      </motion.div>

      {/* Interactive Image-Only Detail Modal */}
      <HighlightModal
        highlight={selectedHighlight}
        onClose={handleCloseModal}
      />
    </motion.section>
  )
}
