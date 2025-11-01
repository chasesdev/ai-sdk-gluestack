import React, { ReactNode } from 'react';
import { Text } from '@gluestack-ui/themed';
import { useTheme } from '../../contexts/ThemeContext';
import { ComponentProps } from 'react';

type TextProps = ComponentProps<typeof Text>;

interface ThemedTextProps extends Omit<TextProps, 'children'> {
  variant?: 'default' | 'muted' | 'accent';
  children?: ReactNode;
}

/**
 * ThemedText - A Text component with automatic theme-aware colors
 *
 * Variants:
 * - default: Primary text color
 * - muted: Secondary/muted text color
 * - accent: Accent/brand color
 */
export function ThemedText({
  variant = 'default',
  children,
  sx,
  ...props
}: ThemedTextProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const colorMap = {
    default: isDark ? '$textDark' : '$textLight',
    muted: isDark ? '$textMutedDark' : '$textMutedLight',
    accent: '$accent',
  };

  const textColor = colorMap[variant];

  return (
    <Text
      sx={{
        color: textColor,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Text>
  );
}
