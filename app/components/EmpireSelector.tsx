'use client';

import { useState } from 'react';
import { EPOCHS, EMPIRES, EpochId, EmpireId, getEmpiresForEpoch } from '@/types';

interface EmpireSelectorProps {
  selectedEmpire: EmpireId | null;
  onSelectEmpire: (empireId: EmpireId) => void;
}

export default function EmpireSelector({ selectedEmpire, onSelectEmpire }: EmpireSelectorProps) {
  const [selectedEpoch, setSelectedEpoch] = useState<EpochId | null>(null);

  // If an empire is already selected, determine its epoch
  const currentEpoch = selectedEmpire
    ? EMPIRES.find(e => e.id === selectedEmpire)?.epochId as EpochId
    : selectedEpoch;

  const handleEpochSelect = (epochId: EpochId) => {
    setSelectedEpoch(epochId);
  };

  const handleEmpireSelect = (empireId: EmpireId) => {
    onSelectEmpire(empireId);
  };

  const handleBack = () => {
    setSelectedEpoch(null);
  };

  // Show epoch selection if no epoch is selected
  if (!currentEpoch) {
    return (
      <div className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-ink">Choose Your Era</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EPOCHS.map((epoch, index) => (
            <button
              key={epoch.id}
              onClick={() => handleEpochSelect(epoch.id as EpochId)}
              className="relative p-6 text-left transition-all duration-300 card-antiquarian card-accent-left opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="font-display text-xl font-bold text-ink mb-1">
                {epoch.name}
              </h3>
              <p className="text-sm text-brass font-display mb-3">{epoch.years}</p>
              <p className="text-sepia-light font-body text-sm mb-4">{epoch.description}</p>
              <div className="flex flex-wrap gap-2">
                {getEmpiresForEpoch(epoch.id as EpochId).map((empire) => (
                  <span key={empire.id} className="tag-empire">
                    {empire.name}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Show empire selection for the selected epoch
  const empires = getEmpiresForEpoch(currentEpoch);
  const epoch = EPOCHS.find(e => e.id === currentEpoch);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={handleBack}
          className="group flex items-center gap-2 text-sepia-light hover:text-sepia transition-colors font-display"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="h-6 w-px bg-sepia/20" />
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">{epoch?.name}</h2>
          <p className="text-sm text-brass font-display">{epoch?.years}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {empires.map((empire, index) => (
          <button
            key={empire.id}
            onClick={() => handleEmpireSelect(empire.id as EmpireId)}
            className={`
              relative p-6 text-left transition-all duration-300 card-antiquarian
              opacity-0 animate-fade-in-up
              ${selectedEmpire === empire.id ? 'ring-2 ring-brass ring-offset-2 ring-offset-parchment' : ''}
            `}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {selectedEmpire === empire.id && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 rounded-full bg-brass flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-parchment"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            )}

            <h3 className="font-display text-xl font-bold text-ink mb-1">
              {empire.name}
            </h3>
            <p className="text-sm text-brass font-display mb-3">{empire.years}</p>
            <p className="text-sm text-sepia-light font-body">{empire.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
