import type { Message, Player } from '../src/types';
import { CHARACTERS } from '../src/constants';

const DEFAULT_WORKER_URL = 'https://husky-snow-ai.mholtkamp.workers.dev';
const PRIMARY_MODEL = 'gemini-2.5-pro';
const FALLBACK_MODEL = 'gemini-2.5-flash';
const SUMMARIZER_MODEL = 'gemini-2.5-flash';
const HISTORY_THRESHOLD = 20;
const RECENT_HISTORY_COUNT = 10;

const SAFETY_SETTINGS = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
];

interface AIResponse {
  narrative: string;
  suggestions: string[];
  commands: string[];
}

interface WorkerContent {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

interface WorkerGenerateResponse {
  text?: string;
  finishReason?: string | null;
  model?: string;
  error?: string;
  details?: string;
}

const getWorkerUrl = (): string => {
  const configuredUrl = import.meta.env.VITE_HUSKY_AI_WORKER_URL || DEFAULT_WORKER_URL;
  return configuredUrl.replace(/\/+$/, '');
};

const callWorker = async (payload: Record<string, unknown>): Promise<WorkerGenerateResponse> => {
  let response: Response;
  try {
    response = await fetch(`${getWorkerUrl()}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error('The Husky Snow AI Worker is unavailable. Check VITE_HUSKY_AI_WORKER_URL or deploy the Worker.');
  }

  const data = (await response.json().catch(() => ({}))) as WorkerGenerateResponse;

  if (!response.ok) {
    const message = data.error || `The storyteller service returned ${response.status}.`;
    const detail = data.details ? ` ${data.details}` : '';
    throw new Error(`${message}${detail}`);
  }

  return data;
};

const generateText = async ({
  model,
  fallbackModel,
  systemInstruction,
  contents,
  generationConfig,
}: {
  model: string;
  fallbackModel?: string;
  systemInstruction: string;
  contents: WorkerContent[];
  generationConfig: Record<string, unknown>;
}): Promise<string> => {
  const result = await callWorker({
    model,
    fallbackModel,
    systemInstruction: {
      parts: [{ text: systemInstruction }],
    },
    contents,
    generationConfig,
    safetySettings: SAFETY_SETTINGS,
  });

  if (result.text) {
    return result.text;
  }

  if (result.finishReason && result.finishReason !== 'STOP') {
    throw new Error(`The spirits blocked this action (${result.finishReason}).`);
  }

  throw new Error('The spirits are silent.');
};

const summarizeHistory = async (historyToSummarize: Message[]): Promise<string> => {
  const summarizationPrompt = `
You are a story summarizer for a text-based RPG called "Husky's Snow".
Concise summary only. Focus on key plot points, character actions, locations visited, major decisions, items acquired, badges earned, and unresolved threats.
This recap will be used as context for the storyteller AI.

HISTORY:
${historyToSummarize.map((m) => `(${m.author || m.role}): ${m.text}`).join('\n')}
`;

  try {
    return await generateText({
      model: SUMMARIZER_MODEL,
      systemInstruction: 'Summarize only the supplied Husky Snow RPG history. Do not continue the story.',
      contents: [{ role: 'user', parts: [{ text: summarizationPrompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 500,
      },
    });
  } catch (e) {
    console.error('History summarization failed:', e);
    return 'The story so far is a blur, but the adventure continues...';
  }
};

const buildSystemInstruction = (players: Player[]): string => {
  const allPlayerLore = players
    .map((p) => {
      const char = CHARACTERS.find((c) => c.name === p.charName);
      return char ? char.loreContext : `${p.charName} (Unknown Lore)`;
    })
    .join('\n');

  return `
You are Quinn, the storyteller for a cinematic text RPG called "Husky's Snow: Tales of the Moonshine River Pack".

YOUR GOAL:
Provide an immersive "Frostglass Fantasy" experience for young adventurers in the Moonshine River Pack. Stay fully in Husky Snow's world. Do not use or mention any Band-Aid six persona, military persona, hospital persona, or unrelated app identity.

STYLE GUIDELINES:
- Keep narrative turns concise: five sentences or less unless the user explicitly asks for a recap.
- Write atmospheric, wintery, tactile prose with sensory detail, but keep the game moving quickly.
- Use *italics* for emphasis or inner thoughts and **bold** for key terms or dice requests.
- Give players a clear next step every turn. Do not strand them with vague ambience or dead-end suggestions.
- Never reveal hidden commands to the player as explanatory text.

GAMEPLAY MECHANICS:
1. DICE ROLLS:
   - If a player attempts an uncertain action, do not resolve the outcome immediately.
   - Describe the challenge and command exactly: "**Roll the D20 to [action].**"
   - After a roll message, interpret the result briefly: 1 = critical fail, 2-10 = fail, 11-15 = success, 16-20 = critical success.
   - Never ask for another roll until the previous roll result has been interpreted.

2. HIDDEN COMMANDS:
   Put state commands at the very end of your response on separate lines.
   - Give item: [[ADD_ITEM: PlayerName | ItemId]]
   - Award badge: [[AWARD_BADGE: PlayerName | BadgeId]]
   - Item IDs: aloe, spiderweb, berry, net, crystal, trap, moss
   - Badge IDs: catch_fish, save_pup, brave_stand, legend_pack
   - Only give items or badges after a player visibly earns them through action or a resolved roll. Do not hand out rewards as filler.

3. SUGGESTIONS:
   Always end the visible turn with "What do you do?"
   Then provide 3-4 distinct clickable suggestions, each on its own line starting with "-".
   Suggestions must be specific, actionable, and safe for the current scene. Avoid generic options like "continue" or "explore more" unless tied to a concrete clue.

LORE CONTEXT:
The Moonshine River is poisoned. The prophecy says the young pack must find the crystal to save the pack.
Good early adventure beats include: discovering sick river water, hearing Mist's first warning, finding a trail clue, choosing whether to help a packmate, and learning the crystal may be hidden beyond the frosted ravine.

PLAYERS:
${allPlayerLore}

KEY NPCS:
- Mistyfeather (Mist): Telepathic guide with black void eyes. Sarcastic, protective, mysterious.
- Starwhirl: Noble leader of the Moonshine River Pack.
- Snapper: Master crafter and Shiver's dad.
- Sweetbrush: Wise Border Collie healer.
- Dragonfly: Oak's over-protective mother.
- Storm: Shiver and Glacier's mean older brother and rival.
`;
};

const parseAIText = (aiText: string): AIResponse => {
  const lines = aiText.split('\n');
  const narrativeLines: string[] = [];
  const suggestionLines: string[] = [];
  const commandLines: string[] = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('[[') && trimmed.endsWith(']]')) {
      commandLines.push(trimmed);
    } else if (trimmed.startsWith('-')) {
      suggestionLines.push(trimmed.substring(1).trim());
    } else {
      narrativeLines.push(line);
    }
  });

  return {
    narrative: narrativeLines.join('\n').trim(),
    suggestions: suggestionLines.filter(Boolean),
    commands: commandLines,
  };
};

export const generateAIResponse = async (
  history: Message[],
  prompt: string,
  players: Player[]
): Promise<AIResponse> => {
  let summary: string | null = null;
  let processedHistory = [...history];

  if (processedHistory.length > HISTORY_THRESHOLD) {
    const oldHistory = processedHistory.slice(0, -RECENT_HISTORY_COUNT);
    const recentHistory = processedHistory.slice(-RECENT_HISTORY_COUNT);
    summary = await summarizeHistory(oldHistory);
    processedHistory = recentHistory;
  }

  const contents: WorkerContent[] = processedHistory
    .filter((m) => m.role !== 'system' && m.role !== 'error' && m.text.trim() !== '')
    .map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: `(${m.author || m.role}): ${m.text}` }],
    }));

  if (summary) {
    contents.unshift({
      role: 'model',
      parts: [{ text: `--- STORY RECAP ---\n${summary}\n--- END RECAP ---` }],
    });
  }

  contents.push({
    role: 'user',
    parts: [{ text: prompt }],
  });

  const text = await generateText({
    model: PRIMARY_MODEL,
    fallbackModel: FALLBACK_MODEL,
    systemInstruction: buildSystemInstruction(players),
    contents,
    generationConfig: {
      maxOutputTokens: 900,
      temperature: 0.8,
    },
  });

  return parseAIText(text);
};
