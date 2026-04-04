'use client'

import Image from 'next/image'
import { useEffect } from 'react'

// Define Props type for data passed from Research component
type Props = {
  // paper object contains paper details
  paper: {
    title: string              // Paper title (required)
    overview?: string          // Paper overview (optional)
    publishDate?: string       // Publication date (optional)
    chartImage?: string        // Chart image path (optional)
    pdf?: string              // PDF link (optional)
    ssrn?: string             // SSRN link (optional)
  }
  onClose: () => void         // Callback function to close modal
}

// Usage example:
// <ResearchModal 
//   paper={{
//     title: "Paper Title",
//     overview: "Paper overview...",
//     publishDate: "January 2024",
//     chartImage: "/images/chart.png",
//     pdf: "https://example.com/paper.pdf",
//     ssrn: "https://ssrn.com/paper"
//   }}
//   onClose={() => setModalOpen(false)}
// />

export default function ResearchModal({ paper, onClose }: Props) {
  // Disable page scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div 
      className="
        fixed inset-0 
        bg-black/20 backdrop-blur-sm 
        z-50 
        flex items-center justify-center 
        p-4
      "
      onClick={onClose}
    >
      <div 
        className="
          relative w-full max-w-[1000px] max-h-[90vh] overflow-auto
          bg-gradient-to-br from-white/80 to-white/70 
          dark:from-black/80 dark:to-black/70
          backdrop-blur-xl
          rounded-2xl
          border border-white/20 dark:border-white/10
          shadow-[0_8px_32px_rgba(0,0,0,0.1)]
          dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
          transition-all duration-300
          p-6 sm:p-8 md:p-10
          scrollbar-thin scrollbar-track-transparent 
          scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700
        "
        onClick={e => e.stopPropagation()}
      >
        <div className="space-y-8">
          <div className="space-y-6">
            {/* Title and link buttons section */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                {paper.title}
              </h1>
              <div className="flex items-center gap-3">
                {/* PDF download button - only shown if PDF link provided */}
                {paper.pdf && (
                  <a
                    href={paper.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      rounded-full border border-solid border-black/[.08] dark:border-white/[.145] 
                      transition-all flex items-center justify-center 
                      hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] 
                      hover:border-transparent 
                      hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]
                      dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)]
                      h-9 px-4 text-sm
                      group
                    "
                  >
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 stroke-black dark:stroke-white"
                    >
                      <path 
                        d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path 
                        d="M12 12V16M5 10H19V20H5V10Z"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="group-hover:translate-x-0.5 transition-transform duration-300">
                      PDF
                    </span>
                  </a>
                )}
                {/* SSRN link button - only shown if SSRN link provided */}
                {paper.ssrn && (
                  <a
                    href={paper.ssrn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      rounded-full border border-solid border-black/[.08] dark:border-white/[.145] 
                      transition-all flex items-center justify-center 
                      hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] 
                      hover:border-transparent 
                      hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]
                      dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)]
                      h-9 px-4 text-sm
                      group
                    "
                  >
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 stroke-black dark:stroke-white"
                    >
                      <path 
                        d="M12 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V12M12 4L20 12M12 4V12H20"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="group-hover:translate-x-0.5 transition-transform duration-300">
                      SSRN
                    </span>
                  </a>
                )}
              </div>
            </div>
            
            {/* Publication date - only shown if publishDate provided */}
            {paper.publishDate && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Published on {paper.publishDate}
              </p>
            )}

            {/* Paper overview - only shown if overview provided */}
            {paper.overview && (
              <p className="
                text-base sm:text-lg 
                leading-relaxed 
                text-gray-600 dark:text-gray-300
                border-l-4 border-purple-500/30
                pl-4
              ">
                {paper.overview}
              </p>
            )}
          </div>

          {/* Chart image - only shown if chartImage provided */}
          {paper.chartImage && (
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
              <Image
                src={paper.chartImage}
                alt="Research visualization"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}