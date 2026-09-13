/**
 * Validation Helpers for ANISA AI ULTRA
 */

import { isValidUrl } from './urlValidation';

export function validateToolArguments(toolName: string, args: Record<string, unknown>): { valid: boolean; error?: string } {
  if (!toolName) {
    return { valid: false, error: 'Tool name cannot be empty.' };
  }

  if (toolName === 'openWebsite') {
    const url = String(args.url || '');
    if (!isValidUrl(url)) {
      return { valid: false, error: 'Invalid or unsafe URL.' };
    }
  }

  if (toolName === 'sendMessage') {
    if (!args.contact_name) {
      return { valid: false, error: 'Recipient contact name is required.' };
    }
    if (!args.message) {
      return { valid: false, error: 'Message content is required.' };
    }
  }

  return { valid: true };
}
