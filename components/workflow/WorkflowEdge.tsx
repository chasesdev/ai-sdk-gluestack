import React, { memo } from 'react';
import { Path, Circle, Text as SVGText, G } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import type { WorkflowEdge as WorkflowEdgeType, WorkflowNode, Position } from './types';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface WorkflowEdgeProps {
  edge: WorkflowEdgeType;
  sourceNode: WorkflowNode;
  targetNode: WorkflowNode;
  onPress?: (edgeId: string) => void;
}

// Calculate bezier curve path
function getBezierPath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number
): string {
  const centerY = (sourceY + targetY) / 2;

  return `M ${sourceX},${sourceY} C ${sourceX},${centerY} ${targetX},${centerY} ${targetX},${targetY}`;
}

// Calculate point along bezier curve for animation
// Must be a worklet to be called on UI thread
function getPointAtT(
  t: number,
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number
): Position {
  'worklet';
  const centerY = (sourceY + targetY) / 2;

  // Cubic bezier formula
  const x = Math.pow(1 - t, 3) * sourceX +
            3 * Math.pow(1 - t, 2) * t * sourceX +
            3 * (1 - t) * Math.pow(t, 2) * targetX +
            Math.pow(t, 3) * targetX;

  const y = Math.pow(1 - t, 3) * sourceY +
            3 * Math.pow(1 - t, 2) * t * centerY +
            3 * (1 - t) * Math.pow(t, 2) * centerY +
            Math.pow(t, 3) * targetY;

  return { x, y };
}

export const WorkflowEdge = memo(({
  edge,
  sourceNode,
  targetNode,
  onPress,
}: WorkflowEdgeProps) => {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    if (edge.animated) {
      progress.value = withRepeat(
        withTiming(1, {
          duration: 2000,
          easing: Easing.linear,
        }),
        -1,
        false
      );
    }
  }, [edge.animated]);

  // Calculate source and target positions (center bottom and center top of nodes)
  const sourceX = sourceNode.position.x + 110; // Half of node width (220/2)
  const sourceY = sourceNode.position.y + 100; // Approximate node height
  const targetX = targetNode.position.x + 110;
  const targetY = targetNode.position.y;

  const path = getBezierPath(sourceX, sourceY, targetX, targetY);

  const animatedDotProps = useAnimatedProps(() => {
    const point = getPointAtT(progress.value, sourceX, sourceY, targetX, targetY);
    return {
      cx: point.x,
      cy: point.y,
    };
  });

  const { resolvedTheme } = useTheme();
  const colors = getThemeColors(resolvedTheme === 'dark');

  const strokeColor = edge.style?.stroke || colors.border;
  const strokeWidth = edge.style?.strokeWidth || 2;

  return (
    <G>
      {/* Main path */}
      <Path
        d={path}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        onPress={() => onPress?.(edge.id)}
      />

      {/* Animated dot */}
      {edge.animated && (
        <AnimatedCircle
          animatedProps={animatedDotProps}
          r={4}
          fill={strokeColor}
          opacity={0.8}
        />
      )}

      {/* Edge label */}
      {edge.label && (
        <G>
          <SVGText
            x={(sourceX + targetX) / 2}
            y={(sourceY + targetY) / 2}
            fill={colors.text}
            fontSize="12"
            fontWeight="600"
            textAnchor="middle"
          >
            {edge.label}
          </SVGText>
        </G>
      )}
    </G>
  );
});

WorkflowEdge.displayName = 'WorkflowEdge';
