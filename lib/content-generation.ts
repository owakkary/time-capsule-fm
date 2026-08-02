import { EmpireId, getEmpire } from '@/types';
import { getFigure, getMoment, getPerspective, getOverview } from '@/lib/firebase-admin';

// Every item in the content library is generated once at this fixed length.
export const TARGET_DURATION_MINUTES = 10;
export const TARGET_WORD_COUNT = 1200;

export const SYSTEM_PROMPT = `You are the host of Time Capsule FM, a history podcast. Your voice is intellectually rigorous but casually irreverent — you genuinely love this stuff, but you'd never be caught dead sounding like a textbook.

Your signature style:
- OPENING: Start with dramatic weight, then immediately undercut it with a sarcastic or absurd observation. Example pattern: "In 44 BC, the most powerful man in the world was stabbed 23 times by his own colleagues. Which, if you've ever worked in an open-plan office, you might find relatable."
- THROUGHOUT: Weave in absurdist observations about the weird, human, petty details of history. Kings who were terrified of cats. Empires that fell because someone got dysentery at the wrong time. The fact that ancient Rome had fast-food restaurants.
- CLOSING: End with genuine historical significance, then a final wry observation that reframes everything.

Content rules:
- Never sound like a textbook or documentary narrator
- No modern partisan political stances — you can reference modern parallels but stay wry, not preachy
- Inject levity every 2-3 paragraphs — a joke, an absurd comparison, a "wait, really?" moment
- You KNOW your stuff deeply. The humor comes from confidence, not from dumbing things down
- Write as flowing spoken-word monologue: no headers, no bullet points, no formatting
- Use natural speech patterns: pauses, rhetorical questions, asides, personality`;

export const PERSPECTIVE_SYSTEM_PROMPT = `You are a narrator for Time Capsule FM's "Perspectives" series — immersive first-person historical accounts. For these episodes, you fully inhabit a historical character and speak as them.

Your style for perspectives:
- Write entirely in first person as the character — no modern narrator voice
- Ground the listener in sensory details: what they see, hear, smell, taste
- Show the character's worldview naturally — what they believe, what they take for granted
- Include interactions with others — superiors, peers, family
- Make it feel like a journal entry, memoir, or letter — intimate and personal
- End with a reflection that gives genuine insight into this person's inner life
- Weave in historically accurate details about daily life naturally, not as exposition
- The character should feel like a real person with worries, hopes, humor, and contradictions`;

export function buildPromptForOverview(empireId: EmpireId, wordCount: number): string {
  const empire = getEmpire(empireId);
  const overview = getOverview(empireId);

  if (!empire) throw new Error(`Empire not found: ${empireId}`);

  const themes = overview?.keyThemes.join(', ') || empire.keyThemes.join(', ');

  return `Generate approximately ${wordCount} words about ${empire.name} (${empire.years}).

Context: ${empire.description}
Key themes to weave in: ${themes}

Give a sweeping overview — the rise, the peak, the fascinating weirdness. Hit 2-3 stories or facts that capture the essence of this civilization. Connect to modern life where it fits naturally.`;
}

export function buildPromptForFigure(figureId: string, wordCount: number): string {
  const figure = getFigure(figureId);
  if (!figure) throw new Error(`Figure not found: ${figureId}`);

  const empire = getEmpire(figure.empire);

  return `Generate approximately ${wordCount} words about ${figure.name} (${figure.years}), ${figure.title} from ${empire?.name || figure.empire}.

Context: ${figure.description}
Why they matter: ${figure.significance}

Tell their story — the key moments, dramatic turning points, and human elements. What drove them? What were their flaws? What made them exceptional?`;
}

export function buildPromptForMoment(momentId: string, wordCount: number): string {
  const moment = getMoment(momentId);
  if (!moment) throw new Error(`Moment not found: ${momentId}`);

  const empire = getEmpire(moment.empire);

  return `Generate approximately ${wordCount} words about "${moment.name}" (${moment.year}) from ${empire?.name || moment.empire}.

Context: ${moment.description}
Why it matters: ${moment.significance}

Set the scene, build the tension, walk through what actually happened — the drama, the players, the twists. What led to this moment and what were the consequences?`;
}

export function buildPromptForPerspective(perspectiveId: string, wordCount: number): string {
  const perspective = getPerspective(perspectiveId);
  if (!perspective) throw new Error(`Perspective not found: ${perspectiveId}`);

  const empire = getEmpire(perspective.empire);

  return `Generate approximately ${wordCount} words as a first-person account from "${perspective.name}" in ${empire?.name || perspective.empire}.

Character: ${perspective.archetype}
Setting: ${perspective.description}

Start by grounding us in a specific moment or routine in this person's daily life. Build out from there — their world, their relationships, their inner life.`;
}

export function buildTitlePrompt(contentType: string, script: string): string {
  return contentType === 'perspective'
    ? `Generate a short, evocative title (max 6 words) for this first-person historical narrative. Make it intriguing. Just the title, nothing else:\n\n${script.slice(0, 500)}`
    : `Generate a short, catchy podcast episode title (max 6 words) for this history content. Just the title, nothing else:\n\n${script.slice(0, 500)}`;
}
