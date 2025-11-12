/**
 * Response Utility Functions
 * Standardized API response formatting
 */

/**
 * Creates a standardized success response
 * @param {Object} data - Response data
 * @param {string|null} message - Optional success message
 * @returns {Object} Formatted success response
 */
export function successResponse(data, message = null) {
  return {
    success: true,
    ...(message && { message }),
    ...data,
  };
}

/**
 * Creates a standardized error response
 * @param {string|Error} error - Error message or Error object
 * @param {Object|null} details - Optional error details
 * @returns {Object} Formatted error response
 */
export function errorResponse(error, details = null) {
  return {
    success: false,
    error: typeof error === 'string' ? error : error.message,
    ...(details && { details }),
  };
}

/**
 * Creates a validation error response
 * @param {Object} validationErrors - Field-level validation errors
 * @returns {Object} Formatted validation error response
 */
export function validationErrorResponse(validationErrors) {
  return {
    success: false,
    error: 'Validation failed',
    validationErrors,
  };
}

/**
 * Creates a paginated response
 * @param {Array} data - Array of items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total items count
 * @param {Object} additionalData - Additional response data
 * @returns {Object} Formatted paginated response
 */
export function paginatedResponse(data, page, limit, total, additionalData = {}) {
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
    ...additionalData,
  };
}

/**
 * Sends a success response with optional data
 * @param {Object} res - Express response object
 * @param {Object} data - Response data
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {string} message - Optional success message
 */
export function sendSuccess(res, data = {}, statusCode = 200, message = null) {
  return res.status(statusCode).json(successResponse(data, message));
}

/**
 * Sends an error response
 * @param {Object} res - Express response object
 * @param {string|Error} error - Error message or Error object
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {Object} details - Optional error details
 */
export function sendError(res, error, statusCode = 500, details = null) {
  return res.status(statusCode).json(errorResponse(error, details));
}

/**
 * Sends a validation error response
 * @param {Object} res - Express response object
 * @param {Object} validationErrors - Field-level validation errors
 */
export function sendValidationError(res, validationErrors) {
  return res.status(400).json(validationErrorResponse(validationErrors));
}

/**
 * Sends a paginated response
 * @param {Object} res - Express response object
 * @param {Array} data - Array of items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total items count
 * @param {Object} additionalData - Additional response data
 */
export function sendPaginated(res, data, page, limit, total, additionalData = {}) {
  return res.status(200).json(paginatedResponse(data, page, limit, total, additionalData));
}
