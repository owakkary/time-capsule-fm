'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { EPOCHS, getEmpire } from '@/types';
import { getMomentById } from '@/lib/seed-data/moments';
import { getContentLibraryItemId } from '@/lib/content-library';

export default function MomentPage({ params }: { params: { id: string } }) {
  const momentId = params.id;
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const moment = getMomentById(momentId);
  const empire = moment ? getEmpire(moment.empire) : null;
  const epoch = empire ? EPOCHS.find(e => e.id === empire.epochId) : null;
  const episodeId = moment ? getContentLibraryItemId('moment', moment.empire, momentId) : null;

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

  if (!moment || !empire || !epoch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-ink mb-4">Moment Not Found</h1>
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
              <Link href="/moments" className="nav-link active">Moments</Link>
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
          <Link href={`/empire/${empire.id}`} className="hover:text-sepia transition-colors">{empire.name}</Link>
          <span>/</span>
          <span className="text-ink font-medium">Moment</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card-antiquarian overflow-hidden">
          {/* Hero Section */}
          <div className="relative p-8 bg-ink text-parchment">
            {/* Year badge */}
            <div className="absolute top-6 right-6">
              <span className="px-4 py-2 bg-brass/20 backdrop-blur-sm text-brass-light text-lg font-display rounded-sm">
                {moment.year}
              </span>
            </div>

            <div className="pr-24">
              <span className="tag-empire text-sm mb-4 inline-block">
                {empire.name}
              </span>
              <h2 className="font-display text-3xl font-bold mb-4 text-parchment">{moment.name}</h2>
              <p className="text-parchment/80 text-lg font-body">{moment.description}</p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Significance */}
            <div className="mb-8">
              <h3 className="font-display text-lg font-bold text-ink mb-3">Historical Significance</h3>
              <p className="text-sepia font-body text-lg leading-relaxed">{moment.significance}</p>
            </div>

            {/* Tags */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {moment.tags.map((tag) => (
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
                Experience the drama and significance of &quot;{moment.name}&quot; in a conversational podcast episode.
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
