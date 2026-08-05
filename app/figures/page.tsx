'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useExplorerProgress } from '@/hooks/useExplorerProgress';
import { KEY_FIGURES } from '@/lib/seed-data/figures';
import { EPOCHS, getEmpire, EmpireId } from '@/types';
import { filterByAvailableEmpire, getAvailableEpochs, isEmpireAvailable } from '@/lib/availability';
import FigureCard from '@/app/components/FigureCard';
import { AppHeader } from '@/app/components/layout';

export default function FiguresPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [selectedEpoch, setSelectedEpoch] = useState<string | null>(null);
  const [selectedEmpire, setSelectedEmpire] = useState<string | null>(null);

  const { profile } = useExplorerProgress(user?.uid || null);

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

  // Filter figures based on selection
  let filteredFigures = filterByAvailableEmpire(KEY_FIGURES);
  if (selectedEmpire) {
    filteredFigures = filteredFigures.filter(f => f.empire === selectedEmpire);
  } else if (selectedEpoch) {
    const epochEmpires = EPOCHS.find(e => e.id === selectedEpoch)?.empires || [];
    filteredFigures = filteredFigures.filter(f => (epochEmpires as readonly string[]).includes(f.empire));
  }

  return (
    <div className="min-h-screen">
      <AppHeader profile={profile} onSignOut={handleSignOut} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 opacity-0 animate-fade-in-up">
          <h2 className="hero-title mb-3">Historical Figures</h2>
          <p className="hero-subtitle text-left max-w-none">
            Explore the lives of history's most influential people.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-3 opacity-0 animate-fade-in-up animate-stagger-1">
          <button
            onClick={() => { setSelectedEpoch(null); setSelectedEmpire(null); }}
            className={`px-4 py-2 rounded-sm text-sm font-display font-medium transition-all ${
              !selectedEpoch && !selectedEmpire
                ? 'bg-brass text-parchment'
                : 'bg-parchment border border-brass/30 text-sepia hover:border-brass'
            }`}
          >
            All Figures
          </button>
          {getAvailableEpochs().map(epoch => (
            <button
              key={epoch.id}
              onClick={() => { setSelectedEpoch(epoch.id); setSelectedEmpire(null); }}
              className={`px-4 py-2 rounded-sm text-sm font-display font-medium transition-all ${
                selectedEpoch === epoch.id
                  ? 'bg-brass text-parchment'
                  : 'bg-parchment border border-brass/30 text-sepia hover:border-brass'
              }`}
            >
              {epoch.name}
            </button>
          ))}
        </div>

        {/* Empire sub-filters */}
        {selectedEpoch && (
          <div className="mb-8 flex flex-wrap gap-2 opacity-0 animate-fade-in-up">
            {EPOCHS.find(e => e.id === selectedEpoch)?.empires.filter(isEmpireAvailable).map(empireId => {
              const empire = getEmpire(empireId);
              return empire ? (
                <button
                  key={empireId}
                  onClick={() => setSelectedEmpire(selectedEmpire === empireId ? null : empireId)}
                  className={`px-3 py-1.5 rounded-sm text-sm font-display font-medium transition-all ${
                    selectedEmpire === empireId
                      ? 'bg-brass text-parchment'
                      : 'bg-parchment border border-brass/30 text-sepia hover:border-brass'
                  }`}
                >
                  {empire.name}
                </button>
              ) : null;
            })}
          </div>
        )}

        {/* Figures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-0 animate-fade-in-up animate-stagger-2">
          {filteredFigures.map((figure) => (
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

        {filteredFigures.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sepia-light font-body">No figures found for this selection.</p>
          </div>
        )}
      </div>
    </div>
  );
}
