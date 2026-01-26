'use client';

import Link from 'next/link';
import { EmpireId } from '@/types';

interface EmpireCardProps {
  id: EmpireId;
  name: string;
  emoji: string;
  years: string;
  color: string;
  description: string;
  contentCounts?: {
    figures: number;
    moments: number;
    perspectives: number;
  };
}

export default function EmpireCard({
  id,
  name,
  emoji,
  years,
  color,
  description,
  contentCounts,
}: EmpireCardProps) {
  return (
    <Link href={`/empire/${id}`}>
      <div className="card-antiquarian card-accent-left group h-full">
        {/* Title */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-display font-bold text-parchment bg-brass">
            {name.charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="font-display text-xl font-bold text-ink group-hover:text-sepia transition-colors">{name}</h3>
            <p className="text-sm text-sepia-light font-body">{years}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sepia font-body mt-4 mb-4">{description}</p>

        {/* Content counts */}
        {contentCounts && (
          <div className="flex gap-4 text-sm text-sepia-light font-body mb-4">
            <span>{contentCounts.figures} figures</span>
            <span>{contentCounts.moments} moments</span>
            <span>{contentCounts.perspectives} perspectives</span>
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center gap-2 text-brass font-display font-medium">
          <span>Explore empire</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
