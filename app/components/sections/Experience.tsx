'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion'
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
  const [viewportWidth, setViewportWidth] = useState<number>(1200)

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
      setViewportWidth(w)
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

  // Dynamic responsive dimensions adapting to image count and screen size
  const dims = useMemo(() => {
    const count = highlights.length
    if (screenSize === 'mobile') {
      // Dedicated Mobile Close-Up View:
      // Substantially tighter radius and closer camera distance create a dense,
      // clustered 3D composition with controlled photo overlap and zero empty space.
      const safeWidth = viewportWidth > 0 && viewportWidth < 640 ? viewportWidth : 390
      const radius = Math.min(185, Math.max(150, Math.round(safeWidth * 0.42)))
      const nodeSize = count > 35 ? 78 : count > 28 ? 82 : 88
      return {
        stageHeight: Math.min(460, Math.max(390, Math.round(safeWidth * 1.08))),
        radius,
        nodeSize,
        minScale: 0.48,
        maxScale: 1.28,
        minOpacity: 0.38,
        maxOpacity: 1.0,
        cameraDistance: 460,
        curveExponent: 1.05,
      }
    }
    if (screenSize === 'tablet') {
      const radius = 190
      const nodeSize = count > 35 ? 70 : count > 28 ? 76 : 82
      return {
        stageHeight: 560,
        radius,
        nodeSize,
        minScale: 0.45,
        maxScale: 1.25,
        minOpacity: 0.35,
        maxOpacity: 1.0,
        cameraDistance: 800,
        curveExponent: 1.15,
      }
    }
    // Desktop - Enhanced Prominence & Density
    const radius = 240
    const nodeSize = count > 35 ? 88 : count > 28 ? 94 : 100
    return {
      stageHeight: 660,
      radius,
      nodeSize,
      minScale: 0.50,
      maxScale: 1.35,
      minOpacity: 0.35,
      maxOpacity: 1.0,
      cameraDistance: 900,
      curveExponent: 1.1,
    }
  }, [screenSize, viewportWidth])

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

  // Calculate depth order of each point at resting orientation for progressive back-to-front assembly
  const depthRankMap = useMemo(() => {
    const tilt = -12 * (Math.PI / 180)
    const sinTilt = Math.sin(tilt)
    const cosTilt = Math.cos(tilt)

    const pointsWithDepth = sphericalPoints.map((pt, index) => {
      const Z = pt.y * sinTilt + pt.z * cosTilt
      return { index, Z }
    })

    // Sort ascending by Z depth (back nodes first, front nodes last)
    pointsWithDepth.sort((a, b) => a.Z - b.Z)

    const rankMap = new Map<number, number>()
    pointsWithDepth.forEach((item, rank) => {
      rankMap.set(item.index, rank)
    })

    return rankMap
  }, [sphericalPoints])

  // Start continuous 3D rotation only after entrance sequence settles
  const assemblyTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleViewportEnter = useCallback(() => {
    setIsInView(true)
    setIsAssembled(false)

    if (assemblyTimerRef.current) {
      clearTimeout(assemblyTimerRef.current)
    }

    if (isReducedMotion) {
      setIsAssembled(true)
      return
    }

    // Assemble nodes progressively, then begin deliberate rotation at tuned 18s pace
    assemblyTimerRef.current = setTimeout(() => {
      setIsAssembled(true)
    }, 1000)
  }, [isReducedMotion])

  const handleViewportLeave = useCallback(() => {
    setIsInView(false)
    setIsAssembled(false)

    if (assemblyTimerRef.current) {
      clearTimeout(assemblyTimerRef.current)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (assemblyTimerRef.current) {
        clearTimeout(assemblyTimerRef.current)
      }
    }
  }, [])

  // Real-time 3D coordinate projection & dynamic depth shading
  const updatePositions = useCallback(
    (alpha: number) => {
      const D = dims.cameraDistance // Responsive perspective camera distance
      const tilt = -12 * (Math.PI / 180) // -12 degree pitch tilt around X axis
      const cosTilt = Math.cos(tilt)
      const sinTilt = Math.sin(tilt)
      const cosAlpha = Math.cos(alpha)
      const sinAlpha = Math.sin(alpha)
      const R = dims.radius
      const { minScale, maxScale, minOpacity, maxOpacity, curveExponent } = dims

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
        const normZ = Math.max(0, Math.min(1, (Z + 1) / 2))

        // 4. Responsive depth curve
        const depthCurve = Math.pow(normZ, curveExponent)

        // 5. Perspective projection factor
        const persp = D / (D - Z * R)
        const screenX = X * R * persp
        const screenY = Y * R * persp

        // 6. Dynamic scale, opacity, and z-index derived continuously from 3D depth
        const isHovered = hoveredIdRef.current === highlights[i].id
        const depthScale = minScale + depthCurve * (maxScale - minScale)
        const depthOpacity = minOpacity + depthCurve * (maxOpacity - minOpacity)
        const depthZIndex = 10 + Math.round(normZ * 800)

        const finalOpacity = isHovered ? 1 : depthOpacity
        const finalZIndex = isHovered ? 1000 : depthZIndex

        el.style.transform = `translate3d(${screenX.toFixed(2)}px, ${screenY.toFixed(2)}px, 0) scale(${depthScale.toFixed(3)})`
        el.style.opacity = finalOpacity.toFixed(3)
        el.style.zIndex = String(finalZIndex)
      }
    },
    [sphericalPoints, dims]
  )

  // Synchronize positions whenever responsive dimensions or points change
  useEffect(() => {
    updatePositions(angleRef.current)
  }, [updatePositions])

  // Continuous 3D rotation loop tuned to 18 seconds per revolution
  useEffect(() => {
    if (isReducedMotion) {
      updatePositions(0)
      return
    }

    let animationFrameId: number
    const rotationDuration = 18 // 18 seconds per complete revolution
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

  // Mouse hover handlers ensuring immediate tactile feedback without waiting for next animation frame
  const handleMouseEnter = useCallback(
    (item: Highlight) => {
      setHoveredHighlight(item)
      hoveredIdRef.current = item.id
      updatePositions(angleRef.current)
    },
    [updatePositions]
  )

  const handleMouseLeave = useCallback(() => {
    setHoveredHighlight(null)
    hoveredIdRef.current = null
    updatePositions(angleRef.current)
  }, [updatePositions])

  // Framer Motion entrance variants matching the portfolio motion language
  const headingVariants: Variants = {
    hidden: {
      opacity: 0,
      y: isReducedMotion ? 0 : 32,
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
        delay: isReducedMotion ? 0 : 0.16,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const globeContainerVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: isReducedMotion ? 1 : 0.86,
      filter: isReducedMotion ? 'none' : 'blur(8px)',
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: isReducedMotion ? 0 : 0.7,
        delay: isReducedMotion ? 0 : 0.22,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const equatorRingVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: isReducedMotion ? 1 : 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: isReducedMotion ? 0 : 0.6,
        delay: isReducedMotion ? 0 : 0.28,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const ambientGlowVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: isReducedMotion ? 1 : 0.7,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: isReducedMotion ? 0 : 0.8,
        delay: isReducedMotion ? 0 : 0.28,
        ease: 'easeOut',
      },
    },
  }

  const nodeAssemblyVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: isReducedMotion ? 1 : 0.7,
    },
    visible: (rank: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: isReducedMotion ? 0 : 0.42,
        delay: isReducedMotion ? 0 : 0.32 + rank * 0.016,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
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
        delay: isReducedMotion ? 0 : 1.0,
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
      viewport={{ once: false, amount: 0.15 }}
      onViewportEnter={handleViewportEnter}
      onViewportLeave={handleViewportLeave}
      className="w-full py-20 sm:py-28 relative overflow-hidden"
    >
      {/* Anchor alias so both #highlights and #experience navigate cleanly */}
      <div id="highlights" className="sr-only" aria-hidden="true" tabIndex={-1} />

      {/* Ambient background lighting */}
      <GradientBackground
        sectionId="experience"
        gradientColors={{
          start: '#1E3A8A',
          end: '#0F766E',
        }}
      />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 min-[360px]:px-6 sm:px-10 md:px-12 text-center relative z-10 mb-8 sm:mb-12 md:mb-14">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="overflow-hidden py-1">
            <motion.h2
              variants={headingVariants}
              className="font-display text-4xl min-[360px]:text-5xl sm:text-7xl md:text-8xl tracking-wider uppercase font-bold text-foreground leading-none text-center"
            >
              HIGHLIGHTS
            </motion.h2>
          </div>

          <motion.p
            variants={subtitleVariants}
            className="font-sans text-xs min-[360px]:text-sm sm:text-base text-foreground/60 mt-3 max-w-xl mx-auto tracking-wide text-center px-2"
          >
            Moments, milestones, and experiences along the way.
          </motion.p>
        </div>
      </div>

      {/* HIGHLIGHTS 3D Globe Visual Wrapper with localized horizontal overflow clipping */}
      <div className="relative w-full overflow-hidden flex items-center justify-center">
        {/* 3D Sphere Canvas Container */}
        <motion.div
          variants={globeContainerVariants}
          className="relative mx-auto w-full max-w-5xl flex items-center justify-center select-none"
          style={{
            height: `${dims.stageHeight}px`,
            perspective: '1000px',
          }}
        >
        {/* Subtle Central Ambient Glow */}
        <motion.div
          variants={ambientGlowVariants}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/[0.06] blur-3xl z-0"
          style={{
            width: `${dims.radius * 1.8}px`,
            height: `${dims.radius * 1.8}px`,
          }}
        />

        {/* Faint Equator Guide Ring */}
        <motion.div
          variants={equatorRingVariants}
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
          const normZ = Math.max(0, Math.min(1, (Z + 1) / 2))
          const depthCurve = Math.pow(normZ, dims.curveExponent)
          const D = dims.cameraDistance
          const persp = D / (D - Z * dims.radius)
          const initX = X * dims.radius * persp
          const initY = Y * dims.radius * persp
          const initScale = dims.minScale + depthCurve * (dims.maxScale - dims.minScale)
          const initOpacity = dims.minOpacity + depthCurve * (dims.maxOpacity - dims.minOpacity)
          const initZIndex = 10 + Math.round(normZ * 800)

          const isHovered = hoveredHighlight?.id === item.id
          const rank = depthRankMap.get(idx) ?? 0

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
                zIndex: isHovered ? 1000 : initZIndex,
                transformStyle: 'preserve-3d',
                transition: 'opacity 0.28s ease',
              }}
            >
              {/* Progressive Depth Assembly Reveal Wrapper (Layer 2) */}
              <motion.div
                variants={nodeAssemblyVariants}
                custom={rank}
                className="w-full h-full"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Interactive Photo Node Button (Layer 3 - Hover pop) */}
                <button
                  type="button"
                  onClick={() => handleOpenHighlight(item)}
                  onMouseEnter={() => handleMouseEnter(item)}
                  onMouseLeave={handleMouseLeave}
                  onFocus={() => handleMouseEnter(item)}
                  onBlur={handleMouseLeave}
                  aria-label={`View highlight: ${item.name}`}
                  className="
                    group relative flex items-center justify-center rounded-full
                    overflow-hidden border bg-zinc-950
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95
                    w-full h-full cursor-pointer
                  "
                  style={{
                    transform: isHovered
                      ? 'translateZ(24px) scale(1.14)'
                      : 'translateZ(0px) scale(1)',
                    borderColor: isHovered
                      ? 'rgba(255, 255, 255, 0.75)'
                      : 'rgba(255, 255, 255, 0.22)',
                    boxShadow: isHovered
                      ? '0 20px 35px -5px rgba(0, 0, 0, 0.85), 0 0 15px 1px rgba(255, 255, 255, 0.08)'
                      : '0 4px 18px -2px rgba(0, 0, 0, 0.6)',
                    transition:
                      'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.28s ease, box-shadow 0.28s ease',
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes={`${dims.nodeSize}px`}
                    className="object-cover pointer-events-none select-none"
                  />
                </button>
              </motion.div>

              {/* Minimal Hover Label with Connector */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 3, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none z-[400] whitespace-nowrap"
                  >
                    <div className="flex flex-col items-center">
                      <div className="rounded-full border border-white/20 bg-zinc-950/95 px-2.5 py-0.5 text-[11px] font-medium text-foreground backdrop-blur-md shadow-xl max-w-[85vw] truncate">
                        <span className="font-semibold text-white">
                          {item.name}
                        </span>
                      </div>
                      <div className="w-[1px] h-1.5 bg-white/40" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
        </motion.div>
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
          <span>Also View My Certificates</span>
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
