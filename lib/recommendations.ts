import { UserInterestProfile, EMPIRES, EPOCHS } from '@/types';
import { KEY_FIGURES } from '@/lib/seed-data/figures';
import { KEY_MOMENTS } from '@/lib/seed-data/moments';
import { PERSPECTIVES } from '@/lib/seed-data/perspectives';
import { EMPIRE_OVERVIEWS } from '@/lib/seed-data/overviews';

/**
 * Build a compact content catalog string for Claude, grouped by epoch/empire.
 * Includes IDs, names, and content types so Claude can reference them in recommendations.
 */
export function buildContentCatalog(): string {
  const lines: string[] = [];

  for (const epoch of EPOCHS) {
    lines.push(`\n## ${epoch.name} (${epoch.years})`);

    for (const empireId of epoch.empires) {
      const empire = EMPIRES.find(e => e.id === empireId);
      if (!empire) continue;

      lines.push(`\n### ${empire.name} [${empire.id}] — ${empire.years}`);

      const overview = EMPIRE_OVERVIEWS.find(o => o.empire === empireId);
      if (overview) {
        lines.push(`  overview: ${overview.id} "${overview.title}"`);
      }

      const figures = KEY_FIGURES.filter(f => f.empire === empireId);
      for (const fig of figures) {
        lines.push(`  figure: ${fig.id} "${fig.name}" — ${fig.title}`);
      }

      const moments = KEY_MOMENTS.filter(m => m.empire === empireId);
      for (const mom of moments) {
        lines.push(`  moment: ${mom.id} "${mom.name}" — ${mom.year}`);
      }

      const perspectives = PERSPECTIVES.filter(p => p.empire === empireId);
      for (const per of perspectives) {
        lines.push(`  perspective: ${per.id} "${per.name}" — ${per.archetype}`);
      }
    }
  }

  return lines.join('\n');
}

/**
 * System prompt for the recommendation engine.
 */
export function buildSystemPrompt(): string {
  return `You are the personalized recommendation engine for Time Capsule FM, a history exploration app that generates AI podcast episodes.

Your role:
- Suggest 3-5 episodes the user would enjoy, based on their listening history and interests
- Prioritize diversity: mix empires, epochs, and content types (overview, figure, moment, perspective)
- Balance familiar territory (empires they love) with discovery (new empires/epochs they haven't tried)
- Each recommendation needs a compelling "host pitch" — a 1-2 sentence hook in the voice of Time Capsule FM's irreverent, witty host
- Also write a short "welcomeBack" greeting (1-2 sentences) in the host's voice, referencing what the user has been exploring lately

Output format: Return ONLY valid JSON matching this structure:
{
  "recommendations": [
    {
      "id": "unique-rec-id",
      "empire": "empire-id",
      "epoch": "epoch-id",
      "contentType": "overview|figure|moment|perspective",
      "contentId": "content-item-id or omit for overviews",
      "title": "Episode title",
      "hostPitch": "1-2 sentence hook in the host's witty voice",
      "reason": "Brief internal reason for this recommendation",
      "confidence": 0.8
    }
  ],
  "welcomeBack": "Host-voice greeting referencing their recent activity"
}

Rules:
- Never recommend episodes the user has already completed (check completedEpisodeIds)
- confidence is 0.0-1.0 reflecting how well this matches the user's profile
- contentId must be a valid ID from the catalog for figure/moment/perspective types
- For overview type, omit contentId
- The id field should be a descriptive kebab-case string like "rec-roman-empire-augustus"`;
}

/**
 * Build the user prompt with profile data and content catalog.
 */
export function buildUserPrompt(
  profile: UserInterestProfile,
  catalog: string
): string {
  const topEmpires = Object.entries(profile.empireCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([id, count]) => {
      const empire = EMPIRES.find(e => e.id === id);
      return `${empire?.name || id}: ${count} episodes`;
    })
    .join(', ');

  const topEpochs = Object.entries(profile.epochCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([id, count]) => {
      const epoch = EPOCHS.find(e => e.id === id);
      return `${epoch?.name || id}: ${count}`;
    })
    .join(', ');

  const contentPrefs = Object.entries(profile.contentTypeCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .map(([type, count]) => `${type}: ${count}`)
    .join(', ');

  // Find unexplored empires
  const exploredEmpireIds = new Set(Object.keys(profile.empireCounts));
  const unexplored = EMPIRES
    .filter(e => !exploredEmpireIds.has(e.id))
    .map(e => e.name)
    .slice(0, 6);

  return `Here is the user's listening profile:

**Stats**: ${profile.totalEpisodesStarted} episodes started, ${profile.totalEpisodesCompleted} completed
**Top empires**: ${topEmpires || 'none yet'}
**Top epochs**: ${topEpochs || 'none yet'}
**Content type preferences**: ${contentPrefs || 'none yet'}
**Unexplored empires**: ${unexplored.join(', ') || 'all explored'}
${profile.inferredInterests.length > 0 ? `**Inferred interests**: ${profile.inferredInterests.join(', ')}` : ''}
${profile.knowledgeGaps.length > 0 ? `**Knowledge gaps**: ${profile.knowledgeGaps.join(', ')}` : ''}
${profile.personalityNotes ? `**Personality**: ${profile.personalityNotes}` : ''}
${profile.explorationStyle ? `**Style**: ${profile.explorationStyle}` : ''}

**Completed episode IDs** (do NOT recommend these): ${profile.completedEpisodeIds.length > 0 ? profile.completedEpisodeIds.join(', ') : 'none'}

---

**Available Content Catalog:**
${catalog}

---

Based on this profile, recommend 3-5 episodes. Return ONLY valid JSON.`;
}
