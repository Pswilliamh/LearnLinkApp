'use server';
/**
 * @fileOverview A bilingual AI chat tutor (Guru Bahasa).
 *
 * - bilingualChat - A function that handles conversation in both English and Bahasa Indonesia.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BilingualChatInputSchema = z.object({
  userQuery: z.string().describe('The user question or message in English or Bahasa Indonesia.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    text: z.string()
  })).optional().describe('Conversation history for context.')
});
export type BilingualChatInput = z.infer<typeof BilingualChatInputSchema>;

const BilingualChatOutputSchema = z.object({
  englishResponse: z.string().describe('The response in English.'),
  bahasaResponse: z.string().describe('The response in Bahasa Indonesia.'),
  suggestions: z.array(z.string()).describe('Two or three follow-up questions or phrases.')
});
export type BilingualChatOutput = z.infer<typeof BilingualChatOutputSchema>;

export async function bilingualChat(input: BilingualChatInput): Promise<BilingualChatOutput> {
  return bilingualChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'bilingualChatPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: BilingualChatInputSchema},
  output: {schema: BilingualChatOutputSchema},
  prompt: `You are 'Guru Bahasa' (Language Teacher), an expert, friendly, and patient English and Indonesian language tutor for the LearnLink platform.

**MISSION:**
Your mission is to help students learn English through direct association and precision logic. 

**RULES:**
1. You must ALWAYS provide your response in BOTH English and Bahasa Indonesia.
2. If the user asks a question in Bahasa Indonesia, answer it in both languages.
3. If the user asks in English, answer it in both languages.
4. Keep explanations concise, clear, and focused on learning.
5. Provide helpful example sentences when explaining vocabulary or grammar.
6. Your tone should be encouraging and professional (Jakarta 2026 standard).

**CONVERSATION HISTORY:**
{{#each history}}
{{role}}: {{{text}}}
{{/each}}

**NEW USER QUERY:**
user: "{{userQuery}}"
`,
});

const bilingualChatFlow = ai.defineFlow(
  {
    name: 'bilingualChatFlow',
    inputSchema: BilingualChatInputSchema,
    outputSchema: BilingualChatOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      return {
        englishResponse: "I'm sorry, I couldn't process that request. Let's try talking about something else!",
        bahasaResponse: "Maaf, saya tidak bisa memproses permintaan itu. Mari kita bicarakan hal lain!",
        suggestions: ["Hello!", "How are you?", "Help me learn English"]
      };
    }
    return output;
  }
);
