'use client'

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { FiLock, FiMenu, FiX } from "react-icons/fi"

type NavItem = {
  name: string
  href: string
  id: string
}

const navItems: NavItem[] = [
  { name: "Works", href: "#works", id: "works" },
  { name: "About", href: "#about", id: "about" },
  { name: "Highlights", href: "#highlights", id: "highlights" },
  { name: "Recommendations", href: "#recommendations", id: "recommendations" },
  { name: "Skills", href: "#skills", id: "skills" },
  { name: "Contact", href: "#contact", id: "contact" },
]

export default function Navbar() {
  const [activeSection, setActiveSection] = useState<string>("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const underlineRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLUListElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const NAVBAR_HEIGHT = 64

  // Smooth scroll with fixed navbar offset
  const scrollToSection = useCallback((href: string) => {
    const target = document.querySelector(href) as HTMLElement
    if (target) {
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT
      window.scrollTo({
        top: Math.max(targetPosition, 0),
        behavior: 'smooth'
      })
    }
  }, [NAVBAR_HEIGHT])

  // Track active section via throttled requestAnimationFrame
  useEffect(() => {
    let isTicking = false

    const updateActiveSection = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const scrollHeight = document.documentElement.scrollHeight

      // Bottom of page -> contact is active
      if (scrollY + windowHeight >= scrollHeight - 60) {
        setActiveSection("contact")
        return
      }

      // Check if user is still in the hero/top area before works
      const worksEl = document.getElementById("works")
      const probePosition = scrollY + NAVBAR_HEIGHT + 100

      if (worksEl) {
        const worksTop = worksEl.getBoundingClientRect().top + scrollY
        if (probePosition < worksTop) {
          setActiveSection("")
          return
        }
      }

      // Find the last section whose top is at or above probePosition
      let currentSection = ""
      for (const item of navItems) {
        const el = document.getElementById(item.id)
        if (!el) continue
        const top = el.getBoundingClientRect().top + scrollY
        if (probePosition >= top) {
          currentSection = item.id
        }
      }

      setActiveSection(currentSection)
    }

    const handleScroll = () => {
      if (!isTicking) {
        isTicking = true
        window.requestAnimationFrame(() => {
          updateActiveSection()
          isTicking = false
        })
      }
    }

    updateActiveSection()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [NAVBAR_HEIGHT])

  // Update animated underline position
  useEffect(() => {
    const updateUnderline = () => {
      if (!activeSection) {
        if (underlineRef.current) {
          underlineRef.current.style.opacity = "0"
        }
        return
      }

      const activeItem = navRef.current?.querySelector(`a[href="#${activeSection}"]`)
      if (activeItem && underlineRef.current && navRef.current) {
        const rect = activeItem.getBoundingClientRect()
        const navRect = navRef.current.getBoundingClientRect()

        underlineRef.current.style.opacity = "1"
        underlineRef.current.style.left = `${rect.left - navRect.left}px`
        underlineRef.current.style.width = `${rect.width}px`
      } else if (underlineRef.current) {
        underlineRef.current.style.opacity = "0"
      }
    }

    updateUnderline()
    window.addEventListener("resize", updateUnderline)
    return () => window.removeEventListener("resize", updateUnderline)
  }, [activeSection])

  // Mobile menu keyboard and outside click listeners
  useEffect(() => {
    if (!isMobileMenuOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(target)
      ) {
        setIsMobileMenuOpen(false)
      }
    }

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("pointerdown", handlePointerDown)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("resize", handleResize)
    }
  }, [isMobileMenuOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/[0.05]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between relative">
        {/* Mobile branding link (scrolls to top / home) */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault()
            setIsMobileMenuOpen(false)
            scrollToSection("#home")
          }}
          className="md:hidden font-display text-sm tracking-wider uppercase font-bold text-foreground/80 hover:text-foreground transition-colors"
          aria-label="Sijomon P S - Scroll to top"
        >
          SIJOMON P S
        </a>

        {/* Left balance spacer for desktop to maintain perfect centering of nav items */}
        <div className="hidden md:block w-8 sm:w-9 shrink-0" aria-hidden="true" />

        {/* Desktop Navigation (>= 768px) */}
        <nav aria-label="Main Navigation" className="hidden md:flex flex-1 justify-center">
          <ul
            ref={navRef}
            className="flex items-center gap-3.5 sm:gap-4 md:gap-4 lg:gap-6 xl:gap-8 relative text-center py-2"
          >
            <div
              ref={underlineRef}
              className="absolute bottom-0 h-[2px] bg-neutral-50 transition-all duration-300 ease-out opacity-0 pointer-events-none"
            />

            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  aria-label={`Navigate to ${item.name} section`}
                  className={`
                    font-sans text-[11px] lg:text-xs uppercase tracking-[0.15em]
                    font-semibold whitespace-nowrap transition-colors py-1
                    focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded
                    ${activeSection === item.id
                      ? "text-foreground font-bold"
                      : "text-foreground/60 hover:text-foreground"
                    }
                  `}
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveSection(item.id)
                    scrollToSection(item.href)
                  }}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right controls: Personal Area Icon + Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Small subtle private area icon */}
          <Link
            href="/f/"
            aria-label="Personal Area"
            className="group relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-white/25 transition backdrop-blur-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
          >
            <FiLock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span
              role="tooltip"
              className="pointer-events-none absolute right-0 top-full mt-2 hidden whitespace-nowrap rounded-lg border border-white/10 bg-zinc-950/95 px-2.5 py-1 text-[11px] font-mono text-zinc-300 opacity-0 shadow-xl backdrop-blur-md transition-all duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 sm:inline-block"
            >
              Personal Area
            </span>
          </Link>

          {/* Mobile Menu Toggle Button (< 768px) */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-menu"
            className="md:hidden flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-white/25 transition backdrop-blur-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <FiX className="h-4 w-4 text-white" />
            ) : (
              <FiMenu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel (< 768px) */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          ref={mobileMenuRef}
          className="
            md:hidden absolute top-full left-0 right-0
            bg-zinc-950/95 backdrop-blur-xl border-b border-white/10
            shadow-2xl shadow-black/80 px-4 py-3
          "
        >
          <ul className="flex flex-col gap-1 max-w-md mx-auto">
            {navItems.map((item) => {
              const isActive = activeSection === item.id
              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    aria-label={`Navigate to ${item.name} section`}
                    className={`
                      flex items-center justify-between px-4 py-3 rounded-xl
                      font-sans text-xs uppercase tracking-[0.15em] font-semibold
                      transition-colors
                      ${isActive
                        ? "bg-white/10 text-foreground font-bold"
                        : "text-foreground/60 hover:text-foreground hover:bg-white/5"
                      }
                    `}
                    onClick={(e) => {
                      e.preventDefault()
                      setIsMobileMenuOpen(false)
                      setActiveSection(item.id)
                      scrollToSection(item.href)
                    }}
                  >
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </header>
  )
}
