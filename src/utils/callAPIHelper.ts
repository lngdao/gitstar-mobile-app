import type { Options } from 'ky';
import {
  APIError,
  isAPIError,
  isUnauthorizedError,
  isForbiddenError,
  isNotFoundError,
  isRateLimitError,
  isTimeoutError,
  isNetworkError,
} from '@/libs/api';

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type FetcherFunction = (...args: any[]) => Promise<any>;

export interface CallAPIOptions<T extends FetcherFunction> {
  /** API function to call */
  API: T;

  /** Request payload */
  payload?: Parameters<T>[0];

  /** Ky options (timeout, retry, etc.) */
  options?: Options & { cancelKey?: string };

  /** Called before request starts */
  beforeSend?: () => void;

  /** Called on successful response */
  onSuccess?: (response: UnwrapPromise<ReturnType<T>>) => void;

  /** Called on any error */
  onError?: (error: APIError | Error) => void;

  /** Called on unauthorized (401) error */
  onUnauthorized?: (error: APIError) => void;

  /** Called on forbidden (403) error */
  onForbidden?: (error: APIError) => void;

  /** Called on not found (404) error */
  onNotFound?: (error: APIError) => void;

  /** Called on rate limit (429) error */
  onRateLimit?: (error: APIError, retryAfter?: number) => void;

  /** Called on timeout error */
  onTimeout?: () => void;

  /** Called on network error */
  onNetworkError?: () => void;

  /** Called in finally block (success or error) */
  onFinally?: () => void;
}

/**
 * Enhanced API Call Helper
 *
 * Features:
 * - Flexible error handling with specific callbacks
 * - Request cancellation support
 * - Type-safe with TypeScript
 * - Automatic error type detection
 *
 * @example Basic usage
 * ```ts
 * await callAPIHelper({
 *   API: fetchUser,
 *   payload: { id: '123' },
 *   onSuccess: (user) => console.log(user),
 *   onError: (error) => console.error(error),
 * });
 * ```
 *
 * @example With cancellation
 * ```ts
 * await callAPIHelper({
 *   API: searchUsers,
 *   payload: { query },
 *   options: { cancelKey: 'user-search' },
 *   onSuccess: setResults,
 * });
 * ```
 *
 * @example Specific error handling
 * ```ts
 * await callAPIHelper({
 *   API: fetchProfile,
 *   onUnauthorized: () => navigate('/login'),
 *   onNotFound: () => showNotFound(),
 *   onRateLimit: (_, retryAfter) => showRetryMessage(retryAfter),
 * });
 * ```
 */
export async function callAPIHelper<T extends FetcherFunction>({
  API,
  payload,
  options,
  beforeSend,
  onSuccess,
  onError,
  onUnauthorized,
  onForbidden,
  onNotFound,
  onRateLimit,
  onTimeout,
  onNetworkError,
  onFinally,
}: CallAPIOptions<T>): Promise<UnwrapPromise<ReturnType<T>> | undefined> {
  try {
    beforeSend?.();

    // Call API with options
    const response = await API(payload, options);

    onSuccess?.(response);
    return response;
  } catch (error) {
    // Handle specific error types
    if (isUnauthorizedError(error)) {
      onUnauthorized?.(error);
    } else if (isForbiddenError(error)) {
      onForbidden?.(error);
    } else if (isNotFoundError(error)) {
      onNotFound?.(error);
    } else if (isRateLimitError(error)) {
      onRateLimit?.(error, error.retryAfter);
    } else if (isTimeoutError(error)) {
      onTimeout?.();
    } else if (isNetworkError(error)) {
      onNetworkError?.();
    }

    // Call generic error handler
    onError?.(isAPIError(error) ? error : (error as Error));

    // Re-throw if no error handler provided
    if (!onError) {
      throw error;
    }

    return undefined;
  } finally {
    onFinally?.();
  }
}
