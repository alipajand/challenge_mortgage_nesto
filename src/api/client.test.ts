import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { config } from '@/config';
import { apiUrl, notFoundResponse, server } from '@/test/server';
import { ApiError, getErrorMessage, isNotFoundError, request, shouldRetryRequest } from './client';

async function captureError(promise: Promise<unknown>): Promise<unknown> {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  throw new Error('Expected the request to fail');
}

describe('request', () => {
  it('sends the required headers and a JSON body', async () => {
    let received: { headers: Headers; body: unknown } | undefined;
    server.use(
      http.post(apiUrl('/echo'), async ({ request: incoming }) => {
        received = { headers: incoming.headers, body: await incoming.json() };
        return HttpResponse.json({ ok: true });
      }),
    );

    await expect(request('/echo', { method: 'POST', body: { productId: 1 } })).resolves.toEqual({
      ok: true,
    });
    expect(received?.headers.get('Accept')).toBe('application/json');
    expect(received?.headers.get('Content-Type')).toBe('application/json');
    expect(received?.headers.get('X-Nesto-Candidat')).toBe(config.candidateName);
    expect(received?.body).toEqual({ productId: 1 });
  });

  it('treats PostgREST "no rows" errors as not found', async () => {
    server.use(http.get(apiUrl('/missing'), notFoundResponse));

    const error = await captureError(request('/missing'));

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ kind: 'http', status: 500, code: 'PGRST116' });
    expect(isNotFoundError(error)).toBe(true);
    expect(getErrorMessage(error)).toBe("We couldn't find what you were looking for.");
  });

  it('maps authorization errors to a clear message', async () => {
    server.use(
      http.get(apiUrl('/private'), () =>
        HttpResponse.json({ errors: ['Unauthorized'] }, { status: 401 }),
      ),
    );

    const error = await captureError(request('/private'));

    expect(error).toMatchObject({ kind: 'http', status: 401 });
    expect(getErrorMessage(error)).toBe(
      "This site isn't allowed to access the rates service right now.",
    );
  });

  it('handles error pages that are not JSON', async () => {
    server.use(
      http.get(apiUrl('/broken'), () => new HttpResponse('<!doctype html>', { status: 502 })),
    );

    const error = await captureError(request('/broken'));

    expect(error).toMatchObject({ kind: 'http', status: 502 });
    expect(getErrorMessage(error)).toBe(
      'Something went wrong on our side. Please try again in a moment.',
    );
  });

  it('reports network failures', async () => {
    server.use(http.get(apiUrl('/offline'), () => HttpResponse.error()));

    const error = await captureError(request('/offline'));

    expect(error).toMatchObject({ kind: 'network' });
    expect(getErrorMessage(error)).toMatch(/couldn't reach our servers/);
  });

  it('gives up when the server takes too long', async () => {
    const timeoutSpy = vi
      .spyOn(AbortSignal, 'timeout')
      .mockImplementation(() => AbortSignal.abort(new DOMException('Timed out', 'TimeoutError')));

    const error = await captureError(request('/products'));

    expect(error).toMatchObject({ kind: 'timeout' });
    expect(getErrorMessage(error)).toMatch(/taking too long/);
    timeoutSpy.mockRestore();
  });

  it('lets caller cancellations through untouched', async () => {
    const controller = new AbortController();
    controller.abort();

    const error = await captureError(request('/products', { signal: controller.signal }));

    expect(error).not.toBeInstanceOf(ApiError);
  });
});

describe('shouldRetryRequest', () => {
  it('retries network and server errors a couple of times', () => {
    const serverError = new ApiError('http', { status: 503 });

    expect(shouldRetryRequest(0, new ApiError('network'))).toBe(true);
    expect(shouldRetryRequest(1, serverError)).toBe(true);
    expect(shouldRetryRequest(2, serverError)).toBe(false);
  });

  it('does not retry errors that would fail again', () => {
    expect(shouldRetryRequest(0, new ApiError('http', { status: 500, code: 'PGRST116' }))).toBe(
      false,
    );
    expect(shouldRetryRequest(0, new ApiError('http', { status: 401 }))).toBe(false);
  });
});
