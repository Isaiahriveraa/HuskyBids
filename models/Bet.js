import mongoose from 'mongoose';

const BetSchema = new mongoose.Schema(
  {
    // References
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
      index: true,
    },
    
    // Clerk ID for easy lookup
    clerkId: {
      type: String,
      required: true,
      index: true,
    },
    
    // Bet details
    betAmount: {
      type: Number,
      required: true,
      min: 1,
    },
    predictedWinner: {
      type: String,
      required: true,
      enum: ['home', 'away'],
    },
    odds: {
      type: Number,
      required: true,
      min: 1.1,
      max: 10.0,
    },
    
    // Calculations
    potentialWin: {
      type: Number,
      required: true,
    },
    actualWin: {
      type: Number,
      default: 0,
    },
    
    // Status
    status: {
      type: String,
      enum: ['pending', 'won', 'lost', 'cancelled', 'refunded'],
      default: 'pending',
      index: true,
    },
    
    // Timestamps
    placedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    settledAt: {
      type: Date,
      default: null,
    },
    
    // Additional info
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user's betting history
BetSchema.index({ userId: 1, placedAt: -1 });
BetSchema.index({ gameId: 1, status: 1 });

// Virtual field for profit/loss
BetSchema.virtual('profitLoss').get(function () {
  if (this.status === 'won') {
    return this.actualWin - this.betAmount;
  } else if (this.status === 'lost') {
    return -this.betAmount;
  } else if (this.status === 'refunded') {
    return 0;
  }
  return null; // pending or cancelled
});

// Pre-save middleware to calculate potential win
BetSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('betAmount') || this.isModified('odds')) {
    this.potentialWin = Math.round(this.betAmount * this.odds);
  }
  next();
});

// Instance method to settle bet as won
BetSchema.methods.settleAsWon = async function () {
  if (this.status !== 'pending') {
    throw new Error('Bet is not in pending status');
  }
  
  this.status = 'won';
  this.actualWin = this.potentialWin;
  this.settledAt = new Date();
  
  await this.save();
  console.log(`✅ Bet ${this._id} settled as WON. Payout: ${this.actualWin} biscuits`);
  return this;
};

// Instance method to settle bet as lost
BetSchema.methods.settleAsLost = async function () {
  if (this.status !== 'pending') {
    throw new Error('Bet is not in pending status');
  }
  
  this.status = 'lost';
  this.actualWin = 0;
  this.settledAt = new Date();
  
  await this.save();
  console.log(`❌ Bet ${this._id} settled as LOST`);
  return this;
};

// Instance method to refund bet
BetSchema.methods.refund = async function () {
  if (this.status !== 'pending') {
    throw new Error('Can only refund pending bets');
  }
  
  this.status = 'refunded';
  this.actualWin = this.betAmount; // Return original bet amount
  this.settledAt = new Date();
  
  await this.save();
  console.log(`🔄 Bet ${this._id} refunded. Amount: ${this.betAmount} biscuits`);
  return this;
};

// Static method to get user's betting history
BetSchema.statics.getUserBets = function (userId, limit = 50) {
  return this.find({ userId })
    .sort({ placedAt: -1 })
    .limit(limit)
    .populate('gameId', 'homeTeam awayTeam gameDate status homeScore awayScore');
};

// Static method to get pending bets for a game
BetSchema.statics.getPendingBetsForGame = function (gameId) {
  return this.find({ gameId, status: 'pending' }).populate('userId', 'clerkId username');
};

// Static method to get user's pending bets
BetSchema.statics.getUserPendingBets = function (userId) {
  return this.find({ userId, status: 'pending' })
    .sort({ placedAt: -1 })
    .populate('gameId', 'homeTeam awayTeam gameDate status');
};

// Static method to calculate total wagered on a game
BetSchema.statics.getTotalWagered = async function (gameId) {
  const result = await this.aggregate([
    { $match: { gameId: mongoose.Types.ObjectId(gameId), status: 'pending' } },
    {
      $group: {
        _id: null,
        totalWagered: { $sum: '$betAmount' },
        totalBets: { $sum: 1 },
        homeWagers: {
          $sum: {
            $cond: [{ $eq: ['$predictedWinner', 'home'] }, '$betAmount', 0],
          },
        },
        awayWagers: {
          $sum: {
            $cond: [{ $eq: ['$predictedWinner', 'away'] }, '$betAmount', 0],
          },
        },
      },
    },
  ]);
  
  return result[0] || { totalWagered: 0, totalBets: 0, homeWagers: 0, awayWagers: 0 };
};

// Prevent model recompilation in development
export default mongoose.models.Bet || mongoose.model('Bet', BetSchema);
