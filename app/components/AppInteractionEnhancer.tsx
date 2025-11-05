import React, { createContext, useContext, useCallback } from 'react'
import { Platform } from 'react-native'
import { KeyboardShortcutsProvider } from './KeyboardShortcutsProvider'
import { useKeyboardShortcuts, commonShortcuts } from '../hooks/useKeyboardShortcuts'
import { useFocusManagement } from '../hooks/useFocusManagement'

interface AppInteractionEnhancerContextType {
  // Navigation
  openSearch: () => void
  closeModals: () => void

  // Theme
  toggleTheme: () => void

  // Accessibility
  announceToScreenReader: (message: string) => void

  // Focus management
  focusNextElement: () => void
  focusPreviousElement: () => void
  setFocus: (elementId: string) => void

  // Help
  showKeyboardShortcuts: () => void
}

const AppInteractionEnhancerContext = createContext<AppInteractionEnhancerContextType | null>(null)

interface AppInteractionEnhancerProps {
  children: React.ReactNode
  onOpenSearch?: () => void
  onCloseModals?: () => void
  onToggleTheme?: () => void
  onShowKeyboardShortcuts?: () => void
}

export function AppInteractionEnhancer({
  children,
  onOpenSearch,
  onCloseModals,
  onToggleTheme,
  onShowKeyboardShortcuts,
}: AppInteractionEnhancerProps) {
  const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts()
  const { setFocus, focusedElement } = useFocusManagement({
    enabled: Platform.OS === 'web'
  })

  // Screen reader announcements
  const announceToScreenReader = useCallback((message: string) => {
    if (Platform.OS === 'web') {
      // Create a live region for announcements
      const announcement = document.createElement('div')
      announcement.setAttribute('aria-live', 'polite')
      announcement.setAttribute('aria-atomic', 'true')
      announcement.style.position = 'absolute'
      announcement.style.left = '-10000px'
      announcement.style.width = '1px'
      announcement.style.height = '1px'
      announcement.style.overflow = 'hidden'
      announcement.textContent = message

      document.body.appendChild(announcement)

      // Remove after announcement
      setTimeout(() => {
        document.body.removeChild(announcement)
      }, 1000)
    }
  }, [])

  const openSearch = useCallback(() => {
    onOpenSearch?.()
    announceToScreenReader('Search opened')
  }, [onOpenSearch, announceToScreenReader])

  const closeModals = useCallback(() => {
    onCloseModals?.()
    announceToScreenReader('Modal closed')
  }, [onCloseModals, announceToScreenReader])

  const toggleTheme = useCallback(() => {
    onToggleTheme?.()
    announceToScreenReader('Theme toggled')
  }, [onToggleTheme, announceToScreenReader])

  const focusNextElement = useCallback(() => {
    // This would integrate with focusable elements in the app
    announceToScreenReader('Next element focused')
  }, [announceToScreenReader])

  const focusPreviousElement = useCallback(() => {
    // This would integrate with focusable elements in the app
    announceToScreenReader('Previous element focused')
  }, [announceToScreenReader])

  const showKeyboardShortcuts = useCallback(() => {
    onShowKeyboardShortcuts?.()
    announceToScreenReader('Keyboard shortcuts help opened')
  }, [onShowKeyboardShortcuts, announceToScreenReader])

  // Register global keyboard shortcuts
  React.useEffect(() => {
    if (Platform.OS === 'web') {
      // Help shortcut (Ctrl/Cmd + ?)
      registerShortcut({
        key: '?',
        ctrlKey: true,
        metaKey: true,
        action: showKeyboardShortcuts,
        description: 'Show keyboard shortcuts'
      })

      // Accessibility shortcuts
      registerShortcut({
        key: ';',
        ctrlKey: true,
        metaKey: true,
        action: () => announceToScreenReader('Screen reader announcement test'),
        description: 'Test screen reader'
      })

      return () => {
        unregisterShortcut('?', { ctrlKey: true, metaKey: true })
        unregisterShortcut(';', { ctrlKey: true, metaKey: true })
      }
    }
  }, [registerShortcut, unregisterShortcut, showKeyboardShortcuts, announceToScreenReader])

  const contextValue: AppInteractionEnhancerContextType = {
    openSearch,
    closeModals,
    toggleTheme,
    announceToScreenReader,
    focusNextElement,
    focusPreviousElement,
    setFocus,
    showKeyboardShortcuts,
  }

  return (
    <KeyboardShortcutsProvider
      onOpenSearch={openSearch}
      onCloseModals={closeModals}
      onToggleTheme={toggleTheme}
      onGoToNextSection={focusNextElement}
      onGoToPrevSection={focusPreviousElement}
    >
      <AppInteractionEnhancerContext.Provider value={contextValue}>
        {children}
      </AppInteractionEnhancerContext.Provider>
    </KeyboardShortcutsProvider>
  )
}

export function useAppInteractionEnhancer() {
  const context = useContext(AppInteractionEnhancerContext)
  if (!context) {
    throw new Error('useAppInteractionEnhancer must be used within an AppInteractionEnhancer')
  }
  return context
}

// Keyboard shortcuts help component
export function KeyboardShortcutsHelp() {
  const shortcuts = [
    { key: 'Ctrl/Cmd + K', description: 'Open search' },
    { key: 'Ctrl/Cmd + Enter', description: 'Send message' },
    { key: 'Escape', description: 'Close modal/dialog' },
    { key: 'Tab / Shift+Tab', description: 'Navigate between elements' },
    { key: 'Arrow Keys', description: 'Navigate lists and menus' },
    { key: 'Enter / Space', description: 'Activate focused item' },
    { key: 'Ctrl/Cmd + ?', description: 'Show this help' },
    { key: 'Ctrl/Cmd + ;', description: 'Test screen reader' },
  ]

  return (
    <VStack space="md">
      <Text size="lg" fontWeight="bold">Keyboard Shortcuts</Text>
      {shortcuts.map((shortcut, index) => (
        <HStack key={index} space="sm">
          <Text size="sm" fontWeight="$semibold" minWidth={120}>
            {shortcut.key}
          </Text>
          <Text size="sm">{shortcut.description}</Text>
        </HStack>
      ))}
    </VStack>
  )
}