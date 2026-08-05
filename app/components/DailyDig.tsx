'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { collection, query, where, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ListeningHistory, QuizQuestion, XPEventType } from '@/types';
import { isEmpireAvailable } from '@/lib/availability';
import { getQuiz } from '@/lib/content-library';

interface DailyDigProps {
  userId: string;
  onComplete: (eventType: XPEventType) => Promise<unknown>;
}

const QUESTIONS_PER_DIG = 3;

// Deterministic PRNG so everyone gets the *same* three questions all day —
// refreshing the page can't reroll an easier set.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

interface DigQuestion extends QuizQuestion {
  episodeTitle: string;
}

// The daily comeback mechanic: three review questions pulled from quizzes the
// user has already passed, worth a small XP bonus that also feeds the streak.
// Zero content cost — the 5-question quizzes already sit in every episode doc.
export default function DailyDig({ userId, onComplete }: DailyDigProps) {
  const storageKey = `daily-dig-${userId}-${todayKey()}`;

  const [questions, setQuestions] = useState<DigQuestion[] | null>(null);
  const [hasCompletedEpisodes, setHasCompletedEpisodes] = useState<boolean | null>(null);
  const [doneToday, setDoneToday] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [rewarded, setRewarded] = useState(false);

  useEffect(() => {
    setDoneToday(typeof window !== 'undefined' && localStorage.getItem(storageKey) === 'done');
  }, [storageKey]);

  useEffect(() => {
    async function build() {
      if (!db) return;
      try {
        const q = query(
          collection(db, 'listeningHistory'),
          where('userId', '==', userId),
          where('completed', '==', true),
          limit(20)
        );
        const snap = await getDocs(q);
        const completed = snap.docs
          .map((d) => d.data() as ListeningHistory)
          .filter((h) => isEmpireAvailable(h.empireId));

        if (completed.length === 0) {
          setHasCompletedEpisodes(false);
          return;
        }
        setHasCompletedEpisodes(true);

        // Seed by user + date: stable all day, different tomorrow.
        let seed = 0;
        for (const ch of `${userId}-${todayKey()}`) seed = (seed * 31 + ch.charCodeAt(0)) | 0;
        const rand = mulberry32(seed);

        // Read a bounded handful of episode docs for their quiz pools.
        const pickEpisodes = [...completed]
          .sort(() => rand() - 0.5)
          .slice(0, 5);

        const pool: DigQuestion[] = [];
        for (const h of pickEpisodes) {
          const epSnap = await getDoc(doc(db, 'contentLibrary', h.episodeId));
          if (!epSnap.exists()) continue;
          const data = epSnap.data();
          for (const question of getQuiz({ quiz: data.quiz })) {
            pool.push({ ...question, episodeTitle: data.title });
          }
        }

        const picked: DigQuestion[] = [];
        const available = [...pool];
        while (picked.length < QUESTIONS_PER_DIG && available.length > 0) {
          picked.push(available.splice(Math.floor(rand() * available.length), 1)[0]);
        }
        setQuestions(picked.length > 0 ? picked : null);
      } catch {
        setHasCompletedEpisodes(false);
      }
    }
    build();
  }, [userId]);

  const current = questions?.[index];
  const shuffledOptions = useMemo(() => {
    if (!current) return null;
    // Shuffle per question so the correct answer isn't always in one slot.
    const order = current.options.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return {
      options: order.map((i) => current.options[i]),
      correctIndex: order.indexOf(current.correctIndex),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const handleSelect = (i: number) => {
    if (selected !== null || !shuffledOptions) return;
    setSelected(i);
    if (i === shuffledOptions.correctIndex) setCorrectCount((c) => c + 1);
  };

  const handleNext = async () => {
    if (!questions) return;
    if (index === questions.length - 1) {
      setFinished(true);
      localStorage.setItem(storageKey, 'done');
      // daily_activity XP (and the streak update that rides along) is the
      // whole point — award it regardless of score; showing up is the win.
      try {
        await onComplete('daily_activity');
        setRewarded(true);
      } catch {
        // XP write failed; the dig itself still counts as done today.
      }
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  // Nothing to review yet — point at the action that unlocks the feature.
  if (hasCompletedEpisodes === false) {
    return (
      <div className="card-antiquarian mb-8 opacity-0 animate-fade-in-up">
        <p className="font-display text-xs font-bold tracking-widest uppercase text-sepia-light mb-1.5">
          Daily Dig
        </p>
        <p className="font-body text-sm text-sepia">
          Complete your first chapter to unlock a daily three-question review — a quick way to bank XP and keep your streak alive.
        </p>
      </div>
    );
  }

  if (doneToday && !finished) {
    return (
      <div className="card-antiquarian mb-8 opacity-0 animate-fade-in-up">
        <p className="font-display text-xs font-bold tracking-widest uppercase text-sepia-light mb-1.5">
          Daily Dig
        </p>
        <p className="font-body text-sm text-sepia">
          Today&rsquo;s dig is done. Fresh questions arrive tomorrow — or{' '}
          <Link href="/episodes" className="text-brass hover:text-brass-dark transition-colors">
            revisit a chapter
          </Link>{' '}
          in the meantime.
        </p>
      </div>
    );
  }

  if (!questions || !current || !shuffledOptions) return null;

  if (finished) {
    return (
      <div className="card-antiquarian mb-8 text-center animate-fade-in-up">
        <p className="font-display text-xs font-bold tracking-widest uppercase text-brass mb-1.5">
          Daily Dig
        </p>
        <h3 className="font-display text-xl font-bold text-ink mb-1">
          {correctCount}/{questions.length}
          {correctCount === questions.length ? ' — the archive approves' : ' — dug up for today'}
        </h3>
        <p className="font-body text-sm text-sepia">
          {rewarded ? '+10 XP banked. ' : ''}Come back tomorrow for three more.
        </p>
      </div>
    );
  }

  return (
    <div className="card-antiquarian mb-8 opacity-0 animate-fade-in-up">
      <div className="flex items-center justify-between mb-3">
        <p className="font-display text-xs font-bold tracking-widest uppercase text-brass">
          Daily Dig · {index + 1} of {questions.length}
        </p>
        <span className="font-body text-xs text-sepia-light">from &ldquo;{current.episodeTitle}&rdquo;</span>
      </div>

      <h3 className="font-display text-lg font-bold text-ink mb-4">{current.question}</h3>

      <div className="space-y-2.5">
        {shuffledOptions.options.map((option, i) => {
          const reveal = selected !== null;
          let stateClasses = 'border-brass/20 hover:border-brass/50';
          if (reveal && i === shuffledOptions.correctIndex) {
            stateClasses = 'border-green-600 bg-green-50 text-green-900';
          } else if (reveal && selected === i) {
            stateClasses = 'border-burgundy bg-burgundy/5 text-burgundy';
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={reveal}
              className={`w-full text-left px-4 py-2.5 rounded-lg border-2 font-body text-sm text-ink transition-colors ${stateClasses} ${reveal ? 'cursor-default' : 'cursor-pointer'}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="mt-4 flex justify-end">
          <button onClick={handleNext} className="btn-primary !px-5 !py-2 text-sm">
            {index === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      )}
    </div>
  );
}
