'use client';

import Link from 'next/link';
import { EmpireId, getEmpire } from '@/types';

interface PerspectiveCardProps {
  id: string;
  name: string;
  empire: EmpireId;
  archetype: string;
  description: string;
  tags: string[];
}

export default function PerspectiveCard({
  id,
  name,
  empire,
  archetype,
  description,
  tags,
}: PerspectiveCardProps) {
  const empireData = getEmpire(empire);

  return (
    <Link href={`/perspective/${id}`}>
      <div className="card-antiquarian card-accent-left group h-full">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-brass/20 flex items-center justify-center text-xl font-display font-bold text-brass">
            {name.charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-ink leading-tight group-hover:text-sepia transition-colors">{name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="tag-empire text-xs">
                {empireData?.name}
              </span>
              <span className="text-xs text-sepia-light font-body">{archetype}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-sepia-light font-body mb-3 line-clamp-3">{description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-parchment-dark text-sepia rounded-sm text-xs font-body"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Listen hint */}
        <div className="mt-4 pt-3 border-t border-brass/20">
          <span className="text-sm text-brass font-display font-medium flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Step Into Their Story
          </span>
        </div>
      </div>
    </Link>
  );
}
