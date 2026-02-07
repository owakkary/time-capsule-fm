'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useExplorerProgress } from '@/hooks/useExplorerProgress';
import { getEmpire, EPOCHS } from '@/types';
import { AppHeader } from '@/app/components/layout';

interface Episode {
  id: string;
  title: string;
  empire: string;
  epoch: string;
  contentType: string;
  durationMinutes: number;
  createdAt: { _seconds: number };
  audioUrl: string | null;
}

export default function EpisodesPage() {
  const { user, loading, signOut, getIdToken } = useAuth();
  const router = useRouter();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  const { profile } = useExplorerProgress(user?.uid || null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchEpisodes() {
      if (!user) return;

      try {
        const token = await getIdToken();
        const response = await fetch('/api/episodes?limit=50', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setEpisodes(data.episodes || []);
        }
      } catch (error) {
        console.error('Failed to fetch episodes:', error);
      } finally {
        setLoadingEpisodes(false);
      }
    }

    if (user) {
      fetchEpisodes();
    }
  }, [user, getIdToken]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const filteredEpisodes = episodes.filter(ep => {
    if (filter === 'all') return true;
    return ep.epoch === filter || ep.empire === filter;
  });

  const formatDate = (seconds: number) => {
    return new Date(seconds * 1000).toLocaleDateString('en-US', {
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
            <h2 className="hero-title mb-2">My Episodes</h2>
            <p className="text-sepia-light font-body">{episodes.length} episodes generated</p>
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

        {loadingEpisodes ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-vintage" />
          </div>
        ) : filteredEpisodes.length === 0 ? (
          <div className="text-center py-16 card-antiquarian opacity-0 animate-fade-in-up animate-stagger-1">
            <h3 className="font-display text-2xl font-bold text-ink mb-3">No episodes yet</h3>
            <p className="text-sepia-light font-body mb-8">Generate your first history podcast episode!</p>
            <Link href="/dashboard" className="btn-primary">
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-0 animate-fade-in-up animate-stagger-1">
            {filteredEpisodes.map((episode) => {
              const empire = getEmpire(episode.empire as any);
              return (
                <Link
                  key={episode.id}
                  href={`/episode/${episode.id}`}
                  className="card-antiquarian card-accent-left group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="tag-empire text-xs">
                      {empire?.name || episode.empire}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-ink mb-3 line-clamp-2 group-hover:text-sepia transition-colors">
                    {episode.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-sepia-light font-body">
                    <span>{episode.durationMinutes} min</span>
                    <span>{formatDate(episode.createdAt._seconds)}</span>
                  </div>
                  {episode.audioUrl && (
                    <div className="mt-4 pt-3 border-t border-brass/20 flex items-center gap-2 text-brass text-sm font-display">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      <span>Audio ready</span>
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
