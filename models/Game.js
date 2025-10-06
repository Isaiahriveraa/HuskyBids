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
  },
  {
    timestamps: true,
  }
);

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

// Instance method to update odds based on betting distribution
GameSchema.methods.updateOdds = async function () {
  const totalBets = this.homeBets + this.awayBets;
  
  if (totalBets === 0) {
    this.homeOdds = 2.0;
    this.awayOdds = 2.0;
    return this;
  }
  
  // Calculate odds based on betting percentage
  const homePercentage = this.homeBets / totalBets;
  const awayPercentage = this.awayBets / totalBets;
  
  // Simple odds calculation (inverse of betting percentage)
  // More popular bet = lower odds
  this.homeOdds = Math.max(1.1, Math.min(10.0, 1 / homePercentage));
  this.awayOdds = Math.max(1.1, Math.min(10.0, 1 / awayPercentage));
  
  // Round to 2 decimal places
  this.homeOdds = Math.round(this.homeOdds * 100) / 100;
  this.awayOdds = Math.round(this.awayOdds * 100) / 100;
  
  await this.save();
  return this;
};

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
