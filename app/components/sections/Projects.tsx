'use client'

import AnimatedText from '../common/AnimatedText'
import GradientBackground from '../common/GradientBackground'
import { FiArrowUpRight } from 'react-icons/fi'

type Project = {
  title: string
  summary: string
  stack: string[]
  highlights: string[]
  link: string
}

const projects: Project[] = [
  {
    title: 'E-Commerce Website',
    summary:
      'A responsive shopping website focused on smooth browsing and better product discovery.',
    stack: ['HTML', 'CSS', 'Bootstrap'],
    highlights: [
      'Implemented mobile-first layouts for seamless usage across devices.',
      'Added product videos and image carousel to improve browsing experience.',
    ],
    link: 'https://hpcrafts.ccbp.tech',
  },
  {
    title: 'Typing Speed Test',
    summary:
      'An interactive typing practice application that measures speed and accuracy in real time.',
    stack: ['HTML', 'CSS', 'JavaScript', 'REST API', 'Bootstrap'],
    highlights: [
      'Built timer-based result calculation with dynamic DOM updates.',
      'Integrated API-driven content to keep tests engaging and reusable.',
    ],
    link: 'https://sijotypingspeed.ccbp.tech',
  },
  {
    title: 'My Library (Books Page)',
    summary:
      'A visually engaging recommendation page presenting curated books with a clean reading-first layout.',
    stack: ['HTML', 'CSS', 'Bootstrap'],
    highlights: [
      'Used Flexbox and modern CSS layout techniques for balanced sections.',
      'Designed banners and content blocks with strong visual hierarchy.',
    ],
    link: 'https://sijolibrary.ccbp.tech',
  },
  {
    title: 'TEDxKCMT Event Website',
    summary:
      'A responsive event landing page designed to communicate event details and drive registrations.',
    stack: ['HTML', 'CSS'],
    highlights: [
      'Built a clear landing flow that redirected users to registration forms.',
      'Focused on readability and straightforward navigation for event audiences.',
    ],
    link: 'https://sijomonps.github.io/Tedxkcmt/',
  },
]

export default function Projects() {
  return (
    <section id="projects" className="container mx-auto px-6 sm:px-10 md:px-12">
      <div className="
        min-h-screen
        flex flex-col items-center justify-center
        py-16 md:py-20
        relative
        overflow-hidden
      ">
        <GradientBackground 
          sectionId="projects"
          gradientColors={{
            start: '#B45309',
            end: '#7C2D12'
          }}
        />

        <AnimatedText>
          <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-center relative z-10">
            Projects
          </h1>
        </AnimatedText>
        
        <div className="relative z-0 grid w-full max-w-6xl gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <AnimatedText key={project.title}>
              <article className="h-full rounded-2xl border border-white/20 bg-white/[0.08] p-6 backdrop-blur-xl shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-2xl font-semibold leading-tight">{project.title}</h2>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-foreground"
                  >
                    Live
                    <FiArrowUpRight className="h-4 w-4" />
                  </a>
                </div>

                <p className="mt-3 text-foreground/80 leading-relaxed">{project.summary}</p>

                <div className="mt-5 space-y-2 text-sm text-foreground/75">
                  {project.highlights.map((point) => (
                    <p key={point}>{point}</p>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.stack.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-black/10 px-3 py-1 text-sm dark:border-white/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold tracking-wide underline underline-offset-4"
                >
                  View Project
                  <FiArrowUpRight className="h-4 w-4" />
                </a>
              </article>
            </AnimatedText>
          ))}
        </div>
      </div>
    </section>
  )
}