'use client';

import { EpochProgress, EmpireProgress, EPOCHS, EMPIRES, getEmpire, getEpoch } from '@/types';
import Image from 'next/image';

interface SpecializationCardProps {
  epochProgress: EpochProgress[];
  empireProgress: EmpireProgress[];
  className?: string;
}

export default function SpecializationCard({
  epochProgress,
  empireProgress,
  className = '',
}: SpecializationCardProps) {
  return (
    <div className={className}>
      <h3 className="font-display text-xl font-bold text-ink mb-4">Specializations</h3>

      {/* Epoch progress */}
      <div className="mb-6">
        <h4 className="font-display font-medium text-sepia mb-3">Epochs Explored</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {EPOCHS.map(epoch => {
            const progress = epochProgress.find(ep => ep.epochId === epoch.id);
            const empiresExplored = progress?.empiresExplored.length || 0;
            const totalEmpires = epoch.empires.length;
            const percentage = progress?.completionPercentage || 0;

            return (
              <EpochProgressCircle
                key={epoch.id}
                name={epoch.name}
                years={epoch.years}
                color={epoch.color}
                percentage={percentage}
                empiresExplored={empiresExplored}
                totalEmpires={totalEmpires}
              />
            );
          })}
        </div>
      </div>

      {/* Empire mastery */}
      <div>
        <h4 className="font-display font-medium text-sepia mb-3">Empire Mastery</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
          {EMPIRES.map(empire => {
            const progress = empireProgress.find(ep => ep.empireId === empire.id);
            const percentage = progress?.completionPercentage || 0;
            const rank = progress?.rank || 'curious';
            const isExplored = progress && progress.totalEpisodes > 0;

            return (
              <EmpireProgressBadge
                key={empire.id}
                id={empire.id}
                name={empire.name}
                color={empire.color}
                percentage={percentage}
                rank={rank}
                isExplored={isExplored || false}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EpochProgressCircle({
  name,
  years,
  color,
  percentage,
  empiresExplored,
  totalEmpires,
}: {
  name: string;
  years: string;
  color: string;
  percentage: number;
  empiresExplored: number;
  totalEmpires: number;
}) {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center p-3 rounded-sm bg-parchment-dark/50">
      <div className="relative w-20 h-20 mb-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          {/* Background circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-brass/20"
          />
          {/* Progress circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display font-bold text-lg text-ink">
            {percentage}%
          </span>
        </div>
      </div>
      <p className="font-display text-sm font-medium text-sepia text-center leading-tight">
        {name.split(' ')[0]}
      </p>
      <p className="text-xs text-sepia-light">
        {empiresExplored}/{totalEmpires} empires
      </p>
    </div>
  );
}

function EmpireProgressBadge({
  id,
  name,
  color,
  percentage,
  rank,
  isExplored,
}: {
  id: string;
  name: string;
  color: string;
  percentage: number;
  rank: string;
  isExplored: boolean;
}) {
  const rankLabels: Record<string, string> = {
    curious: '',
    familiar: 'Familiar',
    studied: 'Studied',
    expert: 'Expert',
    master: 'Master',
  };

  const shortName = name.split(' ')[0];

  return (
    <div
      className={`
        flex flex-col items-center p-2 rounded-sm text-center
        transition-all duration-200
        ${isExplored ? 'bg-parchment-dark' : 'bg-parchment-dark/30'}
        ${percentage === 100 ? 'ring-2 ring-brass/50' : ''}
        ${!isExplored ? 'grayscale-[60%] opacity-60' : ''}
      `}
      title={`${name}: ${isExplored ? `${percentage}% complete (${rank})` : 'Not explored yet'}`}
    >
      {/* Empire image */}
      <div className="w-12 h-12 mb-1">
        <Image
          src={`/empires/${id}.png`}
          alt={name}
          width={48}
          height={48}
          className="object-contain drop-shadow-md"
        />
      </div>
      {/* Progress bar */}
      <div className="w-full h-1 bg-parchment rounded-full overflow-hidden mb-1">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
      {/* Empire name or rank */}
      <span className="text-xs text-sepia-light truncate w-full">
        {isExplored && rankLabels[rank] ? rankLabels[rank] : shortName}
      </span>
    </div>
  );
}

// Compact version for sidebar
export function SpecializationMini({
  epochProgress,
  className = '',
}: {
  epochProgress: EpochProgress[];
  className?: string;
}) {
  const totalEpochs = EPOCHS.length;
  const exploredEpochs = epochProgress.filter(ep => ep.totalEpisodes > 0).length;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-sepia-light">Epochs:</span>
      <div className="flex gap-1">
        {EPOCHS.map(epoch => {
          const progress = epochProgress.find(ep => ep.epochId === epoch.id);
          const isExplored = progress && progress.totalEpisodes > 0;

          return (
            <div
              key={epoch.id}
              className={`w-2 h-2 rounded-full transition-colors ${isExplored ? '' : 'opacity-30'}`}
              style={{ backgroundColor: epoch.color }}
              title={`${epoch.name}: ${progress?.completionPercentage || 0}%`}
            />
          );
        })}
      </div>
      <span className="text-xs text-sepia-light">
        {exploredEpochs}/{totalEpochs}
      </span>
    </div>
  );
}
