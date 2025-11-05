import React, { createContext, useContext, useEffect, useCallback } from 'react'
import { Platform } from 'react-native'
import { useKeyboardShortcuts, commonShortcuts } from '../hooks/useKeyboardShortcuts'

interface KeyboardShortcutsContextType {
  // Global actions
  openSearch: () => void
  closeModals: () => void
  sendMessage: () => void
  toggleTheme: () => void

  // Navigation actions
  goToNextSection: () => void
  goToPrevSection: () => void

  // List actions
  selectNextItem: () => void
  selectPrevItem: () => void
  selectCurrentItem: () => void

  // Register custom shortcuts
  registerShortcut: (shortcut: any) => void
  unregisterShortcut: (key: string, modifiers?: any) => void
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | null>(null)

interface KeyboardShortcutsProviderProps {
  children: React.ReactNode
  onOpenSearch?: () => void
  onCloseModals?: () => void
  onSendMessage?: () => void
  onToggleTheme?: () => void
  onGoToNextSection?: () => void
  onGoToPrevSection?: () => void
}

export function KeyboardShortcutsProvider({
  children,
  onOpenSearch,
  onCloseModals,
  onSendMessage,
  onToggleTheme,
  onGoToNextSection,
  onGoToPrevSection
}: KeyboardShortcutsProviderProps) {
  const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts({
    enabled: true,
    preventDefault: true
  })

  // Global shortcuts
  const openSearch = useCallback(() => {
    onOpenSearch?.()
  }, [onOpenSearch])

  const closeModals = useCallback(() => {
    onCloseModals?.()
  }, [onCloseModals])

  const sendMessage = useCallback(() => {
    onSendMessage?.()
  }, [onSendMessage])

  const toggleTheme = useCallback(() => {
    onToggleTheme?.()
  }, [onToggleTheme])

  const goToNextSection = useCallback(() => {
    onGoToNextSection?.()
  }, [onGoToNextSection])

  const goToPrevSection = useCallback(() => {
    onGoToPrevSection?.()
  }, [onGoToPrevSection])

  // Register global shortcuts
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Search shortcut (Ctrl/Cmd + K)
      registerShortcut({
        ...commonShortcuts.search,
        action: openSearch,
        enabled: !!onOpenSearch
      })

      // Send message shortcut (Ctrl/Cmd + Enter)
      registerShortcut({
        ...commonShortcuts.send,
        action: sendMessage,
        enabled: !!onSendMessage
      })

      // Escape to close modals
      registerShortcut({
        ...commonShortcuts.escape,
        action: closeModals,
        enabled: !!onCloseModals
      })

      // Theme toggle (Ctrl/Cmd + Shift + T)
      registerShortcut({
        key: 't',
        ctrlKey: true,
        metaKey: true,
        shiftKey: true,
        action: toggleTheme,
        enabled: !!onToggleTheme
      })

      // Navigation shortcuts
      registerShortcut({
        key: 'ArrowDown',
        action: goToNextSection,
        enabled: !!onGoToNextSection
      })

      registerShortcut({
        key: 'ArrowUp',
        action: goToPrevSection,
        enabled: !!onGoToPrevSection
      })
    }
  }, [
    registerShortcut,
    openSearch,
    sendMessage,
    closeModals,
    toggleTheme,
    goToNextSection,
    goToPrevSection,
    onOpenSearch,
    onSendMessage,
    onCloseModals,
    onToggleTheme,
    onGoToNextSection,
    onGoToPrevSection
  ])

  const contextValue: KeyboardShortcutsContextType = {
    openSearch,
    closeModals,
    sendMessage,
    toggleTheme,
    goToNextSection,
    goToPrevSection,
    selectNextItem: () => {}, // These would be context-specific
    selectPrevItem: () => {},
    selectCurrentItem: () => {},
    registerShortcut,
    unregisterShortcut
  }

  return (
    <KeyboardShortcutsContext.Provider value={contextValue}>
      {children}
    </KeyboardShortcutsContext.Provider>
  )
}

export function useKeyboardShortcutsContext() {
  const context = useContext(KeyboardShortcutsContext)
  if (!context) {
    throw new Error('useKeyboardShortcutsContext must be used within a KeyboardShortcutsProvider')
  }
  return context
}

// Hook for component-specific shortcuts
export function useComponentKeyboardShortcuts(
  componentId: string,
  shortcuts: Array<{
    key: string
    ctrlKey?: boolean
    metaKey?: boolean
    shiftKey?: boolean
    altKey?: boolean
    action: () => void
    enabled?: boolean
  }>
) {
  const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts()

  useEffect(() => {
    if (Platform.OS === 'web') {
      shortcuts.forEach((shortcut, index) => {
        registerShortcut({
          ...shortcut,
          action: shortcut.action
        })
      })

      // Cleanup function
      return () => {
        shortcuts.forEach((shortcut) => {
          unregisterShortcut(shortcut.key, {
            ctrlKey: shortcut.ctrlKey,
            metaKey: shortcut.metaKey,
            shiftKey: shortcut.shiftKey,
            altKey: shortcut.altKey
          })
        })
      }
    }
  }, [componentId, shortcuts, registerShortcut, unregisterShortcut])
}