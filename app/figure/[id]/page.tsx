'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { EPOCHS, getEmpire } from '@/types';
import { getFigureById } from '@/lib/seed-data/figures';
import { getContentLibraryItemId } from '@/lib/content-library';
import { isEmpireAvailable } from '@/lib/availability';
import { AppHeader } from '@/app/components/layout';
import { useExplorerProgress } from '@/hooks/useExplorerProgress';

export default function FigurePage({ params }: { params: { id: string } }) {
  const figureId = params.id;
  const { user, loading, signOut } = useAuth();
  const { profile } = useExplorerProgress(user?.uid || null);
  const router = useRouter();

  // Resolves to "not found" when the figure belongs to a hidden empire, so a
  // direct link can't reach content the rest of the UI doesn't offer.
  const figureRecord = getFigureById(figureId);
  const figure = figureRecord && isEmpireAvailable(figureRecord.empire) ? figureRecord : undefined;
  const empire = figure ? getEmpire(figure.empire) : null;
  const epoch = empire ? EPOCHS.find(e => e.id === empire.epochId) : null;
  const episodeId = figure ? getContentLibraryItemId('figure', figure.empire, figureId) : null;

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

  if (!figure || !empire || !epoch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-ink mb-4">Figure Not Found</h1>
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
          <Link href={`/empire/${empire.id}`} className="hover:text-sepia transition-colors">{empire.name}</Link>
          <span>/</span>
          <span className="text-ink font-medium">{figure.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card-antiquarian overflow-hidden">
          {/* Hero Section */}
          <div className="p-8 bg-parchment-dark border-b border-brass/20">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-display font-bold text-parchment bg-brass shadow-lg">
                {figure.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="tag-empire text-sm">
                    {empire.name}
                  </span>
                </div>
                <h2 className="font-display text-3xl font-bold text-ink mb-1">{figure.name}</h2>
                <p className="text-lg text-sepia font-body">{figure.title}</p>
                <p className="text-sepia-light font-body">{figure.years}</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Description */}
            <div className="mb-8">
              <h3 className="font-display text-lg font-bold text-ink mb-3">About</h3>
              <p className="text-sepia font-body text-lg leading-relaxed">{figure.description}</p>
            </div>

            {/* Significance */}
            <div className="mb-8">
              <h3 className="font-display text-lg font-bold text-ink mb-3">Historical Significance</h3>
              <p className="text-sepia font-body">{figure.significance}</p>
            </div>

            {/* Tags */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {figure.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-parchment-dark text-sepia rounded-sm text-sm font-body"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Listen Section */}
            <div className="border-t border-brass/20 pt-8">
              <h3 className="font-display text-lg font-bold text-ink mb-4">This Chapter</h3>
              <p className="text-sepia-light font-body mb-4">
                Learn about {figure.name}&apos;s life, accomplishments, and legacy in a conversational podcast episode.
              </p>

              <Link
                href={`/episode/${episodeId}`}
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
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            href={`/empire/${empire.id}`}
            className="inline-flex items-center gap-2 text-brass hover:text-brass-dark font-display font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {empire.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
