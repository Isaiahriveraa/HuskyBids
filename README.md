# 🎓 HuskyBids

A virtual sports betting platform built for University of Washington students. Bet on UW Huskies games using "biscuits" - a virtual currency system.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)

## 🚀 Features

- **🏈 Live Game Tracking** - Real-time UW Huskies sports scores via ESPN API
- **💰 Virtual Betting System** - Place bets using "biscuits" currency
- **🏆 Leaderboards** - Compete with other students for the top spot
- **✅ Daily Rewards** - Complete tasks to earn bonus biscuits
- **👤 User Profiles** - Track your betting history, wins, and stats
- **📊 Betting History** - View all past bets and outcomes

## 🛠️ Tech Stack

**Frontend:**

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Responsive Design

**Backend:**

- MongoDB with Mongoose ODM
- Next.js API Routes
- ESPN Sports API Integration

**Authentication:**

- Clerk Auth

## 📁 Project Structure

```
HuskyBids/
├── src/
│   └── app/
│       ├── Components/        # Shared React components
│       │   ├── GameCalendar.jsx
│       │   └── BiscuitIcon.jsx
│       ├── dashboard/         # Main dashboard page
│       ├── leaderboard/       # User rankings
│       ├── betting-history/   # User bet history
│       ├── new-bid/           # Place new bets
│       ├── tasks/             # Daily tasks & rewards
│       ├── settings/          # User settings
│       └── SimpleLayout.jsx   # Main layout with sidebar
├── models/                    # MongoDB schemas
│   ├── User.js
│   ├── Game.js
│   └── Bet.js
├── lib/
│   └── mongodb.js            # Database connection
├── pages/api/                # API routes
└── public/                   # Static assets
```

## 🏃 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB database
- Clerk account for authentication

### Installation

```bash
# Clone the repository
git clone https://github.com/isaiahrivera/HuskyBids.git
cd HuskyBids

# Install dependencies
npm install

# Set up environment variables
# Create a .env.local file with:
# - MONGODB_URI
# - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# - CLERK_SECRET_KEY
# - NEXTAUTH_URL
# - NEXTAUTH_SECRET

# Run development server
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# NextAuth
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your_nextauth_secret

# Application
PORT=3002
```

## 📸 Screenshots

_Coming soon - Screenshots will be added to showcase the platform_

## 🎯 Key Features Explained

### Virtual Currency System

Users start with an initial balance of "biscuits" and can:

- Place bets on upcoming UW games
- Earn biscuits through daily tasks
- Compete for top positions on the leaderboard

### Live Game Integration

- Pulls real-time UW Huskies game data from ESPN API
- Displays upcoming games, scores, and betting odds
- Automatically resolves bets based on game outcomes

### User Engagement

- Daily task system for earning bonus biscuits
- Leaderboard to foster competition
- Complete betting history tracking
- User profile customization

## 🚀 Future Enhancements

- [ ] Mobile app version (React Native)
- [ ] Live in-game betting with real-time odds updates
- [ ] Social features (friend groups, private leagues)
- [ ] Advanced analytics dashboard with betting trends
- [ ] Push notifications for game starts and bet results
- [ ] Multiple sports support beyond football
- [ ] Achievement badges and rewards system

## 🤝 Contributing

This is a portfolio project, but suggestions and feedback are welcome!

## 👨‍💻 Developer

**Isaiah Rivera**

- GitHub: [@isaiahrivera](https://github.com/isaiahrivera)
- LinkedIn: https://www.linkedin.com/in/yirivera/

## 📄 License

MIT License - feel free to use this project for learning purposes!

## 🙏 Acknowledgments

- University of Washington for inspiration
- ESPN API for sports data
- Next.js team for the amazing framework

---

_Built as a portfolio project to demonstrate full-stack web development skills with modern technologies_

**⭐ If you found this project interesting, please consider giving it a star!**
