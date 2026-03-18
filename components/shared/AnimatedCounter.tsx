'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface AnimatedCounterProps {
  target: string
  duration?: number
}

export function AnimatedCounter({ target, duration = 2000 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [displayValue, setDisplayValue] = useState('0')

  useEffect(() => {
    if (!isInView) return

    const match = target.match(/^([\d.]+)(.*)$/)
    if (!match) {
      setDisplayValue(target)
      return
    }

    const numericTarget = parseFloat(match[1])
    const suffix = match[2]
    const isFloat = match[1].includes('.')
    const startTime = performance.now()

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = numericTarget * eased

      setDisplayValue(
        (isFloat ? current.toFixed(1) : Math.floor(current).toString()) + suffix
      )

      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [isInView, target, duration])

  return <span ref={ref}>{displayValue}</span>
}
