'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExplorerProfile } from '@/types';
import { ExplorerMini } from '@/app/components/accolades';

interface AppHeaderProps {
  profile?: ExplorerProfile | null;
  onSignOut: () => void;
}

export default function AppHeader({ profile, onSignOut }: AppHeaderProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Explore' },
    { href: '/figures', label: 'Figures' },
    { href: '/moments', label: 'Moments' },
    { href: '/episodes', label: 'My Journey' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
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
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pl-4 border-l border-brass/20">
              {profile && <ExplorerMini profile={profile} />}
              <Link
                href="/accolades"
                className={`text-sm transition-colors font-display ${
                  pathname === '/accolades'
                    ? 'text-sepia font-medium'
                    : 'text-sepia-light hover:text-sepia'
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
        </div>
      </div>
    </header>
  );
}
