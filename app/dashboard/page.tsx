'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useExplorerProgress } from '@/hooks/useExplorerProgress';
import { EmpireId, EpochId } from '@/types';
import {
  getAvailableEmpiresForEpoch,
  getAvailableEpochs,
  getContentCountsForEmpire,
  SEASON,
} from '@/lib/availability';
import EpochCard from '@/app/components/EpochCard';
import EmpireCard from '@/app/components/EmpireCard';
import { ExplorerCard } from '@/app/components/accolades';
import { AppHeader } from '@/app/components/layout';
import PersonalizedHome from '@/app/components/PersonalizedHome';
import ContinueListening from '@/app/components/ContinueListening';
import DailyDig from '@/app/components/DailyDig';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [selectedEpoch, setSelectedEpoch] = useState<EpochId | null>(null);

  // Only epochs that still contain an available empire are offered.
  const visibleEpochs = getAvailableEpochs();

  // Explorer progression
  const {
    profile,
    badges,
    loading: progressLoading,
    awardXP,
  } = useExplorerProgress(user?.uid || null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const handleSelectEpoch = (epochId: EpochId) => {
    setSelectedEpoch(selectedEpoch === epochId ? null : epochId);
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
      <AppHeader profile={profile} onSignOut={handleSignOut} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Explorer Card - show when no epoch selected */}
        {!selectedEpoch && profile && !progressLoading && (
          <div className="mb-8 opacity-0 animate-fade-in-up">
            <ExplorerCard
              profile={profile}
              badges={badges}
              variant="full"
            />
          </div>
        )}

        {/* The comeback loop: resume what was interrupted, then the daily
            review — both above the fold, before any browsing UI */}
        {!selectedEpoch && user && (
          <>
            <ContinueListening userId={user.uid} />
            <DailyDig userId={user.uid} onComplete={awardXP} />
          </>
        )}

        {/* Personalized Recommendations - show when no epoch selected */}
        {!selectedEpoch && <PersonalizedHome />}

        {/* Hero - always visible but compact when map is shown */}
        <div className={`text-center mb-8 opacity-0 animate-fade-in-up transition-all duration-500 ${selectedEpoch ? 'mb-6' : 'mb-8'}`}>
          {!selectedEpoch && (
            <p className="font-display text-xs font-bold tracking-widest uppercase text-brass mb-2">
              Season {SEASON.number} · {SEASON.title}
            </p>
          )}
          <h2 className={`font-display font-bold text-ink tracking-tight transition-all duration-500 ${selectedEpoch ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl'}`}>
            Your Personal History Journey
          </h2>
          {!selectedEpoch && (
            <p className="text-lg text-sepia-light text-balance mt-3 max-w-2xl mx-auto">
              Pick an epoch, explore the map, and step into a curated chapter of history.
            </p>
          )}
        </div>

        {/* Epoch Selector - Compact when map is visible, full cards when not */}
        <div className={`transition-all duration-500 ease-in-out ${selectedEpoch ? 'mb-6' : 'mb-0'}`}>
          {selectedEpoch ? (
            // Compact epoch selector - 2x2 grid for 4 eras
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto opacity-0 animate-fade-in-up">
              {visibleEpochs.map((epoch) => (
                <div key={epoch.id}>
                  <EpochCard
                    id={epoch.id}
                    name={epoch.name}
                    years={epoch.years}
                    description={epoch.description}
                    color={epoch.color}
                    variant="compact"
                    isSelected={selectedEpoch === epoch.id}
                    onClick={() => handleSelectEpoch(epoch.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            // Full epoch cards
            <>
              {/* Ornate Divider */}
              <div className="divider-ornate opacity-0 animate-fade-in-up animate-stagger-1">
                <span className="divider-ornate-icon">&#9674;</span>
              </div>

              {/* Epoch Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {visibleEpochs.map((epoch, index) => (
                  <div
                    key={epoch.id}
                    className="opacity-0 animate-fade-in-up"
                    style={{ animationDelay: `${0.2 + index * 0.15}s` }}
                  >
                    <EpochCard
                      id={epoch.id}
                      name={epoch.name}
                      years={epoch.years}
                      description={epoch.description}
                      color={epoch.color}
                      variant="full"
                      onClick={() => handleSelectEpoch(epoch.id)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Empires of the selected epoch. This replaced the Leaflet map,
            which rendered incorrectly at phone widths and drew territories
            straight from the GeoJSON — bypassing the availability gate and
            leaving hidden empires tappable. */}
        {selectedEpoch && (
          <div className="opacity-0 animate-fade-in-up">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sepia-light font-body text-sm">
                Choose a civilization to explore
              </p>
              <button
                onClick={() => setSelectedEpoch(null)}
                className="text-sm text-sepia-light hover:text-sepia font-display flex items-center gap-1 transition-colors shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Epochs
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getAvailableEmpiresForEpoch(selectedEpoch).map((empire) => (
                <EmpireCard
                  key={empire.id}
                  id={empire.id as EmpireId}
                  name={empire.name}
                  emoji={empire.emoji}
                  years={empire.years}
                  color={empire.color}
                  description={empire.description}
                  contentCounts={getContentCountsForEmpire(empire.id as EmpireId)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
