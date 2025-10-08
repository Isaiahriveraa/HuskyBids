# 🏈 GameCalendar API Integration Guide

## Overview

The GameCalendar component is **ready to use** with mock data now, and **ready to upgrade** with real API data later!

---

## 🎯 Current Status

✅ **GameCalendar.jsx** is built and functional  
✅ Uses mock UW Huskies game data  
✅ Has week navigation (12 weeks)  
✅ Shows game details (opponent, date, location)  
✅ **API-ready architecture** - just needs data swap!

**Decision:** ✅ **KEEP this component** - Don't delete it!

---

## 🚀 Phase 1: Use GameCalendar Now (Current)

### Add to Dashboard

```jsx
// src/app/dashboard/page.jsx
import GameCalendar from "../Components/GameCalendar";

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-purple-900 mb-6">Dashboard</h1>

      {/* Add GameCalendar here */}
      <GameCalendar />

      {/* Rest of your dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats cards */}
      </div>
    </div>
  );
}
```

---

## 🔌 Phase 2: Connect to Real API (Future)

### Option 1: ESPN API (FREE, No Key Needed!)

**Endpoint:**

```
http://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/264/schedule
```

**Team ID 264 = Washington Huskies**

### Step 1: Create API Route

Create: `pages/api/games/upcoming.js`

```javascript
export default async function handler(req, res) {
  try {
    // Fetch from ESPN API
    const response = await fetch(
      "http://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/264/schedule"
    );

    const data = await response.json();

    // Transform ESPN data to our format
    const games = data.events.map((event, index) => ({
      id: event.id,
      opponent: event.competitions[0].competitors.find(
        (team) => team.team.displayName !== "Washington Huskies"
      ).team.displayName,
      date: event.date.split("T")[0],
      time: new Date(event.date).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      location: event.competitions[0].venue.fullName,
      isHome:
        event.competitions[0].competitors.find(
          (team) => team.team.displayName === "Washington Huskies"
        ).homeAway === "home",
      week: event.week.number || index + 1,
      status: event.status.type.name, // 'STATUS_SCHEDULED', 'STATUS_IN_PROGRESS', 'STATUS_FINAL'
      homeScore: event.competitions[0].competitors[0].score,
      awayScore: event.competitions[0].competitors[1].score,
    }));

    res.status(200).json(games);
  } catch (error) {
    console.error("ESPN API Error:", error);
    res.status(500).json({ error: "Failed to fetch games" });
  }
}
```

### Step 2: Update GameCalendar Component

```jsx
// src/app/Components/GameCalendar.jsx
"use client";

import React, { useState, useEffect } from "react";

const GameCalendar = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(1);

  // Fetch real games from API
  useEffect(() => {
    async function fetchGames() {
      try {
        setLoading(true);
        const response = await fetch("/api/games/upcoming");

        if (!response.ok) {
          throw new Error("Failed to fetch games");
        }

        const data = await response.json();
        setGames(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching games:", err);
        setError(err.message);
        // Fallback to mock data on error
        setGames(SAMPLE_GAMES);
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading games...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center text-red-600">
          <p>⚠️ {error}</p>
          <p className="text-sm text-gray-600 mt-2">Using sample data...</p>
        </div>
      </div>
    );
  }

  // Rest of component...
};
```

---

## 💾 Phase 3: Store in MongoDB (Recommended)

### Why Store in MongoDB?

- ✅ **Faster loading** - Don't hit ESPN API every time
- ✅ **Rate limit protection** - Cache data locally
- ✅ **Offline support** - Works even if ESPN is down
- ✅ **Custom data** - Add betting info, odds, etc.

### Step 1: Use Game Model (Already Created!)

You already have `models/Game.js` ready to use! ✅

### Step 2: Sync API Data to MongoDB

Create: `pages/api/games/sync.js`

```javascript
import connectDB from "../../../lib/mongodb";
import Game from "../../../models/Game";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    // Fetch from ESPN
    const response = await fetch(
      "http://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/264/schedule"
    );
    const data = await response.json();

    // Save each game to MongoDB
    const savedGames = [];
    for (const event of data.events) {
      const gameData = {
        apiGameId: event.id,
        sport: "football",
        homeTeam: "Washington Huskies",
        awayTeam: event.competitions[0].competitors.find(
          (team) => team.team.displayName !== "Washington Huskies"
        ).team.displayName,
        gameDate: new Date(event.date),
        location: event.competitions[0].venue.fullName,
        status:
          event.status.type.name === "STATUS_FINAL"
            ? "completed"
            : event.status.type.name === "STATUS_IN_PROGRESS"
              ? "live"
              : "scheduled",
        homeScore: event.competitions[0].competitors[0].score || 0,
        awayScore: event.competitions[0].competitors[1].score || 0,
        week: event.week.number,
      };

      // Upsert (update if exists, create if not)
      const game = await Game.findOneAndUpdate(
        { apiGameId: event.id },
        gameData,
        { upsert: true, new: true }
      );

      savedGames.push(game);
    }

    res.status(200).json({
      success: true,
      message: `Synced ${savedGames.length} games`,
      games: savedGames,
    });
  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({ error: error.message });
  }
}
```

### Step 3: Fetch from MongoDB

Update: `pages/api/games/upcoming.js`

```javascript
import connectDB from "../../../lib/mongodb";
import Game from "../../../models/Game";

export default async function handler(req, res) {
  try {
    await connectDB();

    // Get upcoming and recent games
    const games = await Game.find({
      gameDate: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Past week
        $lte: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // Next 2 months
      },
    })
      .sort({ gameDate: 1 })
      .limit(20);

    // Transform to GameCalendar format
    const formattedGames = games.map((game, index) => ({
      id: game._id,
      opponent: game.awayTeam,
      date: game.gameDate.toISOString().split("T")[0],
      time: game.gameDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      location: game.location,
      isHome: true,
      week: game.week || index + 1,
      status: game.status,
      homeScore: game.homeScore,
      awayScore: game.awayScore,
    }));

    res.status(200).json(formattedGames);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch games" });
  }
}
```

---

## ⏰ Phase 4: Auto-Sync (Cron Job)

### Option 1: Vercel Cron Jobs

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/games/sync",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

Syncs every 6 hours automatically!

### Option 2: Manual Sync

Add a button in your admin page:

```jsx
<button
  onClick={async () => {
    const res = await fetch("/api/games/sync", { method: "POST" });
    const data = await res.json();
    alert(data.message);
  }}
  className="bg-purple-600 text-white px-4 py-2 rounded"
>
  🔄 Sync Games from ESPN
</button>
```

---

## 🎨 Phase 5: Enhanced Features

### Add Live Scores

```jsx
// Show live indicator for ongoing games
{
  game.status === "live" && (
    <span className="absolute top-2 right-2 flex items-center gap-1">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
      </span>
      <span className="text-red-500 font-semibold text-sm">LIVE</span>
    </span>
  );
}
```

### Add Betting Integration

```jsx
// Add "Place Bet" button to each game
<button
  onClick={() => router.push(`/new-bid?gameId=${game.id}`)}
  className="mt-4 w-full bg-yellow-500 text-purple-900 px-4 py-2 rounded font-semibold hover:bg-yellow-400"
>
  🎲 Place Bet
</button>
```

### Add Odds Display

```jsx
// Show betting odds from your Game model
<div className="flex justify-between mt-2 text-sm">
  <div>
    <span className="font-semibold">UW:</span> {game.homeOdds}x
  </div>
  <div>
    <span className="font-semibold">{game.opponent}:</span> {game.awayOdds}x
  </div>
</div>
```

---

## 📅 Implementation Timeline

### Week 1: Use Mock Data ✅

- ✅ GameCalendar already built
- ✅ Add to dashboard
- ✅ Test with sample data

### Week 2-3: API Integration

- [ ] Create ESPN API route
- [ ] Update GameCalendar to fetch data
- [ ] Add loading/error states
- [ ] Test with real UW games

### Week 4: MongoDB Storage

- [ ] Sync ESPN data to MongoDB
- [ ] Update API to read from database
- [ ] Set up auto-sync cron job
- [ ] Add cache invalidation

### Week 5: Enhanced Features

- [ ] Add live score updates
- [ ] Integrate with betting system
- [ ] Show betting odds
- [ ] Add game notifications

---

## 🧪 Testing Checklist

- [ ] GameCalendar displays on dashboard
- [ ] Week navigation works (prev/next)
- [ ] Game details show correctly
- [ ] API route returns valid data
- [ ] MongoDB sync creates Game records
- [ ] Loading state appears during fetch
- [ ] Error handling shows fallback data
- [ ] Live games show indicator
- [ ] Betting button links to new-bid page

---

## 📚 API Documentation

### ESPN API Response Structure

```json
{
  "events": [
    {
      "id": "401628394",
      "uid": "s:20~l:23~e:401628394",
      "date": "2024-09-01T00:00Z",
      "name": "Washington vs Colorado State",
      "competitions": [
        {
          "id": "401628394",
          "venue": {
            "fullName": "Husky Stadium",
            "city": "Seattle"
          },
          "competitors": [
            {
              "homeAway": "home",
              "team": {
                "displayName": "Washington Huskies"
              },
              "score": "0"
            },
            {
              "homeAway": "away",
              "team": {
                "displayName": "Colorado State Rams"
              },
              "score": "0"
            }
          ],
          "status": {
            "type": {
              "name": "STATUS_SCHEDULED"
            }
          }
        }
      ],
      "week": {
        "number": 1
      }
    }
  ]
}
```

---

## 🎯 Final Notes

1. **Keep GameCalendar** - Don't delete it!
2. **Use mock data first** - Get familiar with component
3. **Add to dashboard** - Make it visible
4. **API integration later** - When you're ready for Phase 2
5. **MongoDB recommended** - Better performance and control

---

**Ready to use GameCalendar?** Just add it to your dashboard and you're set! 🏈

The API integration can wait until you've set up MongoDB and are ready for Phase 2-3 of your project.
