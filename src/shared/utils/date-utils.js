/**
 * Date Utility Functions
 * Centralized date formatting and manipulation utilities
 * Used across GameCalendar, EnhancedGameCard, GamesDropdown, and other components
 */

/**
 * Format a date string for display
 * @param {string|Date} dateString - Date to format
 * @param {Object} options - Formatting options
 * @param {boolean} options.includeWeekday - Include weekday (default: false)
 * @param {boolean} options.includeYear - Include year (default: false)
 * @param {boolean} options.capitalize - Capitalize each word (default: false)
 * @param {'short'|'long'} options.format - Short or long format (default: 'short')
 * @returns {string} Formatted date
 *
 * @example
 * formatDate('2025-11-10') // "Nov 10"
 * formatDate('2025-11-10', { includeWeekday: true }) // "Mon, Nov 10"
 * formatDate('2025-11-10', { includeYear: true }) // "Nov 10, 2025"
 * formatDate('2025-11-10', { format: 'long' }) // "November 10"
 * formatDate('2025-11-10', { includeWeekday: true, includeYear: true, format: 'long' }) // "Monday, November 10, 2025"
 */
export function formatDate(dateString, options = {}) {
  const {
    includeWeekday = false,
    includeYear = false,
    capitalize = false,
    format = 'short',
  } = options;

  const date = new Date(dateString);

  // Validate date
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', dateString);
    return 'Invalid Date';
  }

  const formatOptions = {
    month: format,
    day: 'numeric',
  };

  if (includeWeekday) {
    formatOptions.weekday = format;
  }

  if (includeYear) {
    formatOptions.year = 'numeric';
  }

  let formatted = date.toLocaleDateString('en-US', formatOptions);

  // Capitalize first letter of each word if requested
  if (capitalize) {
    formatted = formatted
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return formatted;
}

/**
 * Format time from date string
 * @param {string|Date} dateString - Date to extract time from
 * @param {boolean} includeSeconds - Include seconds (default: false)
 * @returns {string} Formatted time (e.g., "7:30 PM")
 *
 * @example
 * formatTime('2025-11-10T19:30:00') // "7:30 PM"
 * formatTime('2025-11-10T19:30:45', true) // "7:30:45 PM"
 */
export function formatTime(dateString, includeSeconds = false) {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    console.error('Invalid date:', dateString);
    return 'Invalid Time';
  }

  const formatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  if (includeSeconds) {
    formatOptions.second = '2-digit';
  }

  return date.toLocaleTimeString('en-US', formatOptions);
}

/**
 * Format combined date and time
 * @param {string|Date} dateString - Date to format
 * @param {Object} options - Formatting options (passed to toLocaleDateString)
 * @returns {string} Formatted date and time
 *
 * @example
 * formatDateTime('2025-11-10T19:30:00') // "Nov 10, 2025, 7:30 PM"
 */
export function formatDateTime(dateString, options = {}) {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    console.error('Invalid date:', dateString);
    return 'Invalid DateTime';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    ...options,
  });
}

/**
 * Calculate days until a future date
 * @param {string|Date} gameDate - Target date
 * @returns {string} Human-readable time until date
 *
 * @example
 * getDaysUntil('2025-11-13') // "3d"
 * getDaysUntil(todayDate) // "Today"
 * getDaysUntil(tomorrowDate) // "Tomorrow"
 * getDaysUntil(pastDate) // "Past"
 */
export function getDaysUntil(gameDate) {
  const now = new Date();
  const target = new Date(gameDate);

  // Reset time to start of day for accurate day calculation
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffTime = target - now;
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (days < 0) return 'Past';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `${days}d`;
}

/**
 * Get relative time from now (e.g., "2 hours ago", "in 3 days")
 * @param {string|Date} dateString - Date to compare
 * @returns {string} Relative time string
 *
 * @example
 * getRelativeTime('2025-11-09') // "1 day ago"
 * getRelativeTime('2025-11-13') // "in 3 days"
 */
export function getRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date - now;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (Math.abs(diffDays) > 0) {
    return diffDays > 0
      ? `in ${diffDays} day${diffDays > 1 ? 's' : ''}`
      : `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''} ago`;
  }
  if (Math.abs(diffHours) > 0) {
    return diffHours > 0
      ? `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`
      : `${Math.abs(diffHours)} hour${Math.abs(diffHours) > 1 ? 's' : ''} ago`;
  }
  if (Math.abs(diffMins) > 0) {
    return diffMins > 0
      ? `in ${diffMins} minute${diffMins > 1 ? 's' : ''}`
      : `${Math.abs(diffMins)} minute${Math.abs(diffMins) > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

/**
 * Check if date is in the past
 * @param {string|Date} dateString - Date to check
 * @returns {boolean} True if date is in the past
 *
 * @example
 * isPast('2020-01-01') // true
 * isPast('2030-01-01') // false
 */
export function isPast(dateString) {
  return new Date(dateString) < new Date();
}

/**
 * Check if date is today
 * @param {string|Date} dateString - Date to check
 * @returns {boolean} True if date is today
 *
 * @example
 * isToday(new Date()) // true
 */
export function isToday(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is tomorrow
 * @param {string|Date} dateString - Date to check
 * @returns {boolean} True if date is tomorrow
 */
export function isTomorrow(dateString) {
  const date = new Date(dateString);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
}

/**
 * Gets today's date at midnight (for date comparisons)
 * @returns {Date} Today's date at 00:00:00
 */
export function getToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Gets days between two dates
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} Days between dates (absolute value)
 */
export function getDaysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
