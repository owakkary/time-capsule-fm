'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { EPOCHS, EpochId } from '@/types';
import EpochCard from '@/app/components/EpochCard';
import HistoricalMap from '@/app/components/HistoricalMap';

export default function ExplorePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [selectedEpoch, setSelectedEpoch] = useState<EpochId | null>(null);

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
              <Link href="/explore" className="nav-link active">
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
                <span className="text-sm text-sepia-light font-body">{user.email}</span>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero - always visible but can be more compact when map is shown */}
        <div className={`text-center mb-8 opacity-0 animate-fade-in-up transition-all duration-500 ${selectedEpoch ? 'mb-6' : 'mb-12 py-8'}`}>
          <h2 className={`font-display font-bold text-ink tracking-tight transition-all duration-500 ${selectedEpoch ? 'text-3xl md:text-4xl' : 'hero-title'}`}>
            Explore History
          </h2>
          {!selectedEpoch && (
            <p className="hero-subtitle text-balance mt-4">
              Journey through two pivotal epochs of human civilization.
              Select an era to discover empires, key figures, defining moments, and unique perspectives.
            </p>
          )}
        </div>

        {/* Epoch Selector - Compact when map is visible, full cards when not */}
        <div className={`transition-all duration-500 ease-in-out ${selectedEpoch ? 'mb-6' : 'mb-0'}`}>
          {selectedEpoch ? (
            // Compact epoch selector
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto opacity-0 animate-fade-in-up">
              {EPOCHS.map((epoch) => (
                <div key={epoch.id} className="flex-1">
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
                {EPOCHS.map((epoch, index) => (
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

        {/* Historical Map - Shows when epoch is selected */}
        {selectedEpoch && (
          <div className="opacity-0 animate-fade-in-up animate-map-reveal">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sepia-light font-body text-sm">
                Click on a territory to explore that civilization
              </p>
              <button
                onClick={() => setSelectedEpoch(null)}
                className="text-sm text-sepia-light hover:text-sepia font-display flex items-center gap-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close Map
              </button>
            </div>
            <HistoricalMap epochId={selectedEpoch} />
          </div>
        )}
      </div>
    </div>
  );
}
