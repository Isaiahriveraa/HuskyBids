'use client';

/**
 * Reusable empty state component
 * @param {Object} props
 * @param {string} props.icon - Emoji or icon to display
 * @param {string} props.title - Title text
 * @param {string} props.message - Optional message
 * @param {React.ReactNode} props.action - Optional action button/link
 */
export default function EmptyState({
  icon = '📭',
  title = 'No data',
  message,
  action
}) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      {message && (
        <p className="text-gray-500 dark:text-gray-400 mb-4">{message}</p>
      )}
      {action}
    </div>
  );
}
