import { useState } from 'react';

/**
 * Custom hook for placing bets
 * @param {Function} onSuccess - Callback function called after successful bet placement
 * @returns {Object} - { placeBet, loading, error }
 */
export function useBetPlacement(onSuccess) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const placeBet = async ({ gameId, betAmount, predictedWinner }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/bets/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, betAmount, predictedWinner }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place bet');
      }

      onSuccess?.(data);
      return data;
    } catch (err) {
      console.error('Error placing bet:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { placeBet, loading, error };
}
