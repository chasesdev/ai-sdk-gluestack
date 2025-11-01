import React, { useState, useRef } from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Input,
  InputField,
  Button,
  ButtonText,
  Icon,
  ScrollView,
} from '@gluestack-ui/themed';
import { Message } from './types';
import { ChatMessage } from './ChatMessage';
import { SendIcon } from '@gluestack-ui/themed';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../constants/theme';

interface AIChatbotProps {
  initialMessages?: Message[];
  onSendMessage?: (message: string) => void | Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  title?: string;
}

export function AIChatbot({
  initialMessages = [],
  onSendMessage,
  placeholder = 'Type your message...',
  disabled = false,
  title = 'AI Chatbot',
}: AIChatbotProps) {
  const { resolvedTheme } = useTheme();
  const colors = getThemeColors(resolvedTheme === 'dark');
  const { text: textColor, mutedText: mutedTextColor, card: cardBg, border: borderColor } = colors;
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<any>(null);

  const handleSend = async () => {
    if (!inputValue.trim() || disabled || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, assistantMessage]);

    if (onSendMessage) {
      try {
        await onSendMessage(userMessage.content);
        // Simulate AI response for demo
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? {
                    ...msg,
                    content:
                      "I received your message: '" +
                      userMessage.content +
                      "'. This is a demo response.",
                    isLoading: false,
                  }
                : msg
            )
          );
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? {
                  ...msg,
                  content: 'Sorry, an error occurred.',
                  isLoading: false,
                }
              : msg
          )
        );
        setIsLoading(false);
      }
    } else {
      // Demo mode
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? {
                  ...msg,
                  content:
                    "I received your message: '" +
                    userMessage.content +
                    "'. This is a demo response.",
                  isLoading: false,
                }
              : msg
          )
        );
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <VStack space="md" className="h-full">
            <Animated.View entering={FadeIn}>
              <Box className="bg-card border-b border-border pb-4 pt-2" style={{ backgroundColor: cardBg, borderBottomColor: borderColor }}>
                <Text size="lg" fontWeight="$semibold" color="$textLight900" style={{ color: textColor }}>
                  {title}
                </Text>
                <Text size="sm" color="$textLight500" className="mt-1" style={{ color: mutedTextColor }}>
                  Full-featured conversation interface
                </Text>
              </Box>
            </Animated.View>

      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        onContentSizeChange={() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }}
      >
              <VStack space="sm" className="px-4 pb-4">
                {messages.length === 0 ? (
                  <Box className="py-8">
                    <Text size="md" color="$textLight500" className="text-center" style={{ color: mutedTextColor }}>
                      Start a conversation by typing a message below
                    </Text>
                  </Box>
                ) : (
                  messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))
                )}
              </VStack>
      </ScrollView>

      <Box className="bg-card border-t border-border pt-4 px-4 pb-2" style={{ backgroundColor: cardBg, borderTopColor: borderColor }}>
        <HStack space="sm" className="items-center">
          <Input className="flex-1">
            <InputField
              placeholder={placeholder}
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={handleSend}
              editable={!disabled && !isLoading}
              multiline
              className="min-h-[44px] max-h-[120px]"
            />
          </Input>
          <Button
            onPress={handleSend}
            isDisabled={!inputValue.trim() || disabled || isLoading}
            size="md"
          >
            <Icon as={SendIcon} size="sm" />
          </Button>
        </HStack>
      </Box>
    </VStack>
  );
}

