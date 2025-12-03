/**
 * Jest Configuration
 * Configured for Next.js with module aliases matching jsconfig.json
 */

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Path to Next.js app for loading next.config.mjs and .env files
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  // Test environment
  testEnvironment: 'jest-environment-jsdom',
  
  // Setup files to run after Jest is initialized
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Module path aliases (matching jsconfig.json)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@server/(.*)$': '<rootDir>/src/server/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
  },
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  
  // Files to ignore
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.{js,ts}',
  ],
  
  // Transform settings
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
};

module.exports = createJestConfig(customJestConfig);
