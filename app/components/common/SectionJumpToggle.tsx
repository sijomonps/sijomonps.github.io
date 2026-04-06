'use client'

import { useEffect, useRef, useState } from 'react'
import { FiChevronDown, FiChevronUp, FiMoreHorizontal } from 'react-icons/fi'

type SectionItem = {
  id: string
  name: string
}

const sections: SectionItem[] = [
  { id: 'home', name: 'Home' },
  { id: 'about', name: 'About' },
  { id: 'skills', name: 'Skills' },
  { id: 'education', name: 'Education' },
  { id: 'experience', name: 'Highlights' },
  { id: 'projects', name: 'Projects' },
  { id: 'contact', name: 'Contact' },
]



export default function SectionJumpToggle() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAtBottom, setIsAtBottom] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const NAVBAR_OFFSET = 68
  const nextIndex = (currentIndex + 1) % sections.length
  const nextSection = isAtBottom ? sections[0] : sections[nextIndex]
  const isWrappingToTop = isAtBottom || nextSection.id === 'home'


  useEffect(() => {
    let isTicking = false

    const updateCurrentSection = () => {
      const reachedBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
      setIsAtBottom(reachedBottom)

      const probePosition = window.scrollY + window.innerHeight * 0.35
      let activeIndex = 0

      sections.forEach((section, index) => {
        const element = document.getElementById(section.id)
        if (!element) {
          return
        }

        const sectionTop = element.offsetTop - NAVBAR_OFFSET
        if (probePosition >= sectionTop) {
          activeIndex = index
        }
      })

      setCurrentIndex(activeIndex)
    }

    const handleScroll = () => {
      if (isTicking) {
        return
      }
      isTicking = true
      window.requestAnimationFrame(() => {
        updateCurrentSection()
        isTicking = false
      })
    }

    updateCurrentSection()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])



  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId)
    if (!target) {
      return
    }
    const targetTop = target.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET
    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: 'smooth',
    })
  }

  const goToNextSection = () => {
    scrollToSection(nextSection.id)
  }

  const jumpToSection = (sectionId: string) => {
    setIsMenuOpen(false)
    scrollToSection(sectionId)
  }

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleEscape)
  }, [isMenuOpen])



  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4"
      style={{ bottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="pointer-events-auto flex items-center gap-2">
        <div ref={menuRef} className="relative sm:hidden">
          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            aria-label="Open section navigation"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            className="
              inline-flex h-11 w-11 items-center justify-center rounded-full
              border border-black/15 bg-white/85 shadow-lg backdrop-blur-md
              transition hover:-translate-y-0.5 hover:shadow-xl
              dark:border-white/20 dark:bg-black/55
            "
          >
            <FiMoreHorizontal className="h-5 w-5" />
          </button>

          {isMenuOpen && (
            <div
              role="menu"
              aria-label="Sections"
              className="
                absolute bottom-full left-0 mb-2 w-44 rounded-2xl border border-black/15
                bg-white/92 p-2 shadow-xl backdrop-blur-md dark:border-white/20 dark:bg-black/75
              "
            >
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => jumpToSection(section.id)}
                  role="menuitem"
                  className="
                    flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm
                    text-foreground/85 transition hover:bg-black/5 hover:text-foreground
                    dark:hover:bg-white/10
                  "
                >
                  {section.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={goToNextSection}
          aria-label={`Go to ${nextSection.name} section`}
          className="
            inline-flex items-center gap-3 rounded-full border border-black/15 bg-white/85 px-4 py-2
            shadow-lg backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-xl
            dark:border-white/20 dark:bg-black/55
          "
        >
          <div className="text-left">
            <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/55">Next</p>
            <p className="text-sm font-semibold text-foreground">{nextSection.name}</p>
          </div>

          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 dark:border-white/20">
            {isWrappingToTop ? (
              <FiChevronUp className="h-4 w-4" />
            ) : (
              <FiChevronDown className="h-4 w-4 animate-bounce" />
            )}
          </span>
        </button>
      </div>
    </div>
  )
}
