'use client'

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { FiLock } from "react-icons/fi"

const navItems = [
  { name: "Home", href: "#home" },
  { name: "Works", href: "#works" },
  { name: "About", href: "#about" },
  { name: "Highlights", href: "#experience" },
  { name: "Skills", href: "#skills" },
  { name: "Education", href: "#education" },
  { name: "Contact", href: "#contact" },
]

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home")
  const underlineRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLUListElement>(null)
  const NAVBAR_HEIGHT = 64

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]")
      const scrollPosition = window.scrollY + NAVBAR_HEIGHT + 100

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop
        const sectionHeight = section.clientHeight
        const sectionId = section.getAttribute("id") || ""

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const activeItem = navRef.current?.querySelector(`a[href="#${activeSection}"]`)
    if (activeItem && underlineRef.current && navRef.current) {
      const rect = activeItem.getBoundingClientRect()
      const navRect = navRef.current.getBoundingClientRect()
      
      underlineRef.current.style.left = `${rect.left - navRect.left}px`
      underlineRef.current.style.width = `${rect.width}px`
    }
  }, [activeSection])

  const scrollToSection = (href: string) => {
    const target = document.querySelector(href) as HTMLElement
    
    if (target) {
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT
      window.scrollTo({
        top: Math.max(targetPosition, 0),
        behavior: 'smooth'
      })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <nav aria-label="Main Navigation" className="max-w-4xl mx-auto px-4 py-4">
        <div className="relative flex justify-center">
          <ul ref={navRef} className="flex justify-center gap-4 sm:gap-8 relative text-center overflow-x-auto">
            <div
              ref={underlineRef}
              className="absolute bottom-0 h-[2px] bg-neutral-50 transition-all duration-300 ease-out"
            />

            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  aria-label={`Navigate to ${item.name} section`}
                  className={`
                    font-sans text-xs uppercase tracking-[0.15em]
                    font-semibold whitespace-nowrap transition-colors
                    ${activeSection === item.href.slice(1)
                      ? "text-foreground font-bold"
                      : "text-foreground/60 hover:text-foreground"
                    }
                  `}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(item.href)
                  }}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Small subtle private area icon */}
      <div className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 flex items-center">
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
      </div>
    </header>
  )
}
