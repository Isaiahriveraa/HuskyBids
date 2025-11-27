'use client';

export default function MeshGradient({ className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Animated mesh gradient background */}
      <div className="absolute -top-1/2 -left-1/2 w-full h-full">
        <div className="absolute inset-0 bg-gradient-radial from-uw-purple-400/30 to-transparent dark:from-uw-purple-600/20 blur-3xl animate-pulse-slow" />
      </div>

      <div className="absolute -bottom-1/2 -right-1/2 w-full h-full">
        <div className="absolute inset-0 bg-gradient-radial from-uw-gold-400/30 to-transparent dark:from-uw-gold-600/20 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="absolute top-1/4 left-1/3 w-1/2 h-1/2">
        <div className="absolute inset-0 bg-gradient-radial from-uw-purple-300/20 to-transparent dark:from-uw-purple-500/15 blur-2xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-noise mix-blend-overlay" />
    </div>
  );
}
