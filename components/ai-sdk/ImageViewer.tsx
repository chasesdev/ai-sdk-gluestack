import React from 'react'
import {
  Modal,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native'
import { Box, Icon, Image } from '@gluestack-ui/themed'
import { X } from 'lucide-react-native'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

interface ImageViewerProps {
  visible: boolean
  imageUri: string
  imageName?: string
  onClose: () => void
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

export function ImageViewer({
  visible,
  imageUri,
  imageName,
  onClose,
}: ImageViewerProps) {
  const scale = useSharedValue(1)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const savedScale = useSharedValue(1)
  const savedTranslateX = useSharedValue(0)
  const savedTranslateY = useSharedValue(0)

  const pinchGesture = Gesture.Pinch()
    .onUpdate(event => {
      scale.value = savedScale.value * event.scale
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withSpring(1)
      } else if (scale.value > 4) {
        scale.value = withSpring(4)
      }
      savedScale.value = scale.value
    })

  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      translateX.value = savedTranslateX.value + event.translationX
      translateY.value = savedTranslateY.value + event.translationY
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value
      savedTranslateY.value = translateY.value
    })

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }))

  const resetZoom = () => {
    scale.value = withTiming(1)
    translateX.value = withTiming(0)
    translateY.value = withTiming(0)
    savedScale.value = 1
    savedTranslateX.value = 0
    savedTranslateY.value = 0
  }

  const handleClose = () => {
    resetZoom()
    onClose()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Box
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Close button */}
        <TouchableOpacity
          onPress={handleClose}
          style={{
            position: 'absolute',
            top: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 20,
            right: 20,
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 20,
            padding: 8,
          }}
        >
          <Icon as={X} size="lg" color="white" />
        </TouchableOpacity>

        {/* Image name */}
        {imageName && (
          <Box
            style={{
              position: 'absolute',
              top: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 20,
              left: 20,
              right: 80,
              zIndex: 10,
            }}
          >
            <Box
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Animated.Text
                style={{
                  color: 'white',
                  fontSize: 14,
                }}
                numberOfLines={1}
              >
                {imageName}
              </Animated.Text>
            </Box>
          </Box>
        )}

        {/* Zoomable image */}
        <GestureDetector gesture={composedGesture}>
          <Animated.View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, animatedStyle]}>
            <Image
              source={{ uri: imageUri }}
              alt={imageName || 'Full screen image'}
              style={{
                width: SCREEN_WIDTH,
                height: SCREEN_HEIGHT * 0.8,
                resizeMode: 'contain',
              }}
            />
          </Animated.View>
        </GestureDetector>

        {/* Double tap to zoom hint */}
        <Box
          style={{
            position: 'absolute',
            bottom: 40,
            alignSelf: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
          }}
        >
          <Animated.Text
            style={{
              color: 'white',
              fontSize: 12,
              opacity: 0.8,
            }}
          >
            Pinch to zoom • Drag to pan
          </Animated.Text>
        </Box>
      </Box>
    </Modal>
  )
}
