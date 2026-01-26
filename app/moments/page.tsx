'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { KEY_MOMENTS } from '@/lib/seed-data/moments';
import { EPOCHS, getEmpire, EmpireId } from '@/types';
import MomentCard from '@/app/components/MomentCard';

export default function MomentsPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [selectedEpoch, setSelectedEpoch] = useState<string | null>(null);
  const [selectedEmpire, setSelectedEmpire] = useState<string | null>(null);

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

  // Filter moments based on selection
  let filteredMoments = KEY_MOMENTS;
  if (selectedEmpire) {
    filteredMoments = filteredMoments.filter(m => m.empire === selectedEmpire);
  } else if (selectedEpoch) {
    const epochEmpires = EPOCHS.find(e => e.id === selectedEpoch)?.empires || [];
    filteredMoments = filteredMoments.filter(m => (epochEmpires as readonly string[]).includes(m.empire));
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
              <Link href="/explore" className="nav-link">Explore</Link>
              <Link href="/figures" className="nav-link">Figures</Link>
              <Link href="/moments" className="nav-link active">Moments</Link>
              <Link href="/collections" className="nav-link">Collections</Link>
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
          <h2 className="hero-title mb-3">Historical Moments</h2>
          <p className="hero-subtitle text-left max-w-none">
            Discover pivotal events that shaped civilizations and generate immersive podcast episodes about them.
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
            All Moments
          </button>
          {EPOCHS.map(epoch => (
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
            {EPOCHS.find(e => e.id === selectedEpoch)?.empires.map(empireId => {
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

        {/* Moments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-0 animate-fade-in-up animate-stagger-2">
          {filteredMoments.map((moment) => (
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

        {filteredMoments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sepia-light font-body">No moments found for this selection.</p>
          </div>
        )}
      </div>
    </div>
  );
}
