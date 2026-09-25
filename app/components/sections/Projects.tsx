'use client'

import Image from 'next/image'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'
import { projects } from '../../data/project'

export default function Projects() {
  const shouldReduceMotion = useReducedMotion()
  const isReducedMotion = !!shouldReduceMotion

  // Variants for the overall WORKS section container (replays every time section enters viewport)
  const headerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: isReducedMotion ? 0 : 0.14,
      },
    },
  }

  // Masked editorial heading reveal with subtle pop-and-settle
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

  // Subtitle blur-to-sharp entrance following the heading
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

  // Horizontal rail coordinator: staggered vertical entrance for cards (strictly zero translateX)
  const railVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: isReducedMotion ? 0 : 0.075,
        delayChildren: isReducedMotion ? 0 : 0.28,
      },
    },
  }

  // Individual card vertical entrance
  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: isReducedMotion ? 0 : 35,
      scale: isReducedMotion ? 1 : 0.96,
      filter: isReducedMotion ? 'none' : 'blur(4px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: isReducedMotion ? 0 : 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  // Image internal settling reveal
  const imageVariants: Variants = {
    hidden: {
      scale: isReducedMotion ? 1 : 1.06,
      opacity: isReducedMotion ? 1 : 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: isReducedMotion ? 0 : 0.65,
        ease: 'easeOut',
      },
    },
  }

  // Card textual content progressive entrance
  const cardContentVariants: Variants = {
    hidden: {
      opacity: isReducedMotion ? 1 : 0,
      y: isReducedMotion ? 0 : 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isReducedMotion ? 0 : 0.45,
        delay: isReducedMotion ? 0 : 0.1,
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
        delay: isReducedMotion ? 0 : 0.45,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <motion.section
      id="works"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      className="w-full py-20 sm:py-28 relative overflow-hidden"
    >
      {/* Centered Section Header */}
      <motion.div
        variants={headerVariants}
        className="max-w-7xl mx-auto px-6 sm:px-10 md:px-12 text-center"
      >
        <div className="flex flex-col items-center justify-center text-center">
          {/* Masked Editorial Heading */}
          <div className="overflow-hidden py-1">
            <motion.h2
              variants={headingVariants}
              className="font-display text-5xl sm:text-7xl md:text-8xl tracking-wider uppercase font-bold text-foreground leading-none"
            >
              WORKS
            </motion.h2>
          </div>

          <motion.p
            variants={subtitleVariants}
            className="font-sans text-sm sm:text-base text-foreground/60 mt-3 max-w-xl mx-auto tracking-wide text-center"
          >
            Selected projects, experiments, and products I&apos;ve built.
          </motion.p>
        </div>
      </motion.div>

      {/* Horizontal Project Rail Container (Single Row, Native Horizontal Scroll, No Horizontal Animation) */}
      <div className="mt-10 sm:mt-14 w-full">
        <motion.div
          variants={railVariants}
          tabIndex={0}
          aria-label="Horizontal list of projects"
          className="
            works-scrollbar-hidden
            w-full overflow-x-auto overflow-y-hidden
            flex flex-nowrap gap-5 sm:gap-7
            px-6 sm:px-10 md:px-12 pb-6 pt-2
            focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30
          "
        >
          {projects.map((project) => (
            <motion.article
              key={project.id}
              variants={cardVariants}
              className="
                group relative flex flex-col h-full shrink-0
                w-[84vw] max-w-[340px] sm:w-[390px] sm:max-w-none md:w-[420px] lg:w-[450px]
                rounded-2xl overflow-hidden
                border border-white/10 bg-zinc-900/40 backdrop-blur-sm
                transition-all duration-300 ease-out
                hover:-translate-y-1.5 hover:border-white/20 hover:bg-zinc-900/70
                hover:shadow-2xl hover:shadow-black/70
              "
            >
              {/* Dominant Image Area (~65-70% visual area, 16:10 aspect ratio) */}
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View live website for ${project.title}`}
                className="relative block w-full aspect-[16/10] overflow-hidden border-b border-white/10 bg-zinc-950 group/img focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <motion.div variants={imageVariants} className="relative w-full h-full">
                  <Image
                    src={project.image}
                    alt={`${project.title} project preview`}
                    fill
                    sizes="(max-width: 640px) 340px, (max-width: 1024px) 420px, 450px"
                    className="object-cover transition-transform duration-500 ease-out group-hover/img:scale-[1.03]"
                  />
                </motion.div>
              </a>

              {/* Textual Content Area (~30-35% of card) */}
              <motion.div
                variants={cardContentVariants}
                className="p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold tracking-widest text-foreground/50">
                      {project.number} · {project.category}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl tracking-wide uppercase font-bold text-foreground leading-none">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-white focus:outline-none focus-visible:underline"
                    >
                      {project.title}
                    </a>
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-foreground/75 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>

                <div className="pt-3 space-y-3.5 border-t border-white/5">
                  <p className="font-sans text-xs text-foreground/50 tracking-wide font-medium">
                    {project.technologies.join(' · ')}
                  </p>

                  <div className="flex items-center gap-4">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-foreground hover:text-white transition-colors group/link"
                      aria-label={`View live website for ${project.title}`}
                    >
                      <span>VIEW PROJECT</span>
                      <FiArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </a>

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold tracking-wider uppercase text-foreground/50 hover:text-foreground transition-colors"
                        aria-label={`View GitHub repository for ${project.title}`}
                      >
                        <span>GITHUB</span>
                        <FiArrowUpRight className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {/* Global GitHub Repositories Link */}
      <motion.div
        variants={footerVariants}
        className="mt-8 sm:mt-12 flex justify-center px-6"
      >
        <a
          href="https://github.com/sijomonps?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3
            font-sans text-xs font-semibold uppercase tracking-widest text-foreground
            transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:-translate-y-0.5
          "
          aria-label="View all projects on GitHub"
        >
          <span>View All Repositories (40+)</span>
          <FiArrowUpRight className="h-4 w-4" />
        </a>
      </motion.div>
    </motion.section>
  )
}