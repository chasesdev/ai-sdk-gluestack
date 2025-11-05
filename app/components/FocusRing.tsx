import React from 'react'
import { Platform, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated'
import { useTheme } from '../../contexts/ThemeContext'
import { getThemeColors } from '../../constants/theme'

interface FocusRingProps {
  children: React.ReactNode
  visible: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: string
  offset?: number
}

export function FocusRing({
  children,
  visible,
  size = 'md',
  color,
  offset = 2,
}: FocusRingProps) {
  const { resolvedTheme } = useTheme()
  const themeColors = getThemeColors(resolvedTheme === 'dark')
  const focusScale = useSharedValue(visible ? 1 : 0)
  const focusOpacity = useSharedValue(visible ? 1 : 0)

  const sizeConfig = {
    sm: { width: 2, radius: 4 },
    md: { width: 2, radius: 6 },
    lg: { width: 3, radius: 8 },
  }

  const config = sizeConfig[size]

  React.useEffect(() => {
    focusScale.value = withSpring(visible ? 1 : 0, {
      damping: 20,
      stiffness: 300,
    })
    focusOpacity.value = withSpring(visible ? 1 : 0, {
      damping: 20,
      stiffness: 300,
    })
  }, [visible, focusScale, focusOpacity])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderWidth: config.width,
      borderRadius: config.radius,
      borderColor: color || themeColors.accent,
      margin: offset,
      opacity: focusOpacity.value,
      transform: [{ scale: focusScale.value }],
    }
  })

  if (Platform.OS !== 'web') {
    return <>{children}</>
  }

  return (
    <Animated.View style={[styles.focusRing, animatedStyle]}>
      {children}
    </Animated.View>
  )
}

// Hook to add focus ring to any component
export function useFocusRing(focused: boolean, options?: Partial<FocusRingProps>) {
  return {
    FocusRing: (props: Omit<FocusRingProps, 'visible'>) => (
      <FocusRing {...props} visible={focused} {...options} />
    ),
    focusRingStyle: focused
      ? {
          outlineWidth: 2,
          outlineColor: options?.color || '#007AFF',
          outlineOffset: options?.offset || 2,
          outlineStyle: 'solid',
        }
      : {},
  }
}

const styles = StyleSheet.create({
  focusRing: {
    position: 'relative',
    pointerEvents: 'none',
  },
})

// Skip link component for accessibility
export function SkipLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (Platform.OS !== 'web') return null

  return (
    <a
      href={href}
      style={{
        position: 'absolute',
        top: '-40px',
        left: '6px',
        background: '#007AFF',
        color: 'white',
        padding: '8px',
        textDecoration: 'none',
        borderRadius: '4px',
        zIndex: 9999,
        fontSize: '14px',
        fontWeight: 'bold',
      }}
      onFocus={(e) => {
        e.target.style.top = '6px'
      }}
      onBlur={(e) => {
        e.target.style.top = '-40px'
      }}
    >
      {children}
    </a>
  )
}

// Live region for screen reader announcements
export function LiveRegion() {
  const [announcement, setAnnouncement] = React.useState('')

  React.useEffect(() => {
    // Expose a global function to make announcements
    (global as any).announce = (message: string) => {
      setAnnouncement(message)
      setTimeout(() => setAnnouncement(''), 1000)
    }
  }, [])

  if (Platform.OS !== 'web') return null

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
    >
      {announcement}
    </div>
  )
}