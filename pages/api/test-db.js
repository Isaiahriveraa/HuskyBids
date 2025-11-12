/**
 * MongoDB Connection Test Endpoint
 * Use this to verify your MongoDB connection is working
 *
 * Test it by visiting: http://localhost:3000/api/test-db
 */

import connectDB from '../../lib/mongodb';
import User from '../../models/User';

export default async function handler(req, res) {
  try {
    // Test 1: Connect to MongoDB
    console.log('🧪 Testing MongoDB connection...');
    await connectDB();

    // Test 2: Count users in database
    const userCount = await User.countDocuments();

    // Test 3: Get database connection state
    const mongoose = require('mongoose');
    const connectionState = mongoose.connection.readyState;
    const connectionStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    // Test 4: Get a sample user (if any exist)
    const sampleUser = await User.findOne().select('username email biscuits createdAt');

    // Return test results
    res.status(200).json({
      success: true,
      message: '✅ MongoDB connection is working!',
      tests: {
        connection: {
          status: connectionStates[connectionState],
          state: connectionState,
          isConnected: connectionState === 1,
        },
        database: {
          name: mongoose.connection.name,
          host: mongoose.connection.host,
        },
        users: {
          totalCount: userCount,
          sampleUser: sampleUser || 'No users in database yet',
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ MongoDB test failed:', error);

    res.status(500).json({
      success: false,
      message: '❌ MongoDB connection failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}
