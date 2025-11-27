'use client';

export default function GlassCard({
  children,
  intensity = 'medium',
  border = true,
  className = ''
}) {
  const intensityClasses = {
    light: 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm',
    medium: 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-md',
    strong: 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg',
    ultra: 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl',
  };

  return (
    <div className={`
      ${intensityClasses[intensity]}
      ${border ? 'border border-white/20 dark:border-slate-700/30' : ''}
      rounded-2xl shadow-xl dark:shadow-slate-900/50
      transition-all duration-300
      hover:shadow-2xl hover:-translate-y-0.5
      ${className}
    `}>
      {children}
    </div>
  );
}
