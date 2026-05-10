import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

interface DetailModalProps {
  isOpen: boolean
  onClose: () => void
  accentColor: string
  title: string
  subtitle?: string
  content: string
  tags?: React.ReactNode
}

export default function DetailModal({
  isOpen,
  onClose,
  accentColor,
  title,
  subtitle,
  content,
  tags,
}: DetailModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
          className="fixed top-0 left-0 w-full h-[100vh] z-[9999] bg-[#060b14] flex flex-col"
          style={{ overflowY: 'auto' }}
        >
          {/* Header (sticky & opaque) */}
          <div className="sticky top-0 left-0 w-full flex-shrink-0 p-6 md:p-8 flex items-start justify-between gap-4 bg-[#060b14] border-b border-white/5 z-20">
            <div className="flex-1 w-full max-w-5xl mx-auto">
              <button
                onClick={onClose}
                className="flex items-center gap-[8px] text-xs font-label tracking-widest uppercase mb-6 transition-colors hover:text-white"
                style={{ color: accentColor }}
              >
                <ArrowLeft size={14} /> <span>Back</span>
              </button>
              {tags && <div className="mb-4">{tags}</div>}
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 leading-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-text-muted font-body text-sm md:text-base">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 w-full max-w-5xl mx-auto p-6 md:p-8 font-body text-text-muted leading-relaxed"
               style={{ scrollbarWidth: 'thin', scrollbarColor: `${accentColor}40 transparent` }}>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-white/80 font-medium mb-6">{content}</p>
              <div className="w-16 h-1 mb-8" style={{ background: accentColor, opacity: 0.5 }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
