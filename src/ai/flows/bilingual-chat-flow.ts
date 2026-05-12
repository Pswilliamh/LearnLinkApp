'use server';
/**
 * @fileOverview A bilingual AI chat tutor (Guru Bahasa).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BilingualChatInputSchema = z.object({
  userQuery: z.string().describe('The user question or message.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    text: z.string()
  })).optional()
});
export type BilingualChatInput = z.infer<typeof BilingualChatInputSchema>;

const BilingualChatOutputSchema = z.object({
  englishResponse: z.string().describe('The response in English.'),
  bahasaResponse: z.string().describe('The response in Bahasa Indonesia.'),
  suggestions: z.array(z.string()).describe('Follow-up questions.')
});
export type BilingualChatOutput = z.infer<typeof BilingualChatOutputSchema>;

const prompt = ai.definePrompt({
  name: 'bilingualChatPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: BilingualChatInputSchema},
  output: {schema: BilingualChatOutputSchema},
  prompt: `You are 'Guru Bahasa', a bilingual English and Indonesian tutor. Answer in both languages.
  
  History:
  {{#each history}}
  {{role}}: {{{text}}}
  {{/each}}
  
  Query: "{{userQuery}}"`,
});

export async function bilingualChat(input: BilingualChatInput): Promise<BilingualChatOutput> {
  try {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('No output from model');
    }
    return output;
  } catch (error) {
    console.error('Bilingual Chat Flow Error');
    return {
      englishResponse: "I'm having a little trouble thinking right now. Could you ask me something else?",
      bahasaResponse: "Saya sedang sedikit kesulitan berpikir saat ini. Bisakah Anda menanyakan hal lain?",
      suggestions: ["Hello!", "Help me learn English"]
    };
  }
}
