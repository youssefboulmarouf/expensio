import type { ZodError } from 'zod';

export const success = <T>(data: T) => ({ success: true as const, data });

export function formatZodErrors(zodError: ZodError): Record<string, string> {
  const details: Record<string, string> = {};
  for (const issue of zodError.issues) {
    const field = String(issue.path[0] ?? 'unknown');
    if (!details[field]) details[field] = issue.message;
  }
  return details;
}

export const error = (code: string, message: string, details?: unknown) => ({
  success: false as const,
  error: {
    code,
    message,
    ...(details !== undefined && { details }),
  },
});

export function internalError(err: unknown) {
  return error('INTERNAL_ERROR', 'An unexpected error occurred', {
    message: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });
}
