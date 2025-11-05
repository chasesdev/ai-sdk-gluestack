import { useEffect, useCallback, useRef } from 'react'
import { Platform } from 'react-native'

interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  action: () => void
  description?: string
  enabled?: boolean
}

interface KeyboardShortcutsOptions {
  enabled?: boolean
  preventDefault?: boolean
}

interface KeyboardShortcutsReturn {
  registerShortcut: (shortcut: KeyboardShortcut) => void
  unregisterShortcut: (key: string, modifiers?: Partial<KeyboardShortcut>) => void
  isShortcutPressed: (key: string, modifiers?: Partial<KeyboardShortcut>) => boolean
}

export function useKeyboardShortcuts(
  options: KeyboardShortcutsOptions = {}
): KeyboardShortcutsReturn {
  const { enabled = true, preventDefault = true } = options
  const shortcutsRef = useRef<Map<string, KeyboardShortcut>>(new Map())

  const getShortcutKey = useCallback((shortcut: KeyboardShortcut): string => {
    const parts = []
    if (shortcut.ctrlKey) parts.push('ctrl')
    if (shortcut.metaKey) parts.push('meta')
    if (shortcut.shiftKey) parts.push('shift')
    if (shortcut.altKey) parts.push('alt')
    parts.push(shortcut.key.toLowerCase())
    return parts.join('+')
  }, [])

  const registerShortcut = useCallback((shortcut: KeyboardShortcut) => {
    if (!enabled) return

    const key = getShortcutKey(shortcut)
    shortcutsRef.current.set(key, {
      ...shortcut,
      enabled: shortcut.enabled !== false
    })
  }, [enabled, getShortcutKey])

  const unregisterShortcut = useCallback((
    key: string,
    modifiers: Partial<KeyboardShortcut> = {}
  ) => {
    const shortcutKey = getShortcutKey({ key, ...modifiers } as KeyboardShortcut)
    shortcutsRef.current.delete(shortcutKey)
  }, [getShortcutKey])

  const isShortcutPressed = useCallback((
    key: string,
    modifiers: Partial<KeyboardShortcut> = {}
  ): boolean => {
    const shortcutKey = getShortcutKey({ key, ...modifiers } as KeyboardShortcut)
    return shortcutsRef.current.has(shortcutKey)
  }, [getShortcutKey])

  const handleKeyDown = useCallback((event: any) => {
    if (!enabled || Platform.OS !== 'web') return

    const { key, ctrlKey, metaKey, shiftKey, altKey } = event

    // Create the shortcut key for current key combination
    const currentShortcut = getShortcutKey({
      key,
      ctrlKey,
      metaKey,
      shiftKey,
      altKey
    })

    const shortcut = shortcutsRef.current.get(currentShortcut)

    if (shortcut && shortcut.enabled !== false) {
      if (preventDefault) {
        event.preventDefault()
      }
      shortcut.action()
    }
  }, [enabled, preventDefault, getShortcutKey])

  // Add global keyboard event listener
  useEffect(() => {
    if (Platform.OS === 'web' && enabled) {
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [enabled, handleKeyDown])

  return {
    registerShortcut,
    unregisterShortcut,
    isShortcutPressed
  }
}

// Predefined common shortcuts
export const commonShortcuts = {
  // Navigation shortcuts
  search: {
    key: 'k',
    ctrlKey: true,
    metaKey: true, // Cmd on Mac
    description: 'Open search'
  },

  // Action shortcuts
  send: {
    key: 'Enter',
    ctrlKey: true,
    metaKey: true,
    description: 'Send message'
  },

  // Modal/dialog shortcuts
  escape: {
    key: 'Escape',
    description: 'Close modal/dialog'
  },

  // Tab navigation
  nextTab: {
    key: 'Tab',
    description: 'Next focusable element'
  },

  prevTab: {
    key: 'Tab',
    shiftKey: true,
    description: 'Previous focusable element'
  },

  // List navigation
  nextItem: {
    key: 'ArrowDown',
    description: 'Next item in list'
  },

  prevItem: {
    key: 'ArrowUp',
    description: 'Previous item in list'
  },

  // Action shortcuts
  select: {
    key: 'Enter',
    description: 'Select focused item'
  },

  space: {
    key: ' ',
    description: 'Activate focused item'
  },

  // File operations
  copy: {
    key: 'c',
    ctrlKey: true,
    metaKey: true,
    description: 'Copy'
  },

  paste: {
    key: 'v',
    ctrlKey: true,
    metaKey: true,
    description: 'Paste'
  },

  // Undo/redo
  undo: {
    key: 'z',
    ctrlKey: true,
    metaKey: true,
    description: 'Undo'
  },

  redo: {
    key: 'y',
    ctrlKey: true,
    metaKey: true,
    description: 'Redo'
  },

  // Find
  find: {
    key: 'f',
    ctrlKey: true,
    metaKey: true,
    description: 'Find'
  },

  // Select all
  selectAll: {
    key: 'a',
    ctrlKey: true,
    metaKey: true,
    description: 'Select all'
  }
} as const