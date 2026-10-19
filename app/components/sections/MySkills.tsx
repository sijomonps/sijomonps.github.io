'use client'

import AnimatedText from "../common/AnimatedText"
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiBootstrap,
  SiPython,
  SiDjango,
  SiNodedotjs,
  SiExpress,
  SiMysql,
  SiMongodb,
  SiFirebase,
  SiDocker,
  SiVercel,
  SiRender,
  SiGithubpages,
  SiGit,
  SiGithub,
  SiGithubactions,
  SiLinux,
} from 'react-icons/si'
import { FaAws, FaInfinity } from 'react-icons/fa6'
import { TbApi } from 'react-icons/tb'
import { MdDevices } from 'react-icons/md'

const skillsByCategory = [
  {
    category: 'FRONTEND DEVELOPMENT',
    items: [
      { name: 'HTML5', icon: SiHtml5 },
      { name: 'CSS3', icon: SiCss },
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'React', icon: SiReact },
      { name: 'Next.js', icon: SiNextdotjs },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'Tailwind CSS', icon: SiTailwindcss },
      { name: 'Bootstrap', icon: SiBootstrap }
    ],
  },
  {
    category: 'BACKEND DEVELOPMENT',
    items: [
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'Express.js', icon: SiExpress },
      { name: 'Django', icon: SiDjango }
    ],
  },
  {
    category: 'DATABASES',
    items: [
      { name: 'MongoDB', icon: SiMongodb },
      { name: 'Firebase', icon: SiFirebase },
      { name: 'MySQL', icon: SiMysql }
    ],
  },
  {
    category: 'CLOUD & DEPLOYMENT',
    items: [
      { name: 'Docker', icon: SiDocker },
      { name: 'AWS', icon: FaAws },
      { name: 'Vercel', icon: SiVercel },
      { name: 'Render', icon: SiRender },
      { name: 'Git', icon: SiGit },
      { name: 'GitHub', icon: SiGithub },
      { name: 'GitHub Pages', icon: SiGithubpages },      
      { name: 'GitHub Actions', icon: SiGithubactions },
      { name: 'REST APIs', icon: TbApi },
      { name: 'CI/CD', icon: FaInfinity },
      { name: 'Linux', icon: SiLinux }
    ],
  },
  
]

export default function MySkills() {
  return (
    <section id="skills" className="min-h-screen w-full flex items-center justify-center px-6 py-16 sm:px-12 scroll-mt-16 sm:scroll-mt-20">
      <div className="container mx-auto max-w-6xl">
        <AnimatedText>
          <h2 className="font-display text-5xl sm:text-7xl md:text-8xl tracking-wider uppercase font-bold mb-10 sm:mb-14 text-center">
            TECHNICAL SKILLS
          </h2>
        </AnimatedText>

        <div className="grid gap-6 grid-cols-1 max-w-5xl mx-auto">
          {skillsByCategory.map((group) => (
            <AnimatedText key={group.category}>
              <div className="rounded-2xl border border-black/10 bg-white/50 p-6 sm:p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-white/20 dark:hover:bg-white/[0.04] flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
                <h3 className="font-display text-2xl sm:text-3xl tracking-wide uppercase font-bold text-foreground/90 w-full md:w-1/3 shrink-0">
                  {group.category}
                </h3>

                <div className="flex flex-wrap gap-3 flex-1">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    return (
                      <div
                        key={item.name}
                        className="flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/10 hover:border-black/10 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:border-white/20 dark:hover:text-white"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </AnimatedText>
          ))}
        </div>
      </div>
    </section>
  )
}