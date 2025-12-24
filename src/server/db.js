import mongoose from 'mongoose';
import { registerModels } from './models';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log('🔄 Using cached MongoDB connection');

    // IMPORTANT: Even with cached connection, ensure models are registered
    // This handles cases where the serverless function instance is reused
    // but models aren't in memory
    await registerModels();

    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('🔌 Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then(async (mongoose) => {
      console.log('✅ MongoDB connected successfully');

      // Register all models immediately after connection
      await registerModels();

      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB connection error:', e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
