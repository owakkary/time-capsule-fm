'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-vintage" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-brass flex items-center justify-center mx-auto mb-6 opacity-0 animate-fade-in-up">
            <svg className="w-10 h-10 text-parchment" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="hero-title mb-6 opacity-0 animate-fade-in-up animate-stagger-1">
            Time Capsule FM
          </h1>
          <p className="hero-subtitle mb-8 max-w-3xl mx-auto opacity-0 animate-fade-in-up animate-stagger-2">
            Your personal AI-powered history podcast. Explore ancient empires and revolutionary movements
            through immersive audio episodes crafted just for you.
          </p>

          <div className="flex justify-center gap-4 mb-16 opacity-0 animate-fade-in-up animate-stagger-3">
            <Link href="/login" className="btn-primary">
              Sign In
            </Link>
            <Link href="/signup" className="btn-secondary">
              Create Account
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto opacity-0 animate-fade-in-up animate-stagger-4">
            <div className="card-antiquarian text-left">
              <div className="w-12 h-12 rounded-full bg-brass/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="font-display text-xl font-bold text-ink mb-2">Ancient World</h2>
              <p className="text-sepia-light font-body">
                Explore Egypt, Rome, Greece, and Persia through the eyes of pharaohs,
                emperors, philosophers, and warriors.
              </p>
            </div>
            <div className="card-antiquarian text-left">
              <div className="w-12 h-12 rounded-full bg-brass/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <h2 className="font-display text-xl font-bold text-ink mb-2">Revolutionary Period</h2>
              <p className="text-sepia-light font-body">
                Witness the birth of nations from America to Haiti, France to Latin America,
                through revolutionaries and monarchs.
              </p>
            </div>
          </div>

          <div className="mt-16 opacity-0 animate-fade-in-up animate-stagger-5">
            <h3 className="font-display text-lg font-semibold text-sepia mb-4 uppercase tracking-widest">Features</h3>
            <div className="flex justify-center gap-8 text-sepia-light font-body">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-brass" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                <span>AI-Generated Episodes</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span>Interactive Maps</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414-9.9m-2.828 12.728a9 9 0 010-12.728" />
                </svg>
                <span>Text-to-Speech Audio</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
