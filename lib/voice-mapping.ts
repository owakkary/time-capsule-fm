import { ContentType } from '@/types';
import { getPerspective } from '@/lib/firebase-admin';

// ElevenLabs voice IDs
const VOICES = {
  host: '9IzcwKmvwJcw58h3KnlH',       // Julian — British, default host
  malePerspective: 'JBFqnCBsd6RMkjVDRZzb', // George — warm, British, middle-aged
  femalePerspective: 'pFZP5JQG7iQjIQuC4Bku', // Lily — British, warm, clear
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
