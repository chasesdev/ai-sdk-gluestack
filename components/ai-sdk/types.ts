// Type definitions for AI SDK components

export type ConnectionStatus =
  | 'connected'
  | 'connecting'
  | 'disconnected'
  | 'error'

export interface ActionItem {
  id: string
  label: string
  icon?: React.ReactNode
  onPress?: () => void
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  action?: 'primary' | 'secondary' | 'positive' | 'negative' | 'default'
}

export type ActionsLayout = 'horizontal' | 'vertical' | 'grid'

export type AttachmentType = 'image' | 'document' | 'audio'

export interface Attachment {
  id: string
  type: AttachmentType
  uri: string
  name: string
  mimeType?: string
  size?: number
  duration?: number // For audio files
  width?: number // For images
  height?: number // For images
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: Date
  isLoading?: boolean
  attachments?: Attachment[]
}

export interface WorkflowNode {
  id: string
  label: string
  type: 'start' | 'process' | 'decision' | 'end' | 'action'
  description?: string
  code?: string
  position?: { x: number; y: number }
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  label?: string
}

export interface Workflow {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}
