import React, { ReactNode } from 'react';
import { Box } from '@gluestack-ui/themed';
import { useTheme } from '@/contexts/ThemeContext';
import { ComponentProps } from 'react';

type BoxProps = ComponentProps<typeof Box>;

interface ThemedCardProps extends Omit<BoxProps, 'children'> {
  variant?: 'elevated' | 'flat' | 'outlined';
  children?: ReactNode;
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
  className = '',
  sx,
  ...props
}: ThemedCardProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const bgColor = isDark ? '$cardDark' : '$cardLight';
  const borderColor = isDark ? '$borderDark' : '$borderLight';

  // Build className based on variant
  const variantClasses = {
    elevated: 'shadow-sm',
    flat: '',
    outlined: 'border-2',
  };

  const combinedClassName = `${variantClasses[variant]} ${className}`.trim();

  return (
    <Box
      className={combinedClassName}
      sx={{
        backgroundColor: bgColor,
        borderColor: borderColor,
        borderWidth: variant === 'outlined' ? 2 : 1,
        borderRadius: '$3',
        padding: '$5',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
