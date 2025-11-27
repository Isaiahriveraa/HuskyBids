/**
 * Class Name Utility
 * Combines clsx and tailwind-merge for conditional class names
 */
import { clsx } from 'clsx';

/**
 * Combines class names with support for conditionals
 * @param {...(string|Object|Array)} inputs - Class names or conditional objects
 * @returns {string} Combined class names
 * 
 * @example
 * cn('base-class', isActive && 'active', { 'disabled': isDisabled })
 */
export function cn(...inputs) {
  return clsx(inputs);
}
