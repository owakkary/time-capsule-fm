'use client';

import { useState } from 'react';
import { EMPIRES, EpochId, EmpireId, getEmpiresForEpoch } from '@/types';

interface InteractiveMapProps {
  epochId: EpochId;
  selectedEmpire: EmpireId | null;
  onSelectEmpire: (empireId: EmpireId) => void;
}

export default function InteractiveMap({
  epochId,
  selectedEmpire,
  onSelectEmpire,
}: InteractiveMapProps) {
  const [hoveredEmpire, setHoveredEmpire] = useState<EmpireId | null>(null);
  const empires = getEmpiresForEpoch(epochId);

  // Map dimensions
  const mapWidth = 500;
  const mapHeight = 300;

  // Get empire positions based on epoch
  const getEmpirePositions = (empireId: EmpireId): { x: number; y: number } => {
    const positions: Record<string, { x: number; y: number }> = {
      // Ancient World positions (Mediterranean/Middle East focus)
      'ancient-egypt': { x: 210, y: 180 },
      'persian-empire': { x: 340, y: 140 },
      'classical-greece': { x: 180, y: 120 },
      'roman-empire': { x: 120, y: 130 },
      // Revolutionary Period positions (World map)
      'british-empire': { x: 140, y: 80 },
      'french-empire': { x: 160, y: 110 },
      'spanish-empire': { x: 100, y: 140 },
      'qing-china': { x: 400, y: 130 },
      'united-states': { x: 80, y: 120 },
    };
    return positions[empireId] || { x: 250, y: 150 };
  };

  const activeEmpire = hoveredEmpire || selectedEmpire;
  const activeEmpireData = activeEmpire
    ? EMPIRES.find(e => e.id === activeEmpire)
    : null;

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl overflow-hidden border-2 border-amber-200">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* SVG Map */}
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="w-full h-64 md:h-80"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Empire regions */}
          {empires.map((empire) => {
            const pos = getEmpirePositions(empire.id as EmpireId);
            const isSelected = selectedEmpire === empire.id;
            const isHovered = hoveredEmpire === empire.id;
            const isActive = isSelected || isHovered;

            return (
              <g key={empire.id}>
                {/* Empire circle marker */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isActive ? 35 : 30}
                  fill={empire.color}
                  fillOpacity={isActive ? 0.9 : 0.7}
                  stroke={isSelected ? '#1e3a8a' : empire.color}
                  strokeWidth={isSelected ? 4 : 2}
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => onSelectEmpire(empire.id as EmpireId)}
                  onMouseEnter={() => setHoveredEmpire(empire.id as EmpireId)}
                  onMouseLeave={() => setHoveredEmpire(null)}
                />

                {/* Empire emoji */}
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-2xl pointer-events-none select-none"
                  style={{ fontSize: isActive ? '28px' : '24px' }}
                >
                  {empire.emoji}
                </text>

                {/* Empire name label */}
                <text
                  x={pos.x}
                  y={pos.y + 50}
                  textAnchor="middle"
                  className="text-xs font-semibold pointer-events-none fill-gray-700"
                  style={{ opacity: isActive ? 1 : 0.7 }}
                >
                  {empire.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Map title overlay */}
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg">
          <span className="text-sm font-medium text-gray-700">
            {epochId === 'ancient-world' ? 'Ancient World' : 'Revolutionary Period'}
          </span>
        </div>
      </div>

      {/* Hovered/Selected Empire Info */}
      {activeEmpireData && (
        <div
          className="p-4 rounded-xl border-2 transition-all"
          style={{
            borderColor: activeEmpireData.color,
            backgroundColor: `${activeEmpireData.color}10`,
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{activeEmpireData.emoji}</span>
            <div>
              <h3 className="font-bold text-gray-900">{activeEmpireData.name}</h3>
              <p className="text-sm text-gray-600">{activeEmpireData.years}</p>
            </div>
          </div>
          <p className="text-sm text-gray-700">{activeEmpireData.description}</p>
        </div>
      )}

      {/* Mobile fallback list */}
      <div className="md:hidden space-y-2">
        <p className="text-sm text-gray-500 font-medium">Or select from list:</p>
        <div className="grid grid-cols-2 gap-2">
          {empires.map((empire) => (
            <button
              key={empire.id}
              onClick={() => onSelectEmpire(empire.id as EmpireId)}
              className={`
                p-3 rounded-lg border-2 text-left transition-all
                ${
                  selectedEmpire === empire.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
              style={{
                borderColor: selectedEmpire === empire.id ? empire.color : undefined,
              }}
            >
              <span className="text-xl mr-2">{empire.emoji}</span>
              <span className="text-sm font-medium">{empire.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
