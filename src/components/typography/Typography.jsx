'use client';

export function Display({ children, className = '' }) {
  return (
    <h1 className={`
      text-5xl md:text-6xl lg:text-7xl
      font-black tracking-tight
      bg-gradient-to-r from-uw-purple-600 to-uw-purple-400
      dark:from-uw-purple-400 dark:to-uw-purple-200
      bg-clip-text text-transparent
      ${className}
    `}>
      {children}
    </h1>
  );
}

export function Heading({ level = 1, children, gradient = false, className = '' }) {
  const sizes = {
    1: 'text-4xl md:text-5xl',
    2: 'text-3xl md:text-4xl',
    3: 'text-2xl md:text-3xl',
    4: 'text-xl md:text-2xl',
    5: 'text-lg md:text-xl',
    6: 'text-base md:text-lg',
  };

  const Tag = `h${level}`;

  const baseClasses = `
    font-bold tracking-tight
    ${gradient
      ? 'bg-gradient-to-r from-uw-purple-600 to-uw-gold-500 dark:from-uw-purple-400 dark:to-uw-gold-400 bg-clip-text text-transparent'
      : 'text-uw-purple-900 dark:text-uw-purple-300'
    }
    ${sizes[level]}
    ${className}
  `;

  return <Tag className={baseClasses}>{children}</Tag>;
}

export function BodyText({ size = 'base', weight = 'normal', children, className = '' }) {
  const sizes = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const weights = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  return (
    <p className={`
      ${sizes[size]}
      ${weights[weight]}
      leading-relaxed
      text-gray-700 dark:text-gray-300
      ${className}
    `}>
      {children}
    </p>
  );
}

export function Label({ children, required = false, className = '' }) {
  return (
    <label className={`
      block text-sm font-semibold
      text-gray-700 dark:text-gray-300
      mb-2
      ${className}
    `}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}
