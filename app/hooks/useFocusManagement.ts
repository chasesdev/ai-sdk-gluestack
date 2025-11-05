import { useEffect, useRef, useCallback, useState } from 'react'
import { Platform } from 'react-native'

interface FocusableElement {
  id: string
  element: any
  index: number
}

interface FocusManagementOptions {
  enabled?: boolean
  restoreFocus?: boolean
  trapFocus?: boolean
  autoFocus?: boolean | string
}

interface FocusManagementReturn {
  focusedElement: string | null
  setFocus: (elementId: string) => void
  removeFocus: (elementId: string) => void
  focusProps: (elementId: string, index?: number) => {
    onFocus: (e: any) => void
    onBlur: (e: any) => void
    accessible: boolean
    accessibilityLabel?: string
    accessibilityHint?: string
    style?: any
  }
  trapFocusProps: {
    onKeyDown: (e: any) => void
  }
}

export function useFocusManagement(
  options: FocusManagementOptions = {}
): FocusManagementReturn {
  const {
    enabled = true,
    restoreFocus = true,
    trapFocus = false,
    autoFocus = false
  } = options

  const [focusedElement, setFocusedElement] = useState<string | null>(null)
  const focusableElementsRef = useRef<Map<string, FocusableElement>>(new Map())
  const previousFocusRef = useRef<string | null>(null)
  const containerRef = useRef<any>(null)

  const registerElement = useCallback((elementId: string, element: any, index: number = 0) => {
    if (!enabled) return

    focusableElementsRef.current.set(elementId, {
      id: elementId,
      element,
      index
    })
  }, [enabled])

  const unregisterElement = useCallback((elementId: string) => {
    focusableElementsRef.current.delete(elementId)
  }, [])

  const setFocus = useCallback((elementId: string) => {
    if (!enabled) return

    const focusableElement = focusableElementsRef.current.get(elementId)
    if (focusableElement?.element) {
      // Store previous focus for restoration
      if (focusedElement && focusedElement !== elementId) {
        previousFocusRef.current = focusedElement
      }

      setFocusedElement(elementId)

      // Actually focus the element (web only)
      if (Platform.OS === 'web' && focusableElement.element.focus) {
        focusableElement.element.focus()
      }
    }
  }, [enabled, focusedElement])

  const removeFocus = useCallback((elementId: string) => {
    if (focusedElement === elementId) {
      setFocusedElement(null)
    }
    unregisterElement(elementId)
  }, [focusedElement, unregisterElement])

  const handleFocus = useCallback((elementId: string) => (e: any) => {
    if (!enabled) return

    // Store previous focus for restoration
    if (focusedElement && focusedElement !== elementId) {
      previousFocusRef.current = focusedElement
    }

    setFocusedElement(elementId)
    registerElement(elementId, e.target, parseInt(e.target.dataset?.index || '0'))
  }, [enabled, focusedElement, registerElement])

  const handleBlur = useCallback((elementId: string) => () => {
    if (!enabled) return

    // Only clear focus if we're not trapping focus
    if (!trapFocus) {
      setTimeout(() => {
        if (focusedElement === elementId) {
          setFocusedElement(null)
        }
      }, 0)
    }
  }, [enabled, focusedElement, trapFocus])

  const handleKeyDown = useCallback((e: any) => {
    if (!enabled || !trapFocus || Platform.OS !== 'web') return

    const { key, shiftKey } = e
    const elements = Array.from(focusableElementsRef.current.values())
      .sort((a, b) => a.index - b.index)

    const currentIndex = elements.findIndex(el => el.id === focusedElement)

    switch (key) {
      case 'Tab':
        e.preventDefault()

        let nextIndex: number
        if (shiftKey) {
          // Shift+Tab - previous element
          nextIndex = currentIndex > 0 ? currentIndex - 1 : elements.length - 1
        } else {
          // Tab - next element
          nextIndex = currentIndex < elements.length - 1 ? currentIndex + 1 : 0
        }

        const nextElement = elements[nextIndex]
        if (nextElement) {
          setFocus(nextElement.id)
        }
        break

      case 'Escape':
        // Restore previous focus if available
        if (previousFocusRef.current && restoreFocus) {
          setFocus(previousFocusRef.current)
        }
        break
    }
  }, [enabled, trapFocus, focusedElement, setFocus, restoreFocus])

  // Auto-focus functionality
  useEffect(() => {
    if (enabled && autoFocus) {
      if (typeof autoFocus === 'string') {
        // Focus specific element by ID
        setTimeout(() => setFocus(autoFocus), 100)
      } else if (autoFocus === true) {
        // Focus first focusable element
        const elements = Array.from(focusableElementsRef.current.values())
          .sort((a, b) => a.index - b.index)

        if (elements.length > 0) {
          setTimeout(() => setFocus(elements[0].id), 100)
        }
      }
    }
  }, [enabled, autoFocus, setFocus])

  // Focus trap cleanup
  useEffect(() => {
    return () => {
      focusableElementsRef.current.clear()
    }
  }, [])

  const focusProps = useCallback((elementId: string, index: number = 0) => {
    return {
      onFocus: handleFocus(elementId),
      onBlur: handleBlur(elementId),
      accessible: true,
      accessibilityLabel: elementId,
      accessibilityHint: focusedElement === elementId ? 'Currently focused' : undefined,
      style: Platform.OS === 'web' ? {
        outline: focusedElement === elementId ? '2px solid #007AFF' : 'none',
        outlineOffset: 2
      } : undefined
    }
  }, [handleFocus, handleBlur, focusedElement])

  const trapFocusProps = {
    onKeyDown: handleKeyDown
  }

  return {
    focusedElement,
    setFocus,
    removeFocus,
    focusProps,
    trapFocusProps
  }
}

// Focus ring styles for web
export const focusRingStyles = {
  base: {
    outline: '2px solid #007AFF',
    outlineOffset: 2,
    borderRadius: 4
  },
  highContrast: {
    outline: '3px solid #FFFFFF',
    outlineOffset: 2,
    borderRadius: 4,
    boxShadow: '0 0 0 2px #000000'
  },
  none: {
    outline: 'none'
  }
}

// Utility function to generate unique focus IDs
export function generateFocusId(prefix: string = 'focusable'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}