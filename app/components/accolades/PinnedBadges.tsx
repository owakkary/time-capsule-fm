'use client';

import { EarnedBadge } from '@/types';
import { BADGES } from '@/lib/badges';
import BadgeCard from './BadgeCard';

interface PinnedBadgesProps {
  badges: EarnedBadge[];
  onTogglePin?: (badgeId: string) => void;
  className?: string;
}

export default function PinnedBadges({
  badges,
  onTogglePin,
  className = '',
}: PinnedBadgesProps) {
  // Get pinned badges (up to 3)
  const pinnedBadges = badges
    .filter(b => b.isPinned && b.isUnlocked)
    .slice(0, 3);

  // If no pinned badges, show placeholder
  if (pinnedBadges.length === 0) {
    return (
      <div className={`text-center py-6 ${className}`}>
        <p className="text-sepia-light text-sm">
          No badges pinned. Click on unlocked badges to pin them here!
        </p>
        <div className="flex justify-center gap-4 mt-4">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="w-20 h-24 rounded-sm border-2 border-dashed border-brass/30 flex items-center justify-center"
            >
              <span className="text-2xl text-brass/30">?</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <h4 className="font-display font-medium text-sepia mb-3">Featured Badges</h4>
      <div className="flex justify-center gap-4">
        {pinnedBadges.map(earned => {
          const badge = BADGES.find(b => b.id === earned.badgeId);
          if (!badge) return null;

          return (
            <BadgeCard
              key={badge.id}
              badge={badge}
              earned={earned}
              onTogglePin={onTogglePin ? () => onTogglePin(badge.id) : undefined}
              size="lg"
              showProgress={false}
            />
          );
        })}

        {/* Empty slots */}
        {Array.from({ length: 3 - pinnedBadges.length }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="w-36 h-32 rounded-sm border-2 border-dashed border-brass/20 flex items-center justify-center"
          >
            <span className="text-2xl text-brass/20">+</span>
          </div>
        ))}
      </div>
    </div>
  );
}
