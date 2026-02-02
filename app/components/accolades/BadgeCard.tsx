'use client';

import { BadgeDefinition, EarnedBadge, BadgeRarity } from '@/types';
import { getRarityColors } from '@/lib/badges';

interface BadgeCardProps {
  badge: BadgeDefinition;
  earned: EarnedBadge;
  onTogglePin?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  className?: string;
}

export default function BadgeCard({
  badge,
  earned,
  onTogglePin,
  size = 'md',
  showProgress = true,
  className = '',
}: BadgeCardProps) {
  const colors = getRarityColors(badge.rarity);
  const isUnlocked = earned.isUnlocked;

  const sizeClasses = {
    sm: 'p-2 w-20',
    md: 'p-3 w-28',
    lg: 'p-4 w-36',
  };

  const iconSizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  const progressPercent = earned.targetProgress > 0
    ? Math.min(100, (earned.progress / earned.targetProgress) * 100)
    : 0;

  return (
    <div
      className={`
        relative flex flex-col items-center text-center rounded-sm
        transition-all duration-300 cursor-pointer
        ${sizeClasses[size]}
        ${isUnlocked ? colors.bg : 'bg-parchment-dark/50'}
        ${isUnlocked ? `border-2 ${colors.border}` : 'border border-brass/20'}
        ${isUnlocked ? colors.glow : ''}
        ${!isUnlocked ? 'grayscale-[40%] opacity-70' : ''}
        hover:scale-105 hover:shadow-lg
        ${className}
      `}
      onClick={onTogglePin}
      title={isUnlocked ? (earned.isPinned ? 'Unpin badge' : 'Pin badge') : `${earned.progress}/${earned.targetProgress}`}
    >
      {/* Pin indicator */}
      {earned.isPinned && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-brass rounded-full flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-parchment" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
          </svg>
        </div>
      )}

      {/* Badge icon */}
      <div className={`${iconSizes[size]} mb-1 ${!isUnlocked ? 'opacity-50' : ''}`}>
        {badge.icon}
      </div>

      {/* Badge name */}
      <p className={`font-display font-medium text-sepia leading-tight ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
        {badge.name}
      </p>

      {/* Progress bar (for locked badges) */}
      {showProgress && !isUnlocked && size !== 'sm' && (
        <div className="w-full mt-2">
          <div className="h-1.5 bg-parchment-dark rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getRarityGradient(badge.rarity)} transition-all duration-300`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-sepia-light mt-0.5">
            {earned.progress}/{earned.targetProgress}
          </p>
        </div>
      )}

      {/* Rarity indicator */}
      {size === 'lg' && (
        <span className={`text-xs ${colors.text} mt-1 capitalize`}>
          {badge.rarity}
        </span>
      )}

      {/* Unlock shimmer animation for newly unlocked */}
      {isUnlocked && badge.rarity === 'legendary' && (
        <div className="absolute inset-0 rounded-sm overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      )}
    </div>
  );
}

function getRarityGradient(rarity: BadgeRarity): string {
  switch (rarity) {
    case 'common':
      return 'from-[#8B7355] to-[#A08060]';
    case 'uncommon':
      return 'from-[#B87333] to-[#C9A66B]';
    case 'rare':
      return 'from-[#C9A66B] to-[#DBC9A0]';
    case 'epic':
      return 'from-[#4A6FA5] to-[#7BA3C9]';
    case 'legendary':
      return 'from-[#722F37] via-[#C9A66B] to-[#722F37]';
  }
}

// Compact badge for inline display
export function BadgeIcon({
  badge,
  isUnlocked,
  size = 24,
  className = '',
}: {
  badge: BadgeDefinition;
  isUnlocked: boolean;
  size?: number;
  className?: string;
}) {
  const colors = getRarityColors(badge.rarity);

  return (
    <div
      className={`
        inline-flex items-center justify-center rounded-full
        ${isUnlocked ? colors.bg : 'bg-parchment-dark/50'}
        ${isUnlocked ? `border ${colors.border}` : 'border border-brass/20'}
        ${!isUnlocked ? 'grayscale opacity-50' : ''}
        ${className}
      `}
      style={{ width: size, height: size }}
      title={badge.name}
    >
      <span style={{ fontSize: size * 0.5 }}>{badge.icon}</span>
    </div>
  );
}
