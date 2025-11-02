import React, { useState } from 'react'
import { Platform, Alert, ActionSheetIOS } from 'react-native'
import {
  Button,
  Icon,
  Menu,
  MenuItem,
  MenuItemLabel,
} from '@gluestack-ui/themed'
import { Paperclip, Camera, Image, FileText, Mic } from 'lucide-react-native'
import * as ImagePicker from 'expo-image-picker'
import * as DocumentPicker from 'expo-document-picker'
import { Attachment } from './types'

interface AttachmentButtonProps {
  onAttachmentSelected: (attachment: Attachment) => void
  onAudioRecord?: () => void
  disabled?: boolean
}

export function AttachmentButton({
  onAttachmentSelected,
  onAudioRecord,
  disabled = false,
}: AttachmentButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const requestPermissions = async (type: 'camera' | 'media') => {
    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to take photos.'
        )
        return false
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Media library permission is required to select photos.'
        )
        return false
      }
    }
    return true
  }

  const handleCamera = async () => {
    setIsMenuOpen(false)

    const hasPermission = await requestPermissions('camera')
    if (!hasPermission) return

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0]
        const attachment: Attachment = {
          id: Date.now().toString(),
          type: 'image',
          uri: asset.uri,
          name: `photo_${Date.now()}.jpg`,
          mimeType: 'image/jpeg',
          width: asset.width,
          height: asset.height,
        }
        onAttachmentSelected(attachment)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture photo')
    }
  }

  const handleGallery = async () => {
    setIsMenuOpen(false)

    const hasPermission = await requestPermissions('media')
    if (!hasPermission) return

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
        allowsMultipleSelection: false,
      })

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0]
        const attachment: Attachment = {
          id: Date.now().toString(),
          type: 'image',
          uri: asset.uri,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          mimeType: asset.mimeType || 'image/jpeg',
          width: asset.width,
          height: asset.height,
        }
        onAttachmentSelected(attachment)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image')
    }
  }

  const handleDocument = async () => {
    setIsMenuOpen(false)

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/*', 'image/*'],
        copyToCacheDirectory: true,
      })

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0]
        const attachment: Attachment = {
          id: Date.now().toString(),
          type: 'document',
          uri: asset.uri,
          name: asset.name,
          mimeType: asset.mimeType || undefined,
          size: asset.size || undefined,
        }
        onAttachmentSelected(attachment)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select document')
    }
  }

  const handleAudioRecord = async () => {
    setIsMenuOpen(false)
    if (onAudioRecord) {
      onAudioRecord()
    } else {
      Alert.alert('Audio Recording', 'Audio recording feature not configured')
    }
  }

  const showAttachmentOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            'Cancel',
            'Take Photo',
            'Choose from Gallery',
            'Select Document',
            'Record Audio',
          ],
          cancelButtonIndex: 0,
        },
        buttonIndex => {
          if (buttonIndex === 1) handleCamera()
          else if (buttonIndex === 2) handleGallery()
          else if (buttonIndex === 3) handleDocument()
          else if (buttonIndex === 4) handleAudioRecord()
        }
      )
    } else {
      setIsMenuOpen(true)
    }
  }

  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return (
      <Button
        onPress={showAttachmentOptions}
        isDisabled={disabled}
        size="md"
        variant="outline"
        style={{
          minWidth: 44,
          minHeight: 44,
        }}
        accessibilityLabel="Add attachment"
        accessibilityHint="Add an image, document, or audio recording"
      >
        <Icon as={Paperclip} size="sm" />
      </Button>
    )
  }

  // Web version with menu
  return (
    <Menu
      isOpen={isMenuOpen}
      onOpen={() => setIsMenuOpen(true)}
      onClose={() => setIsMenuOpen(false)}
      trigger={({ ...triggerProps }) => (
        <Button
          {...triggerProps}
          isDisabled={disabled}
          size="md"
          variant="outline"
          style={{
            minWidth: 44,
            minHeight: 44,
          }}
          accessibilityLabel="Add attachment"
        >
          <Icon as={Paperclip} size="sm" />
        </Button>
      )}
    >
      <MenuItem onPress={handleCamera}>
        <Icon as={Camera} size="sm" sx={{ marginRight: '$2' }} />
        <MenuItemLabel>Take Photo</MenuItemLabel>
      </MenuItem>
      <MenuItem onPress={handleGallery}>
        <Icon as={Image} size="sm" sx={{ marginRight: '$2' }} />
        <MenuItemLabel>Choose from Gallery</MenuItemLabel>
      </MenuItem>
      <MenuItem onPress={handleDocument}>
        <Icon as={FileText} size="sm" sx={{ marginRight: '$2' }} />
        <MenuItemLabel>Select Document</MenuItemLabel>
      </MenuItem>
      <MenuItem onPress={handleAudioRecord}>
        <Icon as={Mic} size="sm" sx={{ marginRight: '$2' }} />
        <MenuItemLabel>Record Audio</MenuItemLabel>
      </MenuItem>
    </Menu>
  )
}
