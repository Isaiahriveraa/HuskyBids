/**
 * Advanced gradient system for HuskyBids
 * Generates theme-aware gradients with proper dark mode variants
 */

export const gradients = {
  // Primary brand gradients
  uwPrimary: {
    light: 'bg-gradient-to-br from-uw-purple-500 via-uw-purple-600 to-uw-purple-700',
    dark: 'bg-gradient-to-br from-uw-purple-400 via-uw-purple-500 to-uw-purple-600',
  },

  uwSecondary: {
    light: 'bg-gradient-to-br from-uw-gold-400 via-uw-gold-500 to-uw-gold-600',
    dark: 'bg-gradient-to-br from-uw-gold-500 via-uw-gold-600 to-uw-gold-700',
  },

  uwHero: {
    light: 'bg-gradient-to-br from-uw-purple-50 via-gray-50 to-uw-gold-50',
    dark: 'bg-gradient-to-br from-uw-purple-950 via-slate-950 to-uw-gold-950',
  },

  // Status gradients
  success: {
    light: 'bg-gradient-to-br from-green-400 to-green-600',
    dark: 'bg-gradient-to-br from-green-500 to-green-700',
  },

  error: {
    light: 'bg-gradient-to-br from-red-400 to-red-600',
    dark: 'bg-gradient-to-br from-red-500 to-red-700',
  },

  warning: {
    light: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    dark: 'bg-gradient-to-br from-yellow-500 to-yellow-700',
  },

  // Special effects
  shimmer: {
    light: 'bg-gradient-to-r from-transparent via-white to-transparent',
    dark: 'bg-gradient-to-r from-transparent via-slate-700 to-transparent',
  },

  aurora: {
    light: 'bg-gradient-to-r from-uw-purple-300 via-uw-gold-300 to-uw-purple-300',
    dark: 'bg-gradient-to-r from-uw-purple-600 via-uw-gold-600 to-uw-purple-600',
  },
};

/**
 * Get gradient classes for current theme
 * @param {string} name - Gradient name
 * @returns {string} Tailwind classes with dark mode variants
 */
export function getGradient(name) {
  const gradient = gradients[name];
  if (!gradient) return '';

  return `${gradient.light} dark:${gradient.dark.replace('bg-', '')}`;
}

/**
 * Create custom gradient with dark mode support
 * @param {Array} lightColors - Light mode color stops
 * @param {Array} darkColors - Dark mode color stops
 * @param {string} direction - Gradient direction
 */
export function createGradient(lightColors, darkColors, direction = 'to-br') {
  const light = `bg-gradient-${direction} ${lightColors.join(' ')}`;
  const dark = `dark:bg-gradient-${direction} ${darkColors.join(' ')}`;
  return `${light} ${dark}`;
}
