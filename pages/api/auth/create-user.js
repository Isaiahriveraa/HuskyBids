/**
 * Create User in MongoDB
 * This can be called from Clerk webhook or directly after signup
 */

import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { clerkId, email, username, profileImage } = req.body;

    if (!clerkId || !email) {
      return res.status(400).json({
        error: 'Missing required fields: clerkId and email',
      });
    }

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ clerkId });

    if (existingUser) {
      return res.status(200).json({
        success: true,
        user: existingUser,
        message: 'User already exists',
        isNewUser: false,
      });
    }

    // Generate username if not provided
    let finalUsername = username;
    if (!finalUsername) {
      // Create username from email (before @)
      const emailPrefix = email.split('@')[0];
      finalUsername = emailPrefix;
      
      // Check if username is taken, add number if needed
      let counter = 1;
      while (await User.findOne({ username: finalUsername })) {
        finalUsername = `${emailPrefix}${counter}`;
        counter++;
      }
    }

    // Create new user with starting biscuits
    const newUser = new User({
      clerkId,
      email,
      username: finalUsername,
      profileImage: profileImage || null,
      biscuits: 1000, // Starting balance
      lastLoginDate: new Date(),
      loginStreak: 1,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      user: newUser,
      message: 'User created successfully',
      isNewUser: true,
    });
  } catch (error) {
    console.error('Create user error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'User with this email or username already exists',
      });
    }

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
