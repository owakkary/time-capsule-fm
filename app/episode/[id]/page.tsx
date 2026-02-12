'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useEventLogger } from '@/hooks/useEventLogger';
import { getEmpire, EPOCHS, EmpireId, EpochId, ContentType } from '@/types';

interface Episode {
  id: string;
  title: string;
  content: string;
  empire: string;
  epoch: string;
  contentType: string;
  durationMinutes: number;
  audioUrl: string | null;
  audioDurationSeconds: number | null;
  createdAt: { _seconds: number };
}

export default function EpisodePage({ params }: { params: { id: string } }) {
  const episodeId = params.id;
  const { user, loading, signOut, getIdToken } = useAuth();
  const { logEvent } = useEventLogger();
  const router = useRouter();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loadingEpisode, setLoadingEpisode] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Engagement tracking refs
  const hasStartedRef = useRef(false);
  const hasCompletedRef = useRef(false);
  const progressRef = useRef(0);
  const durationRef = useRef(0);
  const logEventRef = useRef(logEvent);
  const episodeRef = useRef(episode);

  // Keep refs in sync without triggering effects
  logEventRef.current = logEvent;
  episodeRef.current = episode;

  const getEventFields = useCallback(() => ({
    episodeId,
    empire: episode?.empire as EmpireId | undefined,
    epoch: episode?.epoch as EpochId | undefined,
    contentType: episode?.contentType as ContentType | undefined,
  }), [episodeId, episode]);

  const getEventFieldsRef = useRef(getEventFields);
  getEventFieldsRef.current = getEventFields;

  // Track episode_abandoned on unmount / beforeunload (fires ONCE on leave)
  useEffect(() => {
    const handleAbandon = () => {
      if (hasStartedRef.current && !hasCompletedRef.current && episodeRef.current) {
        const pct = durationRef.current > 0 ? Math.round((progressRef.current / durationRef.current) * 100) : 0;
        logEventRef.current({
          eventType: 'episode_abandoned',
          ...getEventFieldsRef.current(),
          completionPercentage: pct,
        });
      }
    };

    window.addEventListener('beforeunload', handleAbandon);
    return () => {
      window.removeEventListener('beforeunload', handleAbandon);
      handleAbandon();
    };
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchEpisode() {
      if (!user || !episodeId) return;

      try {
        const token = await getIdToken();
        const response = await fetch(`/api/episodes?id=${episodeId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setEpisode(data.episode || data);
        }
      } catch (error) {
        console.error('Failed to fetch episode:', error);
      } finally {
        setLoadingEpisode(false);
      }
    }

    if (user) {
      fetchEpisode();
    }
  }, [user, episodeId, getIdToken]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();

      // Fire episode_started on first play
      if (!hasStartedRef.current) {
        hasStartedRef.current = true;
        logEvent({ eventType: 'episode_started', ...getEventFields() });
      }

      // Fire episode_replayed if playing again after completion
      if (hasCompletedRef.current) {
        logEvent({ eventType: 'episode_replayed', ...getEventFields() });
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const currentTime = audioRef.current.currentTime;
    const dur = audioRef.current.duration;
    setProgress(currentTime);
    progressRef.current = currentTime;

    // Fire episode_completed when >= 90% listened
    if (!hasCompletedRef.current && dur > 0 && currentTime / dur >= 0.9) {
      hasCompletedRef.current = true;
      logEvent({
        eventType: 'episode_completed',
        ...getEventFields(),
        completionPercentage: Math.round((currentTime / dur) * 100),
      });
    }
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
    durationRef.current = audioRef.current.duration;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading || loadingEpisode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-vintage" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!episode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-ink mb-4">Episode Not Found</h1>
          <Link href="/episodes" className="text-brass hover:text-brass-dark transition-colors font-display">
            Return to My Episodes
          </Link>
        </div>
      </div>
    );
  }

  const empire = getEmpire(episode.empire as any);
  const epoch = EPOCHS.find(e => e.id === episode.epoch);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-parchment/80 backdrop-blur-sm border-b border-brass/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-brass flex items-center justify-center">
                <svg className="w-5 h-5 text-parchment" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="font-display text-2xl font-bold text-ink group-hover:text-sepia transition-colors">
                Time Capsule FM
              </h1>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/dashboard" className="nav-link">Explore</Link>
              <Link href="/figures" className="nav-link">Figures</Link>
              <Link href="/moments" className="nav-link">Moments</Link>
              <Link href="/episodes" className="nav-link active">My Episodes</Link>
              <div className="flex items-center gap-3 pl-4 border-l border-brass/20">
                <Link href="/accolades" className="text-sm text-sepia-light hover:text-sepia transition-colors font-display">Profile</Link>
                <button onClick={handleSignOut} className="text-sm text-sepia-light hover:text-sepia transition-colors font-display">Sign Out</button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-sepia-light font-body">
          <Link href="/episodes" className="hover:text-sepia transition-colors">My Episodes</Link>
          <span>/</span>
          <span className="text-ink font-medium truncate">{episode.title}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        {/* Episode Header */}
        <div className="card-antiquarian overflow-hidden mb-8">
          <div className="p-8 bg-parchment-dark border-b border-brass/20">
            <div className="flex items-center gap-2 mb-4">
              <span className="tag-empire text-sm">
                {empire?.name}
              </span>
              <span className="text-sm text-sepia-light font-body">
                {episode.durationMinutes} min
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold text-ink">{episode.title}</h2>
          </div>

          {/* Audio Player */}
          {episode.audioUrl && (
            <div className="p-6 border-b border-brass/20">
              <audio
                ref={audioRef}
                src={episode.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => {
                  setIsPlaying(false);
                  if (!hasCompletedRef.current) {
                    hasCompletedRef.current = true;
                    logEvent({
                      eventType: 'episode_completed',
                      ...getEventFields(),
                      completionPercentage: 100,
                    });
                  }
                }}
              />

              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full flex items-center justify-center text-parchment bg-brass shadow-lg hover:bg-brass-dark transition-colors"
                >
                  {isPlaying ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={progress}
                    onChange={handleSeek}
                    className="w-full h-2 bg-parchment-dark rounded-sm appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, var(--color-brass) ${(progress / duration) * 100}%, var(--color-parchment-dark) ${(progress / duration) * 100}%)`,
                    }}
                  />
                  <div className="flex justify-between text-sm text-sepia-light font-body mt-1">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transcript */}
          <div className="p-8">
            <h3 className="font-display text-lg font-bold text-ink mb-4">Transcript</h3>
            <div className="prose prose-lg max-w-none text-sepia font-body whitespace-pre-wrap">
              {episode.content}
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center">
          <Link
            href="/episodes"
            className="inline-flex items-center gap-2 text-brass hover:text-brass-dark font-display font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to My Episodes
          </Link>
        </div>
      </div>

      {/* Sticky Audio Player (when audio exists and scrolled) */}
      {episode.audioUrl && (
        <div
          className="fixed bottom-0 left-0 right-0 bg-parchment border-t border-brass/20 shadow-lg p-4"
          style={{ display: progress > 0 || isPlaying ? 'block' : 'none' }}
        >
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full flex items-center justify-center text-parchment bg-brass hover:bg-brass-dark transition-colors"
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <div className="flex-1">
              <p className="text-sm font-display font-medium text-ink truncate">{episode.title}</p>
              <div className="flex items-center gap-2 text-xs text-sepia-light font-body">
                <span>{formatTime(progress)}</span>
                <span>/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
