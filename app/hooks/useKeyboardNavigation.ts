import { useEffect, useRef, useCallback, useState } from 'react'
import { Platform } from 'react-native'

interface KeyboardNavigationOptions {
  enabled?: boolean
  loop?: boolean
  wrapHorizontally?: boolean
}

interface KeyboardNavigationReturn {
  focusProps: {
    onKeyDown: (e: any) => void
    onFocus: (e: any) => void
    onBlur: (e: any) => void
  }
  focusedIndex: number
  setFocusedIndex: (index: number) => void
}

export function useKeyboardNavigation(
  items: Array<any>,
  options: KeyboardNavigationOptions = {}
): KeyboardNavigationReturn {
  const {
    enabled = true,
    loop = true,
    wrapHorizontally = false
  } = options

  const focusedIndexRef = useRef(0)
  const [focusedIndex, setFocusedIndex] = useState(0)

  const handleKeyDown = useCallback((e: any) => {
    if (!enabled || Platform.OS !== 'web') return

    const { key } = e

    switch (key) {
      case 'Tab':
        e.preventDefault()

        if (e.shiftKey) {
          // Shift+Tab - navigate backwards
          const newIndex = focusedIndexRef.current - 1
          if (loop) {
            focusedIndexRef.current = newIndex < 0 ? items.length - 1 : newIndex
          } else {
            focusedIndexRef.current = Math.max(0, newIndex)
          }
        } else {
          // Tab - navigate forwards
          const newIndex = focusedIndexRef.current + 1
          if (loop) {
            focusedIndexRef.current = newIndex >= items.length ? 0 : newIndex
          } else {
            focusedIndexRef.current = Math.min(items.length - 1, newIndex)
          }
        }

        setFocusedIndex(focusedIndexRef.current)
        break

      case 'ArrowRight':
        if (wrapHorizontally && !e.shiftKey) {
          e.preventDefault()
          const newIndex = focusedIndexRef.current + 1
          if (loop) {
            focusedIndexRef.current = newIndex >= items.length ? 0 : newIndex
          } else {
            focusedIndexRef.current = Math.min(items.length - 1, newIndex)
          }
          setFocusedIndex(focusedIndexRef.current)
        }
        break

      case 'ArrowLeft':
        if (wrapHorizontally && !e.shiftKey) {
          e.preventDefault()
          const newIndex = focusedIndexRef.current - 1
          if (loop) {
            focusedIndexRef.current = newIndex < 0 ? items.length - 1 : newIndex
          } else {
            focusedIndexRef.current = Math.max(0, newIndex)
          }
          setFocusedIndex(focusedIndexRef.current)
        }
        break

      case 'ArrowDown':
        if (!wrapHorizontally && !e.shiftKey) {
          e.preventDefault()
          const newIndex = focusedIndexRef.current + 1
          if (loop) {
            focusedIndexRef.current = newIndex >= items.length ? 0 : newIndex
          } else {
            focusedIndexRef.current = Math.min(items.length - 1, newIndex)
          }
          setFocusedIndex(focusedIndexRef.current)
        }
        break

      case 'ArrowUp':
        if (!wrapHorizontally && !e.shiftKey) {
          e.preventDefault()
          const newIndex = focusedIndexRef.current - 1
          if (loop) {
            focusedIndexRef.current = newIndex < 0 ? items.length - 1 : newIndex
          } else {
            focusedIndexRef.current = Math.max(0, newIndex)
          }
          setFocusedIndex(focusedIndexRef.current)
        }
        break

      case 'Enter':
      case ' ':
        // Activate the currently focused item
        const focusedItem = items[focusedIndexRef.current]
        if (focusedItem && focusedItem.onPress) {
          e.preventDefault()
          focusedItem.onPress()
        }
        break
    }
  }, [enabled, items, loop, wrapHorizontally])

  const handleFocus = useCallback((e: any) => {
    // Update focused index when an item receives focus
    const targetIndex = parseInt(e.target.dataset?.index || '0')
    if (!isNaN(targetIndex)) {
      focusedIndexRef.current = targetIndex
      setFocusedIndex(targetIndex)
    }
  }, [])

  const handleBlur = useCallback(() => {
    // Clear focus when item loses focus
    // Can be used for additional cleanup if needed
  }, [])

  // Update focused index when controlled externally
  useEffect(() => {
    focusedIndexRef.current = focusedIndex
  }, [focusedIndex])

  const focusProps = {
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
    onBlur: handleBlur
  }

  return {
    focusProps,
    focusedIndex,
    setFocusedIndex
  }
}