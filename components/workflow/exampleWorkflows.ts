import type { WorkflowNode, WorkflowEdge } from './types';

// Example workflow demonstrating AI data processing pipeline
export const exampleNodes: WorkflowNode[] = [
  {
    id: 'start',
    type: 'workflow',
    position: { x: 50, y: 50 },
    data: {
      label: 'Start Process',
      description: 'Initialize workflow',
      code: `async function start() {
  return { status: 'ready' };
}`,
      language: 'typescript',
      icon: 'play',
      status: 'success',
    },
  },
  {
    id: 'fetch',
    type: 'workflow',
    position: { x: 50, y: 200 },
    data: {
      label: 'Fetch Data',
      description: 'Load data from API',
      code: `const data = await fetch(
  '/api/data'
).then(r => r.json());`,
      language: 'typescript',
      icon: 'cpu',
      status: 'running',
    },
  },
  {
    id: 'validate',
    type: 'workflow',
    position: { x: 50, y: 380 },
    data: {
      label: 'Validate',
      description: 'Check data quality',
      code: `if (!isValid(data)) {
  throw new Error();
}`,
      language: 'typescript',
      icon: 'check-circle',
      status: 'idle',
    },
  },
  {
    id: 'branch',
    type: 'workflow',
    position: { x: 300, y: 380 },
    data: {
      label: 'Decision',
      description: 'Route based on type',
      code: `return data.type === 'A'
  ? processA()
  : processB();`,
      language: 'typescript',
      icon: 'git-branch',
      status: 'idle',
    },
  },
  {
    id: 'processA',
    type: 'workflow',
    position: { x: 200, y: 560 },
    data: {
      label: 'Process A',
      description: 'Handle type A data',
      code: `await processTypeA(
  data
);`,
      language: 'typescript',
      icon: 'cpu',
      status: 'idle',
    },
  },
  {
    id: 'processB',
    type: 'workflow',
    position: { x: 400, y: 560 },
    data: {
      label: 'Process B',
      description: 'Handle type B data',
      code: `await processTypeB(
  data
);`,
      language: 'typescript',
      icon: 'cpu',
      status: 'idle',
    },
  },
  {
    id: 'complete',
    type: 'workflow',
    position: { x: 300, y: 720 },
    data: {
      label: 'Complete',
      description: 'Finalize workflow',
      code: `return {
  success: true,
  result: data
};`,
      language: 'typescript',
      icon: 'check',
      status: 'idle',
    },
  },
];

export const exampleEdges: WorkflowEdge[] = [
  {
    id: 'e1',
    source: 'start',
    target: 'fetch',
    type: 'animated',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 2 },
  },
  {
    id: 'e2',
    source: 'fetch',
    target: 'validate',
    type: 'animated',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 },
  },
  {
    id: 'e3',
    source: 'validate',
    target: 'branch',
    type: 'animated',
    animated: false,
    style: { stroke: '#94a3b8', strokeWidth: 2 },
  },
  {
    id: 'e4',
    source: 'branch',
    target: 'processA',
    type: 'animated',
    animated: false,
    label: 'Type A',
    style: { stroke: '#8b5cf6', strokeWidth: 2 },
  },
  {
    id: 'e5',
    source: 'branch',
    target: 'processB',
    type: 'animated',
    animated: false,
    label: 'Type B',
    style: { stroke: '#ec4899', strokeWidth: 2 },
  },
  {
    id: 'e6',
    source: 'processA',
    target: 'complete',
    type: 'animated',
    animated: false,
    style: { stroke: '#94a3b8', strokeWidth: 2 },
  },
  {
    id: 'e7',
    source: 'processB',
    target: 'complete',
    type: 'animated',
    animated: false,
    style: { stroke: '#94a3b8', strokeWidth: 2 },
  },
];
