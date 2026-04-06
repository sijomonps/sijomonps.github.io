'use client'

import AnimatedText from "../common/AnimatedText"

interface EducationItem {
  period: string
  title: string
  institution: string
  score?: string
  details?: string
}

const educationTimeline: EducationItem[] = [
  {
    period: "2025 - 2027",
    title: "Master of Computer Applications (Information Technology)",
    institution: "Marian College Kuttikkanam (Autonomous), Kerala",
  },
  {
    period: "2022 - 2025",
    title: "Bachelor of Commerce (Computer Applications)",
    institution: "Kristu Jyoti College of Management and Technology, Kottayam",
  },
  {
    period: "Dec 2023 - Present",
    title: "Industry-Ready Certification in Full-Stack Development",
    institution: "NxtWave Disruptive Technologies",
    score: "Professional Training",
    details: "Hands-on learning in modern frontend and backend development.",
  },
  {
    period: "2020 - 2022",
    title: "Higher Secondary (Commerce Stream)",
    institution: "St. Johns HSS Eraviperoor",
    score: "79%",
  },
  {
    period: "2019 - 2020",
    title: "Secondary School",
    institution: "SCS Higher Secondary School, Thiruvalla",
    score: "77%",
  }
]

export default function CourseTimeline() {
  return (
    <div className="relative mx-auto max-w-4xl pl-8 sm:pl-10">
      <div className="absolute left-2 top-0 h-full w-[2px] bg-neutral-200 dark:bg-neutral-800 sm:left-3" />

      <div className="space-y-8">
        {educationTimeline.map((item) => (
          <AnimatedText key={`${item.title}-${item.period}`}>
            <article className="relative rounded-2xl border border-black/10 bg-white/60 p-5 shadow-sm backdrop-blur-sm dark:border-white/15 dark:bg-white/[0.03] sm:p-6">
              <span className="absolute -left-[30px] top-6 h-3 w-3 rounded-full bg-black dark:bg-white sm:-left-[34px]" />

              <p className="text-sm uppercase tracking-wide text-foreground/60">{item.period}</p>
              <h3 className="mt-1 text-xl font-bold leading-snug">{item.title}</h3>
              <p className="mt-2 text-foreground/80">{item.institution}</p>
              {item.score && <p className="mt-1 font-medium text-foreground/80">{item.score}</p>}
              {item.details && <p className="mt-2 text-sm text-foreground/70">{item.details}</p>}
            </article>
          </AnimatedText>
        ))}
      </div>
    </div>
  )
}