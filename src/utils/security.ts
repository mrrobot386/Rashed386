/**
 * Client-Side Security Helpers for ANISA AI ULTRA
 * Ensures zero arbitrary shell commands and filters dangerous payloads.
 */

export const FORBIDDEN_SHELL_PATTERNS = [
  /rm\s+-rf/i,
  /powershell/i,
  /cmd\.exe/i,
  /bash\s+-c/i,
  /sh\s+-c/i,
  /eval\(/i,
  /base64\s+-d/i,
  /wget/i,
  /curl.*\|\s*sh/i,
  /\/bin\/sh/i,
  /\/bin\/bash/i,
];

export function containsArbitraryShellCode(input: string): boolean {
  return FORBIDDEN_SHELL_PATTERNS.some((pattern) => pattern.test(input));
}

export function sanitizeUserInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // strip HTML tag brackets
    .trim();
}
