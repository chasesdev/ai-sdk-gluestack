import React, { useState } from 'react'
import { TouchableOpacity, Dimensions } from 'react-native'
import {
  Box,
  HStack,
  VStack,
  Text,
  Image,
  Icon,
} from '@gluestack-ui/themed'
import { FileText, Music, X } from 'lucide-react-native'
import { Attachment } from './types'
import { useTheme } from '../../contexts/ThemeContext'
import { getThemeColors } from '../../constants/theme'

interface AttachmentPreviewProps {
  attachment: Attachment
  onPress?: () => void
  onRemove?: () => void
  compact?: boolean
  isInMessage?: boolean
}

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const formatDuration = (seconds?: number): string => {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function AttachmentPreview({
  attachment,
  onPress,
  onRemove,
  compact = false,
  isInMessage = false,
}: AttachmentPreviewProps) {
  const { resolvedTheme } = useTheme()
  const colors = getThemeColors(resolvedTheme === 'dark')
  const { text: textColor, mutedText, card: cardColor, border } = colors

  const screenWidth = Dimensions.get('window').width

  if (attachment.type === 'image') {
    const maxWidth = isInMessage ? screenWidth * 0.6 : compact ? 80 : 200
    const maxHeight = isInMessage ? 300 : compact ? 80 : 200

    return (
      <Box className="relative">
        <TouchableOpacity onPress={onPress} disabled={!onPress}>
          <Image
            source={{ uri: attachment.uri }}
            alt={attachment.name}
            style={{
              width: maxWidth,
              height: maxHeight,
              borderRadius: 12,
              resizeMode: 'cover',
            }}
          />
        </TouchableOpacity>
        {onRemove && (
          <TouchableOpacity
            onPress={onRemove}
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              backgroundColor: 'rgba(0,0,0,0.6)',
              borderRadius: 12,
              padding: 4,
            }}
          >
            <Icon as={X} size="xs" color="white" />
          </TouchableOpacity>
        )}
      </Box>
    )
  }

  if (attachment.type === 'document') {
    return (
      <TouchableOpacity onPress={onPress} disabled={!onPress}>
        <Box
          className={`rounded-lg ${compact ? 'p-2' : 'p-3'}`}
          style={{
            backgroundColor: cardColor,
            borderWidth: 1,
            borderColor: border,
            maxWidth: compact ? 300 : undefined,
          }}
        >
          <HStack space="sm" className="items-center">
            <Box
              className="rounded-md p-2"
              style={{
                backgroundColor: colors.accent + '20',
              }}
            >
              <Icon as={FileText} size={compact ? 'xs' : 'sm'} color={colors.accent} />
            </Box>
            <VStack className="flex-1">
              <Text
                size={compact ? 'xs' : 'sm'}
                style={{ color: textColor }}
                numberOfLines={1}
              >
                {attachment.name}
              </Text>
              {attachment.size && (
                <Text size="xs" style={{ color: mutedText }}>
                  {formatFileSize(attachment.size)}
                </Text>
              )}
            </VStack>
            {onRemove && (
              <TouchableOpacity onPress={onRemove}>
                <Icon as={X} size="xs" color={mutedText} />
              </TouchableOpacity>
            )}
          </HStack>
        </Box>
      </TouchableOpacity>
    )
  }

  if (attachment.type === 'audio') {
    return (
      <TouchableOpacity onPress={onPress} disabled={!onPress}>
        <Box
          className={`rounded-lg ${compact ? 'p-2' : 'p-3'}`}
          style={{
            backgroundColor: cardColor,
            borderWidth: 1,
            borderColor: border,
            maxWidth: compact ? 300 : undefined,
          }}
        >
          <HStack space="sm" className="items-center">
            <Box
              className="rounded-md p-2"
              style={{
                backgroundColor: colors.accent + '20',
              }}
            >
              <Icon as={Music} size={compact ? 'xs' : 'sm'} color={colors.accent} />
            </Box>
            <VStack className="flex-1">
              <Text
                size={compact ? 'xs' : 'sm'}
                style={{ color: textColor }}
                numberOfLines={1}
              >
                {attachment.name}
              </Text>
              <HStack space="xs">
                {attachment.duration && (
                  <Text size="xs" style={{ color: mutedText }}>
                    {formatDuration(attachment.duration)}
                  </Text>
                )}
                {attachment.size && (
                  <Text size="xs" style={{ color: mutedText }}>
                    • {formatFileSize(attachment.size)}
                  </Text>
                )}
              </HStack>
            </VStack>
            {onRemove && (
              <TouchableOpacity onPress={onRemove}>
                <Icon as={X} size="xs" color={mutedText} />
              </TouchableOpacity>
            )}
          </HStack>
        </Box>
      </TouchableOpacity>
    )
  }

  return null
}
