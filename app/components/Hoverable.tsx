import React, { useState } from 'react'
import { Platform } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'

interface HoverableProps {
  children: React.ReactNode
  onHoverIn?: () => void
  onHoverOut?: () => void
  hoverScale?: number
  hoverOpacity?: number
  disabled?: boolean
}

export function Hoverable({
  children,
  onHoverIn,
  onHoverOut,
  hoverScale = 1.02,
  hoverOpacity = 0.8,
  disabled = false,
}: HoverableProps) {
  const [isHovered, setIsHovered] = useState(false)
  const scale = useSharedValue(1)
  const opacity = useSharedValue(1)

  const handleMouseEnter = () => {
    if (disabled || Platform.OS !== 'web') return

    setIsHovered(true)
    scale.value = withSpring(hoverScale)
    opacity.value = withSpring(hoverOpacity)
    onHoverIn?.()
  }

  const handleMouseLeave = () => {
    if (disabled || Platform.OS !== 'web') return

    setIsHovered(false)
    scale.value = withSpring(1)
    opacity.value = withSpring(1)
    onHoverOut?.()
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }
  })

  if (Platform.OS === 'web') {
    return (
      <Animated.View
        style={animatedStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </Animated.View>
    )
  }

  // On mobile, just return children without hover effects
  return <>{children}</>
}

// Enhanced hoverable component with tooltip
interface HoverableWithTooltipProps extends HoverableProps {
  tooltip: string
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
}

export function HoverableWithTooltip({
  children,
  tooltip,
  tooltipPosition = 'top',
  ...hoverableProps
}: HoverableWithTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const handleHoverIn = () => {
    setShowTooltip(true)
    hoverableProps.onHoverIn?.()
  }

  const handleHoverOut = () => {
    setShowTooltip(false)
    hoverableProps.onHoverOut?.()
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Hoverable {...hoverableProps} onHoverIn={handleHoverIn} onHoverOut={handleHoverOut}>
        {children}
      </Hoverable>

      {showTooltip && Platform.OS === 'web' && (
        <div
          style={{
            position: 'absolute',
            backgroundColor: '#333',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            bottom: tooltipPosition === 'top' ? '100%' : 'auto',
            top: tooltipPosition === 'bottom' ? '100%' : 'auto',
            left: tooltipPosition === 'right' ? '100%' : '50%',
            right: tooltipPosition === 'left' ? '100%' : 'auto',
            transform: tooltipPosition === 'left' || tooltipPosition === 'right'
              ? 'translateY(-50%)'
              : 'translateX(-50%)',
            marginBottom: tooltipPosition === 'top' ? '4px' : '0',
            marginTop: tooltipPosition === 'bottom' ? '4px' : '0',
            marginLeft: tooltipPosition === 'right' ? '4px' : '0',
            marginRight: tooltipPosition === 'left' ? '4px' : '0',
          }}
        >
          {tooltip}
        </div>
      )}
    </div>
  )
}