// Type definitions for React Native Workflow Planner

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type NodeStatus = 'idle' | 'running' | 'success' | 'error';

export type HandlePosition = 'top' | 'right' | 'bottom' | 'left';

export interface Handle {
  id: string;
  position: HandlePosition;
  type: 'source' | 'target';
}

export interface WorkflowNodeData {
  label: string;
  description?: string;
  code?: string;
  language?: string;
  icon?: string;
  status?: NodeStatus;
}

export interface WorkflowNode {
  id: string;
  type: string;
  position: Position;
  data: WorkflowNodeData;
  handles?: Handle[];
  size?: Size;
}

export interface EdgeStyle {
  stroke?: string;
  strokeWidth?: number;
  animated?: boolean;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: 'default' | 'animated' | 'bezier';
  style?: EdgeStyle;
  label?: string;
  animated?: boolean;
}

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

export interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  viewport: Viewport;
  selectedNodeId?: string;
  selectedEdgeId?: string;
  mode: 'view' | 'edit' | 'connect';
  isLocked: boolean;
}

export interface ConnectionState {
  isConnecting: boolean;
  sourceNodeId?: string;
  sourceHandleId?: string;
  currentPosition?: Position;
}

// Helper type for coordinate transformation
export interface TransformConfig {
  viewport: Viewport;
  canvasSize: Size;
}

// Event types
export interface NodeDragEvent {
  nodeId: string;
  position: Position;
  delta: Position;
}

export interface EdgeCreateEvent {
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface SelectionEvent {
  nodeId?: string;
  edgeId?: string;
}
