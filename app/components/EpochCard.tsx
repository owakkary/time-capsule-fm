'use client';

import { EpochId, getEmpiresForEpoch } from '@/types';

interface EpochCardProps {
  id: EpochId;
  name: string;
  years: string;
  description: string;
  color: string;
  variant?: 'full' | 'compact';
  isSelected?: boolean;
  onClick?: () => void;
}

export default function EpochCard({
  id,
  name,
  years,
  description,
  variant = 'full',
  isSelected = false,
  onClick,
}: EpochCardProps) {
  const empires = getEmpiresForEpoch(id);

  if (variant === 'compact') {
    return (
      <button
        onClick={onClick}
        className={`
          group relative w-full text-left transition-all duration-300
          ${isSelected
            ? 'epoch-selector-active'
            : 'epoch-selector'
          }
        `}
      >
        <div className="flex items-center gap-3">
          <div className={`
            w-3 h-3 rounded-full transition-all duration-300
            ${isSelected ? 'bg-brass scale-125' : 'bg-brass/40'}
          `} />
          <div className="flex-1 min-w-0">
            <h3 className={`
              font-display text-lg font-bold transition-colors
              ${isSelected ? 'text-ink' : 'text-sepia-light group-hover:text-sepia'}
            `}>
              {name}
            </h3>
            <p className="text-xs text-brass font-display">{years}</p>
          </div>
          <div className={`
            flex items-center gap-1 text-sm font-display transition-colors
            ${isSelected ? 'text-brass' : 'text-sepia-light'}
          `}>
            <span>{empires.length}</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </button>
    );
  }

  // Full variant (original)
  return (
    <button onClick={onClick} className="w-full text-left">
      <div className="group relative h-full card-antiquarian card-accent-left overflow-hidden cursor-pointer">
        {/* Content */}
        <div className="relative">
          <h3 className="font-display text-2xl font-bold text-ink mb-1 group-hover:text-sepia transition-colors">
            {name}
          </h3>
          <p className="text-sm text-brass font-display mb-3">{years}</p>
          <p className="text-sepia-light font-body mb-5 leading-relaxed">{description}</p>

          {/* Empire previews */}
          <div className="flex flex-wrap gap-2 mb-5">
            {empires.map((empire) => (
              <span key={empire.id} className="tag-empire">
                {empire.name}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 text-sepia font-display font-medium group-hover:text-brass transition-colors">
            <span>Explore {empires.length} civilizations</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
}
