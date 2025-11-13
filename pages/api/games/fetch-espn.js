/**
 * ESPN API Integration for UW Huskies Games
 * Fetches upcoming and past games from ESPN's free public API
 */

export default async function handler(req, res) {
  try {
    // ESPN API endpoint for Washington Huskies
    // Team ID 264 = Washington Huskies
    const footballUrl =
      'http://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/264/schedule';
    const basketballUrl =
      'http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams/264/schedule';

    const { sport = 'football', season } = req.query;
    let apiUrl = sport === 'basketball' ? basketballUrl : footballUrl;

    // Add season parameter if provided (e.g., ?season=2024)
    if (season) {
      apiUrl += `?season=${season}`;
    }

    // Fetch from ESPN API
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`ESPN API returned ${response.status}`);
    }

    const data = await response.json();

    // Transform ESPN data to our format
    const games = data.events.map((event, index) => {
      const competition = event.competitions[0];
      const competitors = competition.competitors;

      // Find UW and opponent
      const uwTeam = competitors.find(
        (team) => team.team.displayName === 'Washington Huskies' || team.team.id === '264'
      );
      const opponentTeam = competitors.find(
        (team) => team.team.displayName !== 'Washington Huskies' && team.team.id !== '264'
      );

      // Debug logging for opponent extraction
      if (!opponentTeam) {
        console.warn(`⚠️ No opponent found for game ${event.id}:`, {
          competitors: competitors.map(c => ({ id: c.team.id, name: c.team.displayName }))
        });
      } else {
        console.log(`✅ Opponent found for game ${event.id}: ${opponentTeam.team.displayName}`);
      }

      const isHome = uwTeam?.homeAway === 'home';
      const venue = competition.venue || {};

      // Extract team logos
      const uwLogo = uwTeam?.team?.logos?.[0]?.href || 'https://a.espncdn.com/i/teamlogos/ncaa/500/264.png';
      const opponentLogo = opponentTeam?.team?.logos?.[0]?.href || null;

      // Extract top players/leaders for both teams
      const gameStatus = competition.status?.type?.name || 'STATUS_SCHEDULED';

      const extractTopPlayers = (teamData, teamName, espnStatus) => {
        if (!teamData?.leaders || teamData.leaders.length === 0) {
          console.warn(`⚠️ No leaders data for ${teamName} in game ${event.id}`);

          // For completed games, return explicit empty state with flag
          // This helps frontend differentiate "data unavailable" from "not yet available"
          if (espnStatus === 'STATUS_FINAL') {
            return {
              name: null,
              stats: null,
              position: null,
              athleteId: null,
              dataUnavailable: true, // Flag: data was expected but not available
            };
          }

          // For upcoming/live games, null is expected (stats not yet generated)
          return null;
        }

        const leaders = teamData.leaders;
        const topPlayer = {
          passing: leaders.find(l => l.name === 'passingLeader')?.leaders?.[0],
          rushing: leaders.find(l => l.name === 'rushingLeader')?.leaders?.[0],
          receiving: leaders.find(l => l.name === 'receivingLeader')?.leaders?.[0],
        };

        // Return the most relevant player (prefer passing, then rushing, then receiving)
        const player = topPlayer.passing || topPlayer.rushing || topPlayer.receiving;
        if (!player) {
          console.warn(`⚠️ No player stats available for ${teamName} in game ${event.id}`);

          // Same logic: for completed games, flag as unavailable
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

        const playerData = {
          name: player.athlete?.displayName || player.athlete?.shortName || 'Unknown',
          stats: player.displayValue || '',
          position: topPlayer.passing ? 'QB' : topPlayer.rushing ? 'RB' : 'WR',
          athleteId: player.athlete?.id || null,
          dataUnavailable: false, // Data is available
        };

        console.log(`✅ Top player for ${teamName}: ${playerData.name} (${playerData.position}) - ${playerData.stats}`);
        return playerData;
      };

      const uwTopPlayer = extractTopPlayers(uwTeam, 'UW', gameStatus);
      const opponentTopPlayer = extractTopPlayers(opponentTeam, opponentTeam?.team.displayName || 'Opponent', gameStatus);

      // Extract odds (if available)
      let oddsData = null;
      if (competition.odds && competition.odds.length > 0) {
        const odds = competition.odds[0];
        oddsData = {
          provider: odds.provider?.name || 'ESPN',
          details: odds.details || '',
          overUnder: odds.overUnder || null,
          spread: odds.spread || null,
          homeMoneyLine: odds.homeTeamOdds?.moneyLine || null,
          awayMoneyLine: odds.awayTeamOdds?.moneyLine || null,
        };
      }

      return {
        // API data
        apiGameId: event.id,
        apiSource: 'ESPN',

        // Basic info
        sport: sport,
        homeTeam: isHome ? 'Washington Huskies' : opponentTeam?.team.displayName || 'Opponent',
        awayTeam: isHome ? opponentTeam?.team.displayName || 'Opponent' : 'Washington Huskies',
        opponent: opponentTeam?.team.displayName || 'Opponent',

        // Team Logos
        uwLogo: uwLogo,
        opponentLogo: opponentLogo,
        homeTeamLogo: isHome ? uwLogo : opponentLogo,
        awayTeamLogo: isHome ? opponentLogo : uwLogo,

        // Top Players
        uwTopPlayer: uwTopPlayer,
        opponentTopPlayer: opponentTopPlayer,

        // Date and time
        gameDate: event.date,
        dateFormatted: new Date(event.date).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        time: new Date(event.date).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),

        // Location
        location: venue.fullName || 'TBD',
        city: venue.address?.city || '',
        state: venue.address?.state || '',
        isHome: isHome,

        // Status and scores (status is in competition, not event)
        status: mapESPNStatus(competition.status?.type?.name || 'STATUS_SCHEDULED'),
        statusDetail: competition.status?.type?.detail || '',
        homeScore: parseInt(competitors[0]?.score?.value || competitors[0]?.score || 0),
        awayScore: parseInt(competitors[1]?.score?.value || competitors[1]?.score || 0),

        // Week information
        week: event.week?.number || index + 1,
        seasonType: event.season?.type || 2, // 1=preseason, 2=regular, 3=postseason

        // Additional info
        tvNetwork: competition.broadcast || 'TBD',
        tickets: competition.tickets?.[0]?.summary || null,
        odds: oddsData,
      };
    });

    // Sort by game date
    games.sort((a, b) => new Date(a.gameDate) - new Date(b.gameDate));

    res.status(200).json({
      success: true,
      sport: sport,
      count: games.length,
      games: games,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('ESPN API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}

/**
 * Map ESPN status to our simplified status
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
