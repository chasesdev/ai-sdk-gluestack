import React from 'react'
import { Input, InputField } from '@gluestack-ui/themed'
import { useTheme } from '../../contexts/ThemeContext'
import { ComponentProps } from 'react'

type InputProps = ComponentProps<typeof Input>
type InputFieldProps = ComponentProps<typeof InputField>

interface ThemedInputProps extends Omit<InputProps, 'children'> {
  fieldProps?: InputFieldProps
  placeholder?: string
  value?: string
  onChangeText?: (text: string) => void
}

/**
 * ThemedInput - An input component with theme-aware styling
 *
 * Features:
 * - Automatic border and text colors based on theme
 * - Consistent padding and sizing
 * - Focus state with accent color
 */
export function ThemedInput({
  fieldProps,
  placeholder,
  value,
  onChangeText,
  sx,
  ...props
}: ThemedInputProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const borderColor = isDark ? '$borderDark' : '$borderLight'
  const textColor = isDark ? '$textDark' : '$textLight'
  const bgColor = isDark ? '$cardDark' : '$cardLight'

  return (
    <Input
      sx={{
        borderColor: borderColor,
        backgroundColor: bgColor,
        borderWidth: 1,
        borderRadius: '$2',
        minHeight: 44,
        ...sx,
      }}
      {...props}
    >
      <InputField
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        sx={{
          color: textColor,
          ...fieldProps?.sx,
        }}
        {...fieldProps}
      />
    </Input>
  )
}
