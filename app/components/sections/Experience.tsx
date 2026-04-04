'use client'

import AnimatedText from '../common/AnimatedText'
import GradientBackground from '../common/GradientBackground'
type Highlight = {
  title: string
  organization: string
  period: string
  points: string[]
}

const highlights: Highlight[] = [
  {
    title: 'Industry-Ready Full-Stack Certification',
    organization: 'NxtWave Disruptive Technologies',
    period: 'Dec 2023 - Present',
    points: [
      'Building practical projects across frontend and backend technologies.',
      'Strengthening real-world fundamentals through consistent coding practice.',
    ],
  },
  {
    title: 'NASA Space Apps Challenge Participant',
    organization: 'Global Hackathon',
    period: '2025',
    points: [
      'Collaborated in a fast-paced environment to solve problem statements under time pressure.',
      'Improved teamwork and rapid ideation skills through hands-on hackathon execution.',
    ],
  },
  {
    title: 'TEDxKCMT Core Team Member',
    organization: 'TEDxKCMT',
    period: 'Event Team Contribution',
    points: [
      'Built the event ticket website with a clear, user-friendly interface.',
      'Created promotional content and supported smooth event coordination.',
    ],
  },
]

const strengths = [
  'Strong interest in web development',
  'Fast learner with a practical approach',
  'Solid frontend and beginner backend foundation',
  'Passion for building real-world projects',
]

export default function Experience() {
  return (
    <section id="experience" className="container mx-auto px-6 sm:px-10 md:px-12">
      <div className="
        min-h-screen
        flex flex-col items-center justify-center
        py-16 md:py-20
        relative
        overflow-hidden
      ">
        <GradientBackground 
          sectionId="experience"
          gradientColors={{
            start: '#1E3A8A',
            end: '#0F766E'
          }}
        />

        <AnimatedText>
          <h1 className="text-3xl sm:text-4xl font-bold mb-12 text-center relative z-10">
            Certifications and Involvement
          </h1>
        </AnimatedText>

        <div className="relative z-0 grid w-full max-w-6xl gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <AnimatedText key={item.title}>
              <article className="h-full rounded-2xl border border-white/20 bg-white/[0.08] p-6 backdrop-blur-xl shadow-lg">
                <p className="text-sm uppercase tracking-wide text-foreground/70">{item.period}</p>
                <h2 className="mt-2 text-xl font-semibold leading-snug">{item.title}</h2>
                <p className="mt-2 text-sm text-foreground/70">{item.organization}</p>

                <div className="mt-4 space-y-2 text-sm text-foreground/80">
                  {item.points.map((point) => (
                    <p key={point}>{point}</p>
                  ))}
                </div>
              </article>
            </AnimatedText>
          ))}
        </div>

        <AnimatedText className="relative z-10 mt-10 w-full max-w-6xl">
          <div className="rounded-2xl border border-black/10 bg-white/60 p-6 backdrop-blur-sm dark:border-white/15 dark:bg-white/[0.03]">
            <h3 className="text-2xl font-semibold">Core Strengths</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {strengths.map((strength) => (
                <p key={strength} className="rounded-lg border border-black/10 px-4 py-3 text-sm dark:border-white/15">
                  {strength}
                </p>
              ))}
            </div>
          </div>
        </AnimatedText>
      </div>
    </section>
  )
}
