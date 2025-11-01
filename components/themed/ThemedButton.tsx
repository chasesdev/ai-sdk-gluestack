import React, { ReactNode } from 'react'
import { Button, ButtonText } from '@gluestack-ui/themed'
import { ComponentProps } from 'react'

type ButtonComponentProps = ComponentProps<typeof Button>

interface ThemedButtonProps extends Omit<ButtonComponentProps, 'children'> {
  variant?: 'solid' | 'outline'
  text?: string
  children?: ReactNode
}

/**
 * ThemedButton - A button component with consistent accent color styling
 *
 * Variants:
 * - solid: Filled button with accent background (default)
 * - outline: Outlined button with accent border and text
 */
export function ThemedButton({
  variant = 'solid',
  text,
  children,
  sx,
  ...props
}: ThemedButtonProps) {
  const isSolid = variant === 'solid'

  return (
    <Button
      sx={{
        backgroundColor: isSolid ? '$accent' : 'transparent',
        borderColor: '$accent',
        borderWidth: isSolid ? 0 : 1,
        ...sx,
      }}
      {...props}
    >
      <ButtonText
        sx={{
          color: isSolid ? 'white' : '$accent',
          fontWeight: '$semibold',
        }}
      >
        {text || children}
      </ButtonText>
    </Button>
  )
}
