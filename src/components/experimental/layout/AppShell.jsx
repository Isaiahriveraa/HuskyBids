/**
 * AppShell - Main application layout wrapper
 * Combines Sidebar, Header, MobileNav into a cohesive shell
 * 
 * This is the main layout component that should wrap all pages
 * using the new experimental design system.
 * 
 * @example
 * <AppShell balance={user?.biscuits}>
 *   <YourPageContent />
 * </AppShell>
 */
'use client';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import Header from './Header';
import PageContainer from './PageContainer';
import useKeyboardNav from '@/app/hooks/useKeyboardNav';

export default function AppShell({ 
  children,
  title = 'HuskyBids',
  balance = 0,
  userName = 'user',
  showSidebar = true,
  showMobileNav = true,
  showHeader = true,
}) {
  //Enable global keyboard shortcuts
  useKeyboardNav();

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-mono">
      {/* Desktop Sidebar */}
      {showSidebar && (
        <Sidebar title={title} userName={userName} />
      )}

      {/* Main Content Area */}
      <div className={showSidebar ? 'lg:ml-52' : ''}>
        {/* Header */}
        {showHeader && (
          <Header title={title} balance={balance} />
        )}

        {/* Main Content */}
        <PageContainer>
          {children}
        </PageContainer>
      </div>

      {/* Bottom Navigation - Mobile only */}
      {showMobileNav && <MobileNav />}
    </div>
  );
}
