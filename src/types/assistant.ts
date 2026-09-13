export type AssistantState =
  | "disconnected"
  | "connecting"
  | "listening"
  | "speaking"
  | "error";

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
}

export interface ToolResponse {
  id: string;
  name: string;
  response: {
    success: boolean;
    tool: string;
    action?: string;
    message?: string;
    error?: string;
    [key: string]: unknown;
  };
}

export interface SystemAgentStatus {
  connected: boolean;
  version?: string;
  service?: string;
}

export type SupportedLanguage = "en" | "bn" | "hi";

export interface AssistantConfig {
  voiceName: string;
  model: string;
  language: SupportedLanguage;
}
