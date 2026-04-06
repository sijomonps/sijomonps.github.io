'use client'

import Image from "next/image"
import AnimatedText from "../common/AnimatedText"
import FloatingElements from "../common/FloatingElements"

export default function Hero() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
  const assetPath = (path: string) => `${basePath}${path}`
  const resumeUrl = "/Resume.pdf"

  return (
    <section
      id="home"
      className="relative min-h-screen px-6 pt-28 pb-14 sm:px-12"
    >
      <FloatingElements />
      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-3xl flex-col justify-center space-y-7">
        <AnimatedText className="flex flex-col items-start gap-3 text-left">
          <Image
            className="rounded-full"
            src={assetPath("/avatar.jpg")}
            alt="Profile Picture"
            width={104}
            height={104}
            priority
          />
          <p className="text-xs uppercase tracking-[0.18em] text-foreground/60">
            Thiruvalla, Kerala, India
          </p>
          <h1 className="text-2xl font-bold sm:text-3xl">Sijomon P S</h1>
          <p className="text-sm text-foreground/80 sm:text-base">
            Full-Stack Developer | MCA Student
          </p>
        </AnimatedText>

        <AnimatedText className="max-w-3xl text-left">
          <p className="text-sm leading-relaxed text-foreground/80 sm:text-base">
            Commerce to code — I chose curiosity over comfort. Now I build real web 
            applications and look forward to growing fast by taking ownership in a 
            small, driven team.
          </p>
        </AnimatedText>

        <AnimatedText className="flex flex-wrap items-center gap-2 sm:gap-3">
          <a
            className="
              rounded-full border border-solid border-black/[.12] dark:border-white/[.2]
              transition-colors flex items-center justify-center
              hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]
              h-9 px-4 text-sm
            "
            href="https://github.com/sijomonps"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="invert dark:invert-0 mr-2"
              src={assetPath("/github.svg")}
              alt="GitHub"
              width={20}
              height={20}
              sizes="20px"
            />
            GitHub
          </a>

          <a
            className="
              rounded-full border border-solid border-black/[.12] dark:border-white/[.2]
              transition-colors flex items-center justify-center
              hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]
              h-9 px-4 text-sm
            "
            href="https://www.linkedin.com/in/sijomonps/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert mr-2"
              src={assetPath("/linkedin.svg")}
              alt="LinkedIn"
              width={20}
              height={20}
              sizes="20px"
            />
            LinkedIn
          </a>

          <a
            className="
              rounded-full border border-solid border-black/[.12] dark:border-white/[.2]
              transition-colors flex items-center justify-center
              hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]
              h-9 px-4 text-sm
            "
            href="mailto:sijomon700@gmail.com"
          >
            <Image
              className="dark:invert mr-2"
              src={assetPath("/mail.svg")}
              alt="Email"
              width={20}
              height={20}
              sizes="20px"
            />
            Email Me
          </a>
        </AnimatedText>

        <AnimatedText className="grid max-w-3xl grid-cols-1 gap-2 text-left text-xs text-foreground/75 sm:grid-cols-3">
          <a className="hover:text-foreground" href="tel:+916235719647">
            Phone: +91 62357 19647
          </a>
          <a className="hover:text-foreground" href="mailto:sijomon700@gmail.com">
            sijomon700@gmail.com
          </a>
          <p>Open to internships and junior web developer roles</p>
        </AnimatedText>

        <AnimatedText className="flex flex-wrap items-center gap-4 pt-2 text-xs text-foreground/70">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert mr-2"
              src={assetPath("/resume.svg")}
              alt="Resume"
              width={25}
              height={20}
              sizes="20px"
            />
            View Resume
          </a>
        </AnimatedText>
      </main>
    </section>
  )
}