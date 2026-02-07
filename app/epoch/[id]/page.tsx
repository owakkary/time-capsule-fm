'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { EPOCHS, EpochId, EmpireId, getEmpiresForEpoch } from '@/types';
import InteractiveMap from '@/app/components/InteractiveMap';
import EmpireCard from '@/app/components/EmpireCard';

export default function EpochPage({ params }: { params: { id: string } }) {
  const epochId = params.id as EpochId;
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [selectedEmpire, setSelectedEmpire] = useState<EmpireId | null>(null);

  const epoch = EPOCHS.find(e => e.id === epochId);
  const empires = getEmpiresForEpoch(epochId);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const handleSelectEmpire = (empireId: EmpireId) => {
    setSelectedEmpire(empireId);
    router.push(`/empire/${empireId}`);
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

  if (!epoch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-ink mb-4">Epoch Not Found</h1>
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
              <Link href="/moments" className="nav-link">Moments</Link>
              <Link href="/episodes" className="nav-link">My Episodes</Link>
              <div className="flex items-center gap-3 pl-4 border-l border-brass/20">
                <Link href="/accolades" className="text-sm text-sepia-light hover:text-sepia transition-colors font-display">Profile</Link>
                <button onClick={handleSignOut} className="text-sm text-sepia-light hover:text-sepia transition-colors font-display">
                  Sign Out
                </button>
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
          <span className="text-ink font-medium">{epoch.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Epoch Header */}
        <div className="mb-8 opacity-0 animate-fade-in-up">
          <h2 className="hero-title mb-2">{epoch.name}</h2>
          <p className="text-lg text-sepia font-body mb-2">{epoch.years}</p>
          <p className="text-sepia-light font-body max-w-3xl">{epoch.description}</p>
        </div>

        {/* Interactive Map */}
        <div className="card-antiquarian p-6 mb-8 opacity-0 animate-fade-in-up animate-stagger-1">
          <h3 className="font-display text-xl font-bold text-ink mb-4">
            Select an Empire
          </h3>
          <InteractiveMap
            epochId={epochId}
            selectedEmpire={selectedEmpire}
            onSelectEmpire={handleSelectEmpire}
          />
        </div>

        {/* Empire Grid */}
        <div className="space-y-4 opacity-0 animate-fade-in-up animate-stagger-2">
          <h3 className="font-display text-xl font-bold text-ink">
            All Empires in {epoch.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {empires.map((empire) => (
              <EmpireCard
                key={empire.id}
                id={empire.id as EmpireId}
                name={empire.name}
                emoji={empire.emoji}
                years={empire.years}
                color={empire.color}
                description={empire.description}
                contentCounts={{
                  figures: 2,
                  moments: 3,
                  perspectives: 3,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
