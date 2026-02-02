'use client';

import { useState } from 'react';
import { BadgeCategory, EarnedBadge } from '@/types';
import { BADGES, getBadgesByCategory } from '@/lib/badges';
import BadgeCard from './BadgeCard';

interface BadgeGridProps {
  earnedBadges: EarnedBadge[];
  onTogglePin?: (badgeId: string) => void;
  className?: string;
}

const CATEGORY_LABELS: Record<BadgeCategory, string> = {
  milestone: 'Milestones',
  discovery: 'Discovery',
  mastery: 'Mastery',
  streak: 'Streaks',
  special: 'Special',
};

// SVG icons for each category
const CategoryIcon = ({ category, className = "w-4 h-4" }: { category: BadgeCategory; className?: string }) => {
  switch (category) {
    case 'milestone':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      );
    case 'discovery':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      );
    case 'mastery':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      );
    case 'streak':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      );
    case 'special':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
  }
};

export default function BadgeGrid({
  earnedBadges,
  onTogglePin,
  className = '',
}: BadgeGridProps) {
  const [activeCategory, setActiveCategory] = useState<BadgeCategory | 'all'>('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  const categories: (BadgeCategory | 'all')[] = ['all', 'milestone', 'discovery', 'mastery', 'streak', 'special'];

  const filteredBadges = activeCategory === 'all'
    ? BADGES
    : getBadgesByCategory(activeCategory);

  const displayBadges = showUnlockedOnly
    ? filteredBadges.filter(badge => {
      const earned = earnedBadges.find(eb => eb.badgeId === badge.id);
      return earned?.isUnlocked;
    })
    : filteredBadges;

  // Stats
  const totalUnlocked = earnedBadges.filter(eb => eb.isUnlocked).length;
  const totalBadges = BADGES.length;

  return (
    <div className={className}>
      {/* Header with stats */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-xl font-bold text-ink">Badges</h3>
          <p className="text-sm text-sepia-light">
            {totalUnlocked} of {totalBadges} unlocked
          </p>
        </div>

        {/* Filter toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showUnlockedOnly}
            onChange={(e) => setShowUnlockedOnly(e.target.checked)}
            className="rounded border-brass text-brass focus:ring-brass"
          />
          <span className="text-sm text-sepia-light">Show unlocked only</span>
        </label>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          const categoryBadges = category === 'all' ? BADGES : getBadgesByCategory(category);
          const categoryUnlocked = categoryBadges.filter(b =>
            earnedBadges.find(eb => eb.badgeId === b.id)?.isUnlocked
          ).length;

          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                flex items-center gap-1.5 px-3 py-2 rounded-sm font-display text-sm
                transition-all duration-200 whitespace-nowrap
                ${isActive
                ? 'bg-brass text-parchment'
                : 'bg-parchment-dark text-sepia hover:bg-brass/20'
              }
              `}
            >
              {category !== 'all' && (
                <CategoryIcon category={category} className="w-4 h-4" />
              )}
              <span>{category === 'all' ? 'All' : CATEGORY_LABELS[category]}</span>
              <span className={`text-xs ${isActive ? 'text-parchment/70' : 'text-sepia-light'}`}>
                ({categoryUnlocked}/{categoryBadges.length})
              </span>
            </button>
          );
        })}
      </div>

      {/* Badge grid */}
      {displayBadges.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {displayBadges.map((badge) => {
            const earned = earnedBadges.find(eb => eb.badgeId === badge.id);
            if (!earned) return null;

            return (
              <BadgeCard
                key={badge.id}
                badge={badge}
                earned={earned}
                onTogglePin={earned.isUnlocked && onTogglePin ? () => onTogglePin(badge.id) : undefined}
                size="md"
                showProgress={true}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-sepia-light">
            {showUnlockedOnly
              ? 'No badges unlocked in this category yet.'
              : 'No badges in this category.'}
          </p>
        </div>
      )}
    </div>
  );
}
