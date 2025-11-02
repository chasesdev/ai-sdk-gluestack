import React, { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  AvatarFallbackText,
  Spinner,
} from '@gluestack-ui/themed'
import { Message, Attachment } from './types'
import Animated, { FadeIn } from 'react-native-reanimated'
import { useTheme } from '../../contexts/ThemeContext'
import { getThemeColors } from '../../constants/theme'
import { AttachmentPreview } from './AttachmentPreview'
import { ImageViewer } from './ImageViewer'

const formatTime = (date: Date) => {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
}

interface ChatMessageProps {
  message: Message
}

export const ChatMessage = React.memo(function ChatMessage({ message }: ChatMessageProps) {
  const { resolvedTheme } = useTheme()
  const colors = getThemeColors(resolvedTheme === 'dark')
  const {
    text: textColor,
    mutedText: mutedTextColor,
    card: cardColor,
    border: borderColor,
    accent: accentColor,
  } = colors
  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'

  const [selectedImage, setSelectedImage] = useState<Attachment | null>(null)

  const handleImagePress = (attachment: Attachment) => {
    if (attachment.type === 'image') {
      setSelectedImage(attachment)
    }
  }

  return (
    <Animated.View entering={FadeIn}>
      <HStack
        space="md"
        sx={{
          marginBottom: '$5',
          flexDirection: isUser ? 'row-reverse' : 'row',
        }}
      >
        <Avatar size="sm">
          <AvatarFallbackText
            style={{
              color: colors.background,
              backgroundColor: isUser ? accentColor : cardColor,
            }}
          >
            {isUser ? 'U' : 'AI'}
          </AvatarFallbackText>
        </Avatar>
        <VStack
          space="xs"
          sx={{
            flex: 1,
            alignItems: isUser ? 'flex-end' : 'flex-start',
          }}
        >
          <VStack
            space="xs"
            sx={{
              maxWidth: '85%',
              alignItems: isUser ? 'flex-end' : 'flex-start',
            }}
          >
            {/* Render attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <VStack space="xs" sx={{ width: '100%' }}>
                {message.attachments.map(attachment => (
                  <AttachmentPreview
                    key={attachment.id}
                    attachment={attachment}
                    onPress={() => handleImagePress(attachment)}
                    isInMessage
                  />
                ))}
              </VStack>
            )}

            {/* Render message content */}
            {message.content && (
              <Box
                style={{
                  borderRadius: 12,
                  paddingHorizontal: 20,
                  paddingVertical: 14,
                  backgroundColor: isUser ? accentColor : cardColor,
                  borderWidth: isUser ? 0 : 1,
                  borderColor: isUser ? 'transparent' : borderColor,
                }}
              >
                {message.isLoading ? (
                  <HStack space="sm" sx={{ alignItems: 'center' }}>
                    <Spinner size="small" />
                    <Text
                      size="sm"
                      style={{ color: isUser ? colors.background : textColor }}
                    >
                      Thinking...
                    </Text>
                  </HStack>
                ) : (
                  <Text
                    size="md"
                    style={{ color: isUser ? colors.background : textColor }}
                  >
                    {message.content}
                  </Text>
                )}
              </Box>
            )}
          </VStack>

          {message.timestamp && (
            <Text
              size="xs"
              style={{ paddingHorizontal: 8, color: mutedTextColor }}
            >
              {formatTime(message.timestamp)}
            </Text>
          )}
        </VStack>
      </HStack>

      {/* Image viewer modal */}
      {selectedImage && (
        <ImageViewer
          visible={!!selectedImage}
          imageUri={selectedImage.uri}
          imageName={selectedImage.name}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </Animated.View>
  )
})
