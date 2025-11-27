/**
 * Navigation Configuration
 * Single source of truth for all navigation items
 * 
 * Each item has:
 * - key: Keyboard shortcut letter
 * - label: Display text
 * - href: Route path
 * - isMain: (optional) Highlighted CTA button
 */

export const navConfig = [
  { key: 'H', label: 'Home', href: '/dashboard' },
  { key: 'G', label: 'Games', href: '/games' },
  { key: 'N', label: 'Bet', href: '/new-bid', isMain: true },
  { key: 'L', label: 'Rank', href: '/leaderboard' },
  { key: 'B', label: 'Bets', href: '/betting-history' },
];

export const sidebarConfig = [
  { key: 'D', label: 'Dashboard', href: '/dashboard' },
  { key: 'G', label: 'Games', href: '/games' },
  { key: 'L', label: 'Leaderboard', href: '/leaderboard' },
  { key: 'B', label: 'My Bets', href: '/betting-history' },
  { key: 'T', label: 'Tasks', href: '/tasks' },
];

// Keyboard shortcuts for global actions
export const globalShortcuts = [
  { key: 'N', action: 'new-bet', label: 'New bet' },
  { key: '/', action: 'search', label: 'Search' },
  { key: '?', action: 'help', label: 'Help' },
];
