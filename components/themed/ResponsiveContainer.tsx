import React, { ReactNode } from 'react';
import { Box } from '@gluestack-ui/themed';
import { useTheme } from '../../contexts/ThemeContext';
import { Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ComponentProps } from 'react';

type BoxProps = ComponentProps<typeof Box>;

interface ResponsiveContainerProps extends Omit<BoxProps, 'children'> {
  disableSafeArea?: boolean;
  maxWidth?: number | 'sm' | 'md' | 'lg' | 'xl';
  children?: ReactNode;
}

/**
 * ResponsiveContainer - A container with safe area handling and responsive padding
 *
 * Features:
 * - Automatic safe area insets (can be disabled)
 * - Responsive horizontal padding (8px mobile, 16px tablet/desktop)
 * - Optional max width constraints
 * - Theme-aware background color
 */
export function ResponsiveContainer({
  disableSafeArea = false,
  maxWidth,
  children,
  sx,
  ...props
}: ResponsiveContainerProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  // Responsive horizontal padding
  const horizontalPadding = screenWidth < 768 ? '$2' : '$4';

  // Max width mapping
  const maxWidthMap = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  };

  const resolvedMaxWidth =
    typeof maxWidth === 'string' ? maxWidthMap[maxWidth] : maxWidth;

  // Safe area padding
  const paddingTop = disableSafeArea
    ? 0
    : Platform.OS === 'android'
      ? Math.max(insets.top, 24)
      : Math.max(insets.top, 20);

  const paddingBottom = disableSafeArea ? 0 : 24;

  const bgColor = isDark ? '$backgroundDark' : '$backgroundLight';

  return (
    <Box
      sx={{
        flex: 1,
        backgroundColor: bgColor,
        paddingHorizontal: horizontalPadding,
        paddingTop: paddingTop,
        paddingBottom: paddingBottom,
        maxWidth: resolvedMaxWidth,
        width: '100%',
        marginHorizontal: 'auto',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
