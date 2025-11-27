'use client';

/**
 * EmptyStateMessage Component
 * Displays a centered message when data is completely unavailable
 * Used as fallback when neither team has player statistics
 *
 * @param {string} message - Message to display to user
 * @param {string} className - Additional CSS classes (optional)
 */
export default function EmptyStateMessage({
  message = 'No data available',
  className = ''
}) {
  return (
    <div className={`text-center py-2 text-gray-400 dark:text-gray-500 text-xs ${className}`}>
      {message}
    </div>
  );
}
