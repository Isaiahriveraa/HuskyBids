/**
 * Sync Games from ESPN API
 *
 * Updates existing games in the database with latest data from ESPN:
 * - Game status (scheduled -> live -> completed)
 * - Current scores
 * - Winner determination
 *
 * ARCHITECTURAL DECISION:
 * Calls ESPN API directly (not through our own API route) for:
 * - Better performance (no unnecessary HTTP round-trip)
 * - Serverless compatibility (Netlify Functions)
 * - Reduced latency and failure points
 *
 * This endpoint is called automatically during user login to ensure
 * bet settlement has the most up-to-date game data.
 */

import connectDB from '@server/db';
import Game from '@server/models/Game';

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { sport = 'football' } = req.query;

    console.log(`🔄 Syncing ${sport} games from ESPN API...`);

    // ESPN API URLs - Team ID 264 = Washington Huskies
    const ESPN_API_URLS = {
      football: 'http://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/264/schedule',
      basketball: 'http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams/264/schedule',
    };

    const espnUrl = ESPN_API_URLS[sport] || ESPN_API_URLS.football;

    // Fetch directly from ESPN API
    const espnResponse = await fetch(espnUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!espnResponse.ok) {
      throw new Error(`ESPN API returned ${espnResponse.status}: ${espnResponse.statusText}`);
    }

    const espnData = await espnResponse.json();

    if (!espnData.events || !Array.isArray(espnData.events)) {
      throw new Error('Invalid ESPN API response: missing events array');
    }

    console.log(`📡 Fetched ${espnData.events.length} games from ESPN`);

    let updatedCount = 0;
    let createdCount = 0;
    let errorCount = 0;
    const updates = [];

    // Process each ESPN event
    for (const event of espnData.events) {
      try {
        const competition = event.competitions?.[0];
        if (!competition) {
          console.warn(`⚠️  Skipping event ${event.id}: no competition data`);
          continue;
        }

        const competitors = competition.competitors || [];
        if (competitors.length !== 2) {
          console.warn(`⚠️  Skipping event ${event.id}: invalid competitors`);
          continue;
        }

        // Extract game data from ESPN response
        const gameData = extractGameData(event, competition, competitors, sport);

        // Find existing game by ESPN API ID
        let game = await Game.findOne({ apiGameId: gameData.apiGameId });

        if (game) {
          // Update existing game
          const wasCompleted = game.status === 'completed';
          const isNowCompleted = gameData.status === 'completed';

          // Update fields
          game.status = gameData.status;
          game.homeScore = gameData.homeScore;
          game.awayScore = gameData.awayScore;
          game.homeTeam = gameData.homeTeam;
          game.awayTeam = gameData.awayTeam;
          game.gameDate = gameData.gameDate;
          game.location = gameData.location;

          // Update winner if game just completed or if completed and winner not set
          if (isNowCompleted && !game.winner) {
            game.winner = determineWinner(game.homeScore, game.awayScore);
            console.log(`🏆 Winner set: ${game.homeTeam} ${game.homeScore} - ${game.awayScore} ${game.awayTeam} → ${game.winner}`);
          }

          // Close betting if game is live or completed
          if ((gameData.status === 'live' || gameData.status === 'completed') && game.bettingOpen) {
            game.bettingOpen = false;
            game.bettingCloseTime = new Date();
            console.log(`🔒 Betting closed for ${game.homeTeam} vs ${game.awayTeam}`);
          }

          await game.save();
          updatedCount++;

          updates.push({
            action: 'updated',
            gameId: game._id,
            apiGameId: gameData.apiGameId,
            status: gameData.status,
            score: `${gameData.homeScore}-${gameData.awayScore}`,
            winner: game.winner,
            homeTeam: gameData.homeTeam,
            awayTeam: gameData.awayTeam,
          });

          console.log(`✅ Updated: ${game.homeTeam} vs ${game.awayTeam} (${game.status})`);
        } else {
          // Create new game
          game = await Game.create({
            apiGameId: gameData.apiGameId,
            sport: gameData.sport,
            homeTeam: gameData.homeTeam,
            awayTeam: gameData.awayTeam,
            opponent: gameData.opponent,
            gameDate: gameData.gameDate,
            location: gameData.location,
            status: gameData.status,
            homeScore: gameData.homeScore,
            awayScore: gameData.awayScore,
            winner: gameData.status === 'completed'
              ? determineWinner(gameData.homeScore, gameData.awayScore)
              : null,
            uwLogo: gameData.uwLogo,
            opponentLogo: gameData.opponentLogo,
            homeTeamLogo: gameData.homeTeamLogo,
            awayTeamLogo: gameData.awayTeamLogo,
            uwTopPlayer: gameData.uwTopPlayer,
            opponentTopPlayer: gameData.opponentTopPlayer,
            espnOdds: gameData.espnOdds,
            league: 'NCAA',
            season: '2024-2025',
            week: gameData.week,
            bettingOpen: gameData.status === 'scheduled',
          });

          createdCount++;

          updates.push({
            action: 'created',
            gameId: game._id,
            apiGameId: gameData.apiGameId,
            status: gameData.status,
            teams: `${gameData.homeTeam} vs ${gameData.awayTeam}`,
          });

          console.log(`➕ Created: ${game.homeTeam} vs ${game.awayTeam}`);
        }
      } catch (gameError) {
        console.error(`❌ Error processing event ${event.id}:`, gameError);
        errorCount++;
      }
    }

    console.log(`✅ Sync complete: ${updatedCount} updated, ${createdCount} created, ${errorCount} errors`);

    res.status(200).json({
      success: true,
      message: 'Games synced successfully',
      sport,
      totalProcessed: espnData.events.length,
      updated: updatedCount,
      created: createdCount,
      errors: errorCount,
      updates,
    });
  } catch (error) {
    console.error('❌ Error syncing games:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}

/**
 * Extracts game data from ESPN API response
 *
 * @param {Object} event - ESPN event object
 * @param {Object} competition - ESPN competition object
 * @param {Array} competitors - Array of competitor objects
 * @param {string} sport - Sport type (football/basketball)
 * @returns {Object} Normalized game data
 */
function extractGameData(event, competition, competitors, sport) {
  // Find Washington Huskies and opponent
  const uwTeam = competitors.find(
    team => team.team.displayName === 'Washington Huskies' || team.team.id === '264'
  );
  const opponentTeam = competitors.find(
    team => team.team.displayName !== 'Washington Huskies' && team.team.id !== '264'
  );

  if (!uwTeam || !opponentTeam) {
    throw new Error(`Missing UW or opponent in event ${event.id}`);
  }

  const isHome = uwTeam.homeAway === 'home';
  const venue = competition.venue || {};

  // Extract team logos
  const uwLogo = uwTeam.team?.logos?.[0]?.href || 'https://a.espncdn.com/i/teamlogos/ncaa/500/264.png';
  const opponentLogo = opponentTeam.team?.logos?.[0]?.href || null;

  // Extract scores - handle multiple possible score formats
  const homeScore = parseInt(
    competitors[0]?.score?.value ||
    competitors[0]?.score ||
    0
  );
  const awayScore = parseInt(
    competitors[1]?.score?.value ||
    competitors[1]?.score ||
    0
  );

  // Map ESPN status to our status
  const espnStatus = competition.status?.type?.name || 'STATUS_SCHEDULED';
  const status = mapESPNStatus(espnStatus);

  // Extract top players (if available)
  const gameStatus = espnStatus;
  const uwTopPlayer = extractTopPlayer(uwTeam, 'UW', gameStatus);
  const opponentTopPlayer = extractTopPlayer(opponentTeam, opponentTeam.team.displayName, gameStatus);

  // Extract odds (if available)
  let espnOdds = null;
  if (competition.odds && competition.odds.length > 0) {
    const odds = competition.odds[0];
    espnOdds = {
      provider: odds.provider?.name || 'ESPN',
      details: odds.details || '',
      overUnder: odds.overUnder || null,
      spread: odds.spread || null,
      homeMoneyLine: odds.homeTeamOdds?.moneyLine || null,
      awayMoneyLine: odds.awayTeamOdds?.moneyLine || null,
    };
  }

  return {
    apiGameId: event.id,
    sport,
    homeTeam: isHome ? 'Washington Huskies' : opponentTeam.team.displayName,
    awayTeam: isHome ? opponentTeam.team.displayName : 'Washington Huskies',
    opponent: opponentTeam.team.displayName,
    gameDate: new Date(event.date),
    location: venue.fullName || 'TBD',
    status,
    homeScore,
    awayScore,
    uwLogo,
    opponentLogo,
    homeTeamLogo: isHome ? uwLogo : opponentLogo,
    awayTeamLogo: isHome ? opponentLogo : uwLogo,
    uwTopPlayer,
    opponentTopPlayer,
    espnOdds,
    week: event.week?.number || null,
  };
}

/**
 * Extracts top player stats from team data
 *
 * @param {Object} teamData - ESPN team data
 * @param {string} teamName - Team name for logging
 * @param {string} espnStatus - ESPN game status
 * @returns {Object|null} Top player data or null
 */
function extractTopPlayer(teamData, teamName, espnStatus) {
  if (!teamData?.leaders || teamData.leaders.length === 0) {
    // For completed games, flag as unavailable
    if (espnStatus === 'STATUS_FINAL') {
      return {
        name: null,
        stats: null,
        position: null,
        athleteId: null,
        dataUnavailable: true,
      };
    }
    return null;
  }

  const leaders = teamData.leaders;
  const topPlayer = {
    passing: leaders.find(l => l.name === 'passingLeader')?.leaders?.[0],
    rushing: leaders.find(l => l.name === 'rushingLeader')?.leaders?.[0],
    receiving: leaders.find(l => l.name === 'receivingLeader')?.leaders?.[0],
  };

  const player = topPlayer.passing || topPlayer.rushing || topPlayer.receiving;
  if (!player) {
    if (espnStatus === 'STATUS_FINAL') {
      return {
        name: null,
        stats: null,
        position: null,
        athleteId: null,
        dataUnavailable: true,
      };
    }
    return null;
  }

  return {
    name: player.athlete?.displayName || player.athlete?.shortName || 'Unknown',
    stats: player.displayValue || '',
    position: topPlayer.passing ? 'QB' : topPlayer.rushing ? 'RB' : 'WR',
    athleteId: player.athlete?.id || null,
    dataUnavailable: false,
  };
}

/**
 * Maps ESPN status to our simplified status
 *
 * @param {string} espnStatus - ESPN status string
 * @returns {string} Normalized status
 */
function mapESPNStatus(espnStatus) {
  const statusMap = {
    STATUS_SCHEDULED: 'scheduled',
    STATUS_IN_PROGRESS: 'live',
    STATUS_FINAL: 'completed',
    STATUS_CANCELED: 'cancelled',
    STATUS_POSTPONED: 'postponed',
    STATUS_DELAYED: 'live',
    STATUS_HALFTIME: 'live',
  };

  return statusMap[espnStatus] || 'scheduled';
}

/**
 * Determines winner based on scores
 *
 * @param {number} homeScore - Home team score
 * @param {number} awayScore - Away team score
 * @returns {string} 'home', 'away', or 'tie'
 */
function determineWinner(homeScore, awayScore) {
  if (homeScore > awayScore) {
    return 'home';
  } else if (awayScore > homeScore) {
    return 'away';
  } else {
    return 'tie';
  }
}
