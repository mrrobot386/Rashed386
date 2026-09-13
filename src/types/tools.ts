/**
 * Tool Type Definitions for ANISA AI ULTRA
 */

export type PermissionLevel = 'SAFE' | 'CONFIRMATION_REQUIRED' | 'RESTRICTED';

export interface ToolParameterSchema {
  type: string;
  description?: string;
  enum?: string[];
  properties?: Record<string, ToolParameterSchema>;
  required?: string[];
}

export interface RegisteredToolDefinition {
  name: string;
  description: string;
  permissionLevel: PermissionLevel;
  parameters: {
    type: string;
    properties: Record<string, ToolParameterSchema>;
    required?: string[];
  };
  requiresVerification?: boolean;
}

export interface ToolExecutionEvent {
  id: string;
  name: string;
  action?: string;
  status: 'pending' | 'executing' | 'verifying' | 'success' | 'failed' | 'cancelled';
  args: Record<string, unknown>;
  result?: Record<string, unknown>;
  timestamp: number;
  durationMs?: number;
  verificationMessage?: string;
}

export interface TaskStep {
  stepId: number;
  toolName: string;
  action: string;
  args: Record<string, unknown>;
  permissionLevel: PermissionLevel;
  requiresConfirmation: boolean;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  result?: Record<string, unknown>;
  error?: string;
}

export interface MultiStepPlan {
  planId: string;
  objective: string;
  steps: TaskStep[];
  currentStepIndex: number;
  status: 'planning' | 'ready' | 'executing' | 'waiting_confirmation' | 'completed' | 'failed';
  requiresConfirmation: boolean;
  pendingConfirmationStep?: TaskStep;
}
