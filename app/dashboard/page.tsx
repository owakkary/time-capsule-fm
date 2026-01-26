'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import EpisodeGenerator from '@/app/components/EpisodeGenerator';
import Link from 'next/link';
import { EPOCHS } from '@/types';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleEpisodeGenerated = (episodeId: string) => {
    router.push(`/episode/${episodeId}`);
  };

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
              <Link href="/explore" className="nav-link">
                Explore
              </Link>
              <Link href="/figures" className="nav-link">
                Figures
              </Link>
              <Link href="/moments" className="nav-link">
                Moments
              </Link>
              <Link href="/collections" className="nav-link">
                Collections
              </Link>
              <Link href="/episodes" className="nav-link">
                My Episodes
              </Link>
              <div className="flex items-center gap-4 pl-4 border-l border-brass/20">
                <span className="text-sm text-sepia-light font-body">
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-sepia-light hover:text-sepia transition-colors font-display"
                >
                  Sign Out
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 opacity-0 animate-fade-in-up">
          <h2 className="hero-title mb-6">
            Your Personal History Podcast
          </h2>
          <p className="hero-subtitle text-balance">
            Pick an empire, choose your length, and receive a casual, witty podcast episode
            crafted just for you by AI.
          </p>
        </div>

        {/* Ornate Divider */}
        <div className="divider-ornate opacity-0 animate-fade-in-up animate-stagger-1">
          <span className="divider-ornate-icon">&#9674;</span>
        </div>

        {/* Quick Access Epochs */}
        <div className="mb-12 opacity-0 animate-fade-in-up animate-stagger-2">
          <h3 className="font-display text-lg font-semibold text-sepia mb-6 text-center uppercase tracking-widest">
            Explore by Era
          </h3>
          <div className="flex justify-center gap-4 flex-wrap">
            {EPOCHS.map((epoch) => (
              <Link
                key={epoch.id}
                href={`/epoch/${epoch.id}`}
                className="group flex items-center gap-3 px-5 py-3 card-antiquarian"
              >
                <span className="font-display font-semibold text-sepia group-hover:text-ink transition-colors">
                  {epoch.name}
                </span>
                <span className="text-sm text-sepia-light">
                  ({epoch.empires.length} empires)
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Episode Generator Card */}
        <div className="card-antiquarian p-8 md:p-12 mb-12 opacity-0 animate-fade-in-up animate-stagger-3">
          <EpisodeGenerator onEpisodeGenerated={handleEpisodeGenerated} />
        </div>

        {/* Quick Links */}
        <div className="flex justify-center gap-8 opacity-0 animate-fade-in-up animate-stagger-4">
          <Link
            href="/explore"
            className="group inline-flex items-center gap-3 text-sepia hover:text-brass font-display font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Explore Interactive Maps
          </Link>
          <Link
            href="/episodes"
            className="group inline-flex items-center gap-3 text-sepia hover:text-brass font-display font-medium transition-colors"
          >
            View All Episodes
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-all"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
