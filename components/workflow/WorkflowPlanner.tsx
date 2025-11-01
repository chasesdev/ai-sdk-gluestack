import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Svg, { Defs, Pattern, Rect, Circle } from 'react-native-svg';
import {
  Box,
  VStack,
  HStack,
  Button,
  ButtonText,
  ButtonIcon,
  Badge,
  BadgeText,
  Heading,
  Text,
} from '@gluestack-ui/themed';
import { CloseIcon, AddIcon } from '@gluestack-ui/themed';
import { WorkflowNode } from './WorkflowNode';
import { WorkflowEdge } from './WorkflowEdge';
import type { WorkflowNode as WorkflowNodeType, WorkflowEdge as WorkflowEdgeType, Position } from './types';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

interface WorkflowPlannerProps {
  initialNodes?: WorkflowNodeType[];
  initialEdges?: WorkflowEdgeType[];
  className?: string;
}

export function WorkflowPlanner({
  initialNodes = [],
  initialEdges = [],
}: WorkflowPlannerProps) {
  const { resolvedTheme } = useTheme();
  const colors = getThemeColors(resolvedTheme === 'dark');
  const { background: bgColor, card: cardBg, text: textColor, mutedText: mutedTextColor, border: borderColor } = colors;
  const [nodes, setNodes] = useState<WorkflowNodeType[]>(initialNodes);
  const [edges, setEdges] = useState<WorkflowEdgeType[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>();
  const [isLocked, setIsLocked] = useState(false);
  const [scale, setScale] = useState(1);

  const handleNodePress = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  const handleNodeDragStart = useCallback((nodeId: string) => {
    if (isLocked) return;
    setSelectedNodeId(nodeId);
  }, [isLocked]);

  const handleNodeDrag = useCallback((nodeId: string, position: Position) => {
    if (isLocked) return;
    setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, position } : node
    ));
  }, [isLocked]);

  const handleNodeDragEnd = useCallback(() => {
    // Optional: Add snap-to-grid logic here
  }, []);

  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.1, 2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  }, []);

  const toggleLock = useCallback(() => {
    setIsLocked(prev => !prev);
  }, []);

  // Calculate canvas size based on node positions
  const canvasWidth = Math.max(
    screenWidth,
    ...nodes.map(n => n.position.x + 250)
  );
  const canvasHeight = Math.max(
    800,
    ...nodes.map(n => n.position.y + 150)
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Box style={[styles.container, { backgroundColor: bgColor }]}>
        {/* Toolbar */}
        <HStack space="sm" className="p-3 bg-card border-b border-border" style={{ backgroundColor: cardBg, borderBottomColor: borderColor }}>
          <Button
            size="sm"
            variant="outline"
            onPress={toggleLock}
          >
            <ButtonText>{isLocked ? '🔒 Locked' : '🔓 Unlocked'}</ButtonText>
          </Button>

          <Button size="sm" variant="outline" onPress={handleZoomIn}>
            <ButtonIcon as={AddIcon} />
            <ButtonText>+</ButtonText>
          </Button>

          <Button size="sm" variant="outline" onPress={handleZoomOut}>
            <ButtonIcon as={CloseIcon} />
            <ButtonText>-</ButtonText>
          </Button>

          <Badge className="ml-auto">
            <BadgeText>Zoom: {Math.round(scale * 100)}%</BadgeText>
          </Badge>
        </HStack>

        {/* Canvas */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{
            width: canvasWidth * scale,
            height: canvasHeight * scale,
          }}
          showsHorizontalScrollIndicator
          showsVerticalScrollIndicator
          bounces={false}
        >
          <Box
            style={[
              styles.canvas,
              {
                width: canvasWidth,
                height: canvasHeight,
                transform: [{ scale }],
                backgroundColor: colors.muted || (resolvedTheme === 'dark' ? '#1f2937' : '#f9fafb'),
              },
            ]}
          >
            {/* Background Pattern */}
            <Svg width={canvasWidth} height={canvasHeight} style={StyleSheet.absoluteFill}>
              <Defs>
                <Pattern
                  id="dots"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <Circle cx="1" cy="1" r="1" fill={resolvedTheme === 'dark' ? '#374151' : '#d1d5db'} />
                </Pattern>
              </Defs>
              <Rect width={canvasWidth} height={canvasHeight} fill="url(#dots)" />

              {/* Edges */}
              {edges.map(edge => {
                const sourceNode = nodes.find(n => n.id === edge.source);
                const targetNode = nodes.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                return (
                  <WorkflowEdge
                    key={edge.id}
                    edge={edge}
                    sourceNode={sourceNode}
                    targetNode={targetNode}
                  />
                );
              })}
            </Svg>

            {/* Nodes */}
            {nodes.map(node => (
              <WorkflowNode
                key={node.id}
                node={node}
                isSelected={node.id === selectedNodeId}
                onPress={handleNodePress}
                onDragStart={handleNodeDragStart}
                onDrag={handleNodeDrag}
                onDragEnd={handleNodeDragEnd}
                scale={scale}
                disabled={isLocked}
              />
            ))}
          </Box>
        </ScrollView>

        {/* Stats Footer */}
        <HStack space="md" className="p-3 bg-card border-t border-border items-center" style={{ backgroundColor: cardBg, borderTopColor: borderColor }}>
          <VStack>
            <Text size="xs" color="$textLight500" style={{ color: mutedTextColor }}>
              Nodes
            </Text>
            <Text size="sm" fontWeight="$semibold" color="$textLight900" style={{ color: textColor }}>
              {nodes.length}
            </Text>
          </VStack>
          <VStack>
            <Text size="xs" color="$textLight500" style={{ color: mutedTextColor }}>
              Connections
            </Text>
            <Text size="sm" fontWeight="$semibold" color="$textLight900" style={{ color: textColor }}>
              {edges.length}
            </Text>
          </VStack>
          {selectedNodeId && (
            <Badge action="info" className="ml-auto">
              <BadgeText>
                {nodes.find(n => n.id === selectedNodeId)?.data.label || 'Selected'}
              </BadgeText>
            </Badge>
          )}
        </HStack>
      </Box>
    </GestureHandlerRootView>
  );
}

// Note: Background colors are now set dynamically in the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  canvas: {
    position: 'relative',
    transformOrigin: 'top left',
  },
});
