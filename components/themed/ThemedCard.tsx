import React, { ReactNode } from 'react'
import { Box } from '@gluestack-ui/themed'
import { useTheme } from '../../contexts/ThemeContext'
import { ComponentProps } from 'react'

type BoxProps = ComponentProps<typeof Box>

interface ThemedCardProps extends Omit<BoxProps, 'children'> {
  variant?: 'elevated' | 'flat' | 'outlined'
  children?: ReactNode
}

/**
 * ThemedCard - An elevated card component with consistent styling
 *
 * Variants:
 * - elevated: Card with shadow (default)
 * - flat: Card without shadow
 * - outlined: Card with border emphasis
 */
export function ThemedCard({
  variant = 'elevated',
  children,
  sx,
  ...props
}: ThemedCardProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const bgColor = isDark ? '$cardDark' : '$cardLight'
  const borderColor = isDark ? '$borderDark' : '$borderLight'

  return (
    <Box
      sx={{
        backgroundColor: bgColor,
        borderColor: borderColor,
        borderWidth: variant === 'outlined' ? 2 : 1,
        borderRadius: '$3',
        padding: '$5',
        ...(variant === 'elevated' && {
          shadowColor: '$shadowColor',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  )
}
