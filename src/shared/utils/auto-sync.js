/**
 * Auto-Sync Utility Functions
 * Handles automatic synchronization of games from ESPN API
 */

import { getBaseUrl } from '@shared/constants/config.js';

/**
 * Auto-syncs games from ESPN for specified sport and seasons
 * @param {string} sport - Sport type ('football' or 'basketball')
 * @param {Array<number>|null} seasons - Array of season years to sync (defaults to current and previous year)
 * @param {boolean} force - Force re-sync even if games exist
 * @returns {Promise<Array>} Array of sync results for each season
 */
export async function autoSyncGames(sport, seasons = null, force = true) {
  const baseUrl = getBaseUrl();

  // Default to current and previous year if no seasons provided
  if (!seasons) {
    const currentYear = new Date().getFullYear();
    seasons = [currentYear, currentYear - 1];
  }

  const results = [];

  for (const season of seasons) {
    try {
      console.log(`🔄 Auto-syncing ${sport} season ${season}...`);

      const url = `${baseUrl}/api/games/sync?sport=${sport}&season=${season}&force=${force}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`✅ Successfully synced ${sport} season ${season}`);
        results.push({
          season,
          success: true,
          data: data,
        });
      } else {
        console.warn(`⚠️ Failed to sync ${sport} season ${season}: ${data.error}`);
        results.push({
          season,
          success: false,
          error: data.error || 'Unknown error',
        });
      }
    } catch (error) {
      console.error(`❌ Error syncing ${sport} season ${season}:`, error.message);
      results.push({
        season,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
}

/**
 * Auto-syncs current season games if none exist
 * @param {string} sport - Sport type ('football' or 'basketball')
 * @param {number} minGamesThreshold - Minimum games before auto-sync (default: 0)
 * @returns {Promise<Object>} Sync result
 */
export async function autoSyncIfNeeded(sport, minGamesThreshold = 0) {
  try {
    const baseUrl = getBaseUrl();
    const currentYear = new Date().getFullYear();

    // Check if games exist for current season
    const checkResponse = await fetch(
      `${baseUrl}/api/games/upcoming?sport=${sport}`,
      { method: 'GET' }
    );

    const checkData = await checkResponse.json();
    const gameCount = checkData.games?.length || 0;

    if (gameCount <= minGamesThreshold) {
      console.log(`📊 Found ${gameCount} games, triggering auto-sync for ${sport}...`);

      const syncResults = await autoSyncGames(sport, [currentYear], true);

      return {
        triggered: true,
        reason: `Only ${gameCount} games found`,
        results: syncResults,
      };
    }

    console.log(`✓ ${gameCount} games found for ${sport}, no auto-sync needed`);
    return {
      triggered: false,
      reason: `${gameCount} games already exist`,
      results: [],
    };
  } catch (error) {
    console.error(`Error in autoSyncIfNeeded for ${sport}:`, error.message);
    return {
      triggered: false,
      error: error.message,
      results: [],
    };
  }
}

/**
 * Syncs multiple sports at once
 * @param {Array<string>} sports - Array of sport types
 * @param {number} season - Season year
 * @returns {Promise<Object>} Results for all sports
 */
export async function syncMultipleSports(sports, season = null) {
  const currentYear = new Date().getFullYear();
  const targetSeason = season || currentYear;

  const results = {};

  for (const sport of sports) {
    try {
      console.log(`🔄 Syncing ${sport} for season ${targetSeason}...`);
      const sportResults = await autoSyncGames(sport, [targetSeason], true);
      results[sport] = sportResults;
    } catch (error) {
      console.error(`Error syncing ${sport}:`, error.message);
      results[sport] = [{
        season: targetSeason,
        success: false,
        error: error.message,
      }];
    }
  }

  return results;
}
