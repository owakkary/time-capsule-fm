'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useEventLogger } from '@/hooks/useEventLogger';
import { useExplorerProgress } from '@/hooks/useExplorerProgress';
import { getEmpire, EPOCHS, ContentLibraryItem, EmpireId, EpochId, ContentType, ProgressUpdateResult, Recommendation } from '@/types';
import { getAudioProvider, getQuiz, hasQuiz } from '@/lib/content-library';
import { isContentTypeAvailable, isEmpireAvailable } from '@/lib/availability';
import { getContentCatalog } from '@/lib/recommendations';
import EpisodeQuiz from '@/app/components/EpisodeQuiz';
import RewardSummary from '@/app/components/RewardSummary';
import { AppHeader } from '@/app/components/layout';

// Average spoken pace used to estimate duration for browser-speech
// episodes, which have no audio file to read a real duration from.
const WORDS_PER_MINUTE = 150;

export default function EpisodePage({ params }: { params: { id: string } }) {
  const episodeId = params.id;
  const { user, loading, signOut, getIdToken } = useAuth();
  const { logEvent } = useEventLogger();
  const { profile, recordEpisodeGenerated, recordEpisodeCompleted } = useExplorerProgress(user?.uid || null);
  const router = useRouter();
  const [episode, setEpisode] = useState<ContentLibraryItem | null>(null);
  const [loadingEpisode, setLoadingEpisode] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  // Where a previous session left off, read from listeningHistory. Applied
  // once when audio metadata loads; null once consumed or dismissed.
  const [resumeFrom, setResumeFrom] = useState<number | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  // Set when the quiz is passed: what the completion earned, and what to
  // listen to next — the warmest possible moment to offer another episode.
  const [reward, setReward] = useState<ProgressUpdateResult | null>(null);
  const [upNext, setUpNext] = useState<Recommendation | null>(null);
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
          // The library holds episodes for empires and content types the UI
          // doesn't offer yet; don't play one just because someone has the
          // direct link.
          if (!isEmpireAvailable(item.empireId) || !isContentTypeAvailable(item.contentType)) {
            setNotFound(true);
            return;
          }
          setEpisode(item);

          // Pick up where the last session left off. Completed episodes
          // restart from the top — resume is for interrupted listens only.
          try {
            const historySnap = await getDoc(doc(db, 'listeningHistory', `${user.uid}_${item.id}`));
            if (historySnap.exists()) {
              const h = historySnap.data();
              if (!h.completed && typeof h.progressSeconds === 'number' && h.progressSeconds >= 30) {
                setResumeFrom(h.progressSeconds);
              }
            }
          } catch {
            // Resume is a nicety; never block playback on it.
          }
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

  // Best recommendation for "what next": the personalized engine when it has
  // enough signal, otherwise another chapter from the same empire.
  const fetchUpNext = useCallback(async () => {
    let pick: Recommendation | null = null;
    try {
      const token = await getIdToken();
      if (token) {
        const res = await fetch('/api/recommend', { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          pick = (data.recommendations ?? []).find((r: Recommendation) => r.id !== episodeId) ?? null;
        }
      }
    } catch {
      // fall through to the catalog fallback
    }

    if (!pick && episode && db) {
      const sameEmpire = getContentCatalog().filter(
        (item) => item.empire === episode.empireId && item.id !== episodeId
      );
      const fallback = sameEmpire[Math.floor(Math.random() * sameEmpire.length)];
      if (fallback) {
        try {
          const snap = await getDoc(doc(db, 'contentLibrary', fallback.id));
          if (snap.exists()) {
            pick = {
              id: fallback.id,
              empire: fallback.empire,
              epoch: fallback.epoch,
              contentType: fallback.contentType,
              contentId: fallback.contentId,
              title: snap.data().title,
              hostPitch: 'The story does not stop here — there is more in this corner of the archive.',
              reason: '',
              confidence: 0.3,
            };
          }
        } catch {
          // no up-next is fine; the back link still works
        }
      }
    }
    setUpNext(pick);
  }, [episodeId, episode, getIdToken]);

  const handleComplete = useCallback(async (completionPercentage: number) => {
    if (hasCompletedRef.current || !episode) return;
    hasCompletedRef.current = true;
    logEvent({
      eventType: 'episode_completed',
      ...getEventFields(),
      completionPercentage,
    });
    touchListeningHistory(episode, true);
    fetchUpNext();
    const result = await recordEpisodeCompleted(episode.empireId as EmpireId);
    if (result) setReward(result);
  }, [episode, recordEpisodeCompleted, touchListeningHistory, logEvent, getEventFields, fetchUpNext]);

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
      if (hasFinishedListeningRef.current) {
        logEvent({ eventType: 'episode_replayed', ...getEventFields() });
      }
    }
    // isPlaying state follows the element's onPlay/onPause events, which also
    // covers playback driven from the lock screen via Media Session.
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
    const dur = audioRef.current.duration;
    setDuration(dur);
    durationRef.current = dur;
    audioRef.current.playbackRate = playbackRate;

    // Apply the saved position, unless it's so close to the end that
    // resuming would just dump the user at the quiz.
    if (resumeFrom !== null && resumeFrom < dur * 0.9) {
      audioRef.current.currentTime = resumeFrom;
      setProgress(resumeFrom);
      progressRef.current = resumeFrom;
    }
  };

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  // Persist position every 20s while playing (and on pause via togglePlay),
  // so leaving mid-episode never costs more than ~20 seconds of progress.
  useEffect(() => {
    if (!isPlaying || !episode || hasCompletedRef.current) return;
    const interval = setInterval(() => {
      if (!hasCompletedRef.current) {
        touchListeningHistory(episode, false);
      }
    }, 20000);
    return () => clearInterval(interval);
  }, [isPlaying, episode, touchListeningHistory]);

  // Lock-screen / control-center integration. Without this the Capacitor
  // shell and mobile browsers show a blank player and drop AirPods taps.
  useEffect(() => {
    if (!episode || typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: episode.title,
      artist: 'Time Capsule FM',
      album: getEmpire(episode.empireId)?.name ?? 'Time Capsule FM',
      artwork: [{ src: `/empires/${episode.empireId}.png`, sizes: '512x512', type: 'image/png' }],
    });

    const audio = audioRef.current;
    const seekBy = (delta: number) => {
      if (!audio) return;
      audio.currentTime = Math.min(Math.max(audio.currentTime + delta, 0), audio.duration || Infinity);
    };
    navigator.mediaSession.setActionHandler('play', () => audio?.play());
    navigator.mediaSession.setActionHandler('pause', () => audio?.pause());
    navigator.mediaSession.setActionHandler('seekbackward', () => seekBy(-15));
    navigator.mediaSession.setActionHandler('seekforward', () => seekBy(15));
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (audio && details.seekTime !== undefined) audio.currentTime = details.seekTime;
    });

    return () => {
      navigator.mediaSession.metadata = null;
      for (const action of ['play', 'pause', 'seekbackward', 'seekforward', 'seekto'] as MediaSessionAction[]) {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch {
          // Older browsers throw on unknown actions; nothing to clean up there.
        }
      }
    };
  }, [episode]);

  const skipBy = (delta: number) => {
    if (!audioRef.current) return;
    const next = Math.min(Math.max(audioRef.current.currentTime + delta, 0), audioRef.current.duration || Infinity);
    audioRef.current.currentTime = next;
    setProgress(next);
    progressRef.current = next;
  };

  const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 2];
  const cyclePlaybackRate = () => {
    const next = PLAYBACK_RATES[(PLAYBACK_RATES.indexOf(playbackRate) + 1) % PLAYBACK_RATES.length];
    setPlaybackRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

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
      <AppHeader profile={profile} onSignOut={handleSignOut} />

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
                onPlay={() => {
                  // Media Session / lock-screen controls drive the element
                  // directly, so React state follows the element, not clicks.
                  setIsPlaying(true);
                  onFirstPlay();
                }}
                onPause={() => {
                  setIsPlaying(false);
                  if (hasStartedRef.current && !hasCompletedRef.current) {
                    touchListeningHistory(episode, false);
                  }
                }}
                onEnded={() => {
                  setIsPlaying(false);
                  handleEpisodeEnd();
                }}
              />
            )}

            {resumeFrom !== null && progress > 0 && progress < duration * 0.9 && !isPlaying && !hasStartedRef.current && (
              <div className="mb-4 flex items-center gap-3 text-sm font-body text-sepia">
                <span>Resuming from {formatTime(resumeFrom)}</span>
                <button
                  onClick={() => {
                    if (audioRef.current) audioRef.current.currentTime = 0;
                    setProgress(0);
                    progressRef.current = 0;
                    setResumeFrom(null);
                  }}
                  className="text-brass hover:text-brass-dark font-display transition-colors"
                >
                  Start over
                </button>
              </div>
            )}

            <div className="flex items-center gap-4">
              {!isBrowserSpeech && (
                <button
                  onClick={() => skipBy(-15)}
                  aria-label="Back 15 seconds"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sepia hover:text-ink hover:bg-parchment-dark transition-colors font-display text-xs font-bold"
                >
                  −15
                </button>
              )}

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

              {!isBrowserSpeech && (
                <button
                  onClick={() => skipBy(15)}
                  aria-label="Forward 15 seconds"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sepia hover:text-ink hover:bg-parchment-dark transition-colors font-display text-xs font-bold"
                >
                  +15
                </button>
              )}

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
                <div className="flex justify-between items-center text-sm text-sepia-light font-body mt-1">
                  <span>{formatTime(progress)}</span>
                  {!isBrowserSpeech && (
                    <button
                      onClick={cyclePlaybackRate}
                      aria-label="Playback speed"
                      className="font-display text-xs font-bold text-sepia hover:text-ink px-2 py-0.5 rounded-sm border border-brass/30 hover:border-brass transition-colors"
                    >
                      {playbackRate}×
                    </button>
                  )}
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

        {/* What the completion earned — shown the moment it lands */}
        {reward && <RewardSummary reward={reward} />}

        {/* Up next — offered while the listener is warmest */}
        {reward && upNext && (
          <div className="card-antiquarian p-6 animate-fade-in-up">
            <p className="font-display text-xs font-bold tracking-widest uppercase text-sepia-light mb-3">
              Up Next
            </p>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <div className="mb-1.5">
                  <span className="tag-empire text-xs">{getEmpire(upNext.empire)?.name ?? upNext.empire}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-ink leading-snug">{upNext.title}</h3>
                {upNext.hostPitch && (
                  <p className="font-body text-sm text-sepia-light italic mt-1.5">&ldquo;{upNext.hostPitch}&rdquo;</p>
                )}
              </div>
              <Link href={`/episode/${upNext.id}`} className="btn-primary !px-6 !py-2.5 shrink-0">
                Play
              </Link>
            </div>
          </div>
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
        // Sits above the mobile tab bar (bottom-[3.75rem]) and flush to the
        // bottom on desktop, where no tab bar exists.
        className="fixed bottom-[3.75rem] md:bottom-0 left-0 right-0 bg-parchment border-t border-brass/20 shadow-lg p-4 z-40"
        style={{
          display: progress > 0 || isPlaying ? 'block' : 'none',
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
