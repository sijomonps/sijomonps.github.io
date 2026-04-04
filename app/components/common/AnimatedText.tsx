'use client'

import { motion } from "framer-motion"

interface AnimatedBlockProps {
  children: React.ReactNode
  className?: string
}

export default function AnimatedText({
  children,
  className = "",
}: AnimatedBlockProps) {
  const fadeInVariants = {
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
        ease: [0.25, 0.1, 0.25, 1],
        staggerChildren: 0.1
      }
    }
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-100px" }}
      variants={fadeInVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}
