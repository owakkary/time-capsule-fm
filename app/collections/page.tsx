'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { KEY_FIGURES, getFigureById } from '@/lib/seed-data/figures';
import { KEY_MOMENTS, getMomentById } from '@/lib/seed-data/moments';
import { EmpireId } from '@/types';
import FigureCard from '@/app/components/FigureCard';
import MomentCard from '@/app/components/MomentCard';

export default function CollectionsPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { favorites, loading: favLoading } = useFavorites();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (authLoading || favLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-vintage" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const favoriteFigures = favorites.figures.map(id => getFigureById(id)).filter(Boolean);
  const favoriteMoments = favorites.moments.map(id => getMomentById(id)).filter(Boolean);

  const hasNoFavorites = favoriteFigures.length === 0 && favoriteMoments.length === 0;

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
              <Link href="/explore" className="nav-link">Explore</Link>
              <Link href="/figures" className="nav-link">Figures</Link>
              <Link href="/moments" className="nav-link">Moments</Link>
              <Link href="/collections" className="nav-link active">Collections</Link>
              <Link href="/episodes" className="nav-link">My Episodes</Link>
              <div className="flex items-center gap-4 pl-4 border-l border-brass/20">
                <span className="text-sm text-sepia-light font-body">{user.email}</span>
                <button onClick={handleSignOut} className="text-sm text-sepia-light hover:text-sepia transition-colors font-display">
                  Sign Out
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 opacity-0 animate-fade-in-up">
          <h2 className="hero-title mb-3">My Collections</h2>
          <p className="hero-subtitle text-left max-w-none">
            Your saved figures and moments. Click the heart icon on any figure or moment to add it here.
          </p>
        </div>

        {hasNoFavorites ? (
          <div className="text-center py-16 card-antiquarian opacity-0 animate-fade-in-up animate-stagger-1">
            <h3 className="font-display text-2xl font-bold text-ink mb-3">No favorites yet</h3>
            <p className="text-sepia-light font-body mb-8 max-w-md mx-auto">
              Start exploring and click the heart icon to save figures and moments to your collection.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/figures" className="btn-secondary">
                Browse Figures
              </Link>
              <Link href="/moments" className="btn-secondary">
                Browse Moments
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Favorite Figures */}
            {favoriteFigures.length > 0 && (
              <div className="mb-12 opacity-0 animate-fade-in-up animate-stagger-1">
                <h3 className="font-display text-2xl font-bold text-ink mb-6 flex items-center gap-3">
                  Saved Figures
                  <span className="text-sm font-normal text-sepia-light">({favoriteFigures.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteFigures.map((figure) => figure && (
                    <FigureCard
                      key={figure.id}
                      id={figure.id}
                      name={figure.name}
                      empire={figure.empire as EmpireId}
                      title={figure.title}
                      years={figure.years}
                      description={figure.description}
                      tags={figure.tags}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Favorite Moments */}
            {favoriteMoments.length > 0 && (
              <div className="opacity-0 animate-fade-in-up animate-stagger-2">
                <h3 className="font-display text-2xl font-bold text-ink mb-6 flex items-center gap-3">
                  Saved Moments
                  <span className="text-sm font-normal text-sepia-light">({favoriteMoments.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteMoments.map((moment) => moment && (
                    <MomentCard
                      key={moment.id}
                      id={moment.id}
                      name={moment.name}
                      empire={moment.empire as EmpireId}
                      year={moment.year}
                      description={moment.description}
                      tags={moment.tags}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
