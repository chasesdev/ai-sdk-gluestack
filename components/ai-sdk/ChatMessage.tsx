import React, { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  AvatarFallbackText,
  Spinner,
  Button,
  ButtonText,
  Icon,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@gluestack-ui/themed'
import { Message, Attachment } from './types'
import Animated, { FadeIn } from 'react-native-reanimated'
import { useTheme } from '../../contexts/ThemeContext'
import { getThemeColors } from '../../constants/theme'
import { AttachmentPreview } from './AttachmentPreview'
import { ImageViewer } from './ImageViewer'
import { useTouchGestures, useContextMenuGesture } from '../../app/hooks/useTouchGestures'
import { GestureDetector } from 'react-native-gesture-handler'
import { TrashIcon, ArrowLeftIcon, CopyIcon } from '@gluestack-ui/themed'

const formatTime = (date: Date) => {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
}

interface ChatMessageProps {
  message: Message
  onReply?: (message: Message) => void
  onDelete?: (messageId: string) => void
  onCopy?: (content: string) => void
}

export const ChatMessage = React.memo(function ChatMessage({
  message,
  onReply,
  onDelete,
  onCopy
}: ChatMessageProps) {
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [swipeOffset, setSwipeOffset] = useState(0)

  const handleImagePress = (attachment: Attachment) => {
    if (attachment.type === 'image') {
      setSelectedImage(attachment)
    }
  }

  const handleReply = () => {
    onReply?.(message)
  }

  const handleCopy = () => {
    onCopy?.(message.content)
  }

  const handleDelete = () => {
    onDelete?.(message.id)
    setShowDeleteDialog(false)
  }

  const handleContextMenu = () => {
    // Show context menu on long press (mobile) or right-click (web)
    if (isUser) {
      setShowDeleteDialog(true)
    }
  }

  // Touch gestures for mobile
  const { gesture: touchGestures, animatedStyle: touchStyle } = useTouchGestures(
    {
      swipe: {
        onSwipeLeft: () => {
          if (isUser) {
            setShowDeleteDialog(true)
          } else {
            handleReply()
          }
        },
        onSwipeRight: () => {
          if (isUser) {
            handleCopy()
          } else {
            handleReply()
          }
        }
      },
      longPress: {
        onLongPress: handleContextMenu
      }
    },
    {
      swipe: {
        direction: 'horizontal',
        minDistance: 80,
        enabled: true
      },
      longPress: {
        minDuration: 500,
        enabled: true
      }
    }
  )

  // Context menu gesture for right-click on web
  const { gesture: contextMenuGesture, contextMenuProps } = useContextMenuGesture(
    handleContextMenu,
    { enabled: true }
  )

  return (
    <Animated.View entering={FadeIn}>
      <GestureDetector gesture={touchGestures}>
        <HStack
          space="md"
          sx={{
            marginBottom: '$5',
            flexDirection: isUser ? 'row-reverse' : 'row',
          }}
          {...contextMenuProps}
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
      </GestureDetector>

      {/* Image viewer modal */}
      {selectedImage && (
        <ImageViewer
          visible={!!selectedImage}
          imageUri={selectedImage.uri}
          imageName={selectedImage.name}
          onClose={() => setSelectedImage(null)}
        />
      )}

      {/* Delete confirmation dialog */}
      {showDeleteDialog && (
        <AlertDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
          <AlertDialogBackdrop />
          <AlertDialogContent>
            <AlertDialogHeader>
              <Text size="lg" fontWeight="bold">Delete Message</Text>
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text size="sm">Are you sure you want to delete this message? This action cannot be undone.</Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                variant="outline"
                action="secondary"
                onPress={() => setShowDeleteDialog(false)}
                mr="$3"
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                action="negative"
                onPress={handleDelete}
              >
                <ButtonText>Delete</ButtonText>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Animated.View>
  )
})
