'use client'

import AnimatedText from "../common/AnimatedText"

const strengths = [
  "Strong interest in web development and problem solving",
  "Fast learner with a practical, build-and-ship mindset",
  "Comfortable combining frontend creativity with backend fundamentals",
  "Focused on real-world projects and continuous growth",
  "Creative editing and design sense for better product presentation",
]

export default function About() {
  return (
    <section id="about" className="relative min-h-screen w-full flex items-center justify-center px-6 py-16 sm:px-12">
      <div className="relative max-w-4xl w-full">
        <div className="space-y-12">
          <AnimatedText>
            <h1 className="text-4xl font-bold mb-8 text-center">About Me</h1>
          </AnimatedText>

          <div className="space-y-10">
            <AnimatedText>
              <div className="space-y-4">
                <p className="text-lg text-foreground/80 leading-relaxed">
                  My journey into development started with creativity.
                  During my Commerce degree, I spent most of my time building
                  skills in video editing, portrait drawing, and expressing ideas
                  visually. Stepping out of my comfort zone during college helped
                  me grow, take initiative, and confidently showcase my work.
                </p>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  That creative mindset naturally led me into software
                  development. Today, I build modern web applications with
                  a focus on real-world impact, bringing the same creativity,
                  attention to detail, and curiosity into every project.
                  I aim to grow in an environment where I can take ownership
                  and learn by working on real challenges.
                </p>
              </div>
            </AnimatedText>

            <AnimatedText>
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Strengths</h2>
                <ul className="grid gap-3 text-foreground/80 sm:grid-cols-2">
                  {strengths.map((strength) => (
                    <li
                      key={strength}
                      className="rounded-xl border border-black/10 dark:border-white/15 px-4 py-3 text-base"
                    >
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedText>

            <AnimatedText>
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Career Goals</h2>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  I am looking for opportunities where I can contribute as a Full-Stack or Web Developer,
                  gain hands-on product experience, and grow into a dependable engineer who builds scalable,
                  user-friendly digital solutions.
                </p>
              </div>
            </AnimatedText>
          </div>
        </div>
      </div>
    </section>
  )
}