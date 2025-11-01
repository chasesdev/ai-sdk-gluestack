import React, { ReactNode } from 'react';
import { Box } from '@gluestack-ui/themed';
import { useTheme } from '@/contexts/ThemeContext';
import { ComponentProps } from 'react';

type BoxProps = ComponentProps<typeof Box>;

interface ThemedBoxProps extends Omit<BoxProps, 'children'> {
  variant?: 'default' | 'card' | 'muted' | 'tinted';
  children?: ReactNode;
}

/**
 * ThemedBox - A Box component that automatically applies theme-aware colors
 *
 * Variants:
 * - default: Uses background color
 * - card: Uses card background color
 * - muted: Uses muted background color
 * - tinted: Uses tinted/accent background color
 */
export function ThemedBox({
  variant = 'default',
  children,
  sx,
  ...props
}: ThemedBoxProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Map variants to color tokens
  const bgColorMap = {
    default: isDark ? '$backgroundDark' : '$backgroundLight',
    card: isDark ? '$cardDark' : '$cardLight',
    muted: isDark ? '$mutedDark' : '$mutedLight',
    tinted: isDark ? '$tintedDark' : '$tintedLight',
  };

  const borderColorToken = isDark ? '$borderDark' : '$borderLight';
  const bgColorToken = bgColorMap[variant];

  return (
    <Box
      sx={{
        backgroundColor: bgColorToken,
        borderColor: borderColorToken,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
