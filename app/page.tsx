'use client'

import Hero from "./components/sections/Hero"
import About from "./components/sections/About"
import CourseTimeline from "./components/education/CourseTimeline"
import Navbar from "./components/common/Navbar"
import MySkills from './components/sections/MySkills'
import Experience from './components/sections/Experience'
import Projects from './components/sections/Projects'
import Contact from './components/sections/Contact'
import FixedSocialRail from './components/common/FixedSocialRail'
import SectionJumpToggle from './components/common/SectionJumpToggle'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Projects />
        <About />
        <MySkills />

        <section id="education" className="min-h-screen w-full flex items-center justify-center px-6 py-20 sm:px-12">
          <div className="w-full max-w-5xl">
            <h2 className="font-display text-5xl sm:text-7xl md:text-8xl tracking-wider uppercase font-bold mb-12 text-center">EDUCATION</h2>
            <CourseTimeline />
          </div>
        </section>

        <Experience />
        <Contact />
      </main>
      <FixedSocialRail />
      <SectionJumpToggle />
    </>
  )
}
