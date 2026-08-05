'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { EMPIRES, EmpireId, EPOCHS } from '@/types';
import { isContentTypeAvailable, isEmpireAvailable } from '@/lib/availability';
import { getFiguresByEmpire } from '@/lib/seed-data/figures';
import { getMomentsByEmpire } from '@/lib/seed-data/moments';
import { getPerspectivesByEmpire } from '@/lib/seed-data/perspectives';
import { getOverviewByEmpire } from '@/lib/seed-data/overviews';
import { getContentLibraryItemId } from '@/lib/content-library';
import FigureCard from '@/app/components/FigureCard';
import MomentCard from '@/app/components/MomentCard';
import PerspectiveCard from '@/app/components/PerspectiveCard';
import { AppHeader } from '@/app/components/layout';
import { useExplorerProgress } from '@/hooks/useExplorerProgress';

export default function EmpirePage({ params }: { params: { id: string } }) {
  const empireId = params.id as EmpireId;
  const { user, loading, signOut } = useAuth();
  const { profile } = useExplorerProgress(user?.uid || null);
  const router = useRouter();

  // Unavailable empires render as "not found" rather than showing episodes
  // that have no real narration behind them.
  const empire = isEmpireAvailable(empireId) ? EMPIRES.find(e => e.id === empireId) : undefined;
  const epoch = empire ? EPOCHS.find(e => e.id === empire.epochId) : null;
  // Content types with no generated episodes are hidden entirely — linking to
  // them would dead-end at "Episode Not Found".
  const figures = isContentTypeAvailable('figure') ? getFiguresByEmpire(empireId) : [];
  const moments = isContentTypeAvailable('moment') ? getMomentsByEmpire(empireId) : [];
  const perspectives = isContentTypeAvailable('perspective') ? getPerspectivesByEmpire(empireId) : [];
  const overview = getOverviewByEmpire(empireId);
  const overviewEpisodeId = getContentLibraryItemId('overview', empireId);

  // Chapters completed here, out of everything this empire offers. At Season 1
  // scale (9-10 chapters per empire) full collection is genuinely achievable,
  // which is exactly what makes showing the count worthwhile.
  const totalChapters = 1 + figures.length + moments.length + perspectives.length;
  const [completedChapters, setCompletedChapters] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCompleted() {
      if (!user || !db || !empire) return;
      try {
        const q = query(
          collection(db, 'listeningHistory'),
          where('userId', '==', user.uid),
          where('empireId', '==', empireId),
          where('completed', '==', true)
        );
        const snap = await getDocs(q);
        const ids = new Set<string>();
        snap.forEach((d) => ids.add(d.data().episodeId));
        setCompletedChapters(ids.size);
      } catch {
        // Progress display is optional; the page works without it.
      }
    }
    fetchCompleted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, empireId]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
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

  if (!empire || !epoch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-ink mb-4">Empire Not Found</h1>
          <Link href="/dashboard" className="text-brass hover:text-brass-dark transition-colors font-display">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AppHeader profile={profile} onSignOut={handleSignOut} />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-sepia-light font-body">
          <Link href="/dashboard" className="hover:text-sepia transition-colors">Dashboard</Link>
          <span>/</span>
          <Link href={`/epoch/${epoch.id}`} className="hover:text-sepia transition-colors">{epoch.name}</Link>
          <span>/</span>
          <span className="text-ink font-medium">{empire.name}</span>
        </nav>
      </div>

      {/* Empire Header */}
      <div className="bg-parchment-dark border-b border-brass/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-6 opacity-0 animate-fade-in-up">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-display font-bold text-parchment bg-brass shadow-lg">
              {empire.name.charAt(0)}
            </div>
            <div>
              <h2 className="hero-title mb-1">{empire.name}</h2>
              <p className="text-lg text-sepia font-body">{empire.years}</p>
              <p className="text-sepia-light font-body max-w-2xl mt-2">{empire.description}</p>

              {completedChapters !== null && (
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-40 h-2 bg-parchment rounded-sm overflow-hidden border border-brass/20">
                    <div
                      className="h-full bg-brass transition-[width] duration-700"
                      style={{ width: `${Math.min((completedChapters / totalChapters) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="font-display text-sm font-bold text-sepia">
                    {completedChapters >= totalChapters
                      ? `All ${totalChapters} chapters collected`
                      : `${completedChapters} of ${totalChapters} chapters`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Overview Section */}
        <section className="opacity-0 animate-fade-in-up animate-stagger-1">
          <h3 className="font-display text-2xl font-bold text-ink mb-4">Empire Overview</h3>
          <div className="card-antiquarian p-6">
            {overview && (
              <div className="mb-6">
                <h4 className="font-display font-bold text-lg text-ink mb-2">{overview.title}</h4>
                <p className="text-sepia font-body mb-4">{overview.description}</p>
                <div className="flex flex-wrap gap-2">
                  {overview.keyThemes.map((theme) => (
                    <span
                      key={theme}
                      className="px-3 py-1 bg-parchment-dark text-sepia rounded-sm text-sm font-body"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-brass/20 pt-6">
              <Link
                href={`/episode/${overviewEpisodeId}`}
                className="btn-primary inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Listening
              </Link>
            </div>
          </div>
        </section>

        {/* Key Figures Section */}
        <section className={`opacity-0 animate-fade-in-up animate-stagger-2 ${figures.length === 0 ? 'hidden' : ''}`}>
          <h3 className="font-display text-2xl font-bold text-ink mb-4">Key Figures</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {figures.map((figure) => (
              <FigureCard
                key={figure.id}
                id={figure.id}
                name={figure.name}
                empire={figure.empire}
                title={figure.title}
                years={figure.years}
                description={figure.description}
                tags={figure.tags}
              />
            ))}
          </div>
        </section>

        {/* Key Moments Section */}
        <section className={`opacity-0 animate-fade-in-up animate-stagger-3 ${moments.length === 0 ? 'hidden' : ''}`}>
          <h3 className="font-display text-2xl font-bold text-ink mb-4">Key Moments</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {moments.map((moment) => (
              <MomentCard
                key={moment.id}
                id={moment.id}
                name={moment.name}
                empire={moment.empire}
                year={moment.year}
                description={moment.description}
                tags={moment.tags}
              />
            ))}
          </div>
        </section>

        {/* Perspectives Section — hidden entirely when the content type is
            gated, so we don't advertise chapters that aren't there. */}
        <section className={`opacity-0 animate-fade-in-up animate-stagger-4 ${perspectives.length === 0 ? 'hidden' : ''}`}>
          <h3 className="font-display text-2xl font-bold text-ink mb-4">First-Person Perspectives</h3>
          <p className="text-sepia-light font-body mb-4">
            Experience history through the eyes of people who lived it. These immersive episodes put you in the shoes of different characters from {empire.name}.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {perspectives.map((perspective) => (
              <PerspectiveCard
                key={perspective.id}
                id={perspective.id}
                name={perspective.name}
                empire={perspective.empire}
                archetype={perspective.archetype}
                description={perspective.description}
                tags={perspective.tags}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
