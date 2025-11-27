/**
 * Centralized Model Registry
 *
 * This file ensures all Mongoose models are registered in the correct order
 * before any database operations occur. This prevents "Schema hasn't been
 * registered" errors in serverless environments.
 *
 * IMPORTANT: Always import models directly from /models directory
 */

import mongoose from 'mongoose';

// Track if models have been registered to avoid re-registration
let modelsRegistered = false;

/**
 * Register all Mongoose models
 * This function should be called after MongoDB connection is established
 */
export function registerModels() {
  // Only register once per serverless function instance
  if (modelsRegistered) {
    return;
  }

  try {
    // Import models in dependency order
    // User has no dependencies
    require('./User');

    // Game has no dependencies
    require('./Game');

    // Bet depends on User and Game (via references)
    require('./Bet');

    modelsRegistered = true;
    console.log('✅ All Mongoose models registered successfully');
  } catch (error) {
    console.error('❌ Error registering Mongoose models:', error);
    throw new Error(`Model registration failed: ${error.message}`);
  }
}

/**
 * Check if all required models are registered
 * Useful for debugging and health checks
 */
export function areModelsRegistered() {
  const requiredModels = ['User', 'Game', 'Bet'];
  const registeredModels = Object.keys(mongoose.models);

  const missing = requiredModels.filter(
    model => !registeredModels.includes(model)
  );

  if (missing.length > 0) {
    console.warn('⚠️  Missing models:', missing);
    return false;
  }

  return true;
}

/**
 * Get a model safely with error checking
 * @param {string} modelName - Name of the model to retrieve
 * @returns {Model} Mongoose model
 * @throws {Error} If model is not registered
 */
export function getModel(modelName) {
  if (!mongoose.models[modelName]) {
    throw new Error(
      `Model "${modelName}" is not registered. Did you call registerModels()?`
    );
  }
  return mongoose.models[modelName];
}

/**
 * List all registered models (useful for debugging)
 * @returns {string[]} Array of model names
 */
export function listRegisteredModels() {
  return Object.keys(mongoose.models);
}
