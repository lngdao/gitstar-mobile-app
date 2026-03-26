import { ENV } from '@/config';
import { getStorage } from '@/libs/storage';
import { createLogger } from '@/utils/logger';
import ky, { HTTPError, TimeoutError, type Options } from 'ky';
import 'react-native-get-random-values'; // Polyfill for crypto.getRandomValues
import { Toast } from '@/shared/components/toast';
import i18n from '@/shared/i18n';

const logger = createLogger('API');

// API Configuration
const API_BASE_URL = ENV.API_URL || 'https://api.example.com';
const API_TIMEOUT = 30000;
const AUTH_TOKEN_KEY = 'auth_token';

/**
 * Toast deduplication
 * Prevents showing the same error toast multiple times within a short time window
 */
const recentToasts = new Map<string, number>();
const TOAST_DEBOUNCE_MS = 3000; // Don't show same toast within 3 seconds

const shouldShowToast = (message: string): boolean => {
  const now = Date.now();
  const lastShown = recentToasts.get(message);

  if (lastShown && now - lastShown < TOAST_DEBOUNCE_MS) {
    return false;
  }

  recentToasts.set(message, now);

  // Clean up old entries (older than debounce window)
  for (const [msg, timestamp] of recentToasts.entries()) {
    if (now - timestamp >= TOAST_DEBOUNCE_MS) {
      recentToasts.delete(msg);
    }
  }

  return true;
};

/**
 * Generate UUID v4 compatible with React Native
 * Fallback implementation for crypto.randomUUID
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Custom API Error Types
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public responseBody?: any,
    public retryCount?: number,
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class UnauthorizedError extends APIError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends APIError {
  constructor(message = 'Forbidden') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends APIError {
  constructor(message = 'Not Found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends APIError {
  constructor(
    message = 'Rate Limit Exceeded',
    public retryAfter?: number,
  ) {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

/**
 * Get authentication token from storage
 */
const getAuthToken = (): string | null => {
  try {
    const storage = getStorage();
    return storage.getString(AUTH_TOKEN_KEY) || null;
  } catch {
    return null;
  }
};

/**
 * HTTP Client with advanced features
 */
export const apiClient = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    /**
     * Before Request Hook
     * - Add authentication
     * - Add request ID for tracking
     */
    beforeRequest: [
      async (request, options, state) => {
        // Add auth token (only on initial request, not retries)
        if (state.retryCount === 0) {
          const token = getAuthToken();
          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
          }
        }

        // Add request tracking
        const requestId = generateUUID();
        request.headers.set('X-Request-ID', requestId);
        request.headers.set('X-Client-Version', '1.0.0');
      },
    ],

    /**
     * After Response Hook
     * - Force retry on specific conditions
     */
    afterResponse: [
      async (request, options, response) => {
        // Force retry on specific error codes in response body
        if (response.status === 200) {
          const data = await response.clone().json();

          if (data.error?.code === 'TEMPORARY_ERROR') {
            logger.warn('Temporary error, retrying...', { url: request.url });
            return ky.retry();
          }

          if (data.error?.code === 'RATE_LIMIT') {
            const delay = data.error.retryAfter * 1000 || 5000;
            logger.warn('Rate limit, retrying...', { delay });
            return ky.retry({ delay, code: 'RATE_LIMIT' });
          }
        }

        return response;
      },
    ],

    /**
     * Before Retry Hook
     * - Refresh auth token on 401
     * - Log retry attempts
     */
    beforeRetry: [
      async ({ request, error, retryCount }) => {
        logger.warn('Retrying request', {
          url: request.url,
          retry: retryCount,
          error: error.message,
        });

        // Refresh token on 401
        if (error instanceof HTTPError && error.response.status === 401) {
          logger.info('Refreshing auth token...');
          // TODO: Implement token refresh logic
          // const { token } = await refreshAuthToken();
          // request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],

    /**
     * Before Error Hook
     * - Transform errors to custom types
     * - Add context information
     */
    beforeError: [
      async (error, state) => {
        const status = error.response?.status;

        // Parse response body if available
        let responseBody: any = null;
        try {
          responseBody = await error.response?.json();
        } catch {
          // Ignore JSON parse errors
        }

        // Create custom error based on status code
        let customError: APIError;

        if (status === 401) {
          customError = new UnauthorizedError(responseBody?.message || 'Authentication required');
        } else if (status === 403) {
          customError = new ForbiddenError(responseBody?.message || 'Access denied');
        } else if (status === 404) {
          customError = new NotFoundError(responseBody?.message || 'Resource not found');
        } else if (status === 429) {
          const retryAfter = error.response?.headers.get('Retry-After');
          customError = new RateLimitError(
            responseBody?.message || 'Too many requests',
            retryAfter ? parseInt(retryAfter) : undefined,
          );
        } else {
          customError = new APIError(
            responseBody?.message || error.message,
            status,
            responseBody,
            state.retryCount,
          );
        }

        // Add retry count info
        if (state.retryCount === error.options.retry.limit) {
          customError.message = `${customError.message} (failed after ${state.retryCount} retries)`;
        }

        logger.error('API Error', {
          name: customError.name,
          message: customError.message,
          status: customError.statusCode,
          retryCount: state.retryCount,
        });

        // Show toast error for all API errors (server errors, network errors, timeout errors, and validation errors)
        // Skip toast only for specific client errors that are handled elsewhere (401, 403, 404)
        const isTimeoutError = error instanceof TimeoutError;
        const isNetworkError = !status && error.message?.includes('fetch');
        const isServerError = status && (status >= 500 || status === 408 || status === 413);
        const isValidationError = status && status >= 400 && status < 500 && status !== 401 && status !== 403 && status !== 404;
        const shouldShowErrorToast =
          isTimeoutError ||
          isNetworkError ||
          isServerError ||
          isValidationError ||
          (!status && customError instanceof APIError); // Any APIError without status

        if (shouldShowErrorToast) {
          // Extract error message from response body
          // Support formats: {"error": "message"} or {"error": ["message"]}
          let errorMessage = i18n.t('common.apiError'); // Default fallback

          if (responseBody?.error) {
            if (Array.isArray(responseBody.error)) {
              errorMessage = responseBody.error[0] || errorMessage;
            } else if (typeof responseBody.error === 'string') {
              errorMessage = responseBody.error;
            }
          }

          // Only show toast if this message wasn't shown recently
          if (shouldShowToast(errorMessage)) {
            Toast.error(errorMessage);
          }
        }

        return customError as any; // Ky expects HTTPError
      },
    ],
  },
  retry: {
    limit: 0,
    methods: ['get', 'post', 'put', 'patch', 'delete'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
    backoffLimit: 10000, // Max 10s delay
    delay: (attemptCount) => {
      // Exponential backoff: 300ms, 600ms, 1200ms, 2400ms...
      return 0.3 * 2 ** (attemptCount - 1) * 1000;
    },
  },
});

/**
 * Request Manager
 * Manages AbortControllers for cancellable requests
 */
class RequestManager {
  private controllers = new Map<string, AbortController>();

  /**
   * Create a new request with cancellation support
   */
  create(key: string): AbortSignal {
    // Cancel existing request with same key
    this.cancel(key);

    const controller = new AbortController();
    this.controllers.set(key, controller);
    return controller.signal;
  }

  /**
   * Cancel a request by key
   */
  cancel(key: string): void {
    const controller = this.controllers.get(key);
    if (controller) {
      controller.abort();
      this.controllers.delete(key);
    }
  }

  /**
   * Cancel all requests
   */
  cancelAll(): void {
    this.controllers.forEach((controller) => controller.abort());
    this.controllers.clear();
  }

  /**
   * Remove completed request
   */
  cleanup(key: string): void {
    this.controllers.delete(key);
  }
}

export const requestManager = new RequestManager();

/**
 * API Helper with cancellation support
 */
export const api = {
  /**
   * GET request
   */
  get: <T>(url: string, options?: Options & { cancelKey?: string }) => {
    const { cancelKey, ...kyOptions } = options || {};
    const signal = cancelKey ? requestManager.create(cancelKey) : undefined;

    return apiClient
      .get(url, { ...kyOptions, signal })
      .json<T>()
      .finally(() => cancelKey && requestManager.cleanup(cancelKey));
  },

  /**
   * POST request
   */
  post: <T>(url: string, data?: any, options?: Options & { cancelKey?: string }) => {
    const { cancelKey, ...kyOptions } = options || {};
    const signal = cancelKey ? requestManager.create(cancelKey) : undefined;

    return apiClient
      .post(url, { json: data, ...kyOptions, signal })
      .json<T>()
      .finally(() => cancelKey && requestManager.cleanup(cancelKey));
  },

  /**
   * PUT request
   */
  put: <T>(url: string, data?: any, options?: Options & { cancelKey?: string }) => {
    const { cancelKey, ...kyOptions } = options || {};
    const signal = cancelKey ? requestManager.create(cancelKey) : undefined;

    return apiClient
      .put(url, { json: data, ...kyOptions, signal })
      .json<T>()
      .finally(() => cancelKey && requestManager.cleanup(cancelKey));
  },

  /**
   * PATCH request
   */
  patch: <T>(url: string, data?: any, options?: Options & { cancelKey?: string }) => {
    const { cancelKey, ...kyOptions } = options || {};
    const signal = cancelKey ? requestManager.create(cancelKey) : undefined;

    return apiClient
      .patch(url, { json: data, ...kyOptions, signal })
      .json<T>()
      .finally(() => cancelKey && requestManager.cleanup(cancelKey));
  },

  /**
   * DELETE request
   */
  delete: <T>(url: string, options?: Options & { cancelKey?: string }) => {
    const { cancelKey, ...kyOptions } = options || {};
    const signal = cancelKey ? requestManager.create(cancelKey) : undefined;

    return apiClient
      .delete(url, { ...kyOptions, signal })
      .json<T>()
      .finally(() => cancelKey && requestManager.cleanup(cancelKey));
  },
};

/**
 * Error type guards
 */
export const isAPIError = (error: unknown): error is APIError => {
  return error instanceof APIError;
};

export const isUnauthorizedError = (error: unknown): error is UnauthorizedError => {
  return error instanceof UnauthorizedError;
};

export const isForbiddenError = (error: unknown): error is ForbiddenError => {
  return error instanceof ForbiddenError;
};

export const isNotFoundError = (error: unknown): error is NotFoundError => {
  return error instanceof NotFoundError;
};

export const isRateLimitError = (error: unknown): error is RateLimitError => {
  return error instanceof RateLimitError;
};

export const isTimeoutError = (error: unknown): error is TimeoutError => {
  return error instanceof TimeoutError;
};

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof TypeError && error.message.includes('Failed to fetch');
};
