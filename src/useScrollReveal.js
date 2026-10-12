import { useEffect, useRef, useState } from 'react'

export default function useScrollReveal() {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(() => (
    typeof document === 'undefined'
    || document.visibilityState !== 'visible'
    || typeof window === 'undefined'
    || !('IntersectionObserver' in window)
  ))

  useEffect(() => {
    const element = ref.current
    if (!element || isVisible) return
    element.classList.add('is-pending')

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return

      setIsVisible(true)
      observer.unobserve(element)
    }, { threshold: 0.15 })

    observer.observe(element)
    return () => observer.disconnect()
  }, [isVisible])

  return { ref, isVisible }
}
