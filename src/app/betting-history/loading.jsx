'use client';

import BiscuitIcon from '@components/BiscuitIcon';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-purple-900 mb-6">Betting History</h1>
      
      {/* Shimmer effect for search and filter */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-grow min-w-[200px] h-12 bg-gray-200 animate-pulse rounded-lg"></div>
        <div className="min-w-[150px] h-12 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-8 overflow-hidden">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative animate-spin h-16 w-16">
            <BiscuitIcon size={64} className="animate-bounce" />
          </div>
          
          <div className="text-center">
            <h2 className="text-xl font-semibold text-purple-900 mb-2">Loading your bets...</h2>
            <p className="text-gray-600">Fetching your betting history</p>
          </div>
          
          {/* Shimmer loading table */}
          <div className="w-full mt-6">
            <div className="h-12 bg-purple-900 rounded-t-lg w-full"></div>
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="h-16 bg-gray-100 w-full animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
