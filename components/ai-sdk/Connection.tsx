import React from 'react';
import { Box, HStack, VStack, Text, Badge, BadgeText, Icon, CircleIcon } from '@gluestack-ui/themed';
import { ConnectionStatus } from './types';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../constants/theme';

interface ConnectionProps {
  status: ConnectionStatus;
  message?: string;
  showPulse?: boolean;
}

const statusConfig = {
  connected: {
    color: 'success',
    text: 'Connected',
    icon: CircleIcon,
  },
  connecting: {
    color: 'warning',
    text: 'Connecting',
    icon: CircleIcon,
  },
  disconnected: {
    color: 'muted',
    text: 'Disconnected',
    icon: CircleIcon,
  },
  error: {
    color: 'error',
    text: 'Error',
    icon: CircleIcon,
  },
};

export function Connection({ status, message, showPulse = true }: ConnectionProps) {
  const { resolvedTheme } = useTheme();
  const colors = getThemeColors(resolvedTheme === 'dark');
  const { text: textColor, mutedText: mutedTextColor, card: cardBg, border: borderColor } = colors;
  const config = statusConfig[status];

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <Box className="bg-card border border-border rounded-lg p-4" style={{ backgroundColor: cardBg, borderColor: borderColor }}>
        <HStack space="md" className="items-center">
          <Box className="relative">
            <Icon
              as={config.icon}
              size="md"
              style={{
                color: status === 'connected' ? '#10b981' : 
                       status === 'connecting' ? '#f59e0b' :
                       status === 'error' ? '#ef4444' : '#94a3b8',
                opacity: showPulse && status === 'connected' ? 0.75 : 1,
              }}
            />
            {showPulse && status === 'connected' && (
              <Box
                className={`absolute inset-0 rounded-full bg-${config.color} opacity-20`}
                style={{
                  transform: [{ scale: 1.5 }],
                }}
              />
            )}
          </Box>
          <VStack space="xs" className="flex-1">
            <HStack space="sm" className="items-center">
              <Badge action={config.color as any} size="sm">
                <BadgeText style={{ color: textColor }}>{config.text}</BadgeText>
              </Badge>
              {status === 'connecting' && (
                <Box className="animate-pulse">
                  <Text size="xs" style={{ color: mutedTextColor }}>
                    ...
                  </Text>
                </Box>
              )}
            </HStack>
            {message && (
              <Text size="sm" style={{ color: mutedTextColor }}>
                {message}
              </Text>
            )}
          </VStack>
        </HStack>
      </Box>
    </Animated.View>
  );
}

