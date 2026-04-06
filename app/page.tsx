'use client'

import Hero from "./components/sections/Hero"
import About from "./components/sections/About"
import CourseTimeline from "./components/education/CourseTimeline"
import Navbar from "./components/common/Navbar"
import MySkills from './components/sections/MySkills'
import Experience from './components/sections/Experience'
import Projects from './components/sections/Projects'
import Gallery from './components/sections/Gallery'
import SectionJumpToggle from './components/common/SectionJumpToggle'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <MySkills />

        <section id="education" className="min-h-screen w-full flex items-center justify-center px-6 py-16 sm:px-12">
          <div className="w-full max-w-5xl">
            <h1 className="text-4xl font-bold mb-12 text-center">Education</h1>
            <CourseTimeline />
          </div>
        </section>

        <Experience />
        <Projects />
        <Gallery />
      </main>
      <SectionJumpToggle />
    </>
  )
}
