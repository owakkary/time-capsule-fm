'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { EMPIRES, EmpireId, EPOCHS } from '@/types';
import { getFiguresByEmpire } from '@/lib/seed-data/figures';
import { getMomentsByEmpire } from '@/lib/seed-data/moments';
import { getPerspectivesByEmpire } from '@/lib/seed-data/perspectives';
import { getOverviewByEmpire } from '@/lib/seed-data/overviews';
import { getContentLibraryItemId } from '@/lib/content-library';
import FigureCard from '@/app/components/FigureCard';
import MomentCard from '@/app/components/MomentCard';
import PerspectiveCard from '@/app/components/PerspectiveCard';

export default function EmpirePage({ params }: { params: { id: string } }) {
  const empireId = params.id as EmpireId;
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const empire = EMPIRES.find(e => e.id === empireId);
  const epoch = empire ? EPOCHS.find(e => e.id === empire.epochId) : null;
  const figures = getFiguresByEmpire(empireId);
  const moments = getMomentsByEmpire(empireId);
  const perspectives = getPerspectivesByEmpire(empireId);
  const overview = getOverviewByEmpire(empireId);
  const overviewEpisodeId = getContentLibraryItemId('overview', empireId);

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
              <Link href="/episodes" className="nav-link">My Journey</Link>
              <div className="flex items-center gap-3 pl-4 border-l border-brass/20">
                <Link href="/accolades" className="text-sm text-sepia-light hover:text-sepia transition-colors font-display">Profile</Link>
                <button onClick={handleSignOut} className="text-sm text-sepia-light hover:text-sepia transition-colors font-display">Sign Out</button>
              </div>
            </nav>
          </div>
        </div>
      </header>

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
        <section className="opacity-0 animate-fade-in-up animate-stagger-2">
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
        <section className="opacity-0 animate-fade-in-up animate-stagger-3">
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

        {/* Perspectives Section */}
        <section className="opacity-0 animate-fade-in-up animate-stagger-4">
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
