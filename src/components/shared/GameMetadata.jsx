'use client';

/**
 * Reusable component for displaying game metadata
 * @param {Object} props
 * @param {Date|string} props.gameDate - Game date
 * @param {string} props.venue - Game venue
 * @param {string} props.sport - Sport type
 * @param {string} props.season - Season year
 */
export default function GameMetadata({ gameDate, venue, sport, season }) {
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
      {gameDate && (
        <div className="flex items-center gap-2">
          <span>📅</span>
          <span>{formatDate(gameDate)}</span>
        </div>
      )}
      {venue && (
        <div className="flex items-center gap-2">
          <span>📍</span>
          <span>{venue}</span>
        </div>
      )}
      {sport && (
        <div className="flex items-center gap-2">
          <span>{sport === 'football' ? '🏈' : '🏀'}</span>
          <span className="capitalize">{sport}</span>
        </div>
      )}
      {season && (
        <div className="flex items-center gap-2">
          <span>📆</span>
          <span>Season {season}</span>
        </div>
      )}
    </div>
  );
}
