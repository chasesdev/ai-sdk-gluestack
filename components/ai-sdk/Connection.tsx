import React from 'react'
import {
  Box,
  HStack,
  VStack,
  Text,
  Badge,
  BadgeText,
  Icon,
  CircleIcon,
} from '@gluestack-ui/themed'
import { ConnectionStatus } from './types'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { useTheme } from '../../contexts/ThemeContext'
import { getThemeColors } from '../../constants/theme'

interface ConnectionProps {
  status: ConnectionStatus
  message?: string
  showPulse?: boolean
}

const statusConfig = {
  connected: {
    color: 'success' as const,
    text: 'Connected',
    icon: CircleIcon,
  },
  connecting: {
    color: 'warning' as const,
    text: 'Connecting',
    icon: CircleIcon,
  },
  disconnected: {
    color: 'muted' as const,
    text: 'Disconnected',
    icon: CircleIcon,
  },
  error: {
    color: 'error' as const,
    text: 'Error',
    icon: CircleIcon,
  },
}

export function Connection({
  status,
  message,
  showPulse = true,
}: ConnectionProps) {
  const { resolvedTheme } = useTheme()
  const colors = getThemeColors(resolvedTheme === 'dark')
  const {
    text: textColor,
    mutedText: mutedTextColor,
    card: cardBg,
    border: borderColor,
  } = colors
  const config = statusConfig[status]

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <Box
        className="bg-card border border-border rounded-lg p-4"
        style={{ backgroundColor: cardBg, borderColor: borderColor }}
      >
        <HStack space="md" className="items-center">
          <Box className="relative">
            <Icon
              as={config.icon}
              size="md"
              style={{
                color:
                  status === 'connected'
                    ? colors.success
                    : status === 'connecting'
                      ? colors.warning
                      : status === 'error'
                        ? colors.error
                        : colors.mutedText,
                opacity: showPulse && status === 'connected' ? 0.75 : 1,
              }}
            />
            {showPulse && status === 'connected' && (
              <Box
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundColor: colors.success,
                  opacity: 0.2,
                  transform: [{ scale: 1.5 }],
                }}
              />
            )}
          </Box>
          <VStack space="xs" className="flex-1">
            <HStack space="sm" className="items-center">
              <Badge action={config.color} size="sm">
                <BadgeText style={{ color: textColor }}>
                  {config.text}
                </BadgeText>
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
  )
}
