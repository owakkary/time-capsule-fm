'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { EpochId, EmpireId, getEmpiresForEpoch, getEmpire } from '@/types';

interface HistoricalMapProps {
  epochId: EpochId;
  onSelectEmpire?: (empireId: EmpireId) => void;
}

interface HoveredEmpire {
  id: EmpireId;
  name: string;
  years: string;
  description: string;
  color: string;
  x: number;
  y: number;
}

export default function HistoricalMap({ epochId, onSelectEmpire }: HistoricalMapProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [hoveredEmpire, setHoveredEmpire] = useState<HoveredEmpire | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const empires = getEmpiresForEpoch(epochId);
  const mapPath = epochId === 'ancient-world'
    ? '/maps/ancient-world.svg'
    : '/maps/revolutionary-period.svg';

  // Load SVG content
  useEffect(() => {
    setIsLoading(true);
    fetch(mapPath)
      .then(res => res.text())
      .then(content => {
        setSvgContent(content);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load map:', err);
        setIsLoading(false);
      });
  }, [mapPath]);

  // Add event listeners to territory elements
  useEffect(() => {
    if (!containerRef.current || !svgContent) return;

    const territories = containerRef.current.querySelectorAll('.territory');

    const handleMouseEnter = (e: Event) => {
      const target = e.currentTarget as SVGElement;
      const empireId = target.getAttribute('data-empire') as EmpireId;

      if (!empireId) {
        // Check if it's a group with nested paths
        const parentGroup = target.closest('g[data-empire]');
        if (parentGroup) {
          const groupEmpireId = parentGroup.getAttribute('data-empire') as EmpireId;
          showEmpireInfo(groupEmpireId, e as MouseEvent);
        }
        return;
      }

      showEmpireInfo(empireId, e as MouseEvent);
    };

    const handleMouseLeave = () => {
      setHoveredEmpire(null);
    };

    const handleClick = (e: Event) => {
      const target = e.currentTarget as SVGElement;
      let empireId = target.getAttribute('data-empire') as EmpireId;

      if (!empireId) {
        // Check parent group
        const parentGroup = target.closest('g[data-empire]');
        if (parentGroup) {
          empireId = parentGroup.getAttribute('data-empire') as EmpireId;
        }
      }

      if (empireId) {
        if (onSelectEmpire) {
          onSelectEmpire(empireId);
        }
        router.push(`/empire/${empireId}`);
      }
    };

    territories.forEach(territory => {
      territory.addEventListener('mouseenter', handleMouseEnter);
      territory.addEventListener('mouseleave', handleMouseLeave);
      territory.addEventListener('click', handleClick);
    });

    // Also handle group-level interactions
    const empireGroups = containerRef.current.querySelectorAll('g[data-empire]');
    empireGroups.forEach(group => {
      group.addEventListener('mouseenter', handleMouseEnter);
      group.addEventListener('mouseleave', handleMouseLeave);
      group.addEventListener('click', handleClick);
    });

    return () => {
      territories.forEach(territory => {
        territory.removeEventListener('mouseenter', handleMouseEnter);
        territory.removeEventListener('mouseleave', handleMouseLeave);
        territory.removeEventListener('click', handleClick);
      });
      empireGroups.forEach(group => {
        group.removeEventListener('mouseenter', handleMouseEnter);
        group.removeEventListener('mouseleave', handleMouseLeave);
        group.removeEventListener('click', handleClick);
      });
    };
  }, [svgContent, onSelectEmpire, router]);

  const showEmpireInfo = useCallback((empireId: EmpireId, e: MouseEvent) => {
    const empire = getEmpire(empireId);
    if (!empire || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setHoveredEmpire({
      id: empire.id,
      name: empire.name,
      years: empire.years,
      description: empire.description,
      color: empire.color,
      x,
      y,
    });
  }, []);

  if (isLoading) {
    return (
      <div className="map-container w-full aspect-[5/3] flex items-center justify-center">
        <div className="loading-vintage" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Map Container */}
      <div
        ref={containerRef}
        className="map-container w-full overflow-hidden"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />

      {/* Empire Info Panel */}
      {hoveredEmpire && (
        <div
          className="empire-info-panel absolute pointer-events-none z-10 max-w-xs"
          style={{
            left: Math.min(hoveredEmpire.x + 15, containerRef.current?.clientWidth ? containerRef.current.clientWidth - 280 : hoveredEmpire.x),
            top: Math.max(hoveredEmpire.y - 10, 10),
            transform: hoveredEmpire.y < 100 ? 'translateY(20px)' : 'translateY(-100%)',
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-sm flex-shrink-0"
              style={{ backgroundColor: hoveredEmpire.color }}
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-display font-bold text-ink text-base leading-tight">
                {hoveredEmpire.name}
              </h4>
              <p className="text-xs text-brass font-display mt-0.5">
                {hoveredEmpire.years}
              </p>
              <p className="text-xs text-sepia-light font-body mt-1.5 line-clamp-2">
                {hoveredEmpire.description}
              </p>
              <p className="text-xs text-brass font-display mt-2 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                Click to explore
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile fallback - Empire buttons */}
      <div className="md:hidden mt-6 grid grid-cols-2 gap-3">
        {empires.map((empire) => (
          <button
            key={empire.id}
            onClick={() => {
              if (onSelectEmpire) onSelectEmpire(empire.id);
              router.push(`/empire/${empire.id}`);
            }}
            className="empire-mobile-btn p-4 text-left"
            style={{ borderLeftColor: empire.color }}
          >
            <span className="font-display font-semibold text-sm text-ink block">
              {empire.name}
            </span>
            <span className="text-xs text-sepia-light font-body">
              {empire.years}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
