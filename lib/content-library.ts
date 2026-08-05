import { AudioProvider, ContentLibraryItem, ContentType, EmpireId, QuizQuestion } from '@/types';

// Deterministic id for a content library item — shared by the batch
// generation script and every page that links to/reads an episode.
export function getContentLibraryItemId(
  contentType: ContentType,
  empireId: EmpireId,
  contentId?: string | null
): string {
  if (contentType === 'overview') return `overview-${empireId}`;
  return `${contentType}-${contentId}`;
}

// The batch script skips any item that already has a doc, so items generated
// before a field was introduced keep the old shape forever. These two readers
// let the app treat those legacy items as first-class instead of half-broken.

// Items written before `audioProvider` existed always had a real mp3, so the
// presence of an audioUrl is the correct signal for how to play them.
export function getAudioProvider(item: Pick<ContentLibraryItem, 'audioProvider' | 'audioUrl'>): AudioProvider {
  if (item.audioProvider) return item.audioProvider;
  return item.audioUrl ? 'elevenlabs' : 'browser-speech';
}

// Quizzes gate XP and badge unlocks. An item with no quiz (generated before
// quizzes existed, or one whose quiz failed to parse) must fall back to
// "finishing it counts as completing it" — otherwise that episode can never
// be completed and its XP is permanently unreachable.
export function getQuiz(item: Pick<ContentLibraryItem, 'quiz'>): QuizQuestion[] {
  return Array.isArray(item.quiz) ? item.quiz : [];
}

export function hasQuiz(item: Pick<ContentLibraryItem, 'quiz'>): boolean {
  return getQuiz(item).length > 0;
}
