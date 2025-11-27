'use client';

import Image from 'next/image';

/**
 * Reusable team logo component with fallback
 * @param {Object} props
 * @param {string} props.src - Image URL
 * @param {string} props.alt - Alt text
 * @param {string} props.size - Size variant ('sm', 'md', 'lg', 'xl')
 * @param {string} props.fallback - Fallback emoji
 */
export default function TeamLogo({
  src,
  alt,
  size = 'md',
  fallback = '🏈'
}) {
  const sizes = {
    sm: { class: 'w-8 h-8', dimension: 32 },
    md: { class: 'w-12 h-12', dimension: 48 },
    lg: { class: 'w-16 h-16', dimension: 64 },
    xl: { class: 'w-24 h-24', dimension: 96 },
  };

  const sizeConfig = sizes[size] || sizes.md;

  if (!src) {
    return (
      <div className={`${sizeConfig.class} flex items-center justify-center text-2xl`}>
        {fallback}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt || 'Team logo'}
      width={sizeConfig.dimension}
      height={sizeConfig.dimension}
      className={`${sizeConfig.class} object-contain`}
      quality={85}
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
    />
  );
}
