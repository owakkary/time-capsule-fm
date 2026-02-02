'use client';

import { useEffect, useState } from 'react';
import { BadgeDefinition, LevelUpResult } from '@/types';
import { getRarityColors } from '@/lib/badges';

interface AchievementToastProps {
  badge?: BadgeDefinition;
  levelUp?: LevelUpResult;
  xpGained?: number;
  onClose: () => void;
  duration?: number;
}

export default function AchievementToast({
  badge,
  levelUp,
  xpGained,
  onClose,
  duration = 5000,
}: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Enter animation
    setIsVisible(true);

    // Auto-close timer
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  // Determine toast type
  const isBadgeUnlock = !!badge;
  const isLevelUp = !!levelUp;
  const isXPOnly = !isBadgeUnlock && !isLevelUp && !!xpGained;

  const colors = badge ? getRarityColors(badge.rarity) : null;

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm
        transform transition-all duration-300 ease-out
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div
        className={`
          relative overflow-hidden rounded-sm shadow-xl
          ${isBadgeUnlock && colors
          ? `${colors.bg} border-2 ${colors.border} ${colors.glow}`
          : isLevelUp
            ? 'bg-gradient-to-r from-brass/20 to-burgundy/20 border-2 border-brass'
            : 'bg-parchment border border-brass/30'
        }
        `}
      >
        {/* Confetti/particle effect for badge unlocks */}
        {isBadgeUnlock && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  backgroundColor: getConfettiColor(i),
                }}
              />
            ))}
          </div>
        )}

        {/* Content */}
        <div className="relative p-4">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-sepia-light hover:text-sepia transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Badge unlock */}
          {isBadgeUnlock && badge && (
            <div className="flex items-start gap-3">
              <div className="text-4xl animate-bounce-subtle">{badge.icon}</div>
              <div>
                <p className="text-xs text-sepia-light uppercase tracking-wider mb-1">
                  Badge Unlocked!
                </p>
                <h4 className="font-display font-bold text-ink">{badge.name}</h4>
                <p className="text-sm text-sepia-light">{badge.description}</p>
                <span className={`inline-block mt-1 text-xs ${colors?.text} capitalize`}>
                  {badge.rarity}
                </span>
              </div>
            </div>
          )}

          {/* Level up */}
          {isLevelUp && levelUp && (
            <div className="flex items-start gap-3">
              <div className="text-4xl animate-bounce-subtle">⬆️</div>
              <div>
                <p className="text-xs text-sepia-light uppercase tracking-wider mb-1">
                  Level Up!
                </p>
                <h4 className="font-display font-bold text-ink">
                  Level {levelUp.newLevel}
                </h4>
                {levelUp.previousTier !== levelUp.newTier && (
                  <p className="text-sm text-brass font-medium mt-1">
                    New Rank: {levelUp.newTier.charAt(0).toUpperCase() + levelUp.newTier.slice(1)}
                  </p>
                )}
                {levelUp.previousAvatarStage !== levelUp.newAvatarStage && (
                  <p className="text-sm text-sepia-light">
                    Avatar evolved to {levelUp.newAvatarStage}!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* XP only */}
          {isXPOnly && xpGained && (
            <div className="flex items-center gap-3">
              <div className="text-2xl">✨</div>
              <div>
                <span className="font-display font-bold text-brass">+{xpGained} XP</span>
              </div>
            </div>
          )}
        </div>

        {/* Progress bar for auto-close */}
        <div className="h-1 bg-parchment-dark">
          <div
            className="h-full bg-brass transition-all ease-linear"
            style={{
              width: '100%',
              animation: `shrinkWidth ${duration}ms linear forwards`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function getConfettiColor(index: number): string {
  const colors = [
    '#C9A66B', // brass
    '#722F37', // burgundy
    '#FFD700', // gold
    '#4A6FA5', // blue
    '#B87333', // bronze
    '#DBC9A0', // brass-light
  ];
  return colors[index % colors.length];
}

// Toast container to manage multiple toasts
export function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Array<{ id: string; badge?: BadgeDefinition; levelUp?: LevelUpResult; xpGained?: number }>;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ transform: `translateY(${index * 8}px)` }}
        >
          <AchievementToast
            badge={toast.badge}
            levelUp={toast.levelUp}
            xpGained={toast.xpGained}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}
