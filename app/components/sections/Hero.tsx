'use client'

import Image from "next/image"
import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import FloatingElements from "../common/FloatingElements"

const nameWords = [
  { word: "SIJOMON", chars: ["S", "I", "J", "O", "M", "O", "N"] },
  { word: "P", chars: ["P"] },
  { word: "S", chars: ["S"] },
]

export default function Hero() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
  const assetPath = (path: string) => `${basePath}${path}`
  const resumeUrl = "/Resume.pdf"

  const prefersReduced = useReducedMotion()
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)
    const handleMotionChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleMotionChange)
    return () => mediaQuery.removeEventListener('change', handleMotionChange)
  }, [])

  const shouldReduceMotion = prefersReduced || isReducedMotion

  // Calculate cumulative character index for sequential stagger across words
  let globalCharCounter = 0

  return (
    <section
      id="home"
      className="relative w-full min-h-screen overflow-hidden flex flex-col justify-between px-4 pt-16 pb-4 sm:px-12 sm:pt-24 sm:pb-8 bg-background"
    >
      {/* Restored Static Hero Background Image & Luxury Vignette Overlays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <Image
          src={assetPath('/hero/hero-poster.webp')}
          alt=""
          aria-hidden="true"
          fill
          className="object-cover object-[50%_35%] pointer-events-none"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/70 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.65)_100%)]" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      {!shouldReduceMotion && <FloatingElements />}

      {/* Center Editorial Title Block (Visual Focus of the Hero) */}
      <div className="relative z-10 mx-auto my-auto flex flex-col items-center justify-center text-center space-y-2 sm:space-y-4 px-2 sm:px-4">
        <div className="flex flex-col items-center text-center" style={{ perspective: 1000 }}>
          {/* 1. Location Line */}
          {shouldReduceMotion ? (
            <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.3em] text-foreground/50 font-semibold mb-1 sm:mb-2">
              Thiruvalla, Kerala, India
            </p>
          ) : (
            <motion.p
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.3em] text-foreground/50 font-semibold mb-1 sm:mb-2"
            >
              Thiruvalla, Kerala, India
            </motion.p>
          )}

          {/* 2. Main Name with Multi-layer Pop & Settle */}
          <h1
            aria-label="SIJOMON P S"
            className="font-display text-5xl xs:text-6xl sm:text-8xl md:text-9xl lg:text-[7rem] tracking-wider uppercase font-bold text-foreground leading-none drop-shadow-2xl"
          >
            <span className="sr-only">SIJOMON P S</span>
            {shouldReduceMotion ? (
              <span>SIJOMON P S</span>
            ) : (
              <span aria-hidden="true" className="inline-flex flex-wrap justify-center gap-x-[0.25em]">
                {nameWords.map((wordObj, wordIndex) => (
                  <span key={wordIndex} className="inline-flex">
                    {wordObj.chars.map((char) => {
                      const charIndex = globalCharCounter++
                      // 0.15s start + 0.035s per letter + slight pause between words
                      const charDelay = 0.15 + charIndex * 0.035 + (wordIndex > 0 ? 0.03 * wordIndex : 0)

                      return (
                        <motion.span
                          key={charIndex}
                          initial={{
                            opacity: 0,
                            y: 28,
                            scale: 0.9,
                            rotateX: 12,
                            filter: "blur(8px)",
                          }}
                          animate={{
                            opacity: [0, 1, 1],
                            y: [28, -2, 0],
                            scale: [0.9, 1.03, 1],
                            rotateX: [12, 0, 0],
                            filter: ["blur(8px)", "blur(0px)", "blur(0px)"],
                          }}
                          transition={{
                            duration: 0.55,
                            delay: charDelay,
                            times: [0, 0.7, 1],
                            ease: ["easeOut", "easeInOut"],
                          }}
                          className="inline-block transform-gpu"
                        >
                          {char}
                        </motion.span>
                      )
                    })}
                  </span>
                ))}
              </span>
            )}
          </h1>

          {/* 3. Role / Title Line */}
          {shouldReduceMotion ? (
            <p className="font-sans text-[10px] xs:text-xs sm:text-sm uppercase tracking-[0.18em] sm:tracking-[0.25em] text-foreground/80 font-medium mt-1 sm:mt-3">
              Full-Stack Developer | Freelancer | Web • Cloud • DevOps
            </p>
          ) : (
            <motion.p
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
              className="font-sans text-[10px] xs:text-xs sm:text-sm uppercase tracking-[0.18em] sm:tracking-[0.25em] text-foreground/80 font-medium mt-1 sm:mt-3"
            >
              Full-Stack Developer | Freelancer | Web • Cloud • DevOps
            </motion.p>
          )}
        </div>
      </div>

      {/* 4. Bottom Editorial Content Bar (Anchored at the Bottom with Safe Area) */}
      <div className="relative z-10 w-full max-w-4xl mx-auto pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {shouldReduceMotion ? (
          <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-transparent p-3.5 sm:p-6 shadow-2xl space-y-3 sm:space-y-4">
            <p className="text-center mx-auto font-sans text-xs sm:text-sm md:text-base leading-relaxed text-foreground/85 font-normal max-w-3xl">
              Building modern web applications for freelance clients—from code to cloud.
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
              {/* Social & Action Links */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
                <a
                  className="
                    font-sans text-[11px] sm:text-xs tracking-wider uppercase font-medium
                    rounded-full border border-white/20 bg-white/10
                    transition-all flex items-center justify-center
                    hover:bg-white/20 text-foreground
                    h-8 sm:h-9 px-3 sm:px-4
                  "
                  href="https://github.com/sijomonps"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    className="invert dark:invert-0 mr-1.5 sm:mr-2"
                    src={assetPath("/github.svg")}
                    alt="GitHub"
                    width={14}
                    height={14}
                  />
                  GitHub
                </a>

                <a
                  className="
                    font-sans text-[11px] sm:text-xs tracking-wider uppercase font-medium
                    rounded-full border border-white/20 bg-white/10
                    transition-all flex items-center justify-center
                    hover:bg-white/20 text-foreground
                    h-8 sm:h-9 px-3 sm:px-4
                  "
                  href="https://www.linkedin.com/in/sijomonps/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    className="dark:invert mr-1.5 sm:mr-2"
                    src={assetPath("/linkedin.svg")}
                    alt="LinkedIn"
                    width={14}
                    height={14}
                  />
                  LinkedIn
                </a>

                <a
                  className="
                    font-sans text-[11px] sm:text-xs tracking-wider uppercase font-medium
                    rounded-full border border-white/20 bg-white/10
                    transition-all flex items-center justify-center
                    hover:bg-white/20 text-foreground
                    h-8 sm:h-9 px-3 sm:px-4
                  "
                  href="mailto:sijomon700@gmail.com"
                >
                  <Image
                    className="dark:invert mr-1.5 sm:mr-2"
                    src={assetPath("/mail.svg")}
                    alt="Email"
                    width={14}
                    height={14}
                  />
                  Email
                </a>

                <a
                  className="
                    font-sans text-[11px] sm:text-xs tracking-wider uppercase font-medium
                    rounded-full border border-white/20 bg-white/10
                    transition-all flex items-center justify-center
                    hover:bg-white/20 text-foreground
                    h-8 sm:h-9 px-3 sm:px-4
                  "
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    className="dark:invert mr-1.5 sm:mr-2"
                    src={assetPath("/resume.svg")}
                    alt="Resume"
                    width={14}
                    height={14}
                  />
                  Resume
                </a>
              </div>

              {/* Secondary Meta Information */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-[10px] sm:text-xs font-sans text-foreground/60">
                <a className="hover:text-foreground transition-colors" href="tel:+916235719647">
                  +91 62357 19647
                </a>
                <a className="hover:text-foreground transition-colors" href="mailto:sijomon700@gmail.com">
                  sijomon700@gmail.com
                </a>
                <span>Lets Connect</span>
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl sm:rounded-2xl border border-white/10 bg-transparent p-3.5 sm:p-6 shadow-2xl space-y-3 sm:space-y-4"
          >
            <motion.p
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.45, delay: 0.78, ease: [0.22, 1, 0.36, 1] }}
              className="text-center mx-auto font-sans text-xs sm:text-sm md:text-base leading-relaxed text-foreground/85 font-normal max-w-3xl"
            >
              Building modern web applications for freelance clients—from code to cloud.
            </motion.p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
              {/* Social & Action Links */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
                <a
                  className="
                    font-sans text-[11px] sm:text-xs tracking-wider uppercase font-medium
                    rounded-full border border-white/20 bg-white/10
                    transition-all flex items-center justify-center
                    hover:bg-white/20 text-foreground
                    h-8 sm:h-9 px-3 sm:px-4
                  "
                  href="https://github.com/sijomonps"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    className="invert dark:invert-0 mr-1.5 sm:mr-2"
                    src={assetPath("/github.svg")}
                    alt="GitHub"
                    width={14}
                    height={14}
                  />
                  GitHub
                </a>

                <a
                  className="
                    font-sans text-[11px] sm:text-xs tracking-wider uppercase font-medium
                    rounded-full border border-white/20 bg-white/10
                    transition-all flex items-center justify-center
                    hover:bg-white/20 text-foreground
                    h-8 sm:h-9 px-3 sm:px-4
                  "
                  href="https://www.linkedin.com/in/sijomonps/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    className="dark:invert mr-1.5 sm:mr-2"
                    src={assetPath("/linkedin.svg")}
                    alt="LinkedIn"
                    width={14}
                    height={14}
                  />
                  LinkedIn
                </a>

                <a
                  className="
                    font-sans text-[11px] sm:text-xs tracking-wider uppercase font-medium
                    rounded-full border border-white/20 bg-white/10
                    transition-all flex items-center justify-center
                    hover:bg-white/20 text-foreground
                    h-8 sm:h-9 px-3 sm:px-4
                  "
                  href="mailto:sijomon700@gmail.com"
                >
                  <Image
                    className="dark:invert mr-1.5 sm:mr-2"
                    src={assetPath("/mail.svg")}
                    alt="Email"
                    width={14}
                    height={14}
                  />
                  Email
                </a>

                <a
                  className="
                    font-sans text-[11px] sm:text-xs tracking-wider uppercase font-medium
                    rounded-full border border-white/20 bg-white/10
                    transition-all flex items-center justify-center
                    hover:bg-white/20 text-foreground
                    h-8 sm:h-9 px-3 sm:px-4
                  "
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    className="dark:invert mr-1.5 sm:mr-2"
                    src={assetPath("/resume.svg")}
                    alt="Resume"
                    width={14}
                    height={14}
                  />
                  Resume
                </a>
              </div>

              {/* Secondary Meta Information */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-[10px] sm:text-xs font-sans text-foreground/60">
                <a className="hover:text-foreground transition-colors" href="tel:+916235719647">
                  +91 62357 19647
                </a>
                <a className="hover:text-foreground transition-colors" href="mailto:sijomon700@gmail.com">
                  sijomon700@gmail.com
                </a>
                <span>Lets Connect</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}