'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { EMPIRES, EPOCHS, DURATIONS, getEmpire } from '@/types';
import { getPerspectiveById } from '@/lib/seed-data/perspectives';

export default function PerspectivePage({ params }: { params: { id: string } }) {
  const perspectiveId = params.id;
  const { user, loading, signOut, getIdToken } = useAuth();
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(10);

  const perspective = getPerspectiveById(perspectiveId);
  const empire = perspective ? getEmpire(perspective.empire) : null;
  const epoch = empire ? EPOCHS.find(e => e.id === empire.epochId) : null;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const handleGenerate = async () => {
    if (!perspective || generating) return;

    setGenerating(true);
    try {
      const token = await getIdToken();
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          empire: perspective.empire,
          contentType: 'perspective',
          contentId: perspectiveId,
          durationMinutes: selectedDuration,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate');
      }

      const data = await response.json();
      router.push(`/episode/${data.id}`);
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate episode. Please try again.');
    } finally {
      setGenerating(false);
    }
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
          <Link href="/explore" className="text-brass hover:text-brass-dark transition-colors font-display">
            Return to Explore
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
            <nav className="flex items-center gap-8">
              <Link href="/explore" className="nav-link active">Explore</Link>
              <Link href="/figures" className="nav-link">Figures</Link>
              <Link href="/moments" className="nav-link">Moments</Link>
              <Link href="/collections" className="nav-link">Collections</Link>
              <Link href="/episodes" className="nav-link">My Episodes</Link>
              <div className="flex items-center gap-4 pl-4 border-l border-brass/20">
                <span className="text-sm text-sepia-light font-body">{user.email}</span>
                <button onClick={handleSignOut} className="text-sm text-sepia-light hover:text-sepia transition-colors font-display">Sign Out</button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-sepia-light font-body">
          <Link href="/explore" className="hover:text-sepia transition-colors">Explore</Link>
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
                  <span className="tag-empire text-sm">
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

            {/* Generate Section */}
            <div className="border-t border-brass/20 pt-8">
              <h3 className="font-display text-lg font-bold text-ink mb-4">Generate Episode</h3>
              <p className="text-sepia-light font-body mb-4">
                Choose your episode length and step into history.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Duration selector */}
                <div className="flex gap-2">
                  {DURATIONS.map((d) => (
                    <button
                      key={d.minutes}
                      onClick={() => setSelectedDuration(d.minutes)}
                      className={`px-4 py-2 rounded-sm text-sm font-display font-medium transition-all ${
                        selectedDuration === d.minutes
                          ? 'bg-brass text-parchment'
                          : 'bg-parchment-dark text-sepia hover:bg-brass/20'
                      }`}
                    >
                      {d.label}
                      <span className="block text-xs opacity-75">{d.description}</span>
                    </button>
                  ))}
                </div>

                {/* Generate button */}
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <>
                      <div className="loading-vintage w-5 h-5" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Generate First-Person Episode
                    </>
                  )}
                </button>
              </div>
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
