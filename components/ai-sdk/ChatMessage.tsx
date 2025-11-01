import React from 'react';
import { Box, VStack, HStack, Text, Avatar, AvatarFallbackText, Spinner } from '@gluestack-ui/themed';
import { Message } from './types';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../constants/theme';

const formatTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { resolvedTheme } = useTheme();
  const colors = getThemeColors(resolvedTheme === 'dark');
  const { text: textColor, mutedText: mutedTextColor, card: cardColor, border: borderColor, accent: accentColor } = colors;
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  return (
    <Animated.View entering={FadeIn}>
      <HStack
        space="md"
        className={`mb-4 ${isUser ? 'flex-row-reverse' : ''}`}
      >
        <Avatar size="sm">
          <AvatarFallbackText style={{ color: '#ffffff', backgroundColor: isUser ? accentColor : cardColor }}>
            {isUser ? 'U' : 'AI'}
          </AvatarFallbackText>
        </Avatar>
        <VStack space="xs" className={`flex-1 ${isUser ? 'items-end' : 'items-start'}`}>
          <Box
            className="rounded-xl px-4 py-3 max-w-[85%]"
            style={{
              backgroundColor: isUser ? accentColor : cardColor,
              borderWidth: isUser ? 0 : 1,
              borderColor: isUser ? 'transparent' : borderColor,
            }}
          >
            {message.isLoading ? (
              <HStack space="sm" className="items-center">
                <Spinner size="small" />
                <Text size="sm" style={{ color: isUser ? '#ffffff' : textColor }}>Thinking...</Text>
              </HStack>
            ) : (
              <Text
                size="md"
                style={{ color: isUser ? '#ffffff' : textColor }}
              >
                {message.content}
              </Text>
            )}
          </Box>
          {message.timestamp && (
            <Text size="xs" className="px-2" style={{ color: mutedTextColor }}>
              {formatTime(message.timestamp)}
            </Text>
          )}
        </VStack>
      </HStack>
    </Animated.View>
  );
}

