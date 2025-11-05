import { useEffect, useCallback, useRef } from 'react'
import { Platform } from 'react-native'

interface MouseWheelZoomOptions {
  enabled?: boolean
  minScale?: number
  maxScale?: number
  zoomSpeed?: number
  onZoomChange?: (scale: number) => void
}

export function useMouseWheelZoom(
  containerRef: any,
  options: MouseWheelZoomOptions = {}
) {
  const {
    enabled = true,
    minScale = 0.5,
    maxScale = 3,
    zoomSpeed = 0.001,
    onZoomChange
  } = options

  const scaleRef = useRef(1)
  const isZoomingRef = useRef(false)

  const handleWheel = useCallback((event: any) => {
    if (!enabled || Platform.OS !== 'web' || !containerRef.current) return

    event.preventDefault()

    // Get the container element
    const container = containerRef.current

    // Calculate zoom delta
    const delta = (event.deltaY || 0) * -zoomSpeed

    // Calculate new scale
    const newScale = Math.min(Math.max(scaleRef.current + delta, minScale), maxScale)

    // Update scale if it changed
    if (newScale !== scaleRef.current) {
      scaleRef.current = newScale
      onZoomChange?.(newScale)
    }
  }, [enabled, minScale, maxScale, zoomSpeed, onZoomChange, containerRef])

  useEffect(() => {
    if (Platform.OS === 'web' && enabled && containerRef.current) {
      const container = containerRef.current

      // Add wheel event listener
      container.addEventListener('wheel', handleWheel, { passive: false })

      // Cleanup
      return () => {
        container.removeEventListener('wheel', handleWheel)
      }
    }
  }, [Platform.OS, enabled, handleWheel, containerRef])

  const setScale = useCallback((scale: number) => {
    scaleRef.current = Math.min(Math.max(scale, minScale), maxScale)
    onZoomChange?.(scaleRef.current)
  }, [minScale, maxScale, onZoomChange])

  const getScale = useCallback(() => scaleRef.current, [])

  return {
    setScale,
    getScale,
    isZooming: isZoomingRef.current
  }
}

// Hook for pinch-to-zoom on mobile devices
export function usePinchZoom(
  options: {
    minScale?: number
    maxScale?: number
    onZoomChange?: (scale: number) => void
  } = {}
) {
  const {
    minScale = 0.5,
    maxScale = 3,
    onZoomChange
  } = options

  const scale = useRef(1)

  const setScale = useCallback((newScale: number) => {
    const clampedScale = Math.min(Math.max(newScale, minScale), maxScale)
    scale.current = clampedScale
    onZoomChange?.(clampedScale)
  }, [minScale, maxScale, onZoomChange])

  const getScale = useCallback(() => scale.current, [])

  return {
    setScale,
    getScale,
    scale: scale.current
  }
}