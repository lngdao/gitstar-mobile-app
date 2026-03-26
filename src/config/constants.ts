/**
 * Date/Time formats
 */
export const DATE_FORMATS = {
  FULL: 'YYYY-MM-DD HH:mm:ss',
  DATE_ONLY: 'YYYY-MM-DD',
  TIME_ONLY: 'HH:mm:ss',
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
} as const;

/**
 * Regex patterns
 */
export const REGEX = {
  EMAIL: /^[a-z0-9]+([._+\-][a-z0-9]+)*@[a-z0-9]+([.-][a-z0-9]+)*\.[a-z]{2,6}$/i,
  PHONE: /^[\d\s()+-]+$/,
  URL: /^https?:\/\/.+/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
} as const;

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Error codes
 */
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

/**
 * Animation durations (ms)
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

/**
 * Debounce/Throttle delays (ms)
 */
export const DELAYS = {
  SEARCH: 300,
  SCROLL: 100,
  RESIZE: 200,
} as const;
