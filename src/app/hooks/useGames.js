import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for fetching and managing games data
 * @param {Object} options - Configuration options
 * @param {string} options.sport - Sport type ('football' or 'basketball')
 * @param {string} options.status - Game status ('upcoming' or 'completed')
 * @returns {Object} - { games, loading, error, refetch }
 */
export function useGames({ sport = 'football', status = 'upcoming' } = {}) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = status === 'completed'
        ? '/api/games/completed'
        : '/api/games/upcoming';

      const response = await fetch(`${endpoint}?sport=${sport}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch games');
      }

      setGames(data.games || []);
    } catch (err) {
      console.error('Error fetching games:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sport, status]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  return { games, loading, error, refetch: fetchGames };
}
