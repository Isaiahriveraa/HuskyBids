'use client';

export default function ResponsiveGrid({
  children,
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 6,
  className = ''
}) {
  const gridClasses = `
    grid
    grid-cols-${cols.sm}
    md:grid-cols-${cols.md}
    lg:grid-cols-${cols.lg}
    xl:grid-cols-${cols.xl}
    gap-${gap}
    ${className}
  `;

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
}

// Masonry Grid for varied content heights
export function MasonryGrid({ children, className = '' }) {
  return (
    <div className={`
      columns-1 md:columns-2 lg:columns-3 xl:columns-4
      gap-6 space-y-6
      ${className}
    `}>
      {children}
    </div>
  );
}

// Bento Box Layout (asymmetric grid)
export function BentoGrid({ children, className = '' }) {
  return (
    <div className={`
      grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12
      gap-4 md:gap-6
      auto-rows-fr
      ${className}
    `}>
      {children}
    </div>
  );
}
