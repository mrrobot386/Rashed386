import { SystemAgentStatus } from '../types/assistant';

const LOCAL_AGENT_URL = 'http://localhost:8765';

export class SystemAgentClient {
  private isConnected = false;
  private sessionToken: string | null = null;

  async checkStatus(): Promise<SystemAgentStatus> {
    try {
      const response = await fetch(`${LOCAL_AGENT_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(2000),
      });

      if (response.ok) {
        const data = await response.json();
        this.isConnected = true;
        this.sessionToken = data.session_token || null;
        return {
          connected: true,
          version: data.version,
          service: data.service,
        };
      }
    } catch {
      this.isConnected = false;
    }
    return { connected: false };
  }

  async executeTool(tool: string, args: Record<string, unknown>): Promise<{
    success: boolean;
    tool: string;
    action?: string;
    message?: string;
    error?: string;
    [key: string]: unknown;
  }> {
    if (!this.isConnected) {
      const status = await this.checkStatus();
      if (!status.connected) {
        return {
          success: false,
          tool,
          error: "The local system-control service isn't running right now.",
        };
      }
    }

    try {
      const response = await fetch(`${LOCAL_AGENT_URL}/tool`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.sessionToken
            ? { Authorization: `Bearer ${this.sessionToken}` }
            : {}),
        },
        body: JSON.stringify({ tool, args }),
        signal: AbortSignal.timeout(6000),
      });

      if (!response.ok) {
        return {
          success: false,
          tool,
          error: `Agent service error HTTP ${response.status}`,
        };
      }

      return await response.json();
    } catch (err: unknown) {
      return {
        success: false,
        tool,
        error: `Failed to reach system agent: ${String(err)}`,
      };
    }
  }

  getIsConnected(): boolean {
    return this.isConnected;
  }
}

export const systemAgentClient = new SystemAgentClient();
