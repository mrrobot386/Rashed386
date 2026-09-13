/**
 * Web Tools Engine for ANISA AI ULTRA
 * Safe browser navigation and search operations with strict URL validation.
 */

import { isValidUrl } from './urlValidation';

export interface WebToolResult {
  success: boolean;
  tool: string;
  url?: string;
  query?: string;
  message?: string;
  error?: string;
}

export class WebTools {
  static openWebsite(rawUrl: string): WebToolResult {
    let url = rawUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }

    if (!isValidUrl(url)) {
      return {
        success: false,
        tool: 'openWebsite',
        error: 'Invalid or unsafe URL protocol. Only secure HTTP/HTTPS destinations are allowed.',
      };
    }

    try {
      window.open(url, '_blank', 'noopener,noreferrer');
      return {
        success: true,
        tool: 'openWebsite',
        url,
        message: `Opened ${url} in a new tab.`,
      };
    } catch {
      return {
        success: false,
        tool: 'openWebsite',
        error: 'Failed to open web page.',
      };
    }
  }

  static searchWeb(query: string): WebToolResult {
    const encoded = encodeURIComponent(query.trim());
    const targetUrl = `https://www.google.com/search?q=${encoded}`;
    try {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      return {
        success: true,
        tool: 'searchWeb',
        query,
        url: targetUrl,
        message: `Searching web for "${query}".`,
      };
    } catch {
      return {
        success: false,
        tool: 'searchWeb',
        error: 'Failed to execute web search.',
      };
    }
  }

  static openYouTube(query?: string): WebToolResult {
    const targetUrl = query
      ? `https://www.youtube.com/results?search_query=${encodeURIComponent(query.trim())}`
      : 'https://www.youtube.com';
    try {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      return {
        success: true,
        tool: 'openYouTube',
        query,
        url: targetUrl,
        message: query ? `Opened YouTube searching for "${query}".` : 'Opened YouTube.',
      };
    } catch {
      return {
        success: false,
        tool: 'openYouTube',
        error: 'Failed to open YouTube.',
      };
    }
  }
}
