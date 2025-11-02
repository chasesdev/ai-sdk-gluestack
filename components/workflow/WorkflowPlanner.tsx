import React, { useState, useCallback, useMemo } from 'react'
import { ScrollView, StyleSheet, Dimensions } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Svg, { Defs, Pattern, Rect, Circle } from 'react-native-svg'
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
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
} from '@gluestack-ui/themed'
import { CloseIcon, AddIcon, CheckCircleIcon } from '@gluestack-ui/themed'
import { WorkflowNode } from './WorkflowNode'
import { WorkflowEdge } from './WorkflowEdge'
import type {
  WorkflowNode as WorkflowNodeType,
  WorkflowEdge as WorkflowEdgeType,
  Position,
  NodeStatus,
} from './types'
import { useTheme } from '../../contexts/ThemeContext'
import { getThemeColors } from '../../constants/theme'

const { width: screenWidth } = Dimensions.get('window')

interface WorkflowPlannerProps {
  initialNodes?: WorkflowNodeType[]
  initialEdges?: WorkflowEdgeType[]
  className?: string
}

export function WorkflowPlanner({
  initialNodes = [],
  initialEdges = [],
}: WorkflowPlannerProps) {
  const { resolvedTheme } = useTheme()
  const colors = getThemeColors(resolvedTheme === 'dark')
  const {
    background: bgColor,
    card: cardBg,
    text: textColor,
    mutedText: mutedTextColor,
    border: borderColor,
  } = colors
  const [nodes, setNodes] = useState<WorkflowNodeType[]>(initialNodes)
  const [edges, setEdges] = useState<WorkflowEdgeType[]>(initialEdges)
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>()
  const [isLocked, setIsLocked] = useState(false)
  const [scale, setScale] = useState(1)
  const [showAddNodeModal, setShowAddNodeModal] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  const nodeTypes = [
    {
      id: 'process',
      label: 'Process',
      icon: 'cpu',
      description: 'Data processing node',
    },
    {
      id: 'decision',
      label: 'Decision',
      icon: 'git-branch',
      description: 'Conditional branching',
    },
    {
      id: 'validation',
      label: 'Validation',
      icon: 'check-circle',
      description: 'Data validation step',
    },
  ]

  // Topological sort to get execution order (BFS from start node)
  const getExecutionOrder = useCallback(
    (nodes: WorkflowNodeType[], edges: WorkflowEdgeType[]): string[] => {
      const order: string[] = []
      const visited = new Set<string>()
      const queue: string[] = []

      // Start from the start node
      const startNode = nodes.find(n => n.id === 'start')
      if (!startNode) return []

      queue.push(startNode.id)
      visited.add(startNode.id)

      while (queue.length > 0) {
        const currentNodeId = queue.shift()!
        order.push(currentNodeId)

        // Add all connected nodes that haven't been visited
        edges
          .filter(e => e.source === currentNodeId)
          .forEach(edge => {
            if (!visited.has(edge.target)) {
              visited.add(edge.target)
              queue.push(edge.target)
            }
          })
      }

      return order
    },
    []
  )

  const executeWorkflow = useCallback(() => {
    if (isRunning) return

    setIsRunning(true)
    setSelectedNodeId('start')

    // Reset all nodes to idle
    setNodes(prev =>
      prev.map(node => ({
        ...node,
        data: { ...node.data, status: 'idle' as NodeStatus },
      }))
    )

    // Execute nodes in sequence based on edges
    const currentNodes = nodes
    const currentEdges = edges
    const executionOrder = getExecutionOrder(currentNodes, currentEdges)

    if (executionOrder.length === 0) {
      setIsRunning(false)
      return
    }

    executionOrder.forEach((nodeId, index) => {
      setTimeout(() => {
        setNodes(prev =>
          prev.map(node => {
            if (node.id === nodeId) {
              // Mark as running
              return {
                ...node,
                data: { ...node.data, status: 'running' as NodeStatus },
              }
            }
            return node
          })
        )

        // After a delay, mark as success
        setTimeout(() => {
          setNodes(prev =>
            prev.map(n =>
              n.id === nodeId
                ? { ...n, data: { ...n.data, status: 'success' as NodeStatus } }
                : n
            )
          )

          // If this is the last node, reset execution state
          if (index === executionOrder.length - 1) {
            setTimeout(() => {
              setIsRunning(false)
              setSelectedNodeId(undefined)
            }, 500)
          }
        }, 1500)
      }, index * 2000)
    })
  }, [nodes, edges, isRunning, getExecutionOrder])

  const handleNodePress = useCallback(
    (nodeId: string) => {
      const node = nodes.find(n => n.id === nodeId)

      // If it's the start node, execute the workflow
      if (node?.id === 'start' && !isRunning) {
        executeWorkflow()
      } else {
        setSelectedNodeId(nodeId)
      }
    },
    [nodes, isRunning, executeWorkflow]
  )

  const handleNodeDragStart = useCallback(
    (nodeId: string) => {
      if (isLocked) return
      setSelectedNodeId(nodeId)
    },
    [isLocked]
  )

  const handleNodeDrag = useCallback(
    (nodeId: string, position: Position) => {
      if (isLocked) return
      setNodes(prev =>
        prev.map(node => (node.id === nodeId ? { ...node, position } : node))
      )
    },
    [isLocked]
  )

  const handleNodeDragEnd = useCallback(() => {
    // Optional: Add snap-to-grid logic here
  }, [])

  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.1, 2))
  }, [])

  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.1, 0.5))
  }, [])

  const toggleLock = useCallback(() => {
    setIsLocked(prev => !prev)
  }, [])

  const handleAddNode = useCallback(
    (nodeType: string) => {
      const nodeTypeConfig = nodeTypes.find(t => t.id === nodeType)
      if (!nodeTypeConfig) return

      // Find a good position for the new node (bottom right of canvas)
      const maxX = Math.max(...nodes.map(n => n.position.x), 0)
      const maxY = Math.max(...nodes.map(n => n.position.y), 0)

      const newNode: WorkflowNodeType = {
        id: `node-${Date.now()}`,
        type: 'workflow',
        position: { x: maxX + 50, y: maxY + 150 },
        data: {
          label: nodeTypeConfig.label,
          description: nodeTypeConfig.description,
          code: `// ${nodeTypeConfig.label}\n// Add your code here`,
          language: 'typescript',
          icon:
            nodeType === 'process'
              ? 'cpu'
              : nodeType === 'decision'
                ? 'git-branch'
                : 'check-circle',
          status: 'idle',
        },
      }

      setNodes(prev => [...prev, newNode])
      setShowAddNodeModal(false)
      setSelectedNodeId(newNode.id)
    },
    [nodes]
  )

  // Calculate canvas size based on node positions (memoized for performance)
  const canvasWidth = useMemo(
    () => Math.max(screenWidth, ...nodes.map(n => n.position.x + 250)),
    [nodes, screenWidth]
  )
  const canvasHeight = useMemo(
    () => Math.max(800, ...nodes.map(n => n.position.y + 150)),
    [nodes]
  )

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Box style={[styles.container, { backgroundColor: bgColor }]}>
        {/* Toolbar */}
        <HStack
          space="sm"
          style={{
            backgroundColor: cardBg,
            borderBottomColor: borderColor,
            borderBottomWidth: 1,
            padding: 12,
          }}
        >
          <Button
            size="sm"
            variant="outline"
            onPress={() => setShowAddNodeModal(true)}
            isDisabled={isLocked}
          >
            <ButtonIcon as={AddIcon} />
            <ButtonText style={{ color: textColor }}>Add Node</ButtonText>
          </Button>

          <Button size="sm" variant="outline" onPress={toggleLock}>
            <ButtonText style={{ color: textColor }}>
              {isLocked ? '🔒' : '🔓'}
            </ButtonText>
          </Button>

          <Button size="sm" variant="outline" onPress={handleZoomIn}>
            <ButtonIcon as={AddIcon} />
          </Button>

          <Button size="sm" variant="outline" onPress={handleZoomOut}>
            <ButtonIcon as={CloseIcon} />
          </Button>

          {isRunning && (
            <Badge action="info">
              <BadgeText style={{ color: textColor }}>Running...</BadgeText>
            </Badge>
          )}

          <Badge sx={{ marginLeft: 'auto' }}>
            <BadgeText style={{ color: textColor }}>
              {Math.round(scale * 100)}%
            </BadgeText>
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
                backgroundColor: colors.background,
              },
            ]}
          >
            {/* Background Pattern */}
            <Svg
              width={canvasWidth}
              height={canvasHeight}
              style={StyleSheet.absoluteFill}
            >
              <Defs>
                <Pattern
                  id="dots"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <Circle cx="1" cy="1" r="1" fill={borderColor} />
                </Pattern>
              </Defs>
              <Rect
                width={canvasWidth}
                height={canvasHeight}
                fill="url(#dots)"
              />

              {/* Edges */}
              {edges.map(edge => {
                const sourceNode = nodes.find(n => n.id === edge.source)
                const targetNode = nodes.find(n => n.id === edge.target)
                if (!sourceNode || !targetNode) return null

                return (
                  <WorkflowEdge
                    key={edge.id}
                    edge={edge}
                    sourceNode={sourceNode}
                    targetNode={targetNode}
                  />
                )
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
        <HStack
          space="md"
          style={{
            backgroundColor: cardBg,
            borderTopColor: borderColor,
            borderTopWidth: 1,
            padding: 12,
            alignItems: 'center',
          }}
        >
          <VStack>
            <Text size="xs" style={{ color: mutedTextColor }}>
              Nodes
            </Text>
            <Text size="sm" fontWeight="$semibold" style={{ color: textColor }}>
              {nodes.length}
            </Text>
          </VStack>
          <VStack>
            <Text size="xs" style={{ color: mutedTextColor }}>
              Connections
            </Text>
            <Text size="sm" fontWeight="$semibold" style={{ color: textColor }}>
              {edges.length}
            </Text>
          </VStack>
          {selectedNodeId && (
            <Badge action="info" sx={{ marginLeft: 'auto' }}>
              <BadgeText style={{ color: textColor }}>
                {nodes.find(n => n.id === selectedNodeId)?.data.label ||
                  'Selected'}
              </BadgeText>
            </Badge>
          )}
        </HStack>
      </Box>

      {/* Add Node Modal */}
      <Actionsheet
        isOpen={showAddNodeModal}
        onClose={() => setShowAddNodeModal(false)}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent style={{ backgroundColor: cardBg }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <Box style={{ width: '100%', paddingHorizontal: 16, paddingTop: 16 }}>
            <Heading size="md" style={{ color: textColor, marginBottom: 16 }}>
              Add Node
            </Heading>
            <VStack space="sm">
              {nodeTypes.map(nodeType => {
                // Use emoji or text for icons since we don't have all icon components
                const iconEmoji =
                  nodeType.icon === 'cpu'
                    ? '⚙️'
                    : nodeType.icon === 'git-branch'
                      ? '🌿'
                      : '✓'
                return (
                  <ActionsheetItem
                    key={nodeType.id}
                    onPress={() => handleAddNode(nodeType.id)}
                  >
                    <Text style={{ fontSize: 24, marginRight: 12 }}>
                      {iconEmoji}
                    </Text>
                    <VStack flex={1}>
                      <Text style={{ color: textColor, fontWeight: '600' }}>
                        {nodeType.label}
                      </Text>
                      <Text size="sm" style={{ color: mutedTextColor }}>
                        {nodeType.description}
                      </Text>
                    </VStack>
                  </ActionsheetItem>
                )
              })}
            </VStack>
          </Box>
        </ActionsheetContent>
      </Actionsheet>
    </GestureHandlerRootView>
  )
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
})
