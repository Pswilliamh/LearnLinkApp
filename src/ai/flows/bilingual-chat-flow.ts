'use server';
/**
 * @fileOverview A bilingual AI chat tutor (Guru Bahasa) for the 2026 Precision Protocol.
 *
 * - bilingualChat - The primary interaction function for the chat UI.
 * - BilingualChatInput - Schema for user query and conversation history.
 * - BilingualChatOutput - Schema for dual-language responses and suggestions.
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
  suggestions: z.array(z.string()).describe('Three short follow-up questions to keep the conversation going.')
});
export type BilingualChatOutput = z.infer<typeof BilingualChatOutputSchema>;

const prompt = ai.definePrompt({
  name: 'bilingualChatPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: BilingualChatInputSchema},
  output: {schema: BilingualChatOutputSchema},
  system: `You are 'Guru Bahasa', the lead 2026 Precision AI Tutor. 
  
  YOUR CORE DIRECTIVES:
  1. ALWAYS provide a response in both English and Bahasa Indonesia.
  2. Use the 'Direct Association' methodology: ensure the translation is accurate and helpful for a student.
  3. If the user asks in Bahasa, explain the English equivalent clearly.
  4. If the user asks in English, provide the Bahasa translation to ensure understanding.
  5. Maintain a professional, encouraging, and high-dimensional educational tone.
  6. Your responses must be structured into the 'englishResponse' and 'bahasaResponse' fields specifically.`,
  prompt: `
  Conversation History:
  {{#each history}}
  {{role}}: {{{text}}}
  {{/each}}
  
  Current User Query: "{{userQuery}}"
  
  Please provide your bilingual teaching response.`,
});

export async function bilingualChat(input: BilingualChatInput): Promise<BilingualChatOutput> {
  try {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Guru Bahasa received no output from the logic engine.');
    }
    return output;
  } catch (error: any) {
    console.error('Guru Bahasa Logic Error:', error.message || error);
    return {
      englishResponse: "I am temporarily resetting my linguistic matrix. Please ask me again in a moment.",
      bahasaResponse: "Saya sedang mengatur ulang matriks linguistik saya sementara. Silakan tanya saya lagi dalam sekejap.",
      suggestions: ["Hello!", "Help me with English", "What is the Precision Protocol?"]
    };
  }
}
