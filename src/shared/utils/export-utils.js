/**
 * Utility functions for exporting data
 */

/**
 * Convert betting history to CSV format and trigger download
 * @param {Array} bets - Array of bet objects with game data
 * @param {Object} stats - Betting statistics
 * @param {Object} financial - Financial statistics
 */
export function exportBettingHistoryToCSV(bets, stats, financial) {
  // CSV Headers
  const headers = [
    'Date',
    'Sport',
    'Home Team',
    'Away Team',
    'Bet On',
    'Bet Amount',
    'Odds',
    'Status',
    'Result',
    'Profit/Loss',
    'Game Status',
    'Final Score'
  ];

  // Convert bets to CSV rows
  const rows = bets.map(bet => {
    const game = bet.gameId;
    if (!game) return null;

    const isUWHome = game.homeTeam === 'Washington Huskies';
    const betOnTeam = bet.predictedWinner === 'home' ? game.homeTeam : game.awayTeam;
    const betOnUW = (bet.predictedWinner === 'home' && isUWHome) || (bet.predictedWinner === 'away' && !isUWHome);

    let result = '';
    let profitLoss = '';

    if (bet.status === 'won') {
      result = bet.actualWin.toLocaleString();
      profitLoss = `+${(bet.actualWin - bet.betAmount).toLocaleString()}`;
    } else if (bet.status === 'lost') {
      result = '0';
      profitLoss = `-${bet.betAmount.toLocaleString()}`;
    } else if (bet.status === 'pending') {
      result = `${bet.potentialWin.toLocaleString()} (potential)`;
      profitLoss = 'Pending';
    } else {
      result = bet.betAmount.toLocaleString();
      profitLoss = '0 (refunded)';
    }

    const finalScore = game.status === 'completed'
      ? `${game.homeTeam} ${game.homeScore} - ${game.awayScore} ${game.awayTeam}`
      : 'N/A';

    return [
      new Date(game.gameDate).toLocaleDateString(),
      game.sport.charAt(0).toUpperCase() + game.sport.slice(1),
      game.homeTeam,
      game.awayTeam,
      betOnUW ? `🐺 ${betOnTeam}` : betOnTeam,
      bet.betAmount.toLocaleString(),
      bet.odds.toFixed(2) + 'x',
      bet.status.charAt(0).toUpperCase() + bet.status.slice(1),
      result,
      profitLoss,
      game.status.charAt(0).toUpperCase() + game.status.slice(1),
      finalScore
    ];
  }).filter(row => row !== null);

  // Add summary statistics at the top
  const summaryRows = [
    ['BETTING HISTORY SUMMARY'],
    [''],
    ['Total Bets', stats.total],
    ['Bets Won', stats.won],
    ['Bets Lost', stats.lost],
    ['Pending Bets', stats.pending],
    ['Win Rate', stats.total > 0 ? `${((stats.won / (stats.won + stats.lost || 1)) * 100).toFixed(1)}%` : '0%'],
    [''],
    ['Total Wagered', financial.totalWagered.toLocaleString() + ' biscuits'],
    ['Total Won', financial.totalWon.toLocaleString() + ' biscuits'],
    ['Total Lost', financial.totalLost.toLocaleString() + ' biscuits'],
    ['Net Profit', `${financial.netProfit >= 0 ? '+' : ''}${financial.netProfit.toLocaleString()} biscuits`],
    ['ROI', financial.roi + '%'],
    [''],
    ['INDIVIDUAL BETS'],
    ['']
  ];

  // Combine all data
  const csvContent = [
    ...summaryRows,
    headers,
    ...rows
  ].map(row =>
    row.map(cell => {
      // Escape quotes and wrap in quotes if contains comma
      const cellStr = String(cell);
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    }).join(',')
  ).join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  const timestamp = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `huskybids-betting-history-${timestamp}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Format date for export
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatExportDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
