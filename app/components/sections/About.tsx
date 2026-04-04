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
    <section id="about" className="min-h-screen w-full flex items-center justify-center px-6 py-16 sm:px-12">
      <div className="max-w-4xl space-y-12">
        <AnimatedText>
          <h1 className="text-4xl font-bold mb-8 text-center">About Me</h1>
        </AnimatedText>

        <div className="space-y-10">
          <AnimatedText>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Professional Snapshot</h2>
              <p className="text-lg text-foreground/80 leading-relaxed">
                I am an aspiring full-stack developer with a strong interest in building modern, responsive
                web applications. My journey started in Commerce and evolved into software development, giving
                me a practical perspective on both users and business outcomes.
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed">
                I am currently pursuing an Industry-Ready Certification in Full-Stack Development from NxtWave
                while completing my MCA in Information Technology. I enjoy turning ideas into working products,
                learning by doing, and continuously improving with each project.
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
    </section>
  )
}