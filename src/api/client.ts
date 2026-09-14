import { config } from '@/config';

type ApiErrorKind = 'network' | 'timeout' | 'http';

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly code?: string;

  constructor(kind: ApiErrorKind, { status, code }: { status?: number; code?: string } = {}) {
    super(status ? `Request failed with status ${status}` : `Request failed (${kind})`);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
    this.code = code;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT';
  body?: unknown;
  signal?: AbortSignal;
};

export async function request<T>(
  path: string,
  { method = 'GET', body, signal }: RequestOptions = {},
): Promise<T> {
  const timeout = AbortSignal.timeout(config.requestTimeoutMs);
  let response: Response;

  try {
    response = await fetch(`${config.apiBaseUrl}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Nesto-Candidat': config.candidateName,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new ApiError(timeout.aborted ? 'timeout' : 'network');
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new ApiError('http', { status: response.status, code: payload?.code });
  }

  return response.json();
}

const POSTGREST_NOT_FOUND_CODES = ['PGRST116', '22P02'];

export function isNotFoundError(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    (error.status === 404 || POSTGREST_NOT_FOUND_CODES.includes(error.code ?? ''))
  );
}

export function shouldRetryRequest(failureCount: number, error: unknown): boolean {
  const isClientError = error instanceof ApiError && !!error.status && error.status < 500;
  return failureCount < 2 && !isClientError && !isNotFoundError(error);
}

export function getErrorMessage(error: unknown): string {
  if (isNotFoundError(error)) {
    return "We couldn't find what you were looking for.";
  }
  if (error instanceof ApiError && error.kind === 'network') {
    return "We couldn't reach our servers. Check your internet connection and try again.";
  }
  if (error instanceof ApiError && error.kind === 'timeout') {
    return 'The server is taking too long to respond. Please try again.';
  }
  if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
    return "This site isn't allowed to access the rates service right now.";
  }
  return 'Something went wrong on our side. Please try again in a moment.';
}
