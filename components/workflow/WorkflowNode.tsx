import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  BadgeText,
  Icon,
} from '@gluestack-ui/themed';
import {
  PlayIcon,
  CpuIcon,
  GitBranchIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  CheckIcon,
} from '@gluestack-ui/themed';
import type { WorkflowNode as WorkflowNodeType, Position } from './types';

interface WorkflowNodeProps {
  node: WorkflowNodeType;
  isSelected: boolean;
  onPress: (nodeId: string) => void;
  onDragStart: (nodeId: string) => void;
  onDrag: (nodeId: string, position: Position) => void;
  onDragEnd: (nodeId: string) => void;
  scale: number;
  disabled?: boolean;
}

const iconMap = {
  play: PlayIcon,
  cpu: CpuIcon,
  'git-branch': GitBranchIcon,
  'check-circle': CheckCircleIcon,
  'alert-circle': AlertCircleIcon,
  check: CheckIcon,
};

const statusColors = {
  idle: {
    bg: '$backgroundLight100',
    border: '$borderLight300',
    badge: 'muted',
  },
  running: {
    bg: '$blue50',
    border: '$blue500',
    badge: 'info',
  },
  success: {
    bg: '$green50',
    border: '$green500',
    badge: 'success',
  },
  error: {
    bg: '$red50',
    border: '$red500',
    badge: 'error',
  },
};

export const WorkflowNode = memo(({
  node,
  isSelected,
  onPress,
  onDragStart,
  onDrag,
  onDragEnd,
  scale,
  disabled = false,
}: WorkflowNodeProps) => {
  const translateX = useSharedValue(node.position.x);
  const translateY = useSharedValue(node.position.y);
  const isDragging = useSharedValue(false);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  // Pulse animation for running status
  const pulseScale = useSharedValue(1);

  React.useEffect(() => {
    if (node.data.status === 'running') {
      pulseScale.value = withRepeat(
        withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 200 });
    }
  }, [node.data.status]);

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onStart(() => {
      isDragging.value = true;
      startX.value = translateX.value;
      startY.value = translateY.value;
      runOnJS(onDragStart)(node.id);
    })
    .onUpdate((event) => {
      translateX.value = startX.value + event.translationX / scale;
      translateY.value = startY.value + event.translationY / scale;
      runOnJS(onDrag)(node.id, {
        x: translateX.value,
        y: translateY.value,
      });
    })
    .onEnd(() => {
      isDragging.value = false;
      runOnJS(onDragEnd)(node.id);
    });

  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      runOnJS(onPress)(node.id);
    });

  const composed = Gesture.Race(panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: withSpring(isDragging.value ? 1.05 : pulseScale.value) },
      ],
      zIndex: isDragging.value ? 1000 : 1,
    };
  });

  const status = node.data.status || 'idle';
  const colors = statusColors[status];
  const NodeIcon = node.data.icon ? iconMap[node.data.icon as keyof typeof iconMap] : CpuIcon;

  return (
    <GestureDetector gesture={composed}>
      <Animated.View
        style={[
          styles.nodeContainer,
          animatedStyle,
        ]}
      >
        <Box
          style={[
            styles.node,
            {
              borderWidth: isSelected ? 3 : 2,
              borderColor: isSelected ? '#3b82f6' : colors.border,
            },
          ]}
          bg={colors.bg}
          className="rounded-xl shadow-lg"
        >
          <VStack space="xs">
            {/* Header */}
            <HStack space="sm" className="items-center">
              <Box
                className="rounded-lg p-2"
                style={{
                  backgroundColor: isSelected ? '#3b82f6' :
                    status === 'running' ? '#3b82f6' :
                    status === 'success' ? '#10b981' :
                    status === 'error' ? '#ef4444' : '#6b7280'
                }}
              >
                {NodeIcon && <Icon as={NodeIcon} size="sm" color="$white" />}
              </Box>
              <VStack flex={1}>
                <Heading size="sm" color="$textLight900" style={{ color: '#0f172a' }}>
                  {node.data.label}
                </Heading>
                {node.data.description && (
                  <Text size="xs" color="$textLight500" style={{ color: '#64748b' }}>
                    {node.data.description}
                  </Text>
                )}
              </VStack>
              <Badge action={colors.badge as any}>
                <BadgeText>{status}</BadgeText>
              </Badge>
            </HStack>

            {/* Code Block */}
            {node.data.code && (
              <Box
                className="rounded-md p-2 mt-1"
                bg="$backgroundLight50"
                style={{ borderWidth: 1, borderColor: '#e5e7eb' }}
              >
                <Text
                  size="xs"
                  fontFamily="$mono"
                  color="$textLight700"
                  numberOfLines={3}
                  style={{ color: '#334155' }}
                >
                  {node.data.code}
                </Text>
              </Box>
            )}

            {/* Connection Handles */}
            {node.data.icon === 'git-branch' && (
              <HStack space="xs" className="mt-1 justify-around">
                <Box className="w-3 h-3 rounded-full bg-blue-500" />
                <Box className="w-3 h-3 rounded-full bg-blue-500" />
              </HStack>
            )}
          </VStack>

          {/* Input Handle (top) */}
          <Box
            style={styles.handleTop}
            className="w-3 h-3 rounded-full bg-gray-400 border-2 border-white"
          />

          {/* Output Handle (bottom) */}
          <Box
            style={styles.handleBottom}
            className="w-3 h-3 rounded-full bg-gray-400 border-2 border-white"
          />
        </Box>
      </Animated.View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  nodeContainer: {
    position: 'absolute',
    width: 220,
  },
  node: {
    padding: 12,
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
});

WorkflowNode.displayName = 'WorkflowNode';
