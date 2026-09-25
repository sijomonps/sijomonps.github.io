'use client'

import { motion, useReducedMotion, type Variants } from "framer-motion"

interface AnimatedBlockProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "hero"
}

export default function AnimatedText({
  children,
  className = "",
  variant = "default",
}: AnimatedBlockProps) {
  const shouldReduceMotion = useReducedMotion()

  const defaultVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      filter: "blur(10px)",
      rotateX: 45
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)", 
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
        staggerChildren: 0.1
      }
    }
  }

  const heroVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.96,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.08,
      },
    },
  }

  if (shouldReduceMotion) {
    return (
      <div className={className}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: variant === "hero", margin: variant === "hero" ? "0px" : "-100px" }}
      variants={variant === "hero" ? heroVariants : defaultVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}
