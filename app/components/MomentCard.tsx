'use client';

import Link from 'next/link';
import { EmpireId, getEmpire } from '@/types';
import { useFavorites } from '@/hooks/useFavorites';

interface MomentCardProps {
  id: string;
  name: string;
  empire: EmpireId;
  year: string;
  description: string;
  tags: string[];
  showFavorite?: boolean;
}

export default function MomentCard({
  id,
  name,
  empire,
  year,
  description,
  tags,
  showFavorite = true,
}: MomentCardProps) {
  const empireData = getEmpire(empire);
  const { isMomentFavorite, toggleMomentFavorite } = useFavorites();
  const isFavorite = isMomentFavorite(id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMomentFavorite(id);
  };

  return (
    <Link href={`/moment/${id}`}>
      <div className="card-antiquarian card-accent-left group h-full">
        {/* Favorite Button */}
        {showFavorite && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-20 p-2 rounded-full hover:bg-brass/10 transition-colors z-10"
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              className={`w-5 h-5 transition-colors ${isFavorite ? 'text-burgundy fill-burgundy' : 'text-sepia-light hover:text-burgundy'}`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              fill={isFavorite ? 'currentColor' : 'none'}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}

        {/* Year badge */}
        <div className="absolute top-4 right-4">
          <span className="px-2 py-1 bg-ink text-parchment text-xs font-display rounded-sm">
            {year}
          </span>
        </div>

        {/* Header */}
        <div className="pr-24 mb-3">
          <h3 className="font-display font-bold text-ink leading-tight group-hover:text-sepia transition-colors">{name}</h3>
          <span className="tag-empire text-xs mt-2 inline-block">
            {empireData?.name}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-sepia-light font-body mb-3 line-clamp-2">{description}</p>

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

        {/* Generate hint */}
        <div className="mt-4 pt-3 border-t border-brass/20">
          <span className="text-sm text-brass font-display font-medium flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Generate episode
          </span>
        </div>
      </div>
    </Link>
  );
}
