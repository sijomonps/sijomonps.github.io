'use client'

import AnimatedText from '../common/AnimatedText'

// Define course data type
// Each course entry must include:
// - id: Unique identifier
// - code: Course code (e.g. "ECON 200") 
// - name: Course name
// - level: Course level ("Graduate" or "Undergraduate")
// - professor: Professor name
// - term: Academic term (e.g. "2023 Fall")
// - reviews: Optional array of student reviews
type Course = {
  id: number
  code: string
  name: string
  level: string
  professor: string
  term: string
  reviews?: string[]
}

// Example course data
// Usage instructions:
// 1. Copy template below and modify content as needed
// 2. Required fields for each course: id, code, name, level, professor, term
// 3. Reviews field is optional for student feedback
// 4. Sort courses in reverse chronological order
const courses: Course[] = [
  {
    id: 1,
    code: "ECON 200",
    name: "Microeconomic Analysis", 
    level: "Graduate",
    professor: "Professor Dong Wei",
    term: "2023 Fall"
  },
  {
    id: 2,
    code: "ECON 170",
    name: "Environmental Economics",
    level: "Undergraduate", 
    professor: "Professor Jeremy West",
    term: "2025 Winter",
    reviews: [
      "I absolutely loved Qianping. He was the perfect TA. He was available whenever I was confused, and explained concepts more clearly than the professor did some time. I loved being able to learn from him.",
      "I really liked how Qianping went over the basic framework of the unit we were learning each week. It served as a great reference point and helped me in completeing the problem sets and exams a lot."
    ]
  },
  {
    id: 3,
    code: "ECON 100A",
    name: "Intermediate Microeconomics",
    level: "Undergraduate",
    professor: "Professor Natalia Lazzati", 
    term: "2020 Fall"
  }
]

export default function TeachingExperience() {
  return (
    <section id="teaching" className="
      min-h-screen w-full 
      flex items-center justify-center 
      py-16 px-4 sm:px-8 md:px-16
    ">
      <div className="container max-w-4xl mx-auto">
        <AnimatedText>
          <div className="flex flex-col items-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-center">
              Teaching Experience
            </h1>
            <span className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
              @ UC Santa Cruz
            </span>
          </div>
        </AnimatedText>

        <div className="space-y-12">
          {courses.map((course) => (
            <AnimatedText key={course.id}>
              <div className="space-y-4 pb-8 border-b border-black/10 dark:border-white/10">
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    {course.code}: {course.name}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    ({course.level})
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-base sm:text-lg">
                    Teaching Assistant to {course.professor}
                  </p>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    {course.term}
                  </p>
                </div>

                {course.reviews && course.reviews.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-medium">
                      Selected Student Experience:
                    </h3>
                    {course.reviews.map((review, index) => (
                      <blockquote 
                        key={index}
                        className="
                          pl-4 
                          border-l-2 border-gray-300 dark:border-gray-700
                          italic
                          text-gray-600 dark:text-gray-400
                        "
                      >
                        "{review}"
                      </blockquote>
                    ))}
                  </div>
                )}
              </div>
            </AnimatedText>
          ))}
        </div>
      </div>
    </section>
  )
} 