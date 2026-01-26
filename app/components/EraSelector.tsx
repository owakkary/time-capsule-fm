'use client';

import { TIME_PERIODS, TimePeriodId } from '@/types';

interface EraSelectorProps {
  selectedEra: TimePeriodId | null;
  onSelectEra: (eraId: TimePeriodId) => void;
}

export default function EraSelector({ selectedEra, onSelectEra }: EraSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Choose Your Time Period</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TIME_PERIODS.map((period) => (
          <button
            key={period.id}
            onClick={() => onSelectEra(period.id)}
            className={`
              relative p-6 rounded-xl border-2 transition-all text-left
              hover:shadow-lg hover:-translate-y-1
              ${
                selectedEra === period.id
                  ? 'border-blue-600 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
            style={{
              borderColor: selectedEra === period.id ? period.color : undefined,
            }}
          >
            {selectedEra === period.id && (
              <div className="absolute top-3 right-3">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
            
            <div className="text-4xl mb-3">{period.emoji}</div>
            <h3 className="text-xl font-semibold mb-1 text-gray-900">
              {period.name}
            </h3>
            <p className="text-sm text-gray-600">{period.years}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
