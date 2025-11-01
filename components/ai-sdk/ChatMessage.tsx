import React from 'react';
import { Box, VStack, HStack, Text, Avatar, AvatarFallbackText, Spinner } from '@gluestack-ui/themed';
import { Message } from './types';
import Animated, { FadeIn } from 'react-native-reanimated';

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
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  return (
    <Animated.View entering={FadeIn}>
      <HStack
        space="md"
        className={`mb-4 ${isUser ? 'flex-row-reverse' : ''}`}
      >
        <Avatar size="sm">
          <AvatarFallbackText>
            {isUser ? 'U' : 'AI'}
          </AvatarFallbackText>
        </Avatar>
        <VStack space="xs" className={`flex-1 ${isUser ? 'items-end' : 'items-start'}`}>
          <Box
            className={`rounded-xl px-4 py-3 max-w-[85%] ${
              isUser
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground'
            }`}
          >
            {message.isLoading ? (
              <HStack space="sm" className="items-center">
                <Spinner size="sm" />
                <Text size="sm" color={isUser ? '$white' : '$textLight900'} style={{ color: isUser ? '#ffffff' : '#0f172a' }}>Thinking...</Text>
              </HStack>
            ) : (
              <Text
                size="md"
                color={isUser ? '$white' : '$textLight900'}
                style={{ color: isUser ? '#ffffff' : '#0f172a' }}
              >
                {message.content}
              </Text>
            )}
          </Box>
          {message.timestamp && (
            <Text size="xs" color="$textLight500" className="px-2" style={{ color: '#64748b' }}>
              {formatTime(message.timestamp)}
            </Text>
          )}
        </VStack>
      </HStack>
    </Animated.View>
  );
}

