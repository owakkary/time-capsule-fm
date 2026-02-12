'use client';

import { Recommendation, getEmpire } from '@/types';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onGenerate: (rec: Recommendation) => void;
  onSkip: (rec: Recommendation) => void;
}

export default function RecommendationCard({
  recommendation,
  onGenerate,
  onSkip,
}: RecommendationCardProps) {
  const empire = getEmpire(recommendation.empire);
  const empireName = empire?.name ?? recommendation.empire;

  return (
    <div className="card-antiquarian flex flex-col h-full">
      {/* Empire tag */}
      <div className="mb-3">
        <span className="tag-empire text-xs">{empireName}</span>
      </div>

      {/* Title */}
      <h3 className="font-display text-lg font-bold text-ink mb-2 leading-snug">
        {recommendation.title}
      </h3>

      {/* Host pitch */}
      <p className="font-body text-sm text-sepia-light leading-relaxed mb-3 italic">
        &ldquo;{recommendation.hostPitch}&rdquo;
      </p>

      {/* Reason */}
      <p className="font-body text-xs text-sepia-light/80 mb-4 flex-1">
        {recommendation.reason}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-auto pt-2">
        <button
          onClick={() => onGenerate(recommendation)}
          className="btn-primary !px-5 !py-2.5 !text-sm flex-1"
        >
          Generate Episode
        </button>
        <button
          onClick={() => onSkip(recommendation)}
          className="btn-secondary !px-4 !py-2 !text-sm"
        >
          Not Now
        </button>
      </div>
    </div>
  );
}
