import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema(
  {
    // API Integration
    apiGameId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values
      index: true,
    },
    
    // Game details
    sport: {
      type: String,
      required: true,
      enum: ['football', 'basketball', 'baseball', 'volleyball', 'soccer'],
      default: 'football',
    },
    
    // Teams
    homeTeam: {
      type: String,
      required: true,
      default: 'Washington Huskies',
    },
    awayTeam: {
      type: String,
      required: true,
    },
    opponent: {
      type: String,
      default: null,
    },
    
    // Game info
    gameDate: {
      type: Date,
      required: true,
      index: true,
    },
    location: {
      type: String,
      default: 'Husky Stadium',
    },
    
    // Status
    status: {
      type: String,
      enum: ['scheduled', 'live', 'completed', 'cancelled', 'postponed'],
      default: 'scheduled',
      index: true,
    },
    
    // Scores
    homeScore: {
      type: Number,
      default: 0,
      min: 0,
    },
    awayScore: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    // Winner (set after game completes)
    winner: {
      type: String,
      enum: ['home', 'away', 'tie', null],
      default: null,
    },
    
    // Betting info
    totalBetsPlaced: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalBiscuitsWagered: {
      type: Number,
      default: 0,
      min: 0,
    },
    homeBets: {
      type: Number,
      default: 0,
      min: 0,
    },
    awayBets: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    // Odds (calculated based on betting distribution)
    homeOdds: {
      type: Number,
      default: 2.0,
      min: 1.1,
      max: 10.0,
    },
    awayOdds: {
      type: Number,
      default: 2.0,
      min: 1.1,
      max: 10.0,
    },
    
    // Betting open/close
    bettingOpen: {
      type: Boolean,
      default: true,
    },
    bettingCloseTime: {
      type: Date,
      default: null,
    },
    
    // Additional info
    league: {
      type: String,
      default: 'NCAA',
    },
    season: {
      type: String,
      default: '2024-2025',
    },
    week: {
      type: Number,
      default: null,
    },

    // Team Logos (from ESPN)
    uwLogo: {
      type: String,
      default: 'https://a.espncdn.com/i/teamlogos/ncaa/500/264.png',
    },
    opponentLogo: {
      type: String,
      default: null,
    },
    homeTeamLogo: {
      type: String,
      default: null,
    },
    awayTeamLogo: {
      type: String,
      default: null,
    },

    // Top Players (from ESPN leaders)
    uwTopPlayer: {
      name: { type: String, default: null },
      stats: { type: String, default: null },
      position: { type: String, default: null },
      athleteId: { type: String, default: null },
    },
    opponentTopPlayer: {
      name: { type: String, default: null },
      stats: { type: String, default: null },
      position: { type: String, default: null },
      athleteId: { type: String, default: null },
    },

    // ESPN Odds Data (different from our betting odds)
    espnOdds: {
      provider: { type: String, default: null },
      details: { type: String, default: null },
      overUnder: { type: Number, default: null },
      spread: { type: Number, default: null },
      homeMoneyLine: { type: Number, default: null },
      awayMoneyLine: { type: Number, default: null },
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common query patterns
// Optimizes queries filtering by status and sorting by date
GameSchema.index({ status: 1, gameDate: 1 });
// Optimizes queries filtering by sport, status, and sorting by date
GameSchema.index({ sport: 1, status: 1, gameDate: 1 });

// Virtual field for game display name
GameSchema.virtual('displayName').get(function () {
  return `${this.homeTeam} vs ${this.awayTeam}`;
});

// Virtual field to check if betting is allowed
GameSchema.virtual('canBet').get(function () {
  const now = new Date();
  const gameTime = new Date(this.gameDate);
  
  return (
    this.bettingOpen &&
    this.status === 'scheduled' &&
    now < gameTime &&
    (!this.bettingCloseTime || now < this.bettingCloseTime)
  );
});

// NOTE: Odds calculation has been centralized in /lib/odds-calculator.js
// All odds calculations should use calculateOdds() from that module, which:
// - Uses weighted algorithm (70% biscuits wagered, 30% bet count)
// - Applies 5% house edge
// - Clamps odds between 1.1x and 10.0x
// This ensures consistent odds calculation across the entire application

// Instance method to close betting
GameSchema.methods.closeBetting = async function () {
  this.bettingOpen = false;
  this.bettingCloseTime = new Date();
  await this.save();
  
  console.log(`🔒 Betting closed for game: ${this.displayName}`);
  return this;
};

// Instance method to set winner
GameSchema.methods.setWinner = async function () {
  if (this.status !== 'completed') {
    throw new Error('Game is not completed yet');
  }
  
  if (this.homeScore > this.awayScore) {
    this.winner = 'home';
  } else if (this.awayScore > this.homeScore) {
    this.winner = 'away';
  } else {
    this.winner = 'tie';
  }
  
  await this.save();
  console.log(`🏆 Winner set for ${this.displayName}: ${this.winner}`);
  return this;
};

// Static method to get upcoming games
GameSchema.statics.getUpcomingGames = function (limit = 10) {
  const now = new Date();
  return this.find({
    gameDate: { $gte: now },
    status: 'scheduled',
  })
    .sort({ gameDate: 1 })
    .limit(limit);
};

// Static method to get live games
GameSchema.statics.getLiveGames = function () {
  return this.find({ status: 'live' }).sort({ gameDate: -1 });
};

// Static method to get completed games
GameSchema.statics.getCompletedGames = function (limit = 20) {
  return this.find({ status: 'completed' })
    .sort({ gameDate: -1 })
    .limit(limit);
};

// Prevent model recompilation in development
export default mongoose.models.Game || mongoose.model('Game', GameSchema);
