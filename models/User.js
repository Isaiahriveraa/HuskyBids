import mongoose from 'mongoose';

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
    totalBiscuitsWon: {
      type: Number,
      default: 0,
    },
    totalBiscuitsLost: {
      type: Number,
      default: 0,
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

// Virtual field for win rate
UserSchema.virtual('winRate').get(function () {
  if (this.totalBets === 0) return 0;
  return Math.round((this.winningBets / this.totalBets) * 100);
});

// Virtual field for ROI (Return on Investment)
UserSchema.virtual('roi').get(function () {
  const invested = this.totalBiscuitsWon + this.totalBiscuitsLost;
  if (invested === 0) return 0;
  const profit = this.totalBiscuitsWon - this.totalBiscuitsLost;
  return Math.round((profit / invested) * 100);
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
