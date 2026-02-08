'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { EmpireId, EMPIRE_TO_EPOCH } from '@/types';
import EmpireSelector from './EmpireSelector';
import DurationSelector from './DurationSelector';

const HISTORY_FACTS = [
  "Did you know? Cleopatra lived closer to the Moon landing than to the building of the Great Pyramid.",
  "The Great Wall of China is not visible from space with the naked eye.",
  "Oxford University is older than the Aztec Empire.",
  "Mammoths were still alive when the pyramids were being built.",
  "The fax machine was invented the same year people traveled the Oregon Trail.",
  "Nintendo was founded in 1889 as a playing card company.",
  "The last execution by guillotine in France was in 1977, the same year Star Wars came out.",
  "The Persian Empire's Royal Road had rest stops every 15 miles with fresh horses.",
  "Roman concrete is stronger than modern concrete and still holds up after 2,000 years.",
];

interface EpisodeGeneratorProps {
  onEpisodeGenerated: (episodeId: string) => void;
}

export default function EpisodeGenerator({ onEpisodeGenerated }: EpisodeGeneratorProps) {
  const [selectedEmpire, setSelectedEmpire] = useState<EmpireId | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentFact, setCurrentFact] = useState(0);

  const { getIdToken } = useAuth();

  const handleGenerate = async () => {
    if (!selectedEmpire || !selectedDuration) return;

    setLoading(true);
    setError('');

    // Rotate through history facts
    const factInterval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % HISTORY_FACTS.length);
    }, 4000);

    try {
      const token = await getIdToken();
      const epochId = EMPIRE_TO_EPOCH[selectedEmpire];

      // Step 1: Generate content with Claude
      const generateResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          empire: selectedEmpire,
          epoch: epochId,
          contentType: 'overview',
          durationMinutes: selectedDuration,
        }),
      });

      if (!generateResponse.ok) {
        throw new Error('Failed to generate episode');
      }

      const episode = await generateResponse.json();

      // Step 2: Generate audio with ElevenLabs
      const ttsResponse = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          episodeId: episode.id,
          text: episode.content,
          contentType: 'overview',
        }),
      });

      if (!ttsResponse.ok) {
        throw new Error('Failed to generate audio');
      }

      clearInterval(factInterval);
      onEpisodeGenerated(episode.id);

    } catch (err) {
      clearInterval(factInterval);
      setError('Failed to generate episode. Please try again.');
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="loading-vintage mb-8"></div>
        <h3 className="font-display text-3xl font-bold text-ink mb-3">
          Crafting Your Episode...
        </h3>
        <p className="text-sepia-light text-center max-w-md mb-8 font-body">
          Our AI historian is diving deep into the archives and preparing your personalized podcast.
        </p>
        <div className="fact-card max-w-xl">
          <p className="text-sepia font-body italic text-center pl-4">
            {HISTORY_FACTS[currentFact]}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {error && (
        <div className="p-4 rounded-sm border-l-4 border-burgundy bg-burgundy/5">
          <p className="text-burgundy font-body">{error}</p>
        </div>
      )}

      <EmpireSelector
        selectedEmpire={selectedEmpire}
        onSelectEmpire={setSelectedEmpire}
      />

      {selectedEmpire && (
        <div className="animate-fade-in-up">
          <DurationSelector
            selectedDuration={selectedDuration}
            onSelectDuration={setSelectedDuration}
          />
        </div>
      )}

      {selectedEmpire && selectedDuration && (
        <div className="flex justify-center pt-6 animate-fade-in-up">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary group"
          >
            <span className="relative z-10 flex items-center gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
              Generate My Episode
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
