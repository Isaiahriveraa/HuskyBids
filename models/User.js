import mongoose from 'mongoose';
import { calculateWinRate, calculateROI } from '../lib/utils/stats-utils.js';

const UserSchema = new mongoose.Schema(
  {
    // Clerk integration
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    
    // Basic info
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
    
    // Biscuits (virtual currency)
    biscuits: {
      type: Number,
      default: 1000,
      min: 0,
    },
    
    // Betting statistics
    totalBets: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: function() {
          return this.totalBets >= (this.winningBets + this.losingBets);
        },
        message: 'totalBets must be >= winningBets + losingBets'
      }
    },
    winningBets: {
      type: Number,
      default: 0,
      min: 0,
    },
    losingBets: {
      type: Number,
      default: 0,
      min: 0,
    },
    pendingBets: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    // Rewards & streaks
    lastLoginDate: {
      type: Date,
      default: null,
    },
    loginStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastDailyRewardClaimed: {
      type: Date,
      default: null,
    },
    dailyTasksCompleted: {
      type: Map,
      of: Boolean,
      default: {},
    },
    lastDailyTaskReset: {
      type: Date,
      default: null,
    },
    totalBiscuitsWon: {
      type: Number,
      default: 0,
    },
    totalBiscuitsLost: {
      type: Number,
      default: 0,
    },
    totalBiscuitsWagered: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Compound index for leaderboard queries (optimizes sorting by biscuits with filtering)
UserSchema.index({ isActive: 1, isBanned: 1, biscuits: -1 });

// Virtual field for win rate
UserSchema.virtual('winRate').get(function () {
  return calculateWinRate(this.winningBets, this.totalBets, 1);
});

// Virtual field for ROI (Return on Investment)
UserSchema.virtual('roi').get(function () {
  return calculateROI(
    this.totalBiscuitsWon,
    this.totalBiscuitsLost,
    this.totalBiscuitsWagered,
    2
  );
});

// Instance method to add biscuits
UserSchema.methods.addBiscuits = async function (amount, reason = 'reward') {
  this.biscuits += amount;
  await this.save();
  
  console.log(`💰 Added ${amount} biscuits to ${this.username} (${reason})`);
  return this;
};

// Instance method to deduct biscuits
UserSchema.methods.deductBiscuits = async function (amount, reason = 'bet') {
  if (this.biscuits < amount) {
    throw new Error('Insufficient biscuits');
  }
  
  this.biscuits -= amount;
  await this.save();
  
  console.log(`💸 Deducted ${amount} biscuits from ${this.username} (${reason})`);
  return this;
};

// Static method to find user by Clerk ID
UserSchema.statics.findByClerkId = function (clerkId) {
  return this.findOne({ clerkId });
};

// Static method to get leaderboard
UserSchema.statics.getLeaderboard = function (limit = 10) {
  return this.find({ isActive: true, isBanned: false })
    .sort({ biscuits: -1 })
    .limit(limit)
    .select('username biscuits totalBets winningBets profileImage');
};

// Prevent model recompilation in development
export default mongoose.models.User || mongoose.model('User', UserSchema);
