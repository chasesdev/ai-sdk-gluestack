// Type definitions for AI SDK components

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

export interface ActionItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export type ActionsLayout = 'horizontal' | 'vertical' | 'grid';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  isLoading?: boolean;
}

export interface WorkflowNode {
  id: string;
  label: string;
  type: 'start' | 'process' | 'decision' | 'end' | 'action';
  description?: string;
  code?: string;
  position?: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface Workflow {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

