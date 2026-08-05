'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useEventLogger } from '@/hooks/useEventLogger';
import { useExplorerProgress } from '@/hooks/useExplorerProgress';
import { getEmpire, EPOCHS, ContentLibraryItem, EmpireId, EpochId, ContentType } from '@/types';
import { getAudioProvider, getQuiz, hasQuiz } from '@/lib/content-library';
import { isEmpireAvailable } from '@/lib/availability';
import EpisodeQuiz from '@/app/components/EpisodeQuiz';

// Average spoken pace used to estimate duration for browser-speech
// episodes, which have no audio file to read a real duration from.
const WORDS_PER_MINUTE = 150;

export default function EpisodePage({ params }: { params: { id: string } }) {
  const episodeId = params.id;
  const { user, loading, signOut } = useAuth();
  const { logEvent } = useEventLogger();
  const { recordEpisodeGenerated, recordEpisodeCompleted } = useExplorerProgress(user?.uid || null);
  const router = useRouter();
  const [episode, setEpisode] = useState<ContentLibraryItem | null>(null);
  const [loadingEpisode, setLoadingEpisode] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Browser-speech (Web Speech API) playback state — used when the episode
  // has no pre-rendered ElevenLabs audioUrl.
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Engagement tracking refs
  const hasStartedRef = useRef(false);
  const hasFinishedListeningRef = useRef(false); // reached the end of the audio/speech
  const hasCompletedRef = useRef(false); // passed the quiz — this is what unlocks XP
  const progressRef = useRef(0);
  const durationRef = useRef(0);
  const logEventRef = useRef(logEvent);
  const episodeRef = useRef(episode);
  // Lets handleEpisodeEnd complete a quiz-less episode without depending on
  // handleComplete, which is defined below it.
  const handleCompleteRef = useRef<(completionPercentage: number) => void>(() => {});

  // Keep refs in sync without triggering effects
  logEventRef.current = logEvent;
  episodeRef.current = episode;

  const getEventFields = useCallback(() => ({
    episodeId,
    empire: episode?.empireId,
    epoch: episode?.epochId,
    contentType: episode?.contentType,
  }), [episodeId, episode]);

  const getEventFieldsRef = useRef(getEventFields);
  getEventFieldsRef.current = getEventFields;

  const touchListeningHistory = useCallback(async (item: ContentLibraryItem, completed: boolean) => {
    if (!db || !user) return;
    const historyRef = doc(db, 'listeningHistory', `${user.uid}_${item.id}`);
    await setDoc(historyRef, {
      id: `${user.uid}_${item.id}`,
      userId: user.uid,
      episodeId: item.id,
      title: item.title,
      empireId: item.empireId,
      epochId: item.epochId,
      contentType: item.contentType,
      durationMinutes: item.durationMinutes,
      progressSeconds: Math.round(progressRef.current),
      completed,
      lastPlayedAt: Timestamp.now(),
      createdAt: Timestamp.now(),
    }, { merge: true });
  }, [user]);

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
      // Stop any in-flight browser speech when navigating away.
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (speechIntervalRef.current) {
        clearInterval(speechIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchEpisode() {
      if (!user || !episodeId || !db) return;

      try {
        const snap = await getDoc(doc(db, 'contentLibrary', episodeId));
        if (snap.exists()) {
          const data = snap.data();
          const item = {
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
          } as ContentLibraryItem;
          // The library holds episodes for empires the UI doesn't offer yet;
          // don't play one just because someone has the direct link.
          if (!isEmpireAvailable(item.empireId)) {
            setNotFound(true);
            return;
          }
          setEpisode(item);
          if (getAudioProvider(item) === 'browser-speech') {
            setDuration(Math.round((item.wordCount / WORDS_PER_MINUTE) * 60));
          }
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Failed to fetch episode:', error);
        setNotFound(true);
      } finally {
        setLoadingEpisode(false);
      }
    }

    if (user) {
      fetchEpisode();
    }
  }, [user, episodeId]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  // Reached the end of playback (audio or speech) — reveal the quiz.
  // XP/badges/listening-history-completed wait for a passed quiz, EXCEPT for
  // items that have no quiz at all (generated before quizzes existed). Those
  // fall back to the original "finishing it completes it" rule, otherwise
  // their XP would be permanently unreachable.
  const handleEpisodeEnd = useCallback(() => {
    if (hasFinishedListeningRef.current) return;
    hasFinishedListeningRef.current = true;
    setIsPlaying(false);
    const item = episodeRef.current;
    if (item && !hasQuiz(item)) {
      handleCompleteRef.current(100);
      return;
    }
    setShowQuiz(true);
  }, []);

  const handleComplete = useCallback((completionPercentage: number) => {
    if (hasCompletedRef.current || !episode) return;
    hasCompletedRef.current = true;
    logEvent({
      eventType: 'episode_completed',
      ...getEventFields(),
      completionPercentage,
    });
    recordEpisodeCompleted(episode.empireId as EmpireId);
    touchListeningHistory(episode, true);
  }, [episode, recordEpisodeCompleted, touchListeningHistory, logEvent, getEventFields]);

  handleCompleteRef.current = handleComplete;

  const handleQuizPass = useCallback((score: number) => {
    if (!episode) return;
    const total = getQuiz(episode).length;
    logEvent({
      eventType: 'quiz_passed',
      ...getEventFields(),
      completionPercentage: total > 0 ? Math.round((score / total) * 100) : 100,
    });
    handleComplete(100);
  }, [episode, logEvent, getEventFields, handleComplete]);

  const handleQuizFail = useCallback((score: number) => {
    if (!episode) return;
    const total = getQuiz(episode).length;
    logEvent({
      eventType: 'quiz_failed',
      ...getEventFields(),
      completionPercentage: total > 0 ? Math.round((score / total) * 100) : 0,
    });
  }, [episode, logEvent, getEventFields]);

  const onFirstPlay = useCallback(() => {
    if (hasStartedRef.current || !episode) return;
    hasStartedRef.current = true;
    logEvent({ eventType: 'episode_started', ...getEventFields() });
    recordEpisodeGenerated(
      episode.empireId as EmpireId,
      episode.epochId as EpochId,
      episode.contentType as ContentType,
      episode.contentId || undefined
    );
    touchListeningHistory(episode, false);
  }, [episode, logEvent, getEventFields, recordEpisodeGenerated, touchListeningHistory]);

  const toggleAudioPlay = () => {
    if (!audioRef.current || !episode) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      onFirstPlay();
      if (hasFinishedListeningRef.current) {
        logEvent({ eventType: 'episode_replayed', ...getEventFields() });
      }
    }
    setIsPlaying(!isPlaying);
  };

  const toggleSpeechPlay = () => {
    if (!episode || typeof window === 'undefined' || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;

    if (isPlaying) {
      synth.pause();
      setIsPlaying(false);
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
      return;
    }

    if (synth.paused && utteranceRef.current) {
      synth.resume();
      setIsPlaying(true);
      startSpeechProgressTimer();
      return;
    }

    onFirstPlay();
    if (hasFinishedListeningRef.current) {
      logEvent({ eventType: 'episode_replayed', ...getEventFields() });
    }

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(episode.script);
    utterance.rate = 1;
    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(durationRef.current);
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
      handleEpisodeEnd();
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
    };
    utteranceRef.current = utterance;
    setProgress(0);
    synth.speak(utterance);
    setIsPlaying(true);
    startSpeechProgressTimer();
  };

  // Web Speech gives no reliable cross-browser progress callback, so we
  // approximate progress against the word-count-based duration estimate.
  const startSpeechProgressTimer = () => {
    if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
    speechIntervalRef.current = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + 0.25, durationRef.current);
        progressRef.current = next;
        return next;
      });
    }, 250);
  };

  const usesBrowserSpeech = !!episode && getAudioProvider(episode) === 'browser-speech';
  const togglePlay = usesBrowserSpeech ? toggleSpeechPlay : toggleAudioPlay;

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const currentTime = audioRef.current.currentTime;
    const dur = audioRef.current.duration;
    setProgress(currentTime);
    progressRef.current = currentTime;

    if (!hasFinishedListeningRef.current && dur > 0 && currentTime / dur >= 0.9) {
      handleEpisodeEnd();
    }
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
    durationRef.current = audioRef.current.duration;
  };

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (usesBrowserSpeech) return; // seeking isn't supported for Web Speech playback
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

  if (notFound || !episode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-ink mb-4">Episode Not Found</h1>
          <Link href="/episodes" className="text-brass hover:text-brass-dark transition-colors font-display">
            Return to My Journey
          </Link>
        </div>
      </div>
    );
  }

  const empire = getEmpire(episode.empireId);
  const epoch = EPOCHS.find(e => e.id === episode.epochId);
  const isBrowserSpeech = getAudioProvider(episode) === 'browser-speech';

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
              <Link href="/episodes" className="nav-link active">My Journey</Link>
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
          <Link href="/episodes" className="hover:text-sepia transition-colors">My Journey</Link>
          <span>/</span>
          <span className="text-ink font-medium truncate">{episode.title}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 space-y-8">
        {/* Episode Header */}
        <div className="card-antiquarian overflow-hidden">
          <div className="p-8 bg-parchment-dark border-b border-brass/20">
            <div className="flex items-center gap-2 mb-4">
              <span className="tag-empire text-sm">
                {empire?.name}
              </span>
              <span className="text-sm text-sepia-light font-body">
                {episode.durationMinutes} min
              </span>
              {isBrowserSpeech && (
                <span className="text-xs text-sepia-light/70 font-body italic">
                  narrated by your device
                </span>
              )}
            </div>
            <h2 className="font-display text-3xl font-bold text-ink">{episode.title}</h2>
          </div>

          {/* Audio Player */}
          <div className="p-6 border-b border-brass/20">
            {!isBrowserSpeech && (
              <audio
                ref={audioRef}
                src={episode.audioUrl ?? undefined}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => {
                  setIsPlaying(false);
                  handleEpisodeEnd();
                }}
              />
            )}

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
                  disabled={isBrowserSpeech}
                  className="w-full h-2 bg-parchment-dark rounded-sm appearance-none cursor-pointer disabled:cursor-default"
                  style={{
                    background: `linear-gradient(to right, var(--color-brass) ${(progress / (duration || 1)) * 100}%, var(--color-parchment-dark) ${(progress / (duration || 1)) * 100}%)`,
                  }}
                />
                <div className="flex justify-between text-sm text-sepia-light font-body mt-1">
                  <span>{formatTime(progress)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Transcript */}
          <div className="p-8">
            <h3 className="font-display text-lg font-bold text-ink mb-4">Transcript</h3>
            <div className="prose prose-lg max-w-none text-sepia font-body whitespace-pre-wrap">
              {episode.script}
            </div>
          </div>
        </div>

        {/* Quiz — appears once the episode finishes; passing unlocks XP/badges.
            Items with no quiz are completed by handleEpisodeEnd instead. */}
        {showQuiz && hasQuiz(episode) && (
          <EpisodeQuiz quiz={getQuiz(episode)} onPass={handleQuizPass} onFail={handleQuizFail} />
        )}

        {/* Back link */}
        <div className="text-center">
          <Link
            href="/episodes"
            className="inline-flex items-center gap-2 text-brass hover:text-brass-dark font-display font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to My Journey
          </Link>
        </div>
      </div>

      {/* Sticky Audio Player (when audio exists and scrolled) */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-parchment border-t border-brass/20 shadow-lg p-4"
        style={{
          display: progress > 0 || isPlaying ? 'block' : 'none',
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        }}
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
    </div>
  );
}
