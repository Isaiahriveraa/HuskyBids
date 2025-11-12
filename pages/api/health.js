/**
 * Health Check API
 * Verifies MongoDB connection and model registration status
 *
 * GET /api/health
 * Returns: { status, modelsRegistered, models, timestamp }
 */

import { listRegisteredModels, areModelsRegistered } from '../../lib/models';
import connectDB from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    // Connect to database (this also registers models)
    await connectDB();

    // Get model registration status
    const models = listRegisteredModels();
    const allRegistered = areModelsRegistered();

    res.status(200).json({
      status: allRegistered ? 'healthy' : 'unhealthy',
      modelsRegistered: allRegistered,
      models: models,
      requiredModels: ['User', 'Game', 'Bet'],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
