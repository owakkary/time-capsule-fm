'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEventLogger } from '@/hooks/useEventLogger';
import type { Recommendation, RecommendationResponse } from '@/types';
import RecommendationCard from './RecommendationCard';

export default function PersonalizedHome() {
  const { getIdToken } = useAuth();
  const { logEvent } = useEventLogger();
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;

    async function fetchRecommendations() {
      try {
        const token = await getIdToken();
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch('/api/recommend', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setLoading(false);
          setError(true);
          return;
        }

        const json: RecommendationResponse = await res.json();
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchRecommendations();
    return () => { cancelled = true; };
  }, [getIdToken]);

  if (loading || error || !data) return null;
  if (data.isNewUser || data.recommendations.length === 0) return null;

  const visibleRecs = data.recommendations.filter(r => !dismissed.has(r.id));
  if (visibleRecs.length === 0) return null;

  const handleGenerate = (rec: Recommendation) => {
    logEvent({
      eventType: 'recommendation_clicked',
      empire: rec.empire,
      epoch: rec.epoch,
      contentType: rec.contentType,
      contentId: rec.contentId,
      recommendationId: rec.id,
    });
    // Navigate to the empire page where the user can generate
    window.location.href = `/empire/${rec.empire}`;
  };

  const handleSkip = (rec: Recommendation) => {
    logEvent({
      eventType: 'recommendation_skipped',
      empire: rec.empire,
      epoch: rec.epoch,
      contentType: rec.contentType,
      contentId: rec.contentId,
      recommendationId: rec.id,
    });
    setDismissed(prev => new Set(prev).add(rec.id));
  };

  return (
    <section className="mb-8 opacity-0 animate-fade-in-up">
      {/* Section heading */}
      <div className="mb-5">
        <h2 className="font-display text-2xl font-bold text-ink mb-1">
          Recommended For You
        </h2>
        <p className="font-body text-sm text-sepia-light">
          {data.welcomeBack}
        </p>
      </div>

      {/* Recommendation cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleRecs.map((rec, index) => (
          <div
            key={rec.id}
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${0.1 + index * 0.1}s` }}
          >
            <RecommendationCard
              recommendation={rec}
              onGenerate={handleGenerate}
              onSkip={handleSkip}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
