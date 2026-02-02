'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useExplorerProgress } from '@/hooks/useExplorerProgress';
import { useFavorites } from '@/hooks/useFavorites';
import { EmpireId } from '@/types';
import { getFigureById } from '@/lib/seed-data/figures';
import { getMomentById } from '@/lib/seed-data/moments';
import {
  ProfileHeader,
  BadgeGrid,
  SpecializationCard,
  PinnedBadges,
  StreakCard,
} from '@/app/components/accolades';
import { AppHeader } from '@/app/components/layout';
import FigureCard from '@/app/components/FigureCard';
import MomentCard from '@/app/components/MomentCard';

// Icon components for stats
const SparklesIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const MicIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const CheckCircleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const GlobeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BadgeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

type TabType = 'progress' | 'collections';

export default function AccoladesPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('progress');

  const {
    profile,
    empireProgress,
    epochProgress,
    badges,
    loading: progressLoading,
    error: progressError,
    toggleBadgePin,
    refreshProgress,
  } = useExplorerProgress(user?.uid || null);

  const { favorites, loading: favLoading } = useFavorites();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (authLoading || progressLoading || favLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-vintage" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Show error state if there was a problem loading
  if (progressError) {
    return (
      <div className="min-h-screen">
        <AppHeader profile={profile} onSignOut={handleSignOut} />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="text-center card-antiquarian p-8 max-w-md">
            <h2 className="font-display text-xl font-bold text-ink mb-3">Unable to load profile</h2>
            <p className="text-sepia-light font-body mb-6">{progressError}</p>
            <button
              onClick={() => refreshProgress()}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state if profile isn't loaded yet
  if (!profile) {
    return (
      <div className="min-h-screen">
        <AppHeader profile={profile} onSignOut={handleSignOut} />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="text-center">
            <div className="loading-vintage mx-auto mb-4" />
            <p className="text-sepia-light font-body">Setting up your explorer profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Get favorite items
  const favoriteFigures = favorites.figures.map(id => getFigureById(id)).filter(Boolean);
  const favoriteMoments = favorites.moments.map(id => getMomentById(id)).filter(Boolean);
  const hasNoFavorites = favoriteFigures.length === 0 && favoriteMoments.length === 0;

  return (
    <div className="min-h-screen">
      <AppHeader profile={profile} onSignOut={handleSignOut} />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero/Profile Header */}
        <div className="mb-6 opacity-0 animate-fade-in-up">
          <ProfileHeader profile={profile} />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 opacity-0 animate-fade-in-up animate-stagger-1">
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-6 py-3 font-display font-medium rounded-sm transition-all ${
              activeTab === 'progress'
                ? 'bg-brass text-parchment'
                : 'bg-parchment-dark text-sepia hover:bg-brass/20'
            }`}
          >
            Progress & Badges
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={`px-6 py-3 font-display font-medium rounded-sm transition-all flex items-center gap-2 ${
              activeTab === 'collections'
                ? 'bg-brass text-parchment'
                : 'bg-parchment-dark text-sepia hover:bg-brass/20'
            }`}
          >
            Collections
            {(favoriteFigures.length + favoriteMoments.length) > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === 'collections' ? 'bg-parchment/20' : 'bg-brass/20'
              }`}>
                {favoriteFigures.length + favoriteMoments.length}
              </span>
            )}
          </button>
        </div>

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <>
            {/* Two-column layout for desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Pinned Badges */}
                <section className="card-antiquarian opacity-0 animate-fade-in-up animate-stagger-1">
                  <PinnedBadges
                    badges={badges}
                    onTogglePin={toggleBadgePin}
                  />
                </section>

                {/* All Badges */}
                <section className="card-antiquarian opacity-0 animate-fade-in-up animate-stagger-2">
                  <BadgeGrid
                    earnedBadges={badges}
                    onTogglePin={toggleBadgePin}
                  />
                </section>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Streak Card */}
                <div className="opacity-0 animate-fade-in-up animate-stagger-1">
                  <StreakCard
                    currentStreak={profile.currentDailyStreak}
                    longestStreak={profile.longestDailyStreak}
                  />
                </div>

                {/* Stats Summary */}
                <div className="card-antiquarian opacity-0 animate-fade-in-up animate-stagger-2">
                  <h3 className="font-display text-lg font-bold text-ink mb-4">All-Time Stats</h3>
                  <div className="space-y-3">
                    <StatRow
                      label="Total XP Earned"
                      value={profile.currentXP.toLocaleString()}
                      icon={<SparklesIcon />}
                      color="text-amber-700"
                    />
                    <StatRow
                      label="Episodes Generated"
                      value={profile.totalEpisodesGenerated}
                      icon={<MicIcon />}
                      color="text-rose-800"
                    />
                    <StatRow
                      label="Episodes Completed"
                      value={profile.episodesCompleted}
                      icon={<CheckCircleIcon />}
                      color="text-emerald-800"
                    />
                    <StatRow
                      label="Listening Time"
                      value={formatListeningTime(profile.totalListeningMinutes)}
                      icon={<ClockIcon />}
                      color="text-stone-600"
                    />
                    <StatRow
                      label="Empires Explored"
                      value={empireProgress.filter(e => e.totalEpisodes > 0).length}
                      icon={<GlobeIcon />}
                      color="text-slate-600"
                    />
                    <StatRow
                      label="Badges Unlocked"
                      value={badges.filter(b => b.isUnlocked).length}
                      icon={<BadgeIcon />}
                      color="text-yellow-800"
                    />
                  </div>
                </div>

                {/* Quick Links */}
                <div className="card-antiquarian opacity-0 animate-fade-in-up animate-stagger-3">
                  <h3 className="font-display text-lg font-bold text-ink mb-4">Continue Exploring</h3>
                  <div className="space-y-2">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-3 rounded-sm bg-parchment-dark hover:bg-brass/10 transition-colors"
                    >
                      <span className="font-display text-sepia">Generate New Episode</span>
                      <span className="text-xs text-sepia-light ml-2">+25 XP</span>
                    </Link>
                    <Link
                      href="/episodes"
                      className="block px-4 py-3 rounded-sm bg-parchment-dark hover:bg-brass/10 transition-colors"
                    >
                      <span className="font-display text-sepia">Listen to Episodes</span>
                      <span className="text-xs text-sepia-light ml-2">+50 XP per complete</span>
                    </Link>
                    <Link
                      href="/figures"
                      className="block px-4 py-3 rounded-sm bg-parchment-dark hover:bg-brass/10 transition-colors"
                    >
                      <span className="font-display text-sepia">Discover Figures</span>
                      <span className="text-xs text-sepia-light ml-2">+20 XP each</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Specializations Section */}
            <section className="mt-8 card-antiquarian opacity-0 animate-fade-in-up animate-stagger-4">
              <SpecializationCard
                epochProgress={epochProgress}
                empireProgress={empireProgress}
              />
            </section>
          </>
        )}

        {/* Collections Tab */}
        {activeTab === 'collections' && (
          <div className="opacity-0 animate-fade-in-up">
            {hasNoFavorites ? (
              <div className="text-center py-16 card-antiquarian">
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
                  <div className="mb-12">
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
                  <div>
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
        )}
      </main>
    </div>
  );
}

function StatRow({
  label,
  value,
  icon,
  color = 'text-sepia-light',
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-brass/10 last:border-0">
      <div className="flex items-center gap-2">
        <span className={color}>{icon}</span>
        <span className="text-sm text-sepia-light">{label}</span>
      </div>
      <span className="font-display font-medium text-ink">{value}</span>
    </div>
  );
}

function formatListeningTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  }
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}
