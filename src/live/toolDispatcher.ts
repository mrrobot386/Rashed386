import { ToolCall, ToolResponse } from '../types/assistant';
import { isValidUrl } from '../utils/urlValidation';
import { systemAgentClient } from '../system/SystemAgentClient';

export class ToolDispatcher {
  static async dispatch(call: ToolCall): Promise<ToolResponse> {
    const { id, name, args } = call;

    // Handle Browser Tools directly in browser
    if (name === 'openWebsite') {
      const url = String(args.url || '');
      if (isValidUrl(url)) {
        window.open(url, '_blank', 'noopener,noreferrer');
        return {
          id,
          name,
          response: {
            success: true,
            tool: name,
            message: `Successfully opened ${url} in a new tab.`,
          },
        };
      } else {
        return {
          id,
          name,
          response: {
            success: false,
            tool: name,
            error: 'Invalid or unsafe URL. Only HTTP/HTTPS URLs are allowed.',
          },
        };
      }
    }

    // Dispatch all other tools to the local Python System Agent
    const result = await systemAgentClient.executeTool(name, args);
    return {
      id,
      name,
      response: result,
    };
  }
}
