'use client';

import { useState, useEffect, useMemo } from 'react';
import { useUserContext } from '@/app/contexts/UserContext';
import { useBetValidation } from '@/app/hooks';
import MinimalModal from './MinimalModal';
import { SectionLabel, DottedDivider, Kbd, HuskyBidsLoader } from '@/components/experimental';
import { BETTING_LIMITS, QUICK_BET_AMOUNTS } from '@shared/constants/betting';

/**
 * MinimalBettingModal - Betting modal matching experimental minimal design system
 *
 * Features:
 * - Dark zinc theme with dotted borders
 * - Monospace typography throughout
 * - Keyboard shortcuts for quick betting
 * - Same business logic as original BettingModal
 */
export default function MinimalBettingModal({ game, isOpen, onClose, onBetPlaced }) {
  const { user, refreshUser } = useUserContext();
  const userBiscuits = user?.biscuits || 0;
  const { validate, canBet } = useBetValidation();

  const [betAmount, setBetAmount] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null); // 'home' or 'away'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Proactive check: can this game be bet on?
  const gameEligibility = useMemo(() => canBet(game), [canBet, game]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setBetAmount('');
      setSelectedTeam(null);
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  // Calculate potential winnings
  const calculatePotentialWin = () => {
    if (!betAmount || !selectedTeam) return 0;
    const odds = selectedTeam === 'home' ? game.homeOdds : game.awayOdds;
    return Math.round(parseFloat(betAmount) * odds);
  };

  const calculateProfit = () => {
    const potentialWin = calculatePotentialWin();
    return potentialWin - (parseFloat(betAmount) || 0);
  };

  // Handle bet amount change - enforce integers only
  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow empty string for clearing, otherwise parse and floor to integer
    if (value === '') {
      setBetAmount('');
      return;
    }
    // Strip any decimal part and prevent negative values
    const parsed = Math.floor(Math.abs(parseFloat(value)));
    if (!isNaN(parsed)) {
      setBetAmount(parsed.toString());
    }
  };

  // Handle bet placement
  const handlePlaceBet = async () => {
    try {
      setLoading(true);
      setError(null);

      // Parse amount as integer
      const amount = parseInt(betAmount, 10);

      // Use centralized validation hook
      const validation = validate({
        amount,
        selectedTeam,
        userBiscuits,
        game,
      });

      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Place bet via API
      const response = await fetch('/api/bets/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: game._id,
          betAmount: amount,
          predictedWinner: selectedTeam,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Debug: log full error response
        console.error('[MinimalBettingModal] API error response:', {
          status: response.status,
          statusText: response.statusText,
          data,
        });
        // Try multiple error fields that server might return
        const errorMessage = data.error || data.message || data.details || 'Failed to place bet';
        throw new Error(errorMessage);
      }

      // Success!
      setSuccess(true);

      // Refresh user data to update biscuits
      await refreshUser();

      // Call callback to refresh data
      if (onBetPlaced) {
        onBetPlaced(data);
      }

      // Close modal after 1.5 seconds
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Bet placement error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e) => {
      // Ignore if typing in input
      if (e.target.tagName === 'INPUT') return;

      switch (e.key.toLowerCase()) {
        case 'h':
          setSelectedTeam('home');
          break;
        case 'a':
          setSelectedTeam('away');
          break;
        case '1':
          setBetAmount(QUICK_BET_AMOUNTS[0].toString());
          break;
        case '2':
          setBetAmount(QUICK_BET_AMOUNTS[1].toString());
          break;
        case '3':
          setBetAmount(QUICK_BET_AMOUNTS[2].toString());
          break;
        case '4':
          setBetAmount(QUICK_BET_AMOUNTS[3].toString());
          break;
        case '5':
          setBetAmount(QUICK_BET_AMOUNTS[4].toString());
          break;
        case 'm':
          setBetAmount(userBiscuits.toString());
          break;
        case 'enter':
          if (betAmount && selectedTeam && !loading) {
            handlePlaceBet();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, betAmount, selectedTeam, loading, userBiscuits]);

  if (!game) return null;

  return (
    <MinimalModal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        {success ? (
          // Success State
          <div className="text-center py-8">
            <div className="text-4xl mb-4">✓</div>
            <div className="text-lg text-green-500 mb-2">Bet placed</div>
            <div className="text-xs text-zinc-600">Good luck, Husky!</div>
          </div>
        ) : (
          <>
            {/* Header */}
            <SectionLabel>Place bet</SectionLabel>

            <DottedDivider className="my-4" />

            {/* Game Info */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm ${game.homeTeam.includes('Washington') ? 'text-purple-400' : 'text-zinc-300'}`}>
                  {game.homeTeam}
                </span>
                <span className="text-xs text-zinc-700">vs</span>
                <span className={`text-sm ${game.awayTeam.includes('Washington') ? 'text-purple-400' : 'text-zinc-300'}`}>
                  {game.awayTeam}
                </span>
              </div>
              <div className="text-[10px] text-zinc-600 text-center">
                {new Date(game.gameDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </div>
            </div>

            <DottedDivider className="my-4" />

            {/* Game Eligibility Warning */}
            {!gameEligibility.canBet && (
              <div className="mb-4 p-3 border border-dotted border-amber-500/50 bg-amber-500/10">
                <span className="text-xs text-amber-500">{gameEligibility.reason}</span>
              </div>
            )}

            {/* Team Selection */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-wider text-zinc-600">Pick winner</span>
                <Kbd size="xs">H</Kbd>
                <Kbd size="xs">A</Kbd>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {/* Home Team */}
                <button
                  onClick={() => setSelectedTeam('home')}
                  className={`p-3 text-center border border-dotted transition-colors ${
                    selectedTeam === 'home'
                      ? 'border-zinc-600 bg-zinc-900/50 text-zinc-300'
                      : 'border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400'
                  }`}
                >
                  <div className="text-xs mb-1">{game.homeTeam.split(' ').pop()}</div>
                  <div className="text-lg tabular-nums">{game.homeOdds.toFixed(2)}x</div>
                  <div className="text-[10px] text-zinc-700 mt-1">{game.homeBets || 0} bets</div>
                </button>

                {/* Away Team */}
                <button
                  onClick={() => setSelectedTeam('away')}
                  className={`p-3 text-center border border-dotted transition-colors ${
                    selectedTeam === 'away'
                      ? 'border-zinc-600 bg-zinc-900/50 text-zinc-300'
                      : 'border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400'
                  }`}
                >
                  <div className="text-xs mb-1">{game.awayTeam.split(' ').pop()}</div>
                  <div className="text-lg tabular-nums">{game.awayOdds.toFixed(2)}x</div>
                  <div className="text-[10px] text-zinc-700 mt-1">{game.awayBets || 0} bets</div>
                </button>
              </div>
            </div>

            <DottedDivider className="my-4" />

            {/* Bet Amount */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-wider text-zinc-600">Amount</span>
                <span className="text-[10px] text-zinc-700">Min: {BETTING_LIMITS.MIN_BET}</span>
                <span className="text-[10px] text-zinc-700">•</span>
                <span className="text-[10px] text-zinc-700">Available: {userBiscuits.toLocaleString()}</span>
              </div>
              <input
                type="number"
                value={betAmount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
                className="w-full bg-transparent border border-dotted border-zinc-800
                         focus:border-zinc-600 px-3 py-2 text-sm
                         text-zinc-300 placeholder:text-zinc-700
                         focus:outline-none transition-colors"
                min={BETTING_LIMITS.MIN_BET}
                max={userBiscuits}
                step="1"
                inputMode="numeric"
                pattern="[0-9]*"
              />

              {/* Quick Bet Buttons */}
              <div className="flex flex-wrap gap-2 mt-2">
                {QUICK_BET_AMOUNTS.map((amount, idx) => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount.toString())}
                    disabled={amount > userBiscuits}
                    className="flex items-center gap-1 px-2 py-1 text-xs
                             border border-dotted border-zinc-800
                             hover:border-zinc-700 text-zinc-600
                             hover:text-zinc-400 disabled:opacity-30
                             disabled:cursor-not-allowed transition-colors"
                  >
                    <Kbd size="xs">{idx + 1}</Kbd>
                    {amount}
                  </button>
                ))}
                <button
                  onClick={() => setBetAmount(userBiscuits.toString())}
                  className="flex items-center gap-1 px-2 py-1 text-xs
                           border border-dotted border-zinc-800
                           hover:border-zinc-700 text-zinc-600
                           hover:text-zinc-400 transition-colors"
                >
                  <Kbd size="xs">M</Kbd>
                  Max
                </button>
              </div>
            </div>

            {/* Potential Payout */}
            {betAmount && selectedTeam && (
              <>
                <DottedDivider className="my-4" />
                <div className="border border-dotted border-zinc-800 bg-zinc-900/50 p-4 mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-600">Potential payout</span>
                    <span className="text-zinc-300 font-bold tabular-nums">
                      🍪 {calculatePotentialWin().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-700">Profit</span>
                    <span className="text-green-500 tabular-nums">
                      +{calculateProfit().toLocaleString()}
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 border border-dotted border-red-500/50 bg-red-500/10">
                <div className="flex items-start justify-between">
                  <span className="text-xs text-red-500">{error}</span>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-500 hover:text-red-400 text-xs ml-2"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            <DottedDivider className="my-4" />

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-2 text-xs border border-dotted border-zinc-800
                         text-zinc-600 hover:border-zinc-700 hover:text-zinc-400
                         transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceBet}
                disabled={loading || !betAmount || !selectedTeam || !gameEligibility.canBet}
                className="flex-1 py-2 text-xs border border-dotted border-zinc-600
                         text-zinc-300 hover:border-zinc-500 hover:text-zinc-200
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-1"
                title={!gameEligibility.canBet ? gameEligibility.reason : undefined}
              >
                {loading ? (
                  <HuskyBidsLoader size="sm" />
                ) : (
                  <>
                    Place bet
                    <Kbd size="xs">↵</Kbd>
                  </>
                )}
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-4 text-[10px] text-zinc-700 text-center">
              Bets cannot be cancelled. Biscuits deducted immediately.
            </div>
          </>
        )}
      </div>
    </MinimalModal>
  );
}
