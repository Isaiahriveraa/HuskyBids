'use client';

import { useState, useEffect, useMemo } from 'react';

// Cache object to store betting history
const bettingCache = {
  data: null,
  timestamp: null,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes in milliseconds
  
  set(data) {
    this.data = data;
    this.timestamp = Date.now();
    // Also store in localStorage for persistence across page reloads
    try {
      localStorage.setItem('bettingHistory', JSON.stringify({
        data,
        timestamp: this.timestamp
      }));
    } catch (error) {
      console.warn('Could not save to localStorage:', error);
    }
  },
  
  get() {
    // Check memory cache first
    if (this.data && this.isValid()) {
      return this.data;
    }
    
    // Check localStorage cache
    try {
      const stored = localStorage.getItem('bettingHistory');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Date.now() - parsed.timestamp < this.CACHE_DURATION) {
          this.data = parsed.data;
          this.timestamp = parsed.timestamp;
          return this.data;
        }
      }
    } catch (error) {
      console.warn('Could not read from localStorage:', error);
    }
    
    return null;
  },
  
  isValid() {
    return this.timestamp && (Date.now() - this.timestamp) < this.CACHE_DURATION;
  },
  
  clear() {
    this.data = null;
    this.timestamp = null;
    try {
      localStorage.removeItem('bettingHistory');
    } catch (error) {
      console.warn('Could not clear localStorage:', error);
    }
  }
};

const BettingHistory = () => {
  const [bets, setBets] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cacheStatus, setCacheStatus] = useState(''); // For showing cache info to user
  
  // Fetch data function (stable reference)
  const fetchBets = async () => {
    // Try to get from cache first
    const cachedData = bettingCache.get();
    
    if (cachedData) {
      setBets(cachedData);
      setLoading(false);
      setCacheStatus('Loaded from cache ⚡');
      console.log('✅ Betting history loaded from cache');
      return;
    }
    
    // If no cache, fetch from "API"
    setLoading(true);
    setCacheStatus('Loading fresh data...');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockBets = [
        { id: 1, eventName: 'UW vs Oregon Football', betAmount: 50, potentialWin: 150, date: '2023-10-15', status: 'won' },
        { id: 2, eventName: 'UW Basketball Tournament', betAmount: 30, potentialWin: 90, date: '2023-09-28', status: 'lost' },
        { id: 3, eventName: 'Husky Spring Game', betAmount: 25, potentialWin: 75, date: '2023-11-05', status: 'pending' },
        { id: 4, eventName: 'UW vs WSU Football', betAmount: 100, potentialWin: 250, date: '2023-11-25', status: 'won' },
        { id: 5, eventName: 'PAC-12 Championships', betAmount: 75, potentialWin: 225, date: '2023-12-02', status: 'pending' },
        { id: 6, eventName: 'UW vs UCLA Basketball', betAmount: 40, potentialWin: 120, date: '2023-12-10', status: 'won' },
        { id: 7, eventName: 'Rose Bowl Prediction', betAmount: 200, potentialWin: 600, date: '2024-01-01', status: 'lost' },
      ];
      
      // Cache the fresh data
      bettingCache.set(mockBets);
      
      setBets(mockBets);
      setError(null);
      setCacheStatus('Fresh data loaded 🔄');
      console.log('✅ Fresh betting history loaded and cached');
      
    } catch (err) {
      console.error("Error fetching betting history:", err);
      setError("Failed to load betting history. Please try again later.");
      setCacheStatus('Error loading data ❌');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch data on component mount only
  useEffect(() => {
    fetchBets();
  }, []); // Empty dependency array - only run once on mount
  
  // Memoized filtered results for better performance
  const filteredBets = useMemo(() => {
    let result = [...bets];
    
    // Apply status filter
    if (filter !== 'all') {
      result = result.filter(bet => bet.status === filter);
    }
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(bet => 
        bet.eventName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return result;
  }, [bets, filter, searchQuery]);
  
  // Function to manually refresh data
  const refreshData = async () => {
    bettingCache.clear();
    setLoading(true);
    setCacheStatus('Refreshing...');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockBets = [
        { id: 1, eventName: 'UW vs Oregon Football', betAmount: 50, potentialWin: 150, date: '2023-10-15', status: 'won' },
        { id: 2, eventName: 'UW Basketball Tournament', betAmount: 30, potentialWin: 90, date: '2023-09-28', status: 'lost' },
        { id: 3, eventName: 'Husky Spring Game', betAmount: 25, potentialWin: 75, date: '2023-11-05', status: 'pending' },
        { id: 4, eventName: 'UW vs WSU Football', betAmount: 100, potentialWin: 250, date: '2023-11-25', status: 'won' },
        { id: 5, eventName: 'PAC-12 Championships', betAmount: 75, potentialWin: 225, date: '2023-12-02', status: 'pending' },
        { id: 6, eventName: 'UW vs UCLA Basketball', betAmount: 40, potentialWin: 120, date: '2023-12-10', status: 'won' },
        { id: 7, eventName: 'Rose Bowl Prediction', betAmount: 200, potentialWin: 600, date: '2024-01-01', status: 'lost' },
      ];
      
      bettingCache.set(mockBets);
      setBets(mockBets);
      setError(null);
      setCacheStatus('Data refreshed! 🔄');
      
    } catch (err) {
      console.error("Error refreshing betting history:", err);
      setError("Failed to refresh betting history. Please try again later.");
      setCacheStatus('Refresh failed ❌');
    } finally {
      setLoading(false);
    }
  };
  
  // Function to get the color for status chip
  const getStatusColor = (status) => {
    switch (status) {
      case 'won': return 'bg-green-100 text-green-800 border-green-300';
      case 'lost': return 'bg-red-100 text-red-800 border-red-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-900">Betting History</h1>
        
        {/* Cache status and refresh button */}
        <div className="flex items-center gap-4">
          {cacheStatus && (
            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {cacheStatus}
            </div>
          )}
          <button
            onClick={refreshData}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '⟳' : '🔄'} Refresh
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-grow min-w-[200px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            🔍
          </span>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Search Events"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="min-w-[150px]">
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Bets</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
              <option value="pending">Pending</option>
            </select>
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              📋
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              ▼
            </span>
          </div>
        </div>
        
        {/* Results counter */}
        <div className="text-sm text-gray-600">
          {loading ? 'Loading...' : `${filteredBets.length} result${filteredBets.length !== 1 ? 's' : ''}`}
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-900"></div>
        </div>
      ) : error ? (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-purple-900 text-white">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Event</th>
                  <th className="px-6 py-3 text-left font-semibold">Date</th>
                  <th className="px-6 py-3 text-left font-semibold">Bet Amount</th>
                  <th className="px-6 py-3 text-left font-semibold">Potential Win</th>
                  <th className="px-6 py-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBets.length > 0 ? (
                  filteredBets.map((bet) => (
                    <tr key={bet.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{bet.eventName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(bet.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${bet.betAmount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${bet.potentialWin.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(bet.status)}`}>
                          {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      {loading ? 'Loading betting history...' : 'No betting history found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
        <div>
          This page shows your betting history with intelligent caching for faster loading.
        </div>
        <div className="text-right">
          Cache expires in 5 minutes • Data refreshes automatically
        </div>
      </div>
    </div>
  );
};

export default BettingHistory;