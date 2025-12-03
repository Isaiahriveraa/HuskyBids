/**
 * Experimental Design System
 * Ultra-minimal, Notion-inspired UI components
 * 
 * Design Principles:
 * - Monospace typography
 * - Dotted borders
 * - Keyboard-first navigation hints
 * - Extreme whitespace
 * - Dark-mode native (zinc color palette)
 */

// Layout components
export { default as AppShell } from './layout/AppShell';
export { default as Sidebar } from './layout/Sidebar';
export { default as MobileNav } from './layout/MobileNav';
export { default as Header } from './layout/Header';
export { default as PageContainer } from './layout/PageContainer';

// UI primitives
export { default as Kbd } from './ui/Kbd';
export { default as DottedDivider } from './ui/DottedDivider';
export { default as SectionLabel } from './ui/SectionLabel';
export { default as NavLink } from './ui/NavLink';
export { default as ActionButton } from './ui/ActionButton';
export { default as MinimalModal } from './ui/MinimalModal';
export { default as MinimalBettingModal } from './ui/MinimalBettingModal';
export { default as HuskyBidsLoader } from './ui/HuskyBidsLoader';
export { default as LoadingScreen } from './ui/LoadingScreen';

// Data display components
export { default as GameListItem } from './ui/GameListItem';
export { default as QuickBetItem } from './ui/QuickBetItem';
export { default as BalanceDisplay } from './ui/BalanceDisplay';
export { default as ActionBar } from './ui/ActionBar';

// Card components
export { default as StatCard } from './ui/StatCard';
export { default as MinimalGameCard } from './ui/MinimalGameCard';
export { default as LeaderboardRow } from './ui/LeaderboardRow';
export { default as BetHistoryRow } from './ui/BetHistoryRow';

// Navigation configuration
export { navConfig, sidebarConfig, globalShortcuts } from './config/navigation';
