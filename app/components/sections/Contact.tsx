'use client'

import AnimatedText from '../common/AnimatedText'
import GradientBackground from '../common/GradientBackground'
import type { IconType } from 'react-icons'
import { FiGithub, FiInstagram, FiLinkedin, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'

type ContactItem = {
  label: string
  href: string
  Icon: IconType
}

const contactItems: ContactItem[] = [
  {
    label: 'Email',
    href: 'mailto:sijomon700@gmail.com',
    Icon: FiMail,
  },
  {
    label: 'Phone',
    href: 'tel:+916235719647',
    Icon: FiPhone,
  },
  {
    label: 'Location',
    href: 'https://maps.google.com/?q=Thiruvalla,+Kerala,+India',
    Icon: FiMapPin,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/sijomonps',
    Icon: FiGithub,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/sijomonps/',
    Icon: FiLinkedin,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/zeejo.ae/',
    Icon: FiInstagram,
  },
]

export default function Contact() {
  return (
    <section id="contact" className="container mx-auto px-6 sm:px-10 md:px-12">
      <div className="min-h-screen flex flex-col items-center justify-center py-16 md:py-20 relative overflow-hidden">
        <GradientBackground 
          sectionId="contact"
          gradientColors={{
            start: '#0F766E',
            end: '#155E75'
          }}
        />

        <AnimatedText>
          <h2 className="font-display text-5xl sm:text-7xl md:text-8xl tracking-wider uppercase font-bold mb-4 text-center relative z-10 text-foreground">LET&apos;S CONNECT</h2>
        </AnimatedText>

        <AnimatedText>
          <p className="relative z-10 max-w-2xl text-center font-sans text-base sm:text-lg text-foreground/85 leading-relaxed">
            My goal is to grow as a full-stack developer by contributing to meaningful products, solving practical
            problems, and continuously improving through collaboration and real-world engineering experience.
          </p>
        </AnimatedText>

        <AnimatedText className="relative z-10 mt-10 w-full">
          <div className="mx-auto flex w-full max-w-[13.5rem] flex-wrap items-center justify-center gap-3 sm:max-w-none sm:gap-4">
            {contactItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={item.label}
                title={item.label}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/[0.12] text-foreground shadow-md backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/[0.2] sm:h-12 sm:w-12"
              >
                <item.Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
        </AnimatedText>
      </div>
    </section>
  )
}
