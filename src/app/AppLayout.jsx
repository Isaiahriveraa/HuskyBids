'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Components/Sidebar';
import MobileHeader from './Components/MobileHeader';

const AppLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Pages where we don't want to show the sidebar (like login)
  const hideSidebarPages = ['/login', '/login-testing'];
  const shouldShowSidebar = !hideSidebarPages.includes(pathname);

  if (!isClient) {
    return <div className="min-h-screen bg-purple-50">{children}</div>;
  }

  if (!shouldShowSidebar) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Mobile Header */}
      <MobileHeader 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />

      {/* Sidebar - Always visible on desktop, toggleable on mobile */}
      <div className="hidden md:block">
        <Sidebar 
          currentPath={pathname} 
          mobileMenuOpen={mobileMenuOpen} 
          setMobileMenuOpen={setMobileMenuOpen} 
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50" 
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <Sidebar 
            currentPath={pathname} 
            mobileMenuOpen={mobileMenuOpen} 
            setMobileMenuOpen={setMobileMenuOpen} 
          />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen bg-gradient-to-br from-purple-50 via-white to-yellow-50 md:ml-64 pt-16 md:pt-0">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
