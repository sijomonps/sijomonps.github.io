'use client'

import { useEffect, useMemo, useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { IconType } from 'react-icons'
import AnimatedText from "../common/AnimatedText"
import {
  SiCss,
  SiDjango,
  SiExpress,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from 'react-icons/si'

const skillsByCategory = [
  {
    category: 'Frontend Development',
    description: 'Building responsive interfaces with clean structure and user-focused layouts.',
    items: ['HTML', 'CSS', 'Bootstrap', 'JavaScript', 'TypeScript', 'React.js', 'Next.js', 'Tailwind CSS'],
  },
  {
    category: 'Backend Development',
    description: 'Creating application logic and API-ready foundations for real web apps.',
    items: ['Python', 'Django', 'Node.js', 'Express.js'],
  },
  {
    category: 'Databases',
    description: 'Managing structured data and query-driven workflows.',
    items: ['SQL', 'SQLite', 'MongoDB'],
  },
  {
    category: 'Tools and Practices',
    description: 'Version control, API integration, and mobile-first development practices.',
    items: ['Git', 'GitHub', 'REST APIs', 'Responsive Design'],
  },
]

type CloudIcon = {
  name: string
  Icon: IconType
}

const cloudIcons: CloudIcon[] = [
  { name: 'GitHub', Icon: SiGithub },
  { name: 'Next.js', Icon: SiNextdotjs },
  { name: 'Express', Icon: SiExpress },
  { name: 'React', Icon: SiReact },
  { name: 'TypeScript', Icon: SiTypescript },
  { name: 'JavaScript', Icon: SiJavascript },
  { name: 'Node.js', Icon: SiNodedotjs },
  { name: 'Python', Icon: SiPython },
  { name: 'Django', Icon: SiDjango },
  { name: 'SQL', Icon: SiMysql },
  { name: 'MongoDB', Icon: SiMongodb },
  { name: 'Git', Icon: SiGit },
  { name: 'Tailwind CSS', Icon: SiTailwindcss },
  { name: 'HTML5', Icon: SiHtml5 },
  { name: 'CSS3', Icon: SiCss },
]

type CloudPoint = {
  icon: CloudIcon
  x: number
  y: number
  z: number
}

type RenderedCloudPoint = CloudPoint & {
  projectedX: number
  projectedY: number
  scale: number
  opacity: number
  zIndex: number
}

const SPHERE_RADIUS = 120
const CAMERA_DISTANCE = 360

function buildSpherePoints(icons: CloudIcon[]): CloudPoint[] {
  const total = icons.length
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))

  return icons.map((icon, index) => {
    const y = 1 - (index / (total - 1)) * 2
    const radiusAtY = Math.sqrt(1 - y * y)
    const theta = goldenAngle * index

    return {
      icon,
      x: Math.cos(theta) * radiusAtY * SPHERE_RADIUS,
      y: y * SPHERE_RADIUS,
      z: Math.sin(theta) * radiusAtY * SPHERE_RADIUS,
    }
  })
}

function rotatePoint(point: CloudPoint, angleX: number, angleY: number): CloudPoint {
  const cosY = Math.cos(angleY)
  const sinY = Math.sin(angleY)
  const rotatedX = point.x * cosY - point.z * sinY
  const rotatedZAfterY = point.x * sinY + point.z * cosY

  const cosX = Math.cos(angleX)
  const sinX = Math.sin(angleX)
  const rotatedY = point.y * cosX - rotatedZAfterY * sinX
  const rotatedZ = point.y * sinX + rotatedZAfterY * cosX

  return {
    ...point,
    x: rotatedX,
    y: rotatedY,
    z: rotatedZ,
  }
}

function projectPoint(point: CloudPoint): RenderedCloudPoint {
  const perspective = CAMERA_DISTANCE / (CAMERA_DISTANCE - point.z)
  const depth = (point.z + SPHERE_RADIUS) / (SPHERE_RADIUS * 2)

  return {
    ...point,
    projectedX: point.x * perspective,
    projectedY: point.y * perspective * 0.9,
    scale: 0.5 + depth * 0.75,
    opacity: 0.32 + depth * 0.68,
    zIndex: Math.round(depth * 100),
  }
}

export default function MySkills() {
  const points = useMemo(() => buildSpherePoints(cloudIcons), [])
  const pointsRef = useRef<CloudPoint[]>(points)
  const iconRefs = useRef<Array<HTMLDivElement | null>>([])
  const frameRef = useRef<number>(0)
  const pointerTargetRef = useRef({ x: 0, y: 0 })
  const pointerRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    pointsRef.current = points.map((point) => ({ ...point }))

    const applyProjection = (pointsToRender: CloudPoint[]) => {
      pointsToRender.forEach((point, index) => {
        const projected = projectPoint(point)
        const node = iconRefs.current[index]

        if (!node) {
          return
        }

        node.style.transform = `translate3d(${projected.projectedX}px, ${projected.projectedY}px, 0) translate(-50%, -50%) scale(${projected.scale})`
        node.style.opacity = `${projected.opacity}`
        node.style.zIndex = `${projected.zIndex}`
      })
    }

    applyProjection(pointsRef.current)

    const animate = () => {
      pointerRef.current.x += (pointerTargetRef.current.x - pointerRef.current.x) * 0.12
      pointerRef.current.y += (pointerTargetRef.current.y - pointerRef.current.y) * 0.12

      const angleY = 0.006 + pointerRef.current.x * 0.018
      const angleX = 0.0025 + pointerRef.current.y * 0.014

      const nextPoints = pointsRef.current.map((point) => rotatePoint(point, angleX, angleY))
      pointsRef.current = nextPoints
      applyProjection(nextPoints)

      frameRef.current = window.requestAnimationFrame(animate)
    }

    frameRef.current = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(frameRef.current)
    }
  }, [points])

  const updatePointer = (clientX: number, clientY: number, container: HTMLDivElement) => {
    const bounds = container.getBoundingClientRect()
    const x = ((clientX - bounds.left) / bounds.width - 0.5) * 2
    const y = ((clientY - bounds.top) / bounds.height - 0.5) * 2

    pointerTargetRef.current.x = Math.max(-1, Math.min(1, x))
    pointerTargetRef.current.y = Math.max(-1, Math.min(1, y))
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    updatePointer(event.clientX, event.clientY, event.currentTarget)
  }

  const resetPointer = () => {
    pointerTargetRef.current.x = 0
    pointerTargetRef.current.y = 0
  }

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

        <AnimatedText className="mt-10 sm:mt-12">
          <div className="flex flex-col items-center">
            <h2 className="mb-2 text-center text-lg font-semibold uppercase tracking-[0.22em] text-foreground/80 sm:text-xl dark:text-white/80">Tech Stack</h2>
            <div
              className="relative mt-3 h-[300px] w-[300px] sm:h-[360px] sm:w-[360px] overflow-hidden"
              onPointerMove={handlePointerMove}
              onPointerLeave={resetPointer}
              onPointerCancel={resetPointer}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_22%,rgba(15,23,42,0.08),transparent_38%),radial-gradient(circle_at_76%_78%,rgba(15,23,42,0.06),transparent_42%)] dark:bg-[radial-gradient(circle_at_22%_22%,rgba(255,255,255,0.16),transparent_38%),radial-gradient(circle_at_76%_78%,rgba(255,255,255,0.1),transparent_42%)]" />

              {cloudIcons.map((icon, index) => {
                const IconComponent = icon.Icon
                return (
                  <div
                    key={icon.name}
                    title={icon.name}
                    ref={(node) => {
                      iconRefs.current[index] = node
                    }}
                    className="absolute left-1/2 top-1/2 pointer-events-none text-slate-800/80 drop-shadow-[0_0_8px_rgba(15,23,42,0.25)] will-change-transform dark:text-white/90 dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.22)]"
                    style={{
                      transform: 'translate3d(0, 0, 0) translate(-50%, -50%) scale(1)',
                      opacity: 0,
                      zIndex: 1,
                      willChange: 'transform, opacity',
                    }}
                  >
                    <IconComponent className="h-8 w-8 sm:h-10 sm:w-10" aria-label={icon.name} />
                  </div>
                )
              })}
            </div>
          </div>
        </AnimatedText>
      </div>
    </section>
  )
}