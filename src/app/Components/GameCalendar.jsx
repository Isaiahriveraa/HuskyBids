'use client';

import React, { useState, useEffect } from 'react';

/**
 * GameCalendar Component
 * 
 * TODO: API Integration Steps
 * 1. Replace SAMPLE_GAMES with data from ESPN API or CollegeFootballData API
 * 2. Add useEffect to fetch games on component mount
 * 3. Add loading state while fetching
 * 4. Add error handling for failed API calls
 * 5. Connect to MongoDB to store/cache game data
 * 
 * ESPN API Endpoint:
 * http://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/264/schedule
 * (Team ID 264 = Washington Huskies)
 */

// Sample game data - Mock Data for Demo
// TODO: Replace this with API fetch from /api/games/upcoming
const SAMPLE_GAMES = [
    {
        id: 1,
        opponent: 'Colorado State',
        date: '2025-08-30',
        time: '3:30 PM',
        location: 'Husky Stadium',
        isHome: true,
        week: 1
    },
    {
        id: 2,
        opponent: 'UC Davis',
        date: '2024-09-06',
        time: '7:00 PM',
        location: 'Husky Stadium',
        isHome: true,
        week: 2
    },
    {
        id: 3,
        opponent: 'Washington State',
        date: '2024-09-20',
        time: '4:00 PM',
        location: 'Pullman, WA',
        isHome: false,
        week: 3
    },
    {
        id: 4,
        opponent: 'Ohio State',
        date: '2024-09-27',
        time: '12:00 PM',
        location: 'Husky Stadium',
        isHome: true,
        week: 4
    },
    {
        id: 5,
        opponent: 'Maryland',
        date: '2024-10-04',
        time: '12:00 PM',
        location: 'College Park, MD',
        isHome: false,
        week: 5
    },
    {
        id: 6,
        opponent: 'Rutgers',
        date: '2024-10-11',
        time: '12:00 PM',
        location: 'Husky Stadium',
        isHome: true,
        week: 6
    },
    {
        id: 7,
        opponent: 'Michigan',
        date: '2024-10-18',
        time: '12:00 PM',
        location: 'Ann Arbor, MI',
        isHome: false,
        week: 7
    },
    {
        id: 8,
        opponent: 'Illinois',
        date: '2024-10-25',
        time: '12:00 PM',
        location: 'Husky Stadium',
        isHome: true,
        week: 8
    },
    {
        id: 9,
        opponent: 'Wisconsin',
        date: '2024-11-08',
        time: '12:00 PM',
        location: 'Madison, WI',
        isHome: false,
        week: 9
    },
    {
        id: 10,
        opponent: 'Purdue',
        date: '2024-11-15',
        time: '12:00 PM',
        location: 'Husky Stadium',
        isHome: true,
        week: 10
    },
    {
        id: 11,
        opponent: 'UCLA',
        date: '2024-11-22',
        time: '12:00 PM',
        location: 'Pasadena, CA',
        isHome: false,
        week: 11
    },
    {
        id: 12,
        opponent: 'Oregon',
        date: '2024-11-29',
        time: '12:00 PM',
        location: 'Husky Stadium',
        isHome: true,
        week: 12
    }
    
];

const GameCalendar = ({ games = SAMPLE_GAMES, isLoading = false }) => {
    const [currentWeek, setCurrentWeek] = useState(1);
    const [selectedGame, setSelectedGame] = useState(null);

    // TODO: Uncomment when API is ready
    // useEffect(() => {
    //   async function fetchGames() {
    //     try {
    //       const response = await fetch('/api/games/upcoming');
    //       const data = await response.json();
    //       setGames(data);
    //     } catch (error) {
    //       console.error('Failed to fetch games:', error);
    //     }
    //   }
    //   fetchGames();
    // }, []);

    // Get games for current week
    const getGamesForWeek = (week) => {
        return games.filter(game => game.week === week);
    };

    // Function to handle week navigation
    const changeWeek = (increment) => {
        const newWeek = currentWeek + increment;
        if (newWeek >= 1 && newWeek <= 12) { // Assuming 12 weeks in a season
            setCurrentWeek(newWeek);
        }
    };

    const currentGames = getGamesForWeek(currentWeek);

    return (
        <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md p-4 mb-8">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => changeWeek(-1)}
                    className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50"
                    disabled={currentWeek === 1}
                >
                    Previous Week
                </button>
                <h2 className="text-xl font-bold text-purple-900">
                    Week {currentWeek}
                </h2>
                <button
                    onClick={() => changeWeek(1)}
                    className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50"
                    disabled={currentWeek === 12}
                >
                    Next Week
                </button>
            </div>

            <div className="space-y-2">
                {currentGames.length > 0 ? (
                    currentGames.map(game => (
                        <div
                            key={game.id}
                            onClick={() => setSelectedGame(game)}
                            className="flex items-center justify-between p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="text-purple-900">
                                    <div className="font-semibold">{game.opponent}</div>
                                    <div className="text-sm text-purple-700">{game.date} at {game.time}</div>
                                </div>
                            </div>
                            <div className="text-sm font-medium text-purple-700">
                                {game.isHome ? 'Home' : 'Away'}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-4 text-gray-500">
                        No games scheduled for Week {currentWeek}
                    </div>
                )}
            </div>

            {/* Game Details Modal */}
            {selectedGame && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full m-4">
                        <h3 className="text-xl font-bold mb-4">Game Details</h3>
                        <p className="mb-2">
                            <span className="font-semibold">Opponent:</span> {selectedGame.opponent}
                        </p>
                        <p className="mb-2">
                            <span className="font-semibold">Date:</span> {selectedGame.date}
                        </p>
                        <p className="mb-2">
                            <span className="font-semibold">Time:</span> {selectedGame.time}
                        </p>
                        <p className="mb-4">
                            <span className="font-semibold">Location:</span> {selectedGame.location}
                        </p>
                        <button
                            onClick={() => setSelectedGame(null)}
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameCalendar; 