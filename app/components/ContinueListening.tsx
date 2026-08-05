'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getEmpire, ListeningHistory } from '@/types';
import { isEmpireAvailable } from '@/lib/availability';

interface ContinueListeningProps {
  userId: string;
}

// The single biggest retention leak was episodes restarting from 0:00.
// This surfaces the most recent unfinished episode at the top of the
// dashboard so one tap puts the listener back where they left off
// (the episode page seeks to the saved position on load).
export default function ContinueListening({ userId }: ContinueListeningProps) {
  const [item, setItem] = useState<ListeningHistory | null>(null);

  useEffect(() => {
    async function fetchLatest() {
      if (!db) return;
      try {
        const q = query(
          collection(db, 'listeningHistory'),
          where('userId', '==', userId),
          orderBy('lastPlayedAt', 'desc'),
          limit(10)
        );
        const snap = await getDocs(q);
        const candidates = snap.docs
          .map((d) => d.data() as ListeningHistory)
          .filter(
            (h) =>
              !h.completed &&
              isEmpireAvailable(h.empireId) &&
              typeof h.progressSeconds === 'number' &&
              h.progressSeconds >= 30
          );
        setItem(candidates[0] ?? null);
      } catch {
        // Card is a bonus; a failed query just hides it.
      }
    }
    fetchLatest();
  }, [userId]);

  if (!item) return null;

  const totalSeconds = item.durationMinutes * 60;
  const pct = Math.min(Math.round((item.progressSeconds / totalSeconds) * 100), 95);
  const minutesLeft = Math.max(1, Math.round((totalSeconds - item.progressSeconds) / 60));
  const empire = getEmpire(item.empireId);

  return (
    <Link
      href={`/episode/${item.episodeId}`}
      className="card-antiquarian card-accent-left block group mb-8 opacity-0 animate-fade-in-up"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <p className="font-display text-xs font-bold tracking-widest uppercase text-sepia-light mb-1.5">
            Continue Listening
          </p>
          <h3 className="font-display text-lg font-bold text-ink truncate group-hover:text-sepia transition-colors">
            {item.title}
          </h3>
          <p className="font-body text-sm text-sepia-light mt-0.5">
            {empire?.name ?? item.empireId} · about {minutesLeft} min left
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="w-28 h-2 bg-parchment-dark rounded-sm overflow-hidden">
            <div className="h-full bg-brass" style={{ width: `${pct}%` }} />
          </div>
          <span className="w-10 h-10 rounded-full flex items-center justify-center text-parchment bg-brass group-hover:bg-brass-dark transition-colors">
            <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
