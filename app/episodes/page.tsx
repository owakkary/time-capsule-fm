'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useExplorerProgress } from '@/hooks/useExplorerProgress';
import { getEmpire, EPOCHS, ListeningHistory } from '@/types';
import { AppHeader } from '@/app/components/layout';

export default function EpisodesPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<ListeningHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  const { profile } = useExplorerProgress(user?.uid || null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchHistory() {
      if (!user || !db) return;

      try {
        const q = query(
          collection(db, 'listeningHistory'),
          where('userId', '==', user.uid),
          orderBy('lastPlayedAt', 'desc'),
          limit(50)
        );
        const snap = await getDocs(q);
        setHistory(snap.docs.map((d) => ({
          ...d.data(),
          lastPlayedAt: d.data().lastPlayedAt?.toDate?.() || new Date(),
          createdAt: d.data().createdAt?.toDate?.() || new Date(),
        }) as ListeningHistory));
      } catch (error) {
        console.error('Failed to fetch listening history:', error);
      } finally {
        setLoadingHistory(false);
      }
    }

    if (user) {
      fetchHistory();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const filteredHistory = history.filter((h) => {
    if (filter === 'all') return true;
    return h.epochId === filter || h.empireId === filter;
  });

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-vintage" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <AppHeader profile={profile} onSignOut={handleSignOut} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-10 opacity-0 animate-fade-in-up">
          <div>
            <h2 className="hero-title mb-2">My Journey</h2>
            <p className="text-sepia-light font-body">{history.length} chapters explored</p>
          </div>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input max-w-xs"
          >
            <option value="all">All Epochs</option>
            {EPOCHS.map((epoch) => (
              <option key={epoch.id} value={epoch.id}>{epoch.name}</option>
            ))}
          </select>
        </div>

        {loadingHistory ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-vintage" />
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-16 card-antiquarian opacity-0 animate-fade-in-up animate-stagger-1">
            <h3 className="font-display text-2xl font-bold text-ink mb-3">No chapters yet</h3>
            <p className="text-sepia-light font-body mb-8">Start your first chapter to begin your journey.</p>
            <Link href="/dashboard" className="btn-primary">
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-0 animate-fade-in-up animate-stagger-1">
            {filteredHistory.map((item) => {
              const empire = getEmpire(item.empireId);
              return (
                <Link
                  key={item.episodeId}
                  href={`/episode/${item.episodeId}`}
                  className="card-antiquarian card-accent-left group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="tag-empire text-xs">
                      {empire?.name || item.empireId}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-ink mb-3 line-clamp-2 group-hover:text-sepia transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-sepia-light font-body">
                    <span>{item.durationMinutes} min</span>
                    <span>{formatDate(item.lastPlayedAt)}</span>
                  </div>
                  {item.completed && (
                    <div className="mt-4 pt-3 border-t border-brass/20 flex items-center gap-2 text-brass text-sm font-display">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Completed</span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
