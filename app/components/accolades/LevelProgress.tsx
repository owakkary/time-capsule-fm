'use client';

import { ExplorerTier } from '@/types';
import { formatXPDisplay, LEVEL_THRESHOLDS } from '@/lib/xp';

interface LevelProgressProps {
  level: number;
  currentXP: number;
  tier: ExplorerTier;
  size?: 'sm' | 'md' | 'lg';
  showXPText?: boolean;
  className?: string;
}

export default function LevelProgress({
  level,
  currentXP,
  tier,
  size = 'md',
  showXPText = true,
  className = '',
}: LevelProgressProps) {
  const currentLevelXP = LEVEL_THRESHOLDS[level] || 0;
  const nextLevelXP = LEVEL_THRESHOLDS[level + 1] || LEVEL_THRESHOLDS[level];
  const xpIntoLevel = currentXP - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  const progress = xpNeeded > 0 ? Math.min(100, (xpIntoLevel / xpNeeded) * 100) : 100;

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const tierColors: Record<ExplorerTier, string> = {
    novice: 'from-[#8B7355] to-[#A08060]',
    apprentice: 'from-[#B87333] to-[#C9A66B]',
    journeyman: 'from-[#C9A66B] to-[#DBC9A0]',
    scholar: 'from-[#722F37] to-[#A64D54]',
    sage: 'from-[#4A6FA5] to-[#7BA3C9]',
    master: 'from-[#C9A66B] via-[#FFD700] to-[#C9A66B]',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-sepia">Level {level}</span>
          <span className="text-xs text-sepia-light capitalize px-2 py-0.5 bg-brass/10 rounded-sm">
            {tier}
          </span>
        </div>
        {showXPText && (
          <span className="text-sm text-sepia-light font-body">
            {formatXPDisplay(xpIntoLevel)} / {formatXPDisplay(xpNeeded)}
          </span>
        )}
      </div>

      {/* Progress bar container */}
      <div className={`relative w-full ${sizeClasses[size]} bg-parchment-dark rounded-sm overflow-hidden border border-brass/20`}>
        {/* Background texture */}
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-brass/10 to-transparent" />
        </div>

        {/* Progress fill */}
        <div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${tierColors[tier]} transition-all duration-500 ease-out`}
          style={{ width: `${progress}%` }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />

          {/* Animated shimmer for master tier */}
          {tier === 'master' && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          )}
        </div>

        {/* Level markers (subtle tick marks) */}
        {size !== 'sm' && (
          <div className="absolute inset-0 flex">
            {[25, 50, 75].map((mark) => (
              <div
                key={mark}
                className="absolute top-0 bottom-0 w-px bg-ink/10"
                style={{ left: `${mark}%` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* XP to next level indicator */}
      {showXPText && xpNeeded > 0 && (
        <p className="text-xs text-sepia-light mt-1">
          {formatXPDisplay(xpNeeded - xpIntoLevel)} until Level {level + 1}
        </p>
      )}
    </div>
  );
}
