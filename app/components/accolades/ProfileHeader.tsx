'use client';

import { ReactNode } from 'react';
import { ExplorerProfile } from '@/types';
import ExplorerAvatar from './ExplorerAvatar';
import LevelProgress from './LevelProgress';
import StreakDisplay from './StreakDisplay';

// Icon components
const MicIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const CheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const HeadphonesIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 0112.728 0" />
  </svg>
);

const FireIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    <path d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
  </svg>
);

interface ProfileHeaderProps {
  profile: ExplorerProfile;
  className?: string;
}

export default function ProfileHeader({
  profile,
  className = '',
}: ProfileHeaderProps) {
  return (
    <div className={`card-antiquarian ${className}`}>
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <ExplorerAvatar
            stage={profile.avatarStage}
            size="xl"
            showGlow={profile.tier === 'master' || profile.tier === 'sage'}
          />
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">
              {profile.currentTitle}
            </h2>
            <StreakDisplay streak={profile.currentDailyStreak} size="md" />
          </div>

          <p className="text-sepia-light mb-4">
            {getFlavorText(profile)}
          </p>

          {/* Level progress */}
          <LevelProgress
            level={profile.currentLevel}
            currentXP={profile.currentXP}
            tier={profile.tier}
            size="lg"
            showXPText={true}
          />

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
            <StatPill
              label="Episodes"
              value={profile.totalEpisodesGenerated}
              icon={<MicIcon className="w-4 h-4" />}
            />
            <StatPill
              label="Completed"
              value={profile.episodesCompleted}
              icon={<CheckIcon className="w-4 h-4" />}
            />
            <StatPill
              label="Listening"
              value={formatMinutes(profile.totalListeningMinutes)}
              icon={<HeadphonesIcon className="w-4 h-4" />}
            />
            <StatPill
              label="Best Streak"
              value={`${profile.longestDailyStreak}d`}
              icon={<FireIcon className="w-4 h-4" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatPill({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-parchment-dark rounded-sm">
      <span className="text-sepia-light">{icon}</span>
      <span className="font-display font-medium text-sepia">{value}</span>
      <span className="text-xs text-sepia-light">{label}</span>
    </div>
  );
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

function getFlavorText(profile: ExplorerProfile): string {
  const { tier, totalEpisodesGenerated, currentDailyStreak } = profile;

  if (tier === 'master') {
    return 'A true master of the ages, your knowledge spans millennia.';
  }
  if (tier === 'sage') {
    return 'Your wisdom echoes through the corridors of time.';
  }
  if (tier === 'scholar') {
    return 'The ancient texts speak to you in whispers of forgotten truths.';
  }
  if (tier === 'journeyman') {
    return 'Your journey through history deepens with each discovery.';
  }
  if (tier === 'apprentice') {
    return 'The paths of the past begin to reveal themselves to you.';
  }

  // Novice with encouragement
  if (totalEpisodesGenerated === 0) {
    return 'Your journey through time awaits. Generate your first episode!';
  }
  if (currentDailyStreak > 0) {
    return `You've begun your historical journey. Keep exploring!`;
  }
  return 'A curious wanderer ready to explore the annals of history.';
}
