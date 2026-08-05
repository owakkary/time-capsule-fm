'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// One real episode, playable before any account exists. contentLibrary is
// public-read, so this works for anonymous visitors — the product proves
// itself before the signup ask. The CTA appears once they're most of the
// way through.
const DEMO_EPISODE_ID = 'overview-ancient-egypt';

export default function DemoPlayer() {
  const [title, setTitle] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [nearEnd, setNearEnd] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    async function fetchDemo() {
      if (!db) return;
      try {
        const snap = await getDoc(doc(db, 'contentLibrary', DEMO_EPISODE_ID));
        if (snap.exists() && snap.data().audioUrl) {
          setTitle(snap.data().title);
          setAudioUrl(snap.data().audioUrl);
        }
      } catch {
        // No demo is a degraded landing page, not a broken one.
      }
    }
    fetchDemo();
  }, []);

  if (!audioUrl) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card-antiquarian max-w-xl mx-auto text-left">
      <audio
        ref={audioRef}
        src={audioUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => {
          const el = audioRef.current;
          if (!el) return;
          setProgress(el.currentTime);
          if (el.duration > 0 && el.currentTime / el.duration >= 0.85) setNearEnd(true);
        }}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onEnded={() => setIsPlaying(false)}
      />

      <p className="font-display text-xs font-bold tracking-widest uppercase text-brass mb-2">
        Hear a chapter — no account needed
      </p>
      <h3 className="font-display text-lg font-bold text-ink mb-4">{title}</h3>

      <div className="flex items-center gap-4">
        <button
          onClick={() => (isPlaying ? audioRef.current?.pause() : audioRef.current?.play())}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="w-12 h-12 rounded-full flex items-center justify-center text-parchment bg-brass shadow-lg hover:bg-brass-dark transition-colors shrink-0"
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
          <div className="w-full h-2 bg-parchment-dark rounded-sm overflow-hidden">
            <div
              className="h-full bg-brass transition-[width]"
              style={{ width: duration > 0 ? `${(progress / duration) * 100}%` : '0%' }}
            />
          </div>
          <div className="flex justify-between text-xs text-sepia-light font-body mt-1">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {nearEnd && (
        <div className="mt-4 pt-4 border-t border-brass/20 text-center animate-fade-in-up">
          <p className="font-body text-sm text-sepia mb-3">
            26 more chapters are waiting in Season 1.
          </p>
          <Link href="/signup" className="btn-primary !px-6 !py-2.5">
            Create a Free Account
          </Link>
        </div>
      )}
    </div>
  );
}
