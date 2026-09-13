export class AnisaError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly recoverable: boolean = true
  ) {
    super(message);
    this.name = 'AnisaError';
  }
}

export function formatErrorMessage(error: unknown): string {
  if (error instanceof AnisaError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error || 'An unexpected error occurred.');
}
