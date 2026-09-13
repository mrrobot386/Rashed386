import { ToolCall, ToolResponse } from '../types/assistant';
import { isValidUrl } from '../utils/urlValidation';
import { systemAgentClient } from '../system/SystemAgentClient';

export class ToolDispatcher {
  static async dispatch(call: ToolCall): Promise<ToolResponse> {
    const { id, name, args } = call;

    // 1. Browser-Native Website Navigation
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

    // 2. Open YouTube shortcut
    if (name === 'openYouTube') {
      const query = args.query ? encodeURIComponent(String(args.query)) : '';
      const url = query ? `https://www.youtube.com/results?search_query=${query}` : 'https://www.youtube.com';
      window.open(url, '_blank', 'noopener,noreferrer');
      return {
        id,
        name,
        response: {
          success: true,
          tool: name,
          url,
          message: query ? `Opened YouTube searching for "${args.query}".` : 'Opened YouTube.',
        },
      };
    }

    // 3. Open Chrome / Search shortcut
    if (name === 'searchChrome') {
      const query = encodeURIComponent(String(args.query || ''));
      const url = `https://www.google.com/search?q=${query}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      return {
        id,
        name,
        response: {
          success: true,
          tool: name,
          query: args.query,
          message: `Searching Google for "${args.query}".`,
        },
      };
    }

    // 4. Dispatch to local Python System Agent
    const result = await systemAgentClient.executeTool(name, args);

    // If system agent is offline, check if fallback web navigation is possible
    if (!result.success && result.error?.includes("service isn't running")) {
      if (name === 'launchApplication') {
        const appName = String(args.app_name || '').toLowerCase();
        if (appName.includes('whatsapp')) {
          window.open('https://web.whatsapp.com', '_blank', 'noopener,noreferrer');
          return {
            id,
            name,
            response: {
              success: true,
              tool: name,
              mode: 'web_fallback',
              message: 'Opened WhatsApp Web in your browser (System agent offline).',
            },
          };
        }
      }
    }

    return {
      id,
      name,
      response: result,
    };
  }
}
