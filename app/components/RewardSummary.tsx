'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ProgressUpdateResult } from '@/types';

interface RewardSummaryProps {
  reward: ProgressUpdateResult;
}

// Makes earning XP feel like something happened: the number counts up,
// level-ups and fresh badges appear right here instead of silently landing
// on the accolades page.
export default function RewardSummary({ reward }: RewardSummaryProps) {
  const [displayXP, setDisplayXP] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const durationMs = 900;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      // ease-out so the count lands softly instead of stopping dead
      setDisplayXP(Math.round(reward.xpGained * (1 - Math.pow(1 - t, 3))));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [reward.xpGained]);

  const newBadges = reward.newBadges.filter((b) => b.isNewUnlock);

  return (
    <div className="card-antiquarian p-6 text-center animate-fade-in-up">
      <p className="font-display text-4xl font-bold text-brass mb-1">+{displayXP} XP</p>

      {reward.levelUp && (
        <p className="font-display text-lg font-bold text-ink mt-2">
          Level {reward.levelUp.previousLevel} → {reward.levelUp.newLevel}
          {reward.levelUp.newTier !== reward.levelUp.previousTier && (
            <span className="block text-sm text-sepia font-body mt-1">
              You are now a {reward.levelUp.newTier.charAt(0).toUpperCase() + reward.levelUp.newTier.slice(1)}
            </span>
          )}
        </p>
      )}

      {reward.streakUpdated && reward.newStreak > 1 && (
        <p className="font-body text-sm text-sepia mt-2">
          {reward.newStreak}-day streak — keep it alive tomorrow
        </p>
      )}

      {newBadges.length > 0 && (
        <div className="mt-5 pt-4 border-t border-brass/20">
          <p className="font-display text-sm font-bold text-ink mb-3">Badge unlocked</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {newBadges.map(({ badge }) => (
              <div key={badge.id} className="flex flex-col items-center gap-1.5">
                <Image
                  src={`/badges/${badge.id}.png`}
                  alt={badge.name}
                  width={56}
                  height={56}
                  className="rounded-sm shadow-antiquarian"
                />
                <span className="font-body text-xs text-sepia">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
