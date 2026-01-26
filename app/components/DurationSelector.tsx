'use client';

import { DURATIONS } from '@/types';

interface DurationSelectorProps {
  selectedDuration: number | null;
  onSelectDuration: (minutes: number) => void;
}

export default function DurationSelector({ selectedDuration, onSelectDuration }: DurationSelectorProps) {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-ink">Choose Episode Length</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DURATIONS.map((duration, index) => (
          <button
            key={duration.minutes}
            onClick={() => onSelectDuration(duration.minutes)}
            className={`
              relative p-6 text-center transition-all duration-300 card-antiquarian
              opacity-0 animate-fade-in-up
              ${selectedDuration === duration.minutes ? 'ring-2 ring-brass ring-offset-2 ring-offset-parchment' : ''}
            `}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="font-display text-4xl font-bold text-ink mb-2">
              {duration.label}
            </div>
            <div className="text-sm text-sepia-light font-body">
              {duration.description}
            </div>
            {selectedDuration === duration.minutes && (
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
          </button>
        ))}
      </div>
    </div>
  );
}
