'use client'

import AnimatedText from "../common/AnimatedText"

const skillsByCategory = [
  {
    category: 'Frontend Development',
    description: 'Building responsive interfaces with clean structure and user-focused layouts.',
    items: ['HTML', 'CSS', 'Bootstrap', 'JavaScript', 'React.js'],
  },
  {
    category: 'Backend Development',
    description: 'Creating application logic and API-ready foundations for real web apps.',
    items: ['Python', 'Node.js', 'Express.js'],
  },
  {
    category: 'Databases',
    description: 'Managing structured data and query-driven workflows.',
    items: ['SQLite'],
  },
  {
    category: 'Tools and Practices',
    description: 'Version control, API integration, and mobile-first development practices.',
    items: ['Git', 'REST APIs', 'Responsive Design'],
  },
]

export default function MySkills() {
  return (
    <section id="skills" className="min-h-screen w-full flex items-center justify-center px-6 py-16 sm:px-12">
      <div className="container mx-auto max-w-6xl">
        <AnimatedText>
          <h1 className="text-3xl sm:text-4xl font-bold mb-10 sm:mb-14 text-center">
            Technical Skills
          </h1>
        </AnimatedText>

        <div className="grid gap-6 sm:grid-cols-2">
          {skillsByCategory.map((group) => (
            <AnimatedText key={group.category} className="h-full">
              <div className="h-full rounded-2xl border border-black/10 bg-white/50 p-6 shadow-sm backdrop-blur-sm dark:border-white/15 dark:bg-white/[0.03]">
                <h2 className="text-2xl font-semibold">{group.category}</h2>
                <p className="mt-2 text-foreground/75 leading-relaxed">{group.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-black/10 px-3 py-1 text-sm font-medium dark:border-white/20"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedText>
          ))}
        </div>
      </div>
    </section>
  )
} 