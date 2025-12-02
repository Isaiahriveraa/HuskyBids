'use client';

import React, { useState, useEffect } from 'react';
import { useUserContext } from '@/app/contexts/UserContext';
import { Modal, Button, Input, Badge, Alert } from './ui';
import BiscuitIcon from './BiscuitIcon';
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { getTeamPositions } from '@shared/utils/game-utils';
import { BETTING_LIMITS, QUICK_BET_AMOUNTS, BETTING_ERRORS } from '@shared/constants/betting';

export default function BettingModal({ game, isOpen, onClose, onBetPlaced }) {
  const { user, refreshUser } = useUserContext();
  const userBiscuits = user?.biscuits || 0;
  const [betAmount, setBetAmount] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null); // 'home' or 'away'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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

  // Handle bet placement
  const handlePlaceBet = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate
      const amount = parseInt(betAmount);
      if (!amount || amount <= 0) {
        throw new Error(BETTING_ERRORS.INVALID_AMOUNT);
      }

      if (!selectedTeam) {
        throw new Error(BETTING_ERRORS.NO_TEAM_SELECTED);
      }

      if (amount > userBiscuits) {
        throw new Error(BETTING_ERRORS.INSUFFICIENT_FUNDS);
      }

      if (amount < BETTING_LIMITS.MIN_BET) {
        throw new Error(BETTING_ERRORS.MIN_BET_NOT_MET(BETTING_LIMITS.MIN_BET));
      }

      if (amount > BETTING_LIMITS.MAX_BET) {
        throw new Error(BETTING_ERRORS.MAX_BET_EXCEEDED(BETTING_LIMITS.MAX_BET));
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
        throw new Error(data.error || 'Failed to place bet');
      }

      // Success!
      setSuccess(true);

      // Refresh user data to update biscuits
      await refreshUser();

      // Call callback to refresh data
      if (onBetPlaced) {
        onBetPlaced(data);
      }

      // Close modal after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      console.error('Bet placement error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setBetAmount('');
    setSelectedTeam(null);
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!game) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" title="Place Your Bet">
      {success ? (
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-600 mb-2">Bet Placed!</h3>
          <p className="text-gray-600">Good luck, Husky!</p>
        </div>
      ) : (
        <>
          {/* Game Info */}
          <div className="bg-uw-purple-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold text-uw-purple-900">
                {game.homeTeam}
              </span>
              <Badge variant="secondary">VS</Badge>
              <span className="text-lg font-bold text-gray-700">
                {game.awayTeam}
              </span>
            </div>
            <div className="text-sm text-gray-600 text-center">
              {new Date(game.gameDate).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </div>
          </div>

          {/* Team Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Who will win?
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Home Team */}
              <button
                onClick={() => setSelectedTeam('home')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedTeam === 'home'
                    ? 'border-uw-purple-600 bg-uw-purple-50 shadow-lg scale-105'
                    : 'border-gray-300 hover:border-uw-purple-400'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-800 mb-1">
                    {game.homeTeam.length > 15 ? 'Home' : game.homeTeam}
                  </div>
                  <Badge variant="gold" size="lg">
                    {game.homeOdds.toFixed(2)}x
                  </Badge>
                  <div className="text-xs text-gray-500 mt-2">
                    {game.homeBets} bets
                  </div>
                </div>
              </button>

              {/* Away Team */}
              <button
                onClick={() => setSelectedTeam('away')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedTeam === 'away'
                    ? 'border-uw-purple-600 bg-uw-purple-50 shadow-lg scale-105'
                    : 'border-gray-300 hover:border-uw-purple-400'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-800 mb-1">
                    {game.awayTeam.length > 15 ? 'Away' : game.awayTeam}
                  </div>
                  <Badge variant="gold" size="lg">
                    {game.awayOdds.toFixed(2)}x
                  </Badge>
                  <div className="text-xs text-gray-500 mt-2">
                    {game.awayBets} bets
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Bet Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bet Amount
            </label>
            <Input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              placeholder={`Enter amount (min: ${BETTING_LIMITS.MIN_BET})`}
              icon={<BiscuitIcon size={20} />}
              min={BETTING_LIMITS.MIN_BET}
              max={userBiscuits}
            />
            <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
              <span>Min: {BETTING_LIMITS.MIN_BET}</span>
              <span>Available: {userBiscuits.toLocaleString()}</span>
            </div>

            {/* Quick Bet Buttons */}
            <div className="flex gap-2 mt-3">
              {QUICK_BET_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  variant="ghost"
                  size="sm"
                  onClick={() => setBetAmount(amount.toString())}
                  disabled={amount > userBiscuits}
                >
                  {amount}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBetAmount(userBiscuits.toString())}
              >
                Max
              </Button>
            </div>
          </div>

          {/* Potential Winnings */}
          {betAmount && selectedTeam && (
            <div className="bg-gradient-to-r from-uw-gold-50 to-uw-purple-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Potential Payout:</span>
                <span className="text-2xl font-bold text-uw-purple-700 flex items-center gap-1">
                  <BiscuitIcon size={24} />
                  {calculatePotentialWin().toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Profit:</span>
                <span className={`text-lg font-bold flex items-center gap-1 ${
                  calculateProfit() > 0 ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {calculateProfit() > 0 ? <TrendingUp size={18} /> : null}
                  <BiscuitIcon size={18} />
                  +{calculateProfit().toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <Alert variant="danger" className="mb-4" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handlePlaceBet}
              disabled={loading || !betAmount || !selectedTeam}
            >
              {loading ? 'Placing Bet...' : 'Place Bet'}
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-4 text-xs text-gray-500 text-center">
            <AlertCircle className="inline w-4 h-4 mr-1" />
            Bets cannot be cancelled once placed. Biscuits will be deducted immediately.
          </div>
        </>
      )}
    </Modal>
  );
}
