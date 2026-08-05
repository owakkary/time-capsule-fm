'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { EPOCHS, getEmpire } from '@/types';
import { getPerspectiveById } from '@/lib/seed-data/perspectives';
import { getContentLibraryItemId } from '@/lib/content-library';
import { isContentTypeAvailable, isEmpireAvailable } from '@/lib/availability';
import { AppHeader } from '@/app/components/layout';
import { useExplorerProgress } from '@/hooks/useExplorerProgress';

export default function PerspectivePage({ params }: { params: { id: string } }) {
  const perspectiveId = params.id;
  const { user, loading, signOut } = useAuth();
  const { profile } = useExplorerProgress(user?.uid || null);
  const router = useRouter();

  // Resolves to "not found" when the perspective belongs to a hidden empire,
  // so a direct link can't reach content the rest of the UI doesn't offer.
  const perspectiveRecord = getPerspectiveById(perspectiveId);
  const perspective =
    perspectiveRecord &&
    isEmpireAvailable(perspectiveRecord.empire) &&
    isContentTypeAvailable('perspective')
      ? perspectiveRecord
      : undefined;
  const empire = perspective ? getEmpire(perspective.empire) : null;
  const epoch = empire ? EPOCHS.find(e => e.id === empire.epochId) : null;
  const episodeId = perspective ? getContentLibraryItemId('perspective', perspective.empire, perspectiveId) : null;

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

  if (!perspective || !empire || !epoch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-ink mb-4">Perspective Not Found</h1>
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
          <span className="text-ink font-medium">Perspective</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Perspective Header */}
        <div className="card-antiquarian overflow-hidden">
          {/* Hero Section */}
          <div className="bg-ink p-8 text-parchment">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-brass/20 backdrop-blur-sm flex items-center justify-center text-4xl font-display font-bold text-brass-light">
                {perspective.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-brass/20 rounded-sm text-sm font-display font-medium text-brass-light">
                    {perspective.archetype}
                  </span>
                  <span className="px-3 py-1 bg-brass/20 rounded-sm text-sm font-display font-medium text-brass-light">
                    {empire.name}
                  </span>
                </div>
                <h2 className="font-display text-3xl font-bold mb-2 text-parchment">{perspective.name}</h2>
                <p className="text-parchment/80 text-lg font-body">{perspective.description}</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* What to expect */}
            <div className="mb-8">
              <h3 className="font-display text-lg font-bold text-ink mb-3">What to Expect</h3>
              <p className="text-sepia font-body mb-4">
                This is an immersive first-person narrative episode. You&apos;ll experience history through the eyes of
                someone who lived it—their daily routines, their hopes and fears, their view of the world around them.
              </p>
              <div className="flex flex-wrap gap-2">
                {perspective.tags.map((tag) => (
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
                Step into history through their eyes.
              </p>

              <Link
                href={`/episode/${episodeId}`}
                className="btn-primary inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Step Into Their Story
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
