'use client';

import { useState, useEffect } from 'react';

/**
 * A/B Testing Hook
 *
 * Assigns users to test variants and tracks their experience.
 * Variants are stored in localStorage to ensure consistent experience.
 *
 * @param {string} testName - Unique identifier for the test
 * @param {string[]} variants - Array of variant names (e.g., ['control', 'variant-a'])
 * @param {Object} options - Optional configuration
 * @param {Function} options.onAssign - Callback when variant is assigned
 * @returns {string|null} - The assigned variant name
 *
 * @example
 * const oddsFormat = useABTest('odds-format', ['decimal', 'american']);
 *
 * @example
 * const buttonPlacement = useABTest('cta-placement', ['top', 'bottom'], {
 *   onAssign: (variant) => console.log(`User assigned to: ${variant}`)
 * });
 */
export function useABTest(testName, variants, options = {}) {
  const [variant, setVariant] = useState(null);
  const { onAssign } = options;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Get or assign variant
    const storageKey = `ab-test-${testName}`;
    const saved = localStorage.getItem(storageKey);

    if (saved && variants.includes(saved)) {
      // Use existing assignment
      setVariant(saved);
    } else {
      // Assign new variant randomly
      const randomVariant = variants[Math.floor(Math.random() * variants.length)];
      setVariant(randomVariant);
      localStorage.setItem(storageKey, randomVariant);

      // Track assignment
      trackABTestAssignment(testName, randomVariant);

      // Call onAssign callback if provided
      if (onAssign) {
        onAssign(randomVariant);
      }
    }
  }, [testName, variants, onAssign]);

  return variant;
}

/**
 * Track A/B test assignment
 * This is a placeholder - integrate with your analytics service
 */
function trackABTestAssignment(testName, variant) {
  if (typeof window === 'undefined') return;

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[A/B Test] ${testName}: ${variant}`);
  }

  // TODO: Send to analytics service
  // Example: analytics.track('ab_test_assigned', { test: testName, variant });
}

/**
 * Track A/B test conversion
 * Call this when a user completes the goal of your test
 *
 * @param {string} testName - Test identifier
 * @param {string} eventName - Conversion event name
 * @param {Object} metadata - Additional event data
 *
 * @example
 * trackABTestConversion('odds-format', 'bet_placed', { amount: 100 });
 */
export function trackABTestConversion(testName, eventName, metadata = {}) {
  if (typeof window === 'undefined') return;

  const storageKey = `ab-test-${testName}`;
  const variant = localStorage.getItem(storageKey);

  if (!variant) return;

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[A/B Test Conversion] ${testName} (${variant}): ${eventName}`, metadata);
  }

  // TODO: Send to analytics service
  // Example: analytics.track('ab_test_conversion', {
  //   test: testName,
  //   variant,
  //   event: eventName,
  //   ...metadata
  // });
}

/**
 * Get current variant assignment for a test
 * Useful for conditional rendering without hooks
 *
 * @param {string} testName - Test identifier
 * @returns {string|null} - The assigned variant or null
 */
export function getABTestVariant(testName) {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(`ab-test-${testName}`);
}

/**
 * Reset A/B test assignment (useful for testing)
 *
 * @param {string} testName - Test identifier
 */
export function resetABTest(testName) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`ab-test-${testName}`);
}

/**
 * Get all active A/B tests for debugging
 *
 * @returns {Object} - Map of test names to variants
 */
export function getAllABTests() {
  if (typeof window === 'undefined') return {};

  const tests = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('ab-test-')) {
      const testName = key.replace('ab-test-', '');
      tests[testName] = localStorage.getItem(key);
    }
  }
  return tests;
}
