'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExplorerProfile } from '@/types';
import { ExplorerMini } from '@/app/components/accolades';

interface AppHeaderProps {
  profile?: ExplorerProfile | null;
  onSignOut: () => void;
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Explore' },
  { href: '/figures', label: 'Figures' },
  { href: '/moments', label: 'Moments' },
  { href: '/episodes', label: 'Journey' },
  { href: '/accolades', label: 'Profile' },
];

// Icons for the mobile tab bar. Kept inline (no icon dependency) and sized
// to the 24px grid the rest of the app uses.
function NavIcon({ href, className }: { href: string; className: string }) {
  switch (href) {
    case '/dashboard':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      );
    case '/figures':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    case '/moments':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case '/episodes':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m-4 0h8m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z" />
        </svg>
      );
    default:
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
  }
}

function StreakBadge({ streak }: { streak: number }) {
  return (
    <span
      className="flex items-center gap-1 text-sm font-display font-bold text-brass"
      title={`${streak}-day streak — listen or do the Daily Dig to keep it`}
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.5 0.67s0.74 2.65 0.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l0.03-0.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5 0.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-0.36 3.6-1.21 4.62-2.58 0.39 1.29 0.59 2.65 0.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
      </svg>
      {streak}
    </span>
  );
}

export default function AppHeader({ profile, onSignOut }: AppHeaderProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top bar. On phones this carries only identity + status; navigation
          lives in the bottom tab bar, which is what kept the old single-row
          nav from overflowing a 390px screen by ~240px. */}
      <header className="bg-parchment/80 backdrop-blur-sm border-b border-brass/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <Link href="/dashboard" className="flex items-center gap-2 sm:gap-3 group min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brass flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-parchment" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="font-display text-lg sm:text-2xl font-bold text-ink group-hover:text-sepia transition-colors truncate">
                Time Capsule FM
              </h1>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {NAV_ITEMS.filter(i => i.href !== '/accolades').map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                >
                  {item.label === 'Journey' ? 'My Journey' : item.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 pl-4 border-l border-brass/20">
                {profile && profile.currentDailyStreak > 0 && (
                  <StreakBadge streak={profile.currentDailyStreak} />
                )}
                {profile && <ExplorerMini profile={profile} />}
                <Link
                  href="/accolades"
                  className={`text-sm transition-colors font-display ${
                    pathname === '/accolades' ? 'text-sepia font-medium' : 'text-sepia-light hover:text-sepia'
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={onSignOut}
                  className="text-sm text-sepia-light hover:text-sepia transition-colors font-display"
                >
                  Sign Out
                </button>
              </div>
            </nav>

            {/* Mobile: status only — streak and level, no nav links */}
            <div className="flex md:hidden items-center gap-2.5 shrink-0">
              {profile && profile.currentDailyStreak > 0 && (
                <StreakBadge streak={profile.currentDailyStreak} />
              )}
              {profile && <ExplorerMini profile={profile} />}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar — the native-app pattern, and the reason the
          top bar can stay narrow. Sits above the home indicator via
          safe-area inset. */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-parchment/95 backdrop-blur-sm border-t border-brass/20 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-stretch justify-around">
          {NAV_ITEMS.map(item => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors ${
                  active ? 'text-brass' : 'text-sepia-light hover:text-sepia'
                }`}
              >
                <NavIcon href={item.href} className="w-5 h-5" />
                <span className="font-display text-[10px] font-medium leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
