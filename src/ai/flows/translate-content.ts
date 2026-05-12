'use server';
/**
 * @fileOverview A translation AI agent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateContentInputSchema = z.object({
  textContent: z.string(),
  sourceLanguage: z.string(),
  targetLanguage: z.string(),
});
export type TranslateContentInput = z.infer<typeof TranslateContentInputSchema>;

const TranslateContentOutputSchema = z.object({
  translatedText: z.string(),
});
export type TranslateContentOutput = z.infer<typeof TranslateContentOutputSchema>;

const prompt = ai.definePrompt({
  name: 'translateContentPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: TranslateContentInputSchema},
  output: {schema: TranslateContentOutputSchema},
  prompt: `Translate from {{{sourceLanguage}}} to {{{targetLanguage}}}: {{{textContent}}}`,
});

export async function translateContent(input: TranslateContentInput): Promise<TranslateContentOutput> {
  try {
    const {output} = await prompt(input);
    if (!output) {
      return { translatedText: input.textContent };
    }
    return output;
  } catch (error) {
    console.error('Translate Content Flow Error:', error);
    return { translatedText: `[Translation Error: ${input.textContent}]` };
  }
}
