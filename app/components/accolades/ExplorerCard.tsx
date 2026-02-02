'use client';

import Link from 'next/link';
import { ExplorerProfile, EarnedBadge } from '@/types';
import { BADGES } from '@/lib/badges';
import ExplorerAvatar from './ExplorerAvatar';
import LevelProgress from './LevelProgress';
import StreakDisplay from './StreakDisplay';
import { BadgeIcon } from './BadgeCard';

interface ExplorerCardProps {
  profile: ExplorerProfile;
  badges: EarnedBadge[];
  variant?: 'full' | 'compact';
  className?: string;
}

export default function ExplorerCard({
  profile,
  badges,
  variant = 'full',
  className = '',
}: ExplorerCardProps) {
  // Get pinned badges (up to 3)
  const pinnedBadges = badges
    .filter(b => b.isPinned && b.isUnlocked)
    .slice(0, 3);

  // If no pinned badges, show most recent unlocked
  const displayBadges = pinnedBadges.length > 0
    ? pinnedBadges
    : badges
      .filter(b => b.isUnlocked)
      .sort((a, b) => {
        const aDate = a.unlockedAt ? new Date(a.unlockedAt).getTime() : 0;
        const bDate = b.unlockedAt ? new Date(b.unlockedAt).getTime() : 0;
        return bDate - aDate;
      })
      .slice(0, 3);

  if (variant === 'compact') {
    return (
      <Link
        href="/accolades"
        className={`
          flex items-center gap-3 px-3 py-2 rounded-sm
          bg-parchment-dark/50 hover:bg-parchment-dark
          transition-colors cursor-pointer
          ${className}
        `}
      >
        <ExplorerAvatar stage={profile.avatarStage} size="sm" />
        <div className="flex items-center gap-2">
          <span className="font-display font-medium text-sepia text-sm">
            Lvl {profile.currentLevel}
          </span>
          <StreakDisplay streak={profile.currentDailyStreak} size="sm" />
        </div>
      </Link>
    );
  }

  return (
    <div className={`card-antiquarian ${className}`}>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Avatar section */}
        <Link href="/accolades" className="flex-shrink-0 group">
          <div className="relative">
            <ExplorerAvatar
              stage={profile.avatarStage}
              size="lg"
              showGlow={profile.tier === 'master' || profile.tier === 'sage'}
              className="group-hover:scale-105 transition-transform"
            />
          </div>
        </Link>

        {/* Info section */}
        <div className="flex-1 w-full text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
            <Link href="/accolades" className="hover:text-brass transition-colors">
              <h3 className="font-display text-lg font-bold text-ink">
                {profile.currentTitle}
              </h3>
            </Link>
            <StreakDisplay streak={profile.currentDailyStreak} size="sm" />
          </div>

          {/* Level progress */}
          <LevelProgress
            level={profile.currentLevel}
            currentXP={profile.currentXP}
            tier={profile.tier}
            size="md"
            showXPText={true}
          />

          {/* Pinned badges */}
          {displayBadges.length > 0 && (
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
              <span className="text-xs text-sepia-light">Badges:</span>
              {displayBadges.map(earned => {
                const badge = BADGES.find(b => b.id === earned.badgeId);
                if (!badge) return null;
                return (
                  <BadgeIcon
                    key={badge.id}
                    badge={badge}
                    isUnlocked={true}
                    size={28}
                  />
                );
              })}
              <Link
                href="/accolades"
                className="text-xs text-brass hover:text-brass-dark transition-colors"
              >
                View all
              </Link>
            </div>
          )}

          {/* Quick stats row */}
          <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-sepia-light">Episodes:</span>
              <span className="font-medium text-sepia">{profile.totalEpisodesGenerated}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sepia-light">Completed:</span>
              <span className="font-medium text-sepia">{profile.episodesCompleted}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mini version for navigation header
export function ExplorerMini({
  profile,
  className = '',
}: {
  profile: ExplorerProfile | null;
  className?: string;
}) {
  if (!profile) return null;

  return (
    <Link
      href="/accolades"
      className={`
        flex items-center gap-2 px-2.5 py-1.5 rounded-sm
        bg-brass/10 border border-brass/20
        hover:bg-brass/20 hover:border-brass/40 hover:scale-105
        transition-all duration-200
        ${className}
      `}
      title={`${profile.currentTitle} - Level ${profile.currentLevel}`}
    >
      <ExplorerAvatar stage={profile.avatarStage} size="sm" />
      <div className="hidden sm:flex items-center gap-1.5">
        <span className="font-display text-sm font-medium text-sepia">
          Lvl {profile.currentLevel}
        </span>
        {profile.currentDailyStreak > 0 && (
          <StreakDisplay streak={profile.currentDailyStreak} size="sm" />
        )}
      </div>
    </Link>
  );
}
