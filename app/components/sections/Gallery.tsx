'use client'

import AnimatedText from '../common/AnimatedText'
import GradientBackground from '../common/GradientBackground'

type ContactItem = {
  label: string
  value: string
  href?: string
}

const contactItems: ContactItem[] = [
  {
    label: 'Email',
    value: 'sijomon700@gmail.com',
    href: 'mailto:sijomon700@gmail.com',
  },
  {
    label: 'Phone',
    value: '+91 62357 19647',
    href: 'tel:+916235719647',
  },
  {
    label: 'Location',
    value: 'Thiruvalla, Kerala, India',
  },
  {
    label: 'GitHub',
    value: 'github.com/sijomonps',
    href: 'https://github.com/sijomonps',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/sijomonps',
    href: 'https://www.linkedin.com/in/sijomonps/',
  },
]

export default function Gallery() {
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
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center relative z-10">Let&apos;s Connect</h1>
        </AnimatedText>

        <AnimatedText>
          <p className="relative z-10 max-w-3xl text-center text-lg text-foreground/80 leading-relaxed">
            My goal is to grow as a full-stack developer by contributing to meaningful products, solving practical
            problems, and continuously improving through collaboration and real-world engineering experience.
          </p>
        </AnimatedText>

        <div className="relative z-10 mt-10 grid w-full max-w-4xl gap-4 sm:grid-cols-2">
          {contactItems.map((item) => (
            <AnimatedText key={item.label}>
              <article className="rounded-2xl border border-white/20 bg-white/[0.08] p-5 backdrop-blur-xl shadow-lg">
                <p className="text-xs uppercase tracking-[0.15em] text-foreground/60">{item.label}</p>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="mt-2 inline-block text-lg font-semibold hover:underline hover:underline-offset-4"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-2 text-lg font-semibold">{item.value}</p>
                )}
              </article>
            </AnimatedText>
          ))}
        </div>
      </div>
    </section>
  )
}