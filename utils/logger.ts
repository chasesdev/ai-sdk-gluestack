/**
 * Simple logging utility that can be extended for production error tracking
 * (e.g., Sentry, Datadog, etc.)
 */

class Logger {
  error(message: string, error?: unknown) {
    if (__DEV__) {
      console.error(message, error);
    }
    // TODO: In production, send to error tracking service
    // Example: Sentry.captureException(error, { tags: { message } });
  }

  warn(message: string, data?: unknown) {
    if (__DEV__) {
      console.warn(message, data);
    }
  }

  info(message: string, data?: unknown) {
    if (__DEV__) {
      console.info(message, data);
    }
  }

  debug(message: string, data?: unknown) {
    if (__DEV__) {
      console.debug(message, data);
    }
  }
}

export const logger = new Logger();
