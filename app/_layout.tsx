import React from 'react'
import { GluestackUIProvider } from '@gluestack-ui/themed'
import { config } from '../gluestack-ui.config'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { View, Platform } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider, useTheme } from '../contexts/ThemeContext'
import { getThemeColors } from '../constants/theme'

// Fix for Reanimated on web
if (typeof window !== 'undefined') {
  // @ts-ignore
  window._frameTimestamp = null
}

function RootLayoutContent() {
  const { resolvedTheme } = useTheme()

  // Apply dark class to document in web using useLayoutEffect (runs synchronously before paint)
  React.useLayoutEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      if (resolvedTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [resolvedTheme])

  const colors = getThemeColors(resolvedTheme === 'dark')
  const backgroundColor = colors.background

  return (
    <SafeAreaProvider>
      <View
        style={{
          flex: 1,
          backgroundColor: backgroundColor,
          // Ensure full coverage on web and Android
          minHeight: '100%',
          width: '100%',
        }}
      >
        <GluestackUIProvider config={config} colorMode={resolvedTheme}>
          <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: backgroundColor,
                flex: 1,
              },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="components" />
          </Stack>
        </GluestackUIProvider>
      </View>
    </SafeAreaProvider>
  )
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  )
}
