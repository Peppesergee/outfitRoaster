import { GoogleGenerativeAI, Part } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface RoastData {
  roast: string;
  score: number;
  styleLabel: string;
  tip: string;
  dominantColors: string[];
  emoji: string;
}

const TONE_INSTRUCTIONS: Record<string, string> = {
  brutal: 'Be brutally honest, savage, and merciless. Pull no punches. Reference fashion disasters with sharp wit.',
  ironic: 'Be sharp, witty, and deliciously sarcastic. Use dry humor and irony. Pop-culture references welcome.',
  constructive: 'Be honest but hopeful. Point out issues with warmth. End on an encouraging note.',
};

function intensityDescription(intensity: number): string {
  if (intensity <= 3) return 'Keep it fairly light — a gentle nudge.';
  if (intensity <= 6) return 'Medium intensity — be honest but not devastating.';
  if (intensity <= 8) return 'High intensity — be quite sharp and direct.';
  return 'Maximum intensity — absolutely no mercy.';
}

export async function analyzeOutfit(
  base64Image: string,
  tone: string,
  intensity: number
): Promise<RoastData> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are a sharp, pop-culturally updated fashion critic called "The Outfit Roaster".
Analyze the outfit in this photo and respond ONLY with a valid JSON object.

Tone style: ${TONE_INSTRUCTIONS[tone] ?? TONE_INSTRUCTIONS.ironic}
Intensity: ${intensityDescription(intensity)} (${intensity}/10)

HARD RULES — violating any of these disqualifies your response:
- NEVER comment on the person's body, face, weight, or physical appearance
- Comment ONLY on the clothes, accessories, styling, and outfit choices
- Be specific: mention actual colors, materials, combinations, and pieces you can see
- Use current fashion references, micro-trends, and aesthetics
- Even the harshest roast must end with a genuine, practical tip
- Keep everything fun, punchy, and shareable

Respond with ONLY this JSON (no markdown, no backticks):
{
  "roast": "3-4 sentence roast commenting only on the clothes",
  "score": <number from 1 to 10>,
  "styleLabel": "Creative, specific style label like 'Accidental Goblincore' or 'Dark Academia Dropout'",
  "tip": "One specific, actionable improvement tip for this outfit",
  "dominantColors": ["#hex1", "#hex2"],
  "emoji": "single emoji that captures the vibe"
}`;

  const imagePart: Part = {
    inlineData: {
      data: base64Image,
      mimeType: 'image/jpeg',
    },
  };

  const result = await model.generateContent([prompt, imagePart]);
  const text = result.response.text().trim();

  const cleaned = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();

  let parsed: RoastData;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Gemini returned invalid JSON: ${text.slice(0, 200)}`);
  }

  parsed.score = Math.max(1, Math.min(10, Math.round(parsed.score)));
  if (!Array.isArray(parsed.dominantColors) || parsed.dominantColors.length < 2) {
    parsed.dominantColors = ['#FF4757', '#FF6B35'];
  }
  parsed.emoji = parsed.emoji?.slice(0, 4) || '👗';

  return parsed;
}
