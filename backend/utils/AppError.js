/**
 * Custom operational error class that extends the native Error.
 * Used throughout the app to create predictable, structured errors.
 */
class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message
   * @param {number} statusCode - HTTP status code (e.g. 400, 401, 403, 404)
   */
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    // 4xx → 'fail', 5xx → 'error'
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    // Marks this as an operational (expected) error, not a programming bug
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
