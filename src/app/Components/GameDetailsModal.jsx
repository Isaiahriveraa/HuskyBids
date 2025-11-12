/**
 * Game Details Modal Component
 * Shows detailed odds, player stats, and game information
 */

'use client';

import React from 'react';
import Image from 'next/image';
import Modal from './ui/Modal';
import { Badge, Button } from './ui';
import { Trophy, TrendingUp, User, Info, DollarSign, BarChart3 } from 'lucide-react';

export default function GameDetailsModal({ game, isOpen, onClose }) {
  if (!game) return null;

  // Determine if UW is home or away
  const isUWHome = game.homeTeam === 'Washington Huskies' || game.homeTeam?.includes('Washington');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Game Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Teams Header */}
        <div className="grid grid-cols-2 gap-4">
          {/* UW Team */}
          <div className="bg-uw-purple-50 p-4 rounded-lg">
            <div className="flex flex-col items-center">
              {game.uwLogo && (
                <div className="relative w-20 h-20 mb-3">
                  <Image
                    src={game.uwLogo}
                    alt="UW Logo"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}
              <h3 className="font-bold text-uw-purple-900 text-center">Washington Huskies</h3>
              <Badge variant="gold" size="sm" className="mt-2">
                {isUWHome ? 'Home' : 'Away'}
              </Badge>
            </div>
          </div>

          {/* Opponent Team */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex flex-col items-center">
              {game.opponentLogo && (
                <div className="relative w-20 h-20 mb-3">
                  <Image
                    src={game.opponentLogo}
                    alt="Opponent Logo"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}
              <h3 className="font-bold text-gray-900 text-center">{game.opponent}</h3>
              <Badge variant="outline" size="sm" className="mt-2">
                {isUWHome ? 'Away' : 'Home'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Betting Odds Section */}
        {(game.homeOdds || game.awayOdds) && (
          <div className="bg-gradient-to-br from-uw-purple-50 to-uw-gold-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-uw-purple-600" />
              <h4 className="font-bold text-uw-purple-900">Current Betting Odds</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="text-xs text-gray-600 mb-1">Washington Huskies</div>
                <div className="text-3xl font-bold text-uw-purple-900">
                  {isUWHome ? game.homeOdds?.toFixed(2) : game.awayOdds?.toFixed(2)}x
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ${(10 * (isUWHome ? game.homeOdds : game.awayOdds)).toFixed(0)} payout per $10 bet
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="text-xs text-gray-600 mb-1">{game.opponent}</div>
                <div className="text-3xl font-bold text-gray-900">
                  {isUWHome ? game.awayOdds?.toFixed(2) : game.homeOdds?.toFixed(2)}x
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ${(10 * (isUWHome ? game.awayOdds : game.homeOdds)).toFixed(0)} payout per $10 bet
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ESPN Odds (if available) */}
        {game.espnOdds && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h4 className="font-bold text-blue-900">ESPN Odds Data</h4>
              {game.espnOdds.provider && (
                <Badge variant="info" size="sm">{game.espnOdds.provider}</Badge>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {game.espnOdds.spread && (
                <div>
                  <div className="text-gray-600">Spread</div>
                  <div className="font-semibold text-gray-900">{game.espnOdds.spread}</div>
                </div>
              )}
              {game.espnOdds.overUnder && (
                <div>
                  <div className="text-gray-600">Over/Under</div>
                  <div className="font-semibold text-gray-900">{game.espnOdds.overUnder}</div>
                </div>
              )}
              {game.espnOdds.details && (
                <div className="col-span-2">
                  <div className="text-gray-600">Details</div>
                  <div className="font-semibold text-gray-900">{game.espnOdds.details}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Top Performing Players */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-uw-gold-600" />
            <h4 className="font-bold text-gray-900">Top Performing Players</h4>
          </div>

          <div className="space-y-3">
            {/* UW Top Player */}
            {game.uwTopPlayer && (
              <div className="bg-uw-purple-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="bg-uw-purple-100 p-2 rounded-full">
                    <User className="w-5 h-5 text-uw-purple-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-uw-purple-900">{game.uwTopPlayer.name}</span>
                      <Badge variant="gold" size="sm">{game.uwTopPlayer.position}</Badge>
                    </div>
                    <div className="text-sm text-uw-purple-700 font-semibold">Washington Huskies</div>
                    {game.uwTopPlayer.stats && (
                      <div className="text-sm text-gray-600 mt-2">
                        <div className="bg-white px-3 py-1.5 rounded inline-block">
                          {game.uwTopPlayer.stats}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Opponent Top Player */}
            {game.opponentTopPlayer && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-200 p-2 rounded-full">
                    <User className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">{game.opponentTopPlayer.name}</span>
                      <Badge variant="outline" size="sm">{game.opponentTopPlayer.position}</Badge>
                    </div>
                    <div className="text-sm text-gray-700 font-semibold">{game.opponent}</div>
                    {game.opponentTopPlayer.stats && (
                      <div className="text-sm text-gray-600 mt-2">
                        <div className="bg-white px-3 py-1.5 rounded inline-block">
                          {game.opponentTopPlayer.stats}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!game.uwTopPlayer && !game.opponentTopPlayer && (
              <div className="text-center text-gray-500 py-4">
                <Info className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Player statistics not available for this game</p>
              </div>
            )}
          </div>
        </div>

        {/* Betting Statistics */}
        {game.totalBetsPlaced > 0 && (
          <div className="bg-gradient-to-br from-uw-gold-50 to-yellow-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-uw-gold-700" />
              <h4 className="font-bold text-uw-gold-900">Betting Activity</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="text-xs text-gray-600 mb-1">Total Bets Placed</div>
                <div className="text-2xl font-bold text-uw-purple-900">{game.totalBetsPlaced}</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="text-xs text-gray-600 mb-1">Total Wagered</div>
                <div className="text-2xl font-bold text-uw-purple-900">
                  {game.totalBiscuitsWagered?.toLocaleString() || 0} 🥯
                </div>
              </div>
              {game.homeBets > 0 && game.awayBets > 0 && (
                <>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-xs text-gray-600 mb-1">Bets on {isUWHome ? 'UW' : game.opponent}</div>
                    <div className="text-xl font-bold text-uw-purple-700">
                      {isUWHome ? game.homeBets : game.awayBets}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-xs text-gray-600 mb-1">Bets on {isUWHome ? game.opponent : 'UW'}</div>
                    <div className="text-xl font-bold text-gray-700">
                      {isUWHome ? game.awayBets : game.homeBets}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Additional Game Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-3">Game Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Sport:</span>
              <span className="font-semibold text-gray-900 capitalize">{game.sport}</span>
            </div>
            {game.week && (
              <div className="flex justify-between">
                <span className="text-gray-600">Week:</span>
                <span className="font-semibold text-gray-900">Week {game.week}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <Badge variant={getStatusVariant(game.status)} size="sm">
                {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-semibold text-gray-900">
                {new Date(game.gameDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-semibold text-gray-900">
                {new Date(game.gameDate).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-semibold text-gray-900">{game.location}</span>
            </div>
            {game.tvNetwork && (
              <div className="flex justify-between">
                <span className="text-gray-600">TV:</span>
                <span className="font-semibold text-gray-900">{game.tvNetwork}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

// Helper function to get badge variant based on status
function getStatusVariant(status) {
  const variants = {
    scheduled: 'info',
    live: 'success',
    completed: 'secondary',
    cancelled: 'danger',
    postponed: 'warning',
  };
  return variants[status] || 'secondary';
}
