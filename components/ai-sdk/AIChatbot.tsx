import React, { useState, useRef, useCallback } from 'react'
import { Platform, View } from 'react-native'
import { FlashList } from '@shopify/flash-list'
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
} from '@gluestack-ui/themed'
import { Message, Attachment } from './types'
import { ChatMessage } from './ChatMessage'
import { ChevronRightIcon } from '@gluestack-ui/themed'
import { useTheme } from '../../contexts/ThemeContext'
import { getThemeColors } from '../../constants/theme'
import { AttachmentButton } from './AttachmentButton'
import { AttachmentPreview } from './AttachmentPreview'
import { AudioRecorder } from './AudioRecorder'

interface AIChatbotProps {
  initialMessages?: Message[]
  onSendMessage?: (message: string) => void | Promise<void>
  placeholder?: string
  disabled?: boolean
  title?: string
}

export function AIChatbot({
  initialMessages = [],
  onSendMessage,
  placeholder = 'Type your message...',
  disabled = false,
  title = 'AI Chatbot',
}: AIChatbotProps) {
  const { resolvedTheme } = useTheme()
  const colors = getThemeColors(resolvedTheme === 'dark')
  const {
    text: textColor,
    mutedText: mutedTextColor,
    card: cardBg,
    border: borderColor,
  } = colors
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAttachments, setSelectedAttachments] = useState<Attachment[]>([])
  const [showAudioRecorder, setShowAudioRecorder] = useState(false)
  const flashListRef = useRef<any>(null)

  const handleAttachmentSelected = useCallback((attachment: Attachment) => {
    setSelectedAttachments(prev => [...prev, attachment])
  }, [])

  const handleRemoveAttachment = useCallback((attachmentId: string) => {
    setSelectedAttachments(prev => prev.filter(a => a.id !== attachmentId))
  }, [])

  const handleAudioRecordingComplete = useCallback((attachment: Attachment) => {
    setSelectedAttachments(prev => [...prev, attachment])
    setShowAudioRecorder(false)
  }, [])

  const handleSend = useCallback(async () => {
    if ((!inputValue.trim() && selectedAttachments.length === 0) || disabled || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      attachments: selectedAttachments.length > 0 ? selectedAttachments : undefined,
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setSelectedAttachments([])
    setIsLoading(true)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    }

    setMessages(prev => [...prev, assistantMessage])

    if (onSendMessage) {
      try {
        await onSendMessage(userMessage.content)
        // Simulate AI response for demo
        setTimeout(() => {
          setMessages(prev =>
            prev.map(msg =>
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
          )
          setIsLoading(false)
        }, 1500)
      } catch (error) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessage.id
              ? {
                  ...msg,
                  content: 'Sorry, an error occurred.',
                  isLoading: false,
                }
              : msg
          )
        )
        setIsLoading(false)
      }
    } else {
      // Demo mode
      setTimeout(() => {
        setMessages(prev =>
          prev.map(msg =>
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
        )
        setIsLoading(false)
      }, 1500)
    }
  }, [inputValue, selectedAttachments, disabled, isLoading, onSendMessage])

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flashListRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }, [messages.length])

  return (
    <VStack space="md" sx={{ height: '100%' }}>
      <View style={{ flex: 1 }}>
        <FlashList
          ref={flashListRef}
          data={messages}
          renderItem={({ item }) => <ChatMessage message={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 16,
            paddingTop: 16,
          }}
          ListEmptyComponent={
            <Box sx={{ paddingVertical: '$8' }}>
              <Text
                size="sm"
                sx={{ textAlign: 'center' }}
                style={{ color: mutedTextColor }}
              >
                Start a conversation
              </Text>
            </Box>
          }
        />
      </View>

      <Box
        style={{
          borderTopWidth: 1,
          borderTopColor: borderColor,
          paddingTop: 16,
          paddingHorizontal: 16,
          paddingBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <VStack space="md">
          {/* Attachment previews */}
          {selectedAttachments.length > 0 && (
            <HStack space="sm" sx={{ flexWrap: 'wrap' }}>
              {selectedAttachments.map(attachment => (
                <AttachmentPreview
                  key={attachment.id}
                  attachment={attachment}
                  onRemove={() => handleRemoveAttachment(attachment.id)}
                  compact
                />
              ))}
            </HStack>
          )}

          {/* Input area */}
          <HStack
            space="sm"
            style={{
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <AttachmentButton
              onAttachmentSelected={handleAttachmentSelected}
              onAudioRecord={() => setShowAudioRecorder(true)}
              disabled={disabled || isLoading}
            />
            <Input style={{ flex: 1 }} variant="outline">
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
              isDisabled={(!inputValue.trim() && selectedAttachments.length === 0) || disabled || isLoading}
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
              <Icon as={ChevronRightIcon} size="sm" color="white" />
            </Button>
          </HStack>
        </VStack>
      </Box>

      {/* Audio recorder modal */}
      <AudioRecorder
        visible={showAudioRecorder}
        onClose={() => setShowAudioRecorder(false)}
        onRecordingComplete={handleAudioRecordingComplete}
      />
    </VStack>
  )
}
