'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { EPOCHS, EpochId, EmpireId, getEmpiresForEpoch } from '@/types';
import { getContentCountsForEmpire, isEmpireAvailable, isEpochAvailable } from '@/lib/availability';
import EmpireCard from '@/app/components/EmpireCard';
import { AppHeader } from '@/app/components/layout';
import { useExplorerProgress } from '@/hooks/useExplorerProgress';

export default function EpochPage({ params }: { params: { id: string } }) {
  const epochId = params.id as EpochId;
  const { user, loading, signOut } = useAuth();
  const { profile } = useExplorerProgress(user?.uid || null);
  const router = useRouter();

  // An epoch with no available empires is treated as not found, so a stale
  // link or typed URL can't reach a page listing empires we don't ship.
  const epoch = isEpochAvailable(epochId) ? EPOCHS.find(e => e.id === epochId) : undefined;
  const empires = getEmpiresForEpoch(epochId).filter(e => isEmpireAvailable(e.id));

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
      <AppHeader profile={profile} onSignOut={handleSignOut} />

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

        {/* Empire Grid. The Leaflet map that used to sit above this was
            removed: it rendered incorrectly at phone widths and drew its
            territories straight from the GeoJSON, bypassing the availability
            gate so hidden empires stayed tappable. */}
        <div className="space-y-4 opacity-0 animate-fade-in-up animate-stagger-1">
          <h3 className="font-display text-xl font-bold text-ink">
            {empires.length === 1 ? 'Empire' : 'Empires'} in {epoch.name}
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
                contentCounts={getContentCountsForEmpire(empire.id as EmpireId)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
