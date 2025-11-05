import React, { memo } from 'react'
import { StyleSheet, Platform } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated'
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  BadgeText,
  Icon,
  Button,
  ButtonText,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
} from '@gluestack-ui/themed'
import { useTheme } from '../../contexts/ThemeContext'
import { getThemeColors } from '../../constants/theme'
import {
  AddIcon,
  CircleIcon,
  InfoIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  CheckIcon,
  EditIcon,
  CopyIcon,
  TrashIcon,
} from '@gluestack-ui/themed'
import type { WorkflowNode as WorkflowNodeType, Position } from './types'
import { useContextMenuGesture } from '../../app/hooks/useTouchGestures'

interface WorkflowNodeProps {
  node: WorkflowNodeType
  isSelected: boolean
  onPress: (nodeId: string) => void
  onDragStart: (nodeId: string) => void
  onDrag: (nodeId: string, position: Position) => void
  onDragEnd: (nodeId: string) => void
  scale: number
  disabled?: boolean
  onEdit?: (nodeId: string) => void
  onDuplicate?: (nodeId: string) => void
  onDelete?: (nodeId: string) => void
}

const iconMap = {
  play: AddIcon,
  cpu: CircleIcon,
  'git-branch': InfoIcon,
  'check-circle': CheckCircleIcon,
  'alert-circle': AlertCircleIcon,
  check: CheckIcon,
}

const statusColors = {
  idle: {
    bg: '$backgroundLight100',
    border: '$borderLight300',
    badge: 'muted' as const,
  },
  running: {
    bg: '$blue50',
    border: '$blue500',
    badge: 'info' as const,
  },
  success: {
    bg: '$green50',
    border: '$green500',
    badge: 'success' as const,
  },
  error: {
    bg: '$red50',
    border: '$red500',
    badge: 'error' as const,
  },
}

export const WorkflowNode = memo(
  ({
    node,
    isSelected,
    onPress,
    onDragStart,
    onDrag,
    onDragEnd,
    scale,
    disabled = false,
    onEdit,
    onDuplicate,
    onDelete,
  }: WorkflowNodeProps) => {
    const translateX = useSharedValue(node.position.x)
    const translateY = useSharedValue(node.position.y)
    const isDragging = useSharedValue(false)
    const startX = useSharedValue(0)
    const startY = useSharedValue(0)
    const isDraggingRef = React.useRef(false)
    const [showContextMenu, setShowContextMenu] = React.useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)

    // Pulse animation for running status
    const pulseScale = useSharedValue(1)

    const handleContextMenu = React.useCallback(() => {
      setShowContextMenu(true)
    }, [])

    const handleEdit = React.useCallback(() => {
      onEdit?.(node.id)
      setShowContextMenu(false)
    }, [node.id, onEdit])

    const handleDuplicate = React.useCallback(() => {
      onDuplicate?.(node.id)
      setShowContextMenu(false)
    }, [node.id, onDuplicate])

    const handleDelete = React.useCallback(() => {
      onDelete?.(node.id)
      setShowDeleteDialog(false)
      setShowContextMenu(false)
    }, [node.id, onDelete])

    const handleDeleteConfirm = React.useCallback(() => {
      setShowDeleteDialog(true)
      setShowContextMenu(false)
    }, [])

    // Context menu gesture for right-click on web and long-press on mobile
    const { gesture: contextMenuGesture, contextMenuProps } = useContextMenuGesture(
      handleContextMenu,
      { enabled: !disabled }
    )

    // Sync shared values with node position prop changes (but not during drag)
    // Using setTimeout to ensure this runs after render phase
    React.useEffect(() => {
      if (!isDraggingRef.current) {
        const timer = setTimeout(() => {
          translateX.value = node.position.x
          translateY.value = node.position.y
        }, 0)
        return () => clearTimeout(timer)
      }
    }, [node.position.x, node.position.y])

    React.useEffect(() => {
      if (node.data.status === 'running') {
        pulseScale.value = withRepeat(
          withTiming(1.05, {
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true
        )
      } else {
        pulseScale.value = withTiming(1, { duration: 200 })
      }
    }, [node.data.status])

    const panGesture = Gesture.Pan()
      .enabled(!disabled)
      .onStart(() => {
        'worklet'
        isDragging.value = true
        isDraggingRef.current = true
        startX.value = translateX.value
        startY.value = translateY.value
        runOnJS(onDragStart)(node.id)
      })
      .onUpdate(event => {
        'worklet'
        const newX = startX.value + event.translationX / scale
        const newY = startY.value + event.translationY / scale
        translateX.value = newX
        translateY.value = newY
        runOnJS(onDrag)(node.id, {
          x: newX,
          y: newY,
        })
      })
      .onEnd(() => {
        'worklet'
        isDragging.value = false
        isDraggingRef.current = false
        runOnJS(onDragEnd)(node.id)
      })

    const tapGesture = Gesture.Tap().onEnd(() => {
      runOnJS(onPress)(node.id)
    })

    const composed = Gesture.Race(panGesture, tapGesture, contextMenuGesture)

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
          { scale: withSpring(isDragging.value ? 1.05 : pulseScale.value) },
        ],
        zIndex: isDragging.value ? 1000 : 1,
      }
    })

    const { resolvedTheme } = useTheme()
    const themeColors = getThemeColors(resolvedTheme === 'dark')
    const {
      text: textColor,
      mutedText: mutedTextColor,
      card: cardBg,
      border: borderColor,
    } = themeColors
    const status = node.data.status || 'idle'
    const statusColorConfig = statusColors[status]
    const NodeIcon = node.data.icon
      ? iconMap[node.data.icon as keyof typeof iconMap]
      : CircleIcon

    return (
      <GestureDetector gesture={composed}>
        <Animated.View
          style={[styles.nodeContainer, animatedStyle]}
          accessibilityRole="button"
          accessibilityLabel={`${node.data.label} node, status: ${status}`}
          accessibilityHint={
            disabled ? 'Node is disabled' : 'Double tap to select, drag to move, long press for options'
          }
          accessibilityState={{ selected: isSelected, disabled }}
          {...contextMenuProps}
        >
          <Box
            style={[
              styles.node,
              {
                borderWidth: isSelected ? 3 : 2,
                borderColor: isSelected ? themeColors.accent : borderColor,
                backgroundColor: cardBg,
                borderRadius: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              },
            ]}
          >
            <VStack space="xs">
              {/* Header */}
              <HStack space="sm" sx={{ alignItems: 'center' }}>
                <Box
                  style={{ 
                    borderRadius: 8, 
                    backgroundColor: isSelected
                      ? themeColors.info
                      : status === 'running'
                        ? themeColors.info
                        : status === 'success'
                          ? themeColors.success
                          : status === 'error'
                            ? themeColors.error
                            : themeColors.mutedText,
                  }}
                >
                  {NodeIcon && (
                    <Icon
                      as={NodeIcon}
                      size="sm"
                      style={{ color: themeColors.background }}
                    />
                  )}
                </Box>
                <VStack flex={1}>
                  <Heading size="sm" style={{ color: textColor }}>
                    {node.data.label}
                  </Heading>
                  {node.data.description && (
                    <Text size="xs" style={{ color: mutedTextColor }}>
                      {node.data.description}
                    </Text>
                  )}
                </VStack>
                <Badge action={statusColorConfig.badge}>
                  <BadgeText style={{ color: textColor }}>{status}</BadgeText>
                </Badge>
              </HStack>

              {/* Code Block */}
              {node.data.code && (
                <Box
                  style={{
                    borderRadius: 6,
                    marginTop: 4,
                    borderWidth: 1,
                    borderColor: borderColor,
                    backgroundColor: cardBg,
                  }}
                >
                  <Text
                    size="xs"
                    fontFamily="$mono"
                    numberOfLines={3}
                    style={{ color: mutedTextColor }}
                  >
                    {node.data.code}
                  </Text>
                </Box>
              )}

              {/* Connection Handles */}
              {node.data.icon === 'git-branch' && (
                <HStack space="xs" sx={{ marginTop: '$1', justifyContent: 'space-around' }}>
                  <Box
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 9999,
                      backgroundColor: themeColors.info,
                    }}
                  />
                  <Box
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 9999,
                      backgroundColor: themeColors.info,
                    }}
                  />
                </HStack>
              )}
            </VStack>

            {/* Input Handle (top) */}
            <Box
              style={[
                styles.handleTop,
                {
                  backgroundColor: themeColors.mutedText,
                  borderWidth: 2,
                  borderColor: themeColors.background,
                  width: 12,
                  height: 12,
                  borderRadius: 9999,
                },
              ]}
            />

            {/* Output Handle (bottom) */}
            <Box
              style={[
                styles.handleBottom,
                {
                  backgroundColor: themeColors.mutedText,
                  borderWidth: 2,
                  borderColor: themeColors.background,
                  width: 12,
                  height: 12,
                  borderRadius: 9999,
                },
              ]}
            />
          </Box>

        {/* Context Menu Actionsheet */}
        {showContextMenu && (
          <Actionsheet isOpen={showContextMenu} onClose={() => setShowContextMenu(false)}>
            <ActionsheetBackdrop />
            <ActionsheetContent>
              <ActionsheetDragIndicatorWrapper>
                <ActionsheetDragIndicator />
              </ActionsheetDragIndicatorWrapper>

              {onEdit && (
                <ActionsheetItem onPress={handleEdit}>
                  <Icon as={EditIcon} mr="$3" />
                  <Text>Edit Node</Text>
                </ActionsheetItem>
              )}

              {onDuplicate && (
                <ActionsheetItem onPress={handleDuplicate}>
                  <Icon as={CopyIcon} mr="$3" />
                  <Text>Duplicate Node</Text>
                </ActionsheetItem>
              )}

              {onDelete && (
                <ActionsheetItem onPress={handleDeleteConfirm}>
                  <Icon as={TrashIcon} mr="$3" />
                  <Text>Delete Node</Text>
                </ActionsheetItem>
              )}
            </ActionsheetContent>
          </Actionsheet>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && (
          <AlertDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
            <AlertDialogBackdrop />
            <AlertDialogContent>
              <AlertDialogHeader>
                <Heading size="lg">Delete Node</Heading>
              </AlertDialogHeader>
              <AlertDialogBody>
                <Text>Are you sure you want to delete "{node.data.label}"? This action cannot be undone.</Text>
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
      </GestureDetector>
    )
  }
)

const styles = StyleSheet.create({
  nodeContainer: {
    position: 'absolute',
    width: 200,
  },
  node: {
    padding: 4,
    minHeight: 100,
    position: 'relative',
  },
  handleTop: {
    position: 'absolute',
    top: -6,
    left: '50%',
    marginLeft: -6,
  },
  handleBottom: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -6,
  },
})

WorkflowNode.displayName = 'WorkflowNode'
