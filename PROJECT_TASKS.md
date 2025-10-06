# HuskyBids Project Tasks

## Project Overview

Build a betting platform where UW students can place bids on University of Washington sports games using virtual "biscuits" currency.

---

## Phase 1: Database Setup ✨

### 1.1 Choose Database Solution

- [x] **Decision**: ✅ **MongoDB Atlas** (Free tier, industry-standard, great for internships)
  - Free 512MB storage
  - NoSQL flexibility
  - Mongoose ORM integration
  - Cloud-hosted (no server management)
  - Great resume builder!

**Why MongoDB?**

- 🎯 Most requested in internships
- 📚 Great learning resource
- 💼 Industry standard
- 🆓 Free forever tier

### 1.2 Design Database Schema

- [ ] **Users Table/Collection**

  ```
  - id (primary key)
  - username (unique)
  - email (unique)
  - password (hashed)
  - biscuits (default: 1000)
  - createdAt
  - updatedAt
  - profileImage (optional)
  - totalBets
  - winningBets
  - losingBets
  ```

- [ ] **Games Table/Collection**

  ```
  - id (primary key)
  - sport (football, basketball, etc.)
  - homeTeam (default: "UW")
  - awayTeam
  - gameDate
  - location
  - status (scheduled, live, completed, cancelled)
  - homeScore
  - awayScore
  - apiGameId (from sports API)
  - createdAt
  - updatedAt
  ```

- [ ] **Bets Table/Collection**

  ```
  - id (primary key)
  - userId (foreign key)
  - gameId (foreign key)
  - betAmount (biscuits)
  - predictedWinner (home/away)
  - odds (multiplier)
  - status (pending, won, lost, cancelled)
  - potentialWin (calculated)
  - actualWin (final amount)
  - placedAt
  - settledAt
  ```

- [ ] **Transactions Table/Collection** (optional, for history)
  ```
  - id (primary key)
  - userId (foreign key)
  - type (bet_placed, bet_won, bet_lost, daily_reward)
  - amount
  - balanceBefore
  - balanceAfter
  - description
  - createdAt
  ```

### 1.3 Set Up MongoDB Atlas

- [ ] Create MongoDB Atlas account (free) at https://www.mongodb.com/cloud/atlas/register
- [ ] Create new cluster (M0 Free tier)
- [ ] Configure database access (create database user)
- [ ] Whitelist IP address (or allow from anywhere for dev: 0.0.0.0/0)
- [ ] Get connection string
- [ ] Add to `.env.local`: `MONGODB_URI=mongodb+srv://...`

### 1.4 Install MongoDB Dependencies

- [ ] Install Mongoose: `npm install mongoose`
- [ ] Create database connection utility: `lib/mongodb.js`
- [ ] Test database connection

### 1.5 Create Mongoose Models

- [ ] Create `models/User.js`
- [ ] Create `models/Game.js`
- [ ] Create `models/Bet.js`
- [ ] Create `models/Transaction.js`
- [ ] Test models with sample data

---

## Phase 2: Sports API Integration 🏈🏀

### 2.1 Research Free Sports APIs

- [ ] **Option A**: [ESPN API](http://site.api.espn.com/apis/site/v2/sports/) (Free, no auth needed)
  - Endpoint: `/sports/{sport}/teams/{teamId}/schedule`
  - Sports: football (CFB), basketball (CBB)
- [ ] **Option B**: [TheSportsDB](https://www.thesportsdb.com/api.php) (Free tier: 1 req/2 sec)
  - Good for schedules and scores
- [ ] **Option C**: [API-Sports](https://api-sports.io/) (Free tier: 100 req/day)
  - Multiple sports coverage
- [ ] **Option D**: [CollegeFootballData](https://collegefootballdata.com/) (Free, college-specific)
  - Great for UW football specifically

**Recommendation**: Use **ESPN API** (no key needed) + **CollegeFootballData** for detailed stats

### 2.2 Set Up API Integration

- [ ] Create `/pages/api/games/fetch.js` endpoint
- [ ] Implement API fetch functions
- [ ] Parse and normalize API responses
- [ ] Handle API errors and rate limits
- [ ] Create caching layer (5-15 minutes)
- [ ] Test with real UW games data

### 2.3 Sync Games to Database

- [ ] Create automated sync function
- [ ] Schedule periodic updates (cron job or webhook)
- [ ] Update game scores in real-time
- [ ] Handle game status changes
- [ ] Implement error logging

**Example Implementation**:

```javascript
// /pages/api/games/sync.js
export default async function handler(req, res) {
  // Fetch from ESPN API
  const uwFootball = await fetch(
    "http://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/264/schedule"
  );

  // Parse and save to database
  // ...
}
```

---

## Phase 3: User Authentication 🔐

### 3.1 Set Up Your Own Clerk Account

- [ ] Create new Clerk account at https://clerk.com/
- [ ] Create new application in Clerk dashboard
- [ ] Choose authentication methods (Email, Google, GitHub recommended)
- [ ] Get API keys from Clerk dashboard
- [ ] Update `.env.local` with YOUR Clerk keys:
  ```
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
  CLERK_SECRET_KEY=sk_test_...
  ```
- [ ] Remove old Clerk environment variables
- [ ] Test authentication with your new Clerk account

**Why Your Own Clerk Account?**

- ✅ Full control over your project
- ✅ Own the user data
- ✅ Can show on resume/portfolio
- ✅ Learn complete setup process

### 3.2 Implement Authentication

- [ ] Create `/login` page (already exists, enhance it)
- [ ] Create `/signup` page
- [ ] Add authentication middleware
- [ ] Protect routes (dashboard, betting, etc.)
- [ ] Create user session management
- [ ] Add "forgot password" flow
- [ ] Implement email verification

### 3.3 User Profile Management

- [ ] Create `/profile` page
- [ ] Display user stats (biscuits, bets, wins)
- [ ] Allow username/email updates
- [ ] Add profile picture upload
- [ ] Show betting history
- [ ] Display leaderboard rank

---

## Phase 4: Core Betting Features 🎲

### 4.1 Games Display

- [ ] Create `/games` page to show upcoming UW games
- [ ] Filter by sport (football, basketball)
- [ ] Show game details (opponent, date, time, location)
- [ ] Display current odds
- [ ] Show how many users bet on each side
- [ ] Real-time score updates for live games

### 4.2 Place Bets

- [ ] Create betting modal/form
- [ ] Validate bet amount (min/max, available biscuits)
- [ ] Calculate potential winnings
- [ ] Show confirmation before placing bet
- [ ] Deduct biscuits immediately
- [ ] Save bet to database
- [ ] Send confirmation notification
- [ ] Prevent betting after game starts

### 4.3 Odds System

- [ ] Create simple odds algorithm
  ```javascript
  // Simple version: based on betting distribution
  // If 70% bet on UW, odds are lower for UW
  // Example: 1.3x for UW, 2.5x for opponent
  ```
- [ ] Update odds dynamically
- [ ] Display odds clearly
- [ ] Cap max odds (e.g., 10x)
- [ ] Set min odds (e.g., 1.1x)

### 4.4 Settle Bets

- [ ] Create automated bet settlement function
- [ ] Trigger when game completes
- [ ] Award biscuits to winners
- [ ] Update user statistics
- [ ] Send win/loss notifications
- [ ] Create transaction records
- [ ] Handle tie games

---

## Phase 5: Enhanced Features ✨

### 5.1 Leaderboard (Enhance existing page)

- [ ] Show top users by biscuits
- [ ] Display win rate percentage
- [ ] Show total bets placed
- [ ] Add time filters (weekly, monthly, all-time)
- [ ] Highlight current user's position
- [ ] Add pagination

### 5.2 Betting History (Already exists, enhance)

- [ ] Show all past bets with outcomes
- [ ] Add filters (won, lost, pending, sport)
- [ ] Display win/loss statistics
- [ ] Show ROI (return on investment)
- [ ] Export betting history (CSV)
- [ ] Add graphs/charts

### 5.3 Daily Rewards

- [ ] Create daily login bonus (e.g., 50 biscuits)
- [ ] Add daily tasks system:
  - Place 3 bets: +100 biscuits
  - Win a bet: +200 biscuits
  - Visit daily: +50 biscuits
- [ ] Create `/tasks` page (already exists, enhance)
- [ ] Add streak tracking
- [ ] Send reminder notifications

### 5.4 Social Features

- [ ] Add friends system
- [ ] Show friends' recent bets
- [ ] Create group betting pools
- [ ] Add bet sharing to social media
- [ ] Comment on games
- [ ] Trash talk board (moderated)

---

## Phase 6: UI/UX Improvements 🎨

### 6.1 Design Enhancements

- [ ] Create consistent color scheme (Purple & Gold for UW!)
- [ ] Design custom biscuit icon/animation
- [ ] Add loading skeletons
- [ ] Implement toast notifications
- [ ] Create mobile-responsive design
- [ ] Add dark mode toggle
- [ ] Improve sidebar navigation

### 6.2 Animations & Interactions

- [ ] Add confetti on big wins
- [ ] Animate biscuit counter changes
- [ ] Create smooth page transitions
- [ ] Add hover effects on cards
- [ ] Implement skeleton loading states
- [ ] Add progress bars for live games

### 6.3 Accessibility

- [ ] Add ARIA labels
- [ ] Ensure keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Add high contrast mode
- [ ] Implement focus indicators

---

## Phase 7: Testing & Optimization 🧪

### 7.1 Testing

- [ ] Write unit tests for critical functions
- [ ] Test authentication flows
- [ ] Test betting logic extensively
- [ ] Test with multiple users
- [ ] Test API error handling
- [ ] Performance testing
- [ ] Mobile device testing

### 7.2 Security

- [ ] Validate all user inputs
- [ ] Prevent SQL injection
- [ ] Secure API endpoints
- [ ] Rate limit API calls
- [ ] Encrypt sensitive data
- [ ] Add CSRF protection
- [ ] Implement proper error handling

### 7.3 Performance

- [ ] Optimize database queries
- [ ] Implement caching strategies
- [ ] Optimize images (Next.js Image component)
- [ ] Code splitting
- [ ] Lazy loading components
- [ ] Monitor bundle size
- [ ] Set up CDN for static assets

---

## Phase 8: Deployment 🚀

### 8.1 Prepare for Production

- [ ] Set up environment variables
- [ ] Configure production database
- [ ] Set up error monitoring (Sentry)
- [ ] Configure analytics (Google Analytics)
- [ ] Create backup strategy
- [ ] Write deployment documentation

### 8.2 Deploy Application

- [ ] Deploy to Vercel (recommended for Next.js)
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Configure CDN
- [ ] Test production deployment
- [ ] Set up monitoring/alerts

### 8.3 Post-Launch

- [ ] Monitor error logs
- [ ] Collect user feedback
- [ ] Fix critical bugs
- [ ] Plan feature iterations
- [ ] Create changelog

---

## Priority Order (Suggested)

### 🔥 **Sprint 1 (Weeks 1-2): Foundation**

1. ✅ Set up Convex database
2. ✅ Create database schema
3. ✅ Implement Clerk authentication
4. ✅ Connect auth to database (create user on signup)

### 🔥 **Sprint 2 (Weeks 3-4): Sports Data**

1. ✅ Integrate ESPN API
2. ✅ Fetch UW games
3. ✅ Display games on UI
4. ✅ Set up automatic sync

### 🔥 **Sprint 3 (Weeks 5-6): Core Betting**

1. ✅ Create betting interface
2. ✅ Implement bet placement logic
3. ✅ Create odds system
4. ✅ Test betting flow end-to-end

### 🔥 **Sprint 4 (Weeks 7-8): Settlement & Features**

1. ✅ Implement bet settlement
2. ✅ Enhance leaderboard
3. ✅ Add daily rewards
4. ✅ Polish UI/UX

### 🔥 **Sprint 5 (Weeks 9-10): Polish & Launch**

1. ✅ Testing & bug fixes
2. ✅ Security audit
3. ✅ Performance optimization
4. ✅ Deploy to production

---

## Technical Stack Summary

### Frontend

- ✅ Next.js 14
- ✅ React 18
- ✅ Tailwind CSS
- ✅ Simplified Layout System

### Backend/Database

- ✅ MongoDB Atlas (Free tier)
- ✅ Mongoose ODM
- ✅ Next.js API Routes

### Authentication

- ✅ Clerk (already integrated)

### Sports Data

- 🔄 ESPN API (free)
- 🔄 CollegeFootballData API (free)

### Deployment

- 🔄 Vercel (recommended)

---

## Quick Start Checklist

### Step 1: Database (This Week)

```bash
# Install MongoDB dependencies
npm install mongoose

# Create necessary directories
mkdir -p lib models

# Create files
touch lib/mongodb.js
touch models/User.js
touch models/Game.js
touch models/Bet.js

# Set up MongoDB Atlas account
# https://www.mongodb.com/cloud/atlas/register
```

### Step 2: Test Sports API (This Week)

```bash
# Test ESPN API in browser
open http://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/264/schedule

# Create API route
mkdir -p pages/api/games
touch pages/api/games/fetch.js
```

### Step 3: Connect Auth to Database (Next Week)

- Create user in database on Clerk signup
- Store user ID from Clerk
- Link bets to users

---

## Resources & Documentation

### Free Sports APIs

- [ESPN API Docs](http://site.api.espn.com/apis/site/v2/sports/)
- [CollegeFootballData](https://collegefootballdata.com/)
- [TheSportsDB](https://www.thesportsdb.com/api.php)

### Database Options

- [Convex Docs](https://docs.convex.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/atlas)

### Authentication

- [Clerk Docs](https://clerk.com/docs)
- [NextAuth.js](https://next-auth.js.org/)

### Deployment

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## Notes & Ideas 💡

### Future Features (Nice to Have)

- [ ] Mobile app (React Native)
- [ ] Live betting during games
- [ ] Parlay bets (multiple games)
- [ ] Achievements/badges system
- [ ] Tournament brackets
- [ ] Bet against friends
- [ ] Virtual currency store
- [ ] Game predictions AI
- [ ] Historical stats analysis
- [ ] Custom bet types (over/under, spread)

### Monetization Ideas (Optional)

- [ ] Premium features (ad-free, extra biscuits)
- [ ] Sponsored games
- [ ] Partner with UW athletics
- [ ] Virtual goods store

---

## Questions to Answer

1. **How will odds be calculated?**
   - Simple: Based on betting distribution
   - Advanced: Historical data + current season stats

2. **What happens if a game is cancelled?**
   - Refund all bets automatically

3. **Can users bet on any UW sport?**
   - Start with Football & Basketball
   - Add more sports later

4. **How often do game scores update?**
   - Live games: Every 30-60 seconds
   - Completed games: Final score locked

5. **What's the daily biscuit limit?**
   - Suggestion: Max 5000 biscuits per day from rewards
   - Unlimited from winning bets

---

**Created**: October 5, 2025  
**Last Updated**: October 5, 2025  
**Status**: Planning Phase  
**Next Action**: Set up Convex database and create schema
