import React, { useState, useRef } from 'react'
import { Alert, Platform, Modal } from 'react-native'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  ButtonText,
} from '@gluestack-ui/themed'
import { Mic, Square, Play, Pause, Trash2, Check } from 'lucide-react-native'
import { Audio } from 'expo-av'
import { Attachment } from './types'
import { useTheme } from '../../contexts/ThemeContext'
import { getThemeColors } from '../../constants/theme'

interface AudioRecorderProps {
  visible: boolean
  onClose: () => void
  onRecordingComplete: (attachment: Attachment) => void
}

export function AudioRecorder({
  visible,
  onClose,
  onRecordingComplete,
}: AudioRecorderProps) {
  const { resolvedTheme } = useTheme()
  const colors = getThemeColors(resolvedTheme === 'dark')

  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [recordingUri, setRecordingUri] = useState<string | null>(null)

  const recordingRef = useRef<Audio.Recording | null>(null)
  const soundRef = useRef<Audio.Sound | null>(null)
  const intervalRef = useRef<number | null>(null)

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const requestPermissions = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Microphone permission is required to record audio.'
        )
        return false
      }
      return true
    } catch (error) {
      Alert.alert('Error', 'Failed to request permissions')
      return false
    }
  }

  const startRecording = async () => {
    const hasPermission = await requestPermissions()
    if (!hasPermission) return

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      )

      recordingRef.current = recording
      setIsRecording(true)
      setDuration(0)

      // Update duration every second
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1000)
      }, 1000)

    } catch (error) {
      Alert.alert('Error', 'Failed to start recording')
    }
  }

  const pauseRecording = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.pauseAsync()
        setIsPaused(true)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pause recording')
    }
  }

  const resumeRecording = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.startAsync()
        setIsPaused(false)

        intervalRef.current = setInterval(() => {
          setDuration(prev => prev + 1000)
        }, 1000)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to resume recording')
    }
  }

  const stopRecording = async () => {
    try {
      if (!recordingRef.current) return

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      await recordingRef.current.stopAndUnloadAsync()
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      })

      const uri = recordingRef.current.getURI()
      setRecordingUri(uri)
      setIsRecording(false)
      setIsPaused(false)

      recordingRef.current = null
    } catch (error) {
      Alert.alert('Error', 'Failed to stop recording')
    }
  }

  const playRecording = async () => {
    if (!recordingUri) return

    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync()
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: recordingUri },
        { shouldPlay: true }
      )

      soundRef.current = sound
      setIsPlaying(true)

      sound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false)
        }
      })
    } catch (error) {
      Alert.alert('Error', 'Failed to play recording')
    }
  }

  const pausePlayback = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.pauseAsync()
        setIsPlaying(false)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pause playback')
    }
  }

  const deleteRecording = () => {
    if (soundRef.current) {
      soundRef.current.unloadAsync()
      soundRef.current = null
    }
    setRecordingUri(null)
    setDuration(0)
    setIsPlaying(false)
  }

  const handleSave = async () => {
    if (!recordingUri) return

    try {
      // Get file info
      const fileName = `audio_${Date.now()}.m4a`

      const attachment: Attachment = {
        id: Date.now().toString(),
        type: 'audio',
        uri: recordingUri,
        name: fileName,
        mimeType: 'audio/m4a',
        duration: duration / 1000, // Convert to seconds
      }

      onRecordingComplete(attachment)
      handleClose()
    } catch (error) {
      Alert.alert('Error', 'Failed to save recording')
    }
  }

  const handleClose = () => {
    if (recordingRef.current) {
      stopRecording()
    }
    if (soundRef.current) {
      soundRef.current.unloadAsync()
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsRecording(false)
    setIsPaused(false)
    setIsPlaying(false)
    setRecordingUri(null)
    setDuration(0)
    onClose()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Box
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <Box
          className="rounded-2xl p-6 m-6 w-full max-w-md"
          style={{ backgroundColor: colors.card }}
        >
          <VStack space="lg">
            <Text size="xl" bold style={{ color: colors.text, textAlign: 'center' }}>
              Audio Recorder
            </Text>

            {/* Duration display */}
            <Box className="items-center py-6">
              <Text size="3xl" bold style={{ color: colors.accent }}>
                {formatTime(duration)}
              </Text>
              {isRecording && !isPaused && (
                <HStack space="xs" className="items-center mt-2">
                  <Box
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: '#ef4444' }}
                  />
                  <Text size="sm" style={{ color: colors.mutedText }}>
                    Recording...
                  </Text>
                </HStack>
              )}
              {isPaused && (
                <Text size="sm" style={{ color: colors.mutedText }} className="mt-2">
                  Paused
                </Text>
              )}
            </Box>

            {/* Control buttons */}
            <VStack space="md">
              {!isRecording && !recordingUri && (
                <Button onPress={startRecording} size="lg">
                  <Icon as={Mic} size="md" className="mr-2" />
                  <ButtonText>Start Recording</ButtonText>
                </Button>
              )}

              {isRecording && (
                <HStack space="md">
                  <Button
                    onPress={isPaused ? resumeRecording : pauseRecording}
                    variant="outline"
                    style={{ flex: 1 }}
                  >
                    <Icon as={isPaused ? Play : Pause} size="sm" />
                  </Button>
                  <Button onPress={stopRecording} action="negative" style={{ flex: 1 }}>
                    <Icon as={Square} size="sm" className="mr-2" />
                    <ButtonText>Stop</ButtonText>
                  </Button>
                </HStack>
              )}

              {recordingUri && !isRecording && (
                <VStack space="md">
                  <HStack space="md">
                    <Button
                      onPress={isPlaying ? pausePlayback : playRecording}
                      variant="outline"
                      style={{ flex: 1 }}
                    >
                      <Icon as={isPlaying ? Pause : Play} size="sm" className="mr-2" />
                      <ButtonText>{isPlaying ? 'Pause' : 'Play'}</ButtonText>
                    </Button>
                    <Button onPress={deleteRecording} action="negative" variant="outline">
                      <Icon as={Trash2} size="sm" />
                    </Button>
                  </HStack>

                  <HStack space="md">
                    <Button onPress={handleSave} style={{ flex: 1 }}>
                      <Icon as={Check} size="sm" className="mr-2" />
                      <ButtonText>Save</ButtonText>
                    </Button>
                    <Button onPress={handleClose} variant="outline" style={{ flex: 1 }}>
                      <ButtonText>Cancel</ButtonText>
                    </Button>
                  </HStack>
                </VStack>
              )}

              {!isRecording && !recordingUri && (
                <Button onPress={handleClose} variant="outline">
                  <ButtonText>Cancel</ButtonText>
                </Button>
              )}
            </VStack>
          </VStack>
        </Box>
      </Box>
    </Modal>
  )
}
