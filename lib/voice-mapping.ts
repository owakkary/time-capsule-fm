import { ContentType } from '@/types';

// ElevenLabs voice IDs — premade voices available on the free API plan
// (library/shared voices like the previous British trio require a paid plan)
const VOICES = {
  host: 'pNInz6obpgDQGcFmaJgB',       // Adam — default host
  malePerspective: 'ErXwobaYiN019PkySvjV', // Antoni — male perspective characters
  femalePerspective: 'EXAVITQu4vr4xnSDxMaL', // Bella — female perspective characters
} as const;

// Perspective IDs that use the female voice
const FEMALE_PERSPECTIVE_IDS = new Set([
  'temple-priestess',
  'mycenaean-queen',
  'carthaginian-priestess',
  'roman-matron',
  'daughters-liberty',
]);

export function getVoiceId(contentType?: ContentType, contentId?: string): string {
  if (contentType !== 'perspective' || !contentId) {
    return VOICES.host;
  }

  if (FEMALE_PERSPECTIVE_IDS.has(contentId)) {
    return VOICES.femalePerspective;
  }

  return VOICES.malePerspective;
}

export { VOICES };
