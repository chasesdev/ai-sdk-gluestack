import React, { useState } from 'react'
import { View, Pressable } from 'react-native'
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
  Icon,
  SunIcon,
  MoonIcon,
  SettingsIcon,
} from '@gluestack-ui/themed'
import { useTheme, ThemeMode } from '../contexts/ThemeContext'
import { THEME_COLORS, getThemeColors } from '../constants/theme'

const ACCENT_COLOR = THEME_COLORS.light.accent

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [showActionsheet, setShowActionsheet] = useState(false)
  const colors = getThemeColors(resolvedTheme === 'dark')
  const { text: textColor } = colors

  const handleClose = () => setShowActionsheet(false)

  const selectTheme = (selectedTheme: ThemeMode) => {
    setTheme(selectedTheme)
    handleClose()
  }

  const getCurrentIcon = () => {
    switch (theme) {
      case 'light':
        return SunIcon
      case 'dark':
        return MoonIcon
      case 'system':
        return SettingsIcon
    }
  }

  const CurrentIcon = getCurrentIcon()

  return (
    <>
      {/* Floating Action Button */}
      <Pressable
        onPress={() => setShowActionsheet(true)}
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 9999,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          backgroundColor: ACCENT_COLOR,
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8,
        }}
        accessibilityRole="button"
        accessibilityLabel={`Change theme. Current theme: ${theme}`}
        accessibilityHint="Opens theme selection menu"
      >
        <Icon as={CurrentIcon} size="xl" style={{ color: colors.background }} />
      </Pressable>

      {/* Theme Selection Actionsheet */}
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent style={{ backgroundColor: colors.background }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>

          <View style={{ width: '100%', paddingHorizontal: 16, paddingVertical: 8 }}>
            <ActionsheetItem
              onPress={() => selectTheme('light')}
              accessibilityRole="button"
              accessibilityLabel="Light theme"
              accessibilityState={{ selected: theme === 'light' }}
            >
              <Icon
                as={SunIcon}
                size="lg"
                style={{ marginRight: 12, color: textColor }}
              />
              <ActionsheetItemText style={{ color: textColor }}>
                Light
              </ActionsheetItemText>
              {theme === 'light' && (
                <View
                  style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: 9999, backgroundColor: ACCENT_COLOR }}
                />
              )}
            </ActionsheetItem>

            <ActionsheetItem
              onPress={() => selectTheme('dark')}
              accessibilityRole="button"
              accessibilityLabel="Dark theme"
              accessibilityState={{ selected: theme === 'dark' }}
            >
              <Icon
                as={MoonIcon}
                size="lg"
                style={{ marginRight: 12, color: textColor }}
              />
              <ActionsheetItemText style={{ color: textColor }}>
                Dark
              </ActionsheetItemText>
              {theme === 'dark' && (
                <View
                  style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: 9999, backgroundColor: ACCENT_COLOR }}
                />
              )}
            </ActionsheetItem>

            <ActionsheetItem
              onPress={() => selectTheme('system')}
              accessibilityRole="button"
              accessibilityLabel="System theme"
              accessibilityState={{ selected: theme === 'system' }}
            >
              <Icon
                as={SettingsIcon}
                size="lg"
                style={{ marginRight: 12, color: textColor }}
              />
              <ActionsheetItemText style={{ color: textColor }}>
                System
              </ActionsheetItemText>
              {theme === 'system' && (
                <View
                  style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: 9999, backgroundColor: ACCENT_COLOR }}
                />
              )}
            </ActionsheetItem>
          </View>
        </ActionsheetContent>
      </Actionsheet>
    </>
  )
}
