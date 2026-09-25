'use client'

import type { IconType } from 'react-icons'
import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6'

type SocialLink = {
  name: string
  href: string
  Icon: IconType
}

const socialLinks: SocialLink[] = [
  {
    name: 'WhatsApp',
    href: 'https://wa.me/916235719647',
    Icon: FaWhatsapp,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/sijomonps',
    Icon: FaGithub,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/sijomonps/',
    Icon: FaLinkedinIn,
  },
]

export default function FixedSocialRail() {
  return (
    <aside
      aria-label="Social links rail"
      className="
        fixed z-40
        left-[max(0.75rem,env(safe-area-inset-left))]
        bottom-[max(0.75rem,env(safe-area-inset-bottom))]
        sm:left-6 sm:bottom-6
        pointer-events-auto
      "
    >
      <nav
        aria-label="Social links"
        className="
          fixed-social-rail-grid
          flex flex-col items-center
          w-11 sm:w-16
          rounded-xl sm:rounded-2xl
          border border-white/10
          divide-y divide-white/10
          shadow-2xl shadow-black/80
          backdrop-blur-md
          overflow-hidden
        "
      >
        {socialLinks.map((item) => {
          const Icon = item.Icon
          return (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.name}
              className="
                group relative flex items-center justify-center
                w-full h-11 sm:h-16
                text-zinc-400 hover:text-white
                transition-colors duration-200
                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:z-10
              "
            >
              <Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5 transition-transform duration-200 ease-out group-hover:scale-105 group-hover:translate-x-0.5" />
              <span
                role="tooltip"
                className="
                  pointer-events-none absolute left-full ml-3 hidden
                  -translate-x-1 whitespace-nowrap rounded-md border border-white/10
                  bg-zinc-950/90 px-2.5 py-1 text-xs font-mono tracking-wider
                  text-zinc-300 opacity-0 shadow-lg backdrop-blur-md
                  transition-all duration-150 ease-out
                  group-hover:translate-x-0 group-hover:opacity-100
                  group-focus-visible:translate-x-0 group-focus-visible:opacity-100
                  sm:inline-block
                "
              >
                {item.name}
              </span>
            </a>
          )
        })}
      </nav>
    </aside>
  )
}
