'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import { Highlight } from '../../data/highlights'

type HighlightModalProps = {
  highlight: Highlight | null
  onClose: () => void
}

export default function HighlightModal({ highlight, onClose }: HighlightModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!highlight) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    // Focus the close button for accessibility
    setTimeout(() => {
      closeButtonRef.current?.focus()
    }, 50)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [highlight, onClose])

  return (
    <AnimatePresence>
      {highlight && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close image preview"
            className="
              absolute right-4 top-4 sm:right-6 sm:top-6 z-20
              inline-flex h-11 w-11 items-center justify-center rounded-full
              border border-white/20 bg-black/70 text-white/80 backdrop-blur-md
              transition-all duration-200 hover:scale-110 hover:border-white/50
              hover:bg-black/90 hover:text-white focus:outline-none
              focus-visible:ring-2 focus-visible:ring-white active:scale-95
            "
          >
            <FiX className="h-5 w-5" />
          </button>

          {/* Image-Only Lightbox Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex items-center justify-center max-w-[88vw] max-h-[85vh]"
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-zinc-950/90 shadow-2xl shadow-black/90">
              <Image
                src={highlight.image}
                alt={highlight.name || highlight.title || 'Highlight preview'}
                width={800}
                height={800}
                priority
                className="block max-w-[85vw] max-h-[80vh] w-auto h-auto object-contain select-none"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
