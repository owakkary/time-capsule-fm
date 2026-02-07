'use client';

import { EmpireId, getEmpire } from '@/types';

interface EmpireTooltipProps {
  empireId: EmpireId;
  x: number;
  y: number;
  containerWidth: number;
  containerHeight: number;
}

/**
 * Vintage-styled tooltip for empire hover states
 */
export default function EmpireTooltip({
  empireId,
  x,
  y,
  containerWidth,
  containerHeight,
}: EmpireTooltipProps) {
  const empire = getEmpire(empireId);
  if (!empire) return null;

  const tooltipWidth = 260;
  const tooltipHeight = 130;
  const padding = 15;

  // Calculate position to keep tooltip within bounds
  let tooltipX = x + 20;
  let tooltipY = y - 10;

  // Adjust if tooltip would go off right edge
  if (tooltipX + tooltipWidth > containerWidth - padding) {
    tooltipX = x - tooltipWidth - 20;
  }

  // Adjust if tooltip would go off bottom edge
  if (tooltipY + tooltipHeight > containerHeight - padding) {
    tooltipY = containerHeight - tooltipHeight - padding;
  }

  // Adjust if tooltip would go off top edge
  if (tooltipY < padding) {
    tooltipY = padding;
  }

  // Adjust if tooltip would go off left edge
  if (tooltipX < padding) {
    tooltipX = padding;
  }

  return (
    <div
      className="empire-tooltip"
      style={{
        position: 'absolute',
        left: tooltipX,
        top: tooltipY,
        width: tooltipWidth,
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      {/* Main container with parchment style */}
      <div className="relative bg-gradient-to-b from-parchment to-parchment-dark rounded-sm border-3 border-brass shadow-lg overflow-hidden">
        {/* Inner border decoration */}
        <div className="absolute inset-1 border border-brass/30 rounded-sm pointer-events-none" />

        {/* Content */}
        <div className="p-4">
          {/* Header with color badge */}
          <div className="flex items-start gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-sm flex-shrink-0 border border-ink/20 shadow-inner"
              style={{ backgroundColor: empire.color }}
            >
              <span className="flex items-center justify-center h-full text-2xl">
                {empire.emoji}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-display font-bold text-ink text-base leading-tight">
                {empire.name}
              </h4>
              <p className="text-xs text-brass-dark font-display mt-0.5 tracking-wide">
                {empire.years}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-sepia-light font-body leading-relaxed line-clamp-2 mb-3">
            {empire.description}
          </p>

          {/* Key themes */}
          <div className="flex flex-wrap gap-1.5">
            {empire.keyThemes.slice(0, 3).map((theme) => (
              <span
                key={theme}
                className="text-xs px-2 py-0.5 bg-brass/10 text-sepia border border-brass/20 rounded-sm"
              >
                {theme}
              </span>
            ))}
          </div>

          {/* Click hint */}
          <div className="mt-3 pt-2 border-t border-brass/20 flex items-center gap-1.5 text-brass">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
            <span className="text-xs font-display">Click to explore</span>
          </div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-1 left-1 w-2 h-2 border-l-2 border-t-2 border-brass/40" />
        <div className="absolute top-1 right-1 w-2 h-2 border-r-2 border-t-2 border-brass/40" />
        <div className="absolute bottom-1 left-1 w-2 h-2 border-l-2 border-b-2 border-brass/40" />
        <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-brass/40" />
      </div>
    </div>
  );
}
