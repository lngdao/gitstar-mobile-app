/**
 * Logger Utility
 *
 * Professional logging utility with the following features:
 * - Auto-disabled in production builds
 * - Color-coded output by severity level
 * - File path and line number tracking
 * - Stack trace for errors
 * - Structured formatting
 * - Configurable log levels
 *
 * Usage:
 * ```typescript
 * import { logger } from '@/utils/logger';
 *
 * logger.debug('Debug message', { data: 'value' });
 * logger.info('Info message');
 * logger.warn('Warning message');
 * logger.error('Error message', error);
 * ```
 */

import Constants from 'expo-constants';

/**
 * Log levels in order of severity
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

const LogColorHelpers = {
  reset: '\x1b[0m',
  gray: '\x1b[90m',
  bold: '\x1b[1m',
};

/**
 * Logger metadata injected by Babel plugin
 */
interface LoggerMetadata {
  __file?: string;
  __line?: number;
  scope?: string;
}

/**
 * Configuration for the logger
 */
interface LoggerConfig {
  /**
   * Minimum log level to display
   * Logs below this level will be ignored
   */
  minLevel: LogLevel;

  /**
   * Whether to show timestamps
   */
  showTimestamp: boolean;

  /**
   * Whether to show file location (injected by Babel plugin)
   */
  showLocation: boolean;

  /**
   * Whether to show stack trace for errors
   */
  showStackTrace: boolean;

  /**
   * Whether logging is enabled
   * Automatically disabled in production
   */
  enabled: boolean;
}

/**
 * Default logger configuration
 */
const defaultConfig: LoggerConfig = {
  minLevel: __DEV__ ? LogLevel.DEBUG : LogLevel.NONE,
  showTimestamp: true,
  showLocation: __DEV__, // Show file location injected by Babel plugin
  showStackTrace: __DEV__,
  enabled: __DEV__, // Auto-disable in production
};

/**
 * Logger class
 */
class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Update logger configuration
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current timestamp
   */
  private getTimestamp(): string {
    const now = new Date();
    return now.toISOString();
  }

  /**
   * Format log message with metadata
   */
  private formatMessage(
    message: string,
    data?: unknown,
    error?: Error,
    metadata?: LoggerMetadata
  ): string {
    const parts: string[] = [];
    const reset = LogColorHelpers.reset;
    const gray = LogColorHelpers.gray;

    // Timestamp
    if (this.config.showTimestamp) {
      const time = this.getTimestamp();
      const timeOnly = time.split('T')[1]?.split('.')[0] || time;
      parts.push(`${gray}${timeOnly}${reset}`);
    }

    // File location (injected by Babel plugin)
    if (this.config.showLocation && metadata?.__file) {
      parts.push(`${gray}(${metadata.__file}:${metadata.__line})${reset}`);
    }

    // Scope (either from metadata or from ScopedLogger)
    const scope = metadata?.scope;
    if (scope) {
      parts.push(`[${scope}]`);
    }

    // Build header
    const header = parts.join(' ');

    // Message
    const formattedMessage = `${header} ${message}`;

    // Data (if provided)
    const dataStr = data ? `\n${gray}Data:${reset} ${JSON.stringify(data, null, 2)}` : '';

    // Stack trace for errors
    let stackTrace = '';
    if (error && this.config.showStackTrace && error.stack) {
      stackTrace = `\n${gray}Stack:${reset}\n${error.stack}`;
    }

    return `${formattedMessage}${dataStr}${stackTrace}`;
  }

  /**
   * Log a message
   */
  private log(
    level: LogLevel,
    message: string,
    data?: unknown,
    error?: Error,
    metadata?: LoggerMetadata
  ): void {
    // Check if logging is enabled
    if (!this.config.enabled) {
      return;
    }

    // Check if log level meets minimum requirement
    if (level < this.config.minLevel) {
      return;
    }

    const formattedMessage = this.formatMessage(message, data, error, metadata);

    // Use appropriate console method
    switch (level) {
      case LogLevel.DEBUG:
        console.log(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
    }
  }

  /**
   * Log debug message
   * Use for detailed debugging information
   */
  debug(message: string, data?: unknown, metadata?: LoggerMetadata): void {
    this.log(LogLevel.DEBUG, message, data, undefined, metadata);
  }

  /**
   * Log info message
   * Use for general information
   */
  info(message: string, data?: unknown, metadata?: LoggerMetadata): void {
    this.log(LogLevel.INFO, message, data, undefined, metadata);
  }

  /**
   * Log warning message
   * Use for warning conditions that don't prevent operation
   */
  warn(message: string, data?: unknown, metadata?: LoggerMetadata): void {
    this.log(LogLevel.WARN, message, data, undefined, metadata);
  }

  /**
   * Log error message
   * Use for error conditions
   */
  error(
    message: string,
    error?: Error | unknown,
    data?: unknown,
    metadata?: LoggerMetadata
  ): void {
    const errorObj = error instanceof Error ? error : undefined;
    const errorData = error instanceof Error ? data : error;
    this.log(LogLevel.ERROR, message, errorData, errorObj, metadata);
  }

  /**
   * Create a scoped logger with a prefix
   * Useful for module-specific logging
   */
  scope(prefix: string): ScopedLogger {
    return new ScopedLogger(this, prefix);
  }

  /**
   * Log app info (useful for debugging)
   */
  logAppInfo(): void {
    if (!this.config.enabled) {
      return;
    }

    this.info('App Info', {
      name: Constants.expoConfig?.name,
      version: Constants.expoConfig?.version,
      platform: Constants.platform,
      isDevice: Constants.isDevice,
      nativeAppVersion: Constants.nativeAppVersion,
      nativeBuildVersion: Constants.nativeBuildVersion,
    });
  }
}

/**
 * Scoped logger with prefix
 */
class ScopedLogger {
  constructor(
    private logger: Logger,
    private prefix: string
  ) {}

  private injectScope(metadata?: LoggerMetadata): LoggerMetadata {
    return { ...metadata, scope: this.prefix };
  }

  debug(message: string, data?: unknown, metadata?: LoggerMetadata): void {
    this.logger.debug(message, data, this.injectScope(metadata));
  }

  info(message: string, data?: unknown, metadata?: LoggerMetadata): void {
    this.logger.info(message, data, this.injectScope(metadata));
  }

  warn(message: string, data?: unknown, metadata?: LoggerMetadata): void {
    this.logger.warn(message, data, this.injectScope(metadata));
  }

  error(
    message: string,
    error?: Error | unknown,
    data?: unknown,
    metadata?: LoggerMetadata
  ): void {
    this.logger.error(message, error, data, this.injectScope(metadata));
  }
}

/**
 * Global logger instance
 */
export const logger = new Logger();

/**
 * Create scoped loggers for different modules
 */
export const createLogger = (scope: string) => logger.scope(scope);

/**
 * Export Logger class for custom instances
 */
export { Logger };

/**
 * Export types
 */
export type { LoggerConfig };
