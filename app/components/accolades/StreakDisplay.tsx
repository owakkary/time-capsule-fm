'use client';

// Fire icon SVG component
const FireIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    <path d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
  </svg>
);

// Trophy icon SVG component
const TrophyIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

interface StreakDisplayProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function StreakDisplay({
  streak,
  size = 'md',
  showLabel = false,
  className = '',
}: StreakDisplayProps) {
  const isActive = streak > 0;

  const sizeClasses = {
    sm: 'text-sm gap-0.5 px-1.5 py-0.5',
    md: 'text-base gap-1 px-2 py-1',
    lg: 'text-lg gap-1.5 px-3 py-1.5',
  };

  const iconSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
  };

  // Flame intensity based on streak length
  const getFlameColor = () => {
    if (!isActive) return 'text-sepia-light opacity-50';
    if (streak >= 30) return 'text-[#FF4500]'; // Red-orange for 30+
    if (streak >= 14) return 'text-[#FF8C00]'; // Dark orange for 14+
    if (streak >= 7) return 'text-[#FFA500]';  // Orange for 7+
    return 'text-[#FFD700]'; // Gold for under 7
  };

  return (
    <div
      className={`
        inline-flex items-center rounded-sm
        ${isActive ? 'bg-[#FFA500]/10' : 'bg-parchment-dark'}
        ${sizeClasses[size]}
        ${className}
      `}
      title={`${streak} day streak${streak > 0 ? '' : ' - explore today to start!'}`}
    >
      <span className={`${getFlameColor()} ${isActive ? 'animate-flame' : ''}`}>
        <FireIcon className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
      </span>
      <span className={`font-display font-bold ${isActive ? 'text-sepia' : 'text-sepia-light'}`}>
        {streak}
      </span>
      {showLabel && (
        <span className="text-sepia-light text-sm ml-0.5">
          {streak === 1 ? 'day' : 'days'}
        </span>
      )}
    </div>
  );
}

// Larger streak card for dashboard
export function StreakCard({
  currentStreak,
  longestStreak,
  className = '',
}: {
  currentStreak: number;
  longestStreak: number;
  className?: string;
}) {
  const isActive = currentStreak > 0;

  return (
    <div className={`card-antiquarian p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-sepia-light mb-1">Current Streak</p>
          <div className="flex items-center gap-2">
            <span className={`${isActive ? 'text-[#FFA500] animate-flame' : 'text-sepia-light opacity-50'}`}>
              <FireIcon className="w-8 h-8" />
            </span>
            <span className="font-display text-3xl font-bold text-ink">
              {currentStreak}
            </span>
            <span className="text-sepia-light">
              {currentStreak === 1 ? 'day' : 'days'}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-sepia-light mb-1">Best Streak</p>
          <div className="flex items-center justify-end gap-1">
            <span className="text-brass">
              <TrophyIcon className="w-5 h-5" />
            </span>
            <span className="font-display text-xl font-bold text-brass">
              {longestStreak}
            </span>
            <span className="text-sepia-light text-sm">days</span>
          </div>
        </div>
      </div>

      {/* Streak tips/encouragement */}
      <div className="mt-3 pt-3 border-t border-brass/20">
        <p className="text-sm text-sepia-light">
          {getStreakMessage(currentStreak, longestStreak)}
        </p>
      </div>
    </div>
  );
}

function getStreakMessage(current: number, longest: number): string {
  if (current === 0) {
    return 'Generate an episode today to start your streak!';
  }
  if (current === longest && current > 1) {
    return `You're on your best streak ever! Keep it going!`;
  }
  if (current >= 7 && current < longest) {
    return `Great week! ${longest - current} more days to beat your record.`;
  }
  if (current >= 3) {
    return 'Nice consistency! History rewards the dedicated.';
  }
  return 'Come back tomorrow to keep your streak alive!';
}
