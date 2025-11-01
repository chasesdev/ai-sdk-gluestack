import React, { useState, useRef } from 'react';
import { Platform } from 'react-native';
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
import { ChevronRightIcon } from '@gluestack-ui/themed';
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
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        onContentSizeChange={() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }}
        accessibilityRole="list"
        accessibilityLabel="Chat messages"
      >
        <VStack space="sm" className="px-4 pb-4 pt-4">
          {messages.length === 0 ? (
            <Box className="py-8">
              <Text size="sm" className="text-center" style={{ color: mutedTextColor }}>
                Start a conversation
              </Text>
            </Box>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
        </VStack>
      </ScrollView>

      <Box className="border-t border-border pt-3 px-4 pb-3" style={{ borderTopColor: borderColor }}>
        <HStack 
          space="sm" 
          style={{ 
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Input
            style={{ flex: 1 }}
            variant="outline"
          >
            <InputField
              placeholder={placeholder}
              placeholderTextColor={mutedTextColor}
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={handleSend}
              editable={!disabled && !isLoading}
              multiline
              style={{
                minHeight: 44,
                maxHeight: 120,
                textAlignVertical: Platform.OS === 'android' ? 'center' : 'top',
                paddingTop: Platform.OS === 'ios' ? 12 : 10,
                paddingBottom: Platform.OS === 'ios' ? 12 : 10,
                color: textColor,
              }}
              accessibilityLabel="Message input"
              accessibilityHint="Type your message to send to the chatbot"
            />
          </Input>
          <Button
            onPress={handleSend}
            isDisabled={!inputValue.trim() || disabled || isLoading}
            size="md"
            style={{
              alignSelf: 'center',
              minWidth: 44,
              minHeight: 44,
            }}
            accessibilityLabel="Send message"
            accessibilityHint="Sends your message to the chatbot"
            accessibilityRole="button"
          >
            <Icon as={ChevronRightIcon} size="sm" />
          </Button>
        </HStack>
      </Box>
    </VStack>
  );
}

