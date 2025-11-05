import { useCallback, useRef } from 'react'
import { Platform } from 'react-native'
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  GestureUpdateEvent,
  TapGestureHandlerProps,
  PanGestureHandlerProps,
  LongPressGestureHandlerProps,
  PinchGestureHandlerProps
} from 'react-native-gesture-handler'
import {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
  withSpring,
  withTiming,
  interpolate
} from 'react-native-reanimated'

interface TouchGestureOptions {
  enabled?: boolean
  hapticFeedback?: boolean
  threshold?: number
  debounceMs?: number
}

interface SwipeGestureOptions extends TouchGestureOptions {
  direction?: 'horizontal' | 'vertical' | 'any'
  minDistance?: number
  maxAngle?: number
}

interface SwipeGestureHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}

interface LongPressGestureOptions extends TouchGestureOptions {
  minDuration?: number
  maxDistance?: number
}

interface LongPressGestureHandlers {
  onLongPress?: () => void
  onLongPressStart?: () => void
  onLongPressEnd?: () => void
}

interface TapGestureOptions extends TouchGestureOptions {
  numberOfTaps?: number
  maxDuration?: number
  maxDelay?: number
  maxDist?: number
}

interface TapGestureHandlers {
  onTap?: () => void
  onDoubleTap?: () => void
  onTapStart?: () => void
  onTapEnd?: () => void
}

// Haptic feedback utility
const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') => {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    try {
      // For React Native's built-in haptics
      if (Platform.OS === 'ios') {
        // iOS haptic feedback would go here
        // This would require react-native-haptic-feedback or expo-haptics
      } else {
        // Android vibration feedback would go here
      }
    } catch (error) {
      // Fail silently if haptics aren't available
    }
  }
}

// Swipe gestures hook
export function useSwipeGestures(
  handlers: SwipeGestureHandlers,
  options: SwipeGestureOptions = {}
) {
  const {
    enabled = true,
    hapticFeedback = true,
    direction = 'horizontal',
    minDistance = 50,
    maxAngle = 45
  } = options

  const startX = useSharedValue(0)
  const startY = useSharedValue(0)

  const handleSwipe = useCallback((gestureState: any) => {
    const { translationX, translationY } = gestureState
    const distance = Math.sqrt(translationX ** 2 + translationY ** 2)

    if (distance < minDistance) return

    const angle = Math.atan2(translationY, translationX) * (180 / Math.PI)
    const normalizedAngle = ((angle % 360) + 360) % 360

    if (hapticFeedback) {
      triggerHaptic('light')
    }

    if (direction === 'horizontal' || direction === 'any') {
      if (normalizedAngle < maxAngle || normalizedAngle > 360 - maxAngle) {
        // Swipe right
        handlers.onSwipeRight?.()
      } else if (normalizedAngle > 180 - maxAngle && normalizedAngle < 180 + maxAngle) {
        // Swipe left
        handlers.onSwipeLeft?.()
      }
    }

    if (direction === 'vertical' || direction === 'any') {
      if (normalizedAngle > 90 - maxAngle && normalizedAngle < 90 + maxAngle) {
        // Swipe down
        handlers.onSwipeDown?.()
      } else if (normalizedAngle > 270 - maxAngle && normalizedAngle < 270 + maxAngle) {
        // Swipe up
        handlers.onSwipeUp?.()
      }
    }
  }, [handlers, minDistance, maxAngle, direction, hapticFeedback])

  const panGesture = Gesture.Pan()
    .enabled(enabled)
    .onBegin((event) => {
      startX.value = event.x
      startY.value = event.y
    })
    .onEnd((event, success) => {
      if (success) {
        runOnJS(handleSwipe)(event)
      }
    })

  return panGesture
}

// Long press gestures hook
export function useLongPressGesture(
  handlers: LongPressGestureHandlers,
  options: LongPressGestureOptions = {}
) {
  const {
    enabled = true,
    hapticFeedback = true,
    minDuration = 500,
    maxDistance = 10
  } = options

  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    }
  })

  const longPressGesture = Gesture.LongPress()
    .enabled(enabled)
    .minDuration(minDuration)
    .maxDistance(maxDistance)
    .onStart(() => {
      scale.value = withSpring(0.95)
      if (hapticFeedback) {
        runOnJS(triggerHaptic)('medium')
      }
      runOnJS(handlers.onLongPressStart)?.()
    })
    .onEnd(() => {
      scale.value = withSpring(1)
      if (hapticFeedback) {
        runOnJS(triggerHaptic)('success')
      }
      runOnJS(handlers.onLongPress)?.()
    })
    .onFinalize(() => {
      scale.value = withSpring(1)
      runOnJS(handlers.onLongPressEnd)?.()
    })

  return {
    gesture: longPressGesture,
    animatedStyle
  }
}

// Tap gestures hook
export function useTapGestures(
  handlers: TapGestureHandlers,
  options: TapGestureOptions = {}
) {
  const {
    enabled = true,
    hapticFeedback = true,
    numberOfTaps = 1
  } = options

  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    }
  })

  const tapGesture = Gesture.Tap()
    .enabled(enabled)
    .numberOfTaps(numberOfTaps)
    .onStart(() => {
      scale.value = withSpring(0.95)
    })
    .onEnd(() => {
      scale.value = withSpring(1)
      if (hapticFeedback) {
        runOnJS(triggerHaptic)('light')
      }
      if (numberOfTaps === 1 && handlers.onTap) {
        runOnJS(handlers.onTap)()
      } else if (numberOfTaps === 2 && handlers.onDoubleTap) {
        runOnJS(handlers.onDoubleTap)()
      }
    })
    .onFinalize(() => {
      scale.value = withSpring(1)
    })

  return {
    gesture: tapGesture,
    animatedStyle
  }
}

// Combined gestures hook
export function useTouchGestures(
  gestureHandlers: {
    swipe?: SwipeGestureHandlers
    longPress?: LongPressGestureHandlers
    tap?: TapGestureHandlers
  },
  options: {
    swipe?: SwipeGestureOptions
    longPress?: LongPressGestureOptions
    tap?: TapGestureOptions
    enabled?: boolean
  } = {}
) {
  const { enabled = true } = options

  const swipeGesture = gestureHandlers.swipe
    ? useSwipeGestures(gestureHandlers.swipe, { ...options.swipe, enabled })
    : null

  const longPressGesture = gestureHandlers.longPress
    ? useLongPressGesture(gestureHandlers.longPress, { ...options.longPress, enabled })
    : null

  const tapGesture = gestureHandlers.tap
    ? useTapGestures(gestureHandlers.tap, { ...options.tap, enabled })
    : null

  const combinedAnimatedStyle = useAnimatedStyle(() => {
    const styles: any = {}

    if (longPressGesture) {
      styles.transform = [{ scale: longPressGesture.animatedStyle.transform[0].scale }]
    } else if (tapGesture) {
      styles.transform = [{ scale: tapGesture.animatedStyle.transform[0].scale }]
    }

    return styles
  })

  // Combine gestures
  const gestures: any[] = []

  if (swipeGesture) gestures.push(swipeGesture)
  if (longPressGesture) gestures.push(longPressGesture)
  if (tapGesture) gestures.push(tapGesture)

  let combinedGesture: any
  if (gestures.length === 0) {
    combinedGesture = Gesture.Tap().enabled(false)
  } else if (gestures.length === 1) {
    combinedGesture = gestures[0]
  } else {
    combinedGesture = Gesture.Simultaneous(...gestures)
  }

  return {
    gesture: combinedGesture,
    animatedStyle: combinedAnimatedStyle
  }
}

// Context menu gesture hook for right-click (web) and long-press (mobile)
export function useContextMenuGesture(
  onContextMenu: () => void,
  options: TouchGestureOptions = {}
) {
  const { enabled = true, hapticFeedback = true } = options

  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    }
  })

  const longPressGesture = Gesture.LongPress()
    .enabled(enabled && Platform.OS !== 'web')
    .onStart(() => {
      scale.value = withSpring(0.95)
      if (hapticFeedback) {
        runOnJS(triggerHaptic)('medium')
      }
    })
    .onEnd(() => {
      scale.value = withSpring(1)
      runOnJS(onContextMenu)()
    })
    .onFinalize(() => {
      scale.value = withSpring(1)
    })

  const handleContextMenu = useCallback((e: any) => {
    if (enabled && Platform.OS === 'web') {
      e.preventDefault()
      onContextMenu()
    }
  }, [enabled, onContextMenu])

  return {
    gesture: longPressGesture,
    animatedStyle,
    contextMenuProps: Platform.OS === 'web' ? {
      onContextMenu: handleContextMenu
    } : {}
  }
}

// Pinch to zoom gesture hook
export function usePinchToZoom(
  onZoomChange: (scale: number) => void,
  options: {
    minScale?: number
    maxScale?: number
    enabled?: boolean
  } = {}
) {
  const {
    minScale = 0.5,
    maxScale = 3,
    enabled = true
  } = options

  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    }
  })

  const pinchGesture = Gesture.Pinch()
    .enabled(enabled)
    .onUpdate((event) => {
      const newScale = Math.min(Math.max(event.scale, minScale), maxScale)
      scale.value = newScale
      runOnJS(onZoomChange)(newScale)
    })
    .onEnd(() => {
      // Smoothly animate to final scale
      scale.value = withSpring(scale.value)
    })

  return {
    gesture: pinchGesture,
    animatedStyle,
    scale
  }
}