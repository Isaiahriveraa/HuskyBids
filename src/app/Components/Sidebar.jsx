"use client";

import React, { useState } from "react";
import Link from "next/link";

import BiscuitIcon from "./BiscuitIcon";
import { usePathname } from 'next/navigation';
import { useUser } from "@clerk/nextjs";
// import { useMutation, useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";


const Sidebar = ({ biscuits = 1000, mobileMenuOpen, setMobileMenuOpen }) => {
  // Default starting balance of 1000 biscuits
  const [showDailyBonus, setShowDailyBonus] = useState(true);

  // Get current route
  const pathname = usePathname();

  // Function to determine if a link is active
  const isActivePath = (path) => pathname === path;

  // Get background color based on path
  const getBackgroundColor = (path) => {
    if (!isActivePath(path)) return 'hover:bg-yellow-300';
    
    switch (path) {
      case '/testingHome':
        return 'bg-[#4b2e83] text-white';
      case '/dashboard':
        return 'bg-gray-50';
      case '/new-bid':
        return 'bg-[#4b2e83] text-white';
      case '/tasks':
        return 'bg-[#4b2e83] text-white';
      case '/leaderboard':
        return 'bg-[#4b2e83] text-white';
      default:
        return 'bg-yellow-300';
    }
  };

  const claimDailyBonus = () => {
    setShowDailyBonus(false);
    // In a real app, this would update the user's balance in the database
    alert("Daily bonus of 100 Biscuits claimed!");
  };

  return (
    <div className={`fixed left-0 top-0 h-full w-64 bg-yellow-400 text-purple-900 p-6 flex flex-col shadow-lg z-50 transform transition-transform duration-300 ${
      mobileMenuOpen ? 'translate-x-0' : 'md:translate-x-0 -translate-x-full'
    }`}>
      {/* Close button for mobile */}
      <div className="md:hidden flex justify-end mb-4">
        <button 
          onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
          className="text-purple-900 hover:text-purple-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      {/* Logo/Header */}
      <div className="mb-8">
        <Link href="/" className="block">
          <Image
            src="/images/logo.png"
            alt="HuskyBids Logo"
            width={150}
            height={50}
            className="mb-2"
          />
        </Link>
      </div>

      {/* Daily Bonus Alert */}
      {showDailyBonus && (
        <div className="mb-6 bg-white text-purple-900 p-3 rounded-lg shadow-md">
          <div className="font-semibold mb-2">Daily Bonus Available!</div>
          <button
            onClick={claimDailyBonus}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition-colors text-sm"
          >
            Claim Free 100 Biscuits
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1">
        <ul className="space-y-4">
          <li>
            <Link
              href="/testingHome"
              className={`flex items-center space-x-2 p-2 rounded transition-colors font-medium ${getBackgroundColor('/testingHome')}`}
            >
              <span className="material-icons">dashboard</span>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/new-bid"
              className={`flex items-center space-x-2 p-2 rounded transition-colors font-medium ${getBackgroundColor('/new-bid')}`}
            >
              <span className="material-icons">add_circle</span>
              <span>New Bid</span>
            </Link>
          </li>
          <li>
            <Link
              href="/tasks"
              className={`flex items-center space-x-2 p-2 rounded transition-colors font-medium ${getBackgroundColor('/tasks')}`}
            >
              <span className="material-icons">task</span>
              <span>Tasks</span>
            </Link>
          </li>
          <li>
            <Link
              href="/leaderboard"
              className={`flex items-center space-x-2 p-2 rounded transition-colors font-medium ${getBackgroundColor('/leaderboard')}`}
            >
              <span className="material-icons">leaderboard</span>
              <span>Leaderboard</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Biscuit Balance */}
      <div className="border-t border-yellow-500 pt-4">
        <div className="flex items-center space-x-2">
          <BiscuitIcon size={24} />
          <div>
            <div className="text-sm text-purple-900 opacity-75">
              Your Balance
            </div>
            <div className="font-bold text-purple-900">{biscuits} Biscuits</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
