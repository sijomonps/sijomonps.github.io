'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
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

  // Assembly & entrance animation state
  const [isInView, setIsInView] = useState(false)
  const [isAssembled, setIsAssembled] = useState(false)

  // Responsive layout state
  const [screenSize, setScreenSize] = useState<ScreenSize>('desktop')

  // Animation frame refs
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([])
  const angleRef = useRef(0)
  const lastTimeRef = useRef(0)
  const hoveredIdRef = useRef<string | null>(null)

  useEffect(() => {
    hoveredIdRef.current = hoveredHighlight?.id || null
  }, [hoveredHighlight])

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

  // Start continuous 3D rotation only after entrance sequence settles
  useEffect(() => {
    if (!isInView || isReducedMotion) {
      return
    }

    const timer = setTimeout(() => {
      setIsAssembled(true)
    }, 1200)

    return () => clearTimeout(timer)
  }, [isInView, isReducedMotion])

  const handleViewportEnter = useCallback(() => {
    setIsInView(true)
  }, [])

  const handleViewportLeave = useCallback(() => {
    setIsInView(false)
    setIsAssembled(false)
  }, [])

  // Dynamic responsive dimensions adapting to image count and screen size
  const dims = useMemo(() => {
    const count = highlights.length
    if (screenSize === 'mobile') {
      const radius = 120
      const nodeSize = count > 28 ? 44 : 50
      return {
        stageHeight: 380,
        radius,
        nodeSize,
      }
    }
    if (screenSize === 'tablet') {
      const radius = 175
      const nodeSize = count > 28 ? 58 : 66
      return {
        stageHeight: 520,
        radius,
        nodeSize,
      }
    }
    // Desktop
    const radius = 230
    const nodeSize = count > 28 ? 72 : 82
    return {
      stageHeight: 640,
      radius,
      nodeSize,
    }
  }, [screenSize])

  // Algorithmic Fibonacci-Sphere Distribution across the 3D spherical surface
  const sphericalPoints = useMemo(() => {
    const count = highlights.length
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)) // ~2.39996 rad

    return highlights.map((_, i) => {
      // y from +1 (top pole) to -1 (bottom pole)
      const y = 1 - (2 * i + 1) / count
      const r = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = i * goldenAngle
      const x = Math.cos(theta) * r
      const z = Math.sin(theta) * r
      return { x, y, z }
    })
  }, [])

  // Real-time 3D coordinate projection & depth shading
  const updatePositions = useCallback(
    (alpha: number) => {
      const D = 900 // Perspective camera distance
      const tilt = -12 * (Math.PI / 180) // -12 degree pitch tilt around X axis
      const cosTilt = Math.cos(tilt)
      const sinTilt = Math.sin(tilt)
      const cosAlpha = Math.cos(alpha)
      const sinAlpha = Math.sin(alpha)
      const R = dims.radius

      for (let i = 0; i < sphericalPoints.length; i++) {
        const el = nodeRefs.current[i]
        if (!el) continue

        const pt = sphericalPoints[i]
        // 1. Primary continuous rotation around Y axis
        const x1 = pt.x * cosAlpha - pt.z * sinAlpha
        const y1 = pt.y
        const z1 = pt.x * sinAlpha + pt.z * cosAlpha

        // 2. Subtle pitch tilt around X axis
        const X = x1
        const Y = y1 * cosTilt - z1 * sinTilt
        const Z = y1 * sinTilt + z1 * cosTilt

        // 3. Normalized depth (Z in [-1, 1] -> normZ in [0, 1])
        const normZ = (Z + 1) / 2

        // 4. Perspective projection factor
        const persp = D / (D - Z * R)
        const screenX = X * R * persp
        const screenY = Y * R * persp

        // 5. Dynamic scale, opacity, and z-index derived from instantaneous 3D depth
        const isHovered = hoveredIdRef.current === highlights[i].id
        const scale = (0.65 + 0.45 * normZ) * (isHovered ? 1.15 : 1)
        const opacity = isHovered ? 1 : 0.38 + 0.62 * normZ
        const zIndex = isHovered ? 350 : 10 + Math.round(normZ * 90)

        el.style.transform = `translate3d(${screenX.toFixed(2)}px, ${screenY.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`
        el.style.opacity = `${opacity.toFixed(3)}`
        el.style.zIndex = `${zIndex}`
      }
    },
    [sphericalPoints, dims.radius]
  )

  // Continuous 3D rotation loop
  useEffect(() => {
    if (isReducedMotion) {
      updatePositions(0)
      return
    }

    let animationFrameId: number
    const rotationDuration = 42 // 42 seconds per complete revolution
    const rotationSpeed = (Math.PI * 2) / rotationDuration

    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time
      const delta = Math.min((time - lastTimeRef.current) / 1000, 0.1)
      lastTimeRef.current = time

      const isPaused = Boolean(hoveredIdRef.current) || Boolean(selectedHighlight)

      if (isInView && isAssembled && !isPaused) {
        angleRef.current = (angleRef.current + delta * rotationSpeed) % (Math.PI * 2)
        updatePositions(angleRef.current)
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(animationFrameId)
      lastTimeRef.current = 0
    }
  }, [isInView, isAssembled, selectedHighlight, isReducedMotion, updatePositions])

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

      {/* 3D Sphere Canvas Container */}
      <div
        className="relative mx-auto w-full max-w-5xl flex items-center justify-center select-none"
        style={{
          height: `${dims.stageHeight}px`,
          perspective: '1000px',
        }}
      >
        {/* Subtle Central Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/[0.06] blur-3xl z-0"
          style={{
            width: `${dims.radius * 1.8}px`,
            height: `${dims.radius * 1.8}px`,
          }}
        />

        {/* Faint Equator Guide Ring */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035] z-0"
          style={{
            width: `${dims.radius * 2}px`,
            height: `${dims.radius * 2}px`,
          }}
        />

        {/* 3D Spherical Photo Cloud */}
        {highlights.map((item, idx) => {
          const pt = sphericalPoints[idx]
          const tilt = -12 * (Math.PI / 180)
          const cosTilt = Math.cos(tilt)
          const sinTilt = Math.sin(tilt)
          const X = pt.x
          const Y = pt.y * cosTilt - pt.z * sinTilt
          const Z = pt.y * sinTilt + pt.z * cosTilt
          const normZ = (Z + 1) / 2
          const D = 900
          const persp = D / (D - Z * dims.radius)
          const initX = X * dims.radius * persp
          const initY = Y * dims.radius * persp
          const initScale = 0.65 + 0.45 * normZ
          const initOpacity = 0.38 + 0.62 * normZ
          const initZIndex = 10 + Math.round(normZ * 90)

          return (
            <div
              key={item.id}
              ref={(el) => {
                nodeRefs.current[idx] = el
              }}
              className="absolute left-1/2 top-1/2 pointer-events-auto will-change-transform"
              style={{
                width: `${dims.nodeSize}px`,
                height: `${dims.nodeSize}px`,
                marginLeft: `-${dims.nodeSize / 2}px`,
                marginTop: `-${dims.nodeSize / 2}px`,
                transform: `translate3d(${initX.toFixed(2)}px, ${initY.toFixed(2)}px, 0) scale(${initScale.toFixed(3)})`,
                opacity: initOpacity.toFixed(3),
                zIndex: initZIndex,
              }}
            >
              <button
                type="button"
                onClick={() => handleOpenHighlight(item)}
                onMouseEnter={() => setHoveredHighlight(item)}
                onMouseLeave={() => setHoveredHighlight(null)}
                aria-label={`View highlight: ${item.title}`}
                className="
                  group relative flex items-center justify-center rounded-full
                  overflow-hidden border border-white/25 bg-zinc-950 shadow-md
                  transition-[box-shadow,border-color] duration-200 ease-out
                  hover:border-white/80 hover:shadow-2xl hover:shadow-cyan-900/40
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95
                  w-full h-full
                "
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes={`${dims.nodeSize}px`}
                  className="object-cover pointer-events-none"
                />
              </button>

              {/* Minimal Hover Label with Connector */}
              {hoveredHighlight?.id === item.id && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none z-[400] whitespace-nowrap">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full border border-white/20 bg-zinc-950/95 px-2.5 py-0.5 text-[11px] font-medium text-foreground backdrop-blur-md shadow-xl">
                      <span className="font-semibold text-white">
                        {item.title}
                      </span>
                    </div>
                    <div className="w-[1px] h-1.5 bg-white/40" />
                  </div>
                </div>
              )}
            </div>
          )
        })}
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
