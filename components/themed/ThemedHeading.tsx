import React, { ReactNode } from 'react'
import { Heading } from '@gluestack-ui/themed'
import { useTheme } from '../../contexts/ThemeContext'
import { ComponentProps } from 'react'

type HeadingProps = ComponentProps<typeof Heading>

interface ThemedHeadingProps extends Omit<HeadingProps, 'children'> {
  variant?: 'default' | 'muted' | 'accent'
  children?: ReactNode
}

/**
 * ThemedHeading - A Heading component with automatic theme-aware colors and font weights
 *
 * Variants:
 * - default: Primary text color with semibold weight
 * - muted: Secondary/muted text color with medium weight
 * - accent: Accent/brand color with bold weight
 */
export function ThemedHeading({
  variant = 'default',
  size = 'lg',
  children,
  sx,
  ...props
}: ThemedHeadingProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const colorMap = {
    default: isDark ? '$textDark' : '$textLight',
    muted: isDark ? '$textMutedDark' : '$textMutedLight',
    accent: '$accent',
  }

  const fontWeightMap = {
    default: '$semibold',
    muted: '$medium',
    accent: '$bold',
  }

  const textColor = colorMap[variant]
  const fontWeight = fontWeightMap[variant]

  return (
    <Heading
      size={size}
      sx={{
        color: textColor,
        fontWeight: fontWeight,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Heading>
  )
}
