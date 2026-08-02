import { ContentType, EmpireId } from '@/types';

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
