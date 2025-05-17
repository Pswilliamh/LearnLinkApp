'use server';
/**
 * @fileOverview A translation AI agent.
 *
 * - translateContent - A function that handles the translation process.
 * - TranslateContentInput - The input type for the translateContent function.
 * - TranslateContentOutput - The return type for the translateContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateContentInputSchema = z.object({
  textContent: z.string().describe('The text content to translate.'),
  sourceLanguage: z.string().describe('The source language of the text (e.g., "English", "Bahasa Indonesia").'),
  targetLanguage: z.string().describe('The target language for the translation (e.g., "Bahasa Indonesia", "English").'),
});
export type TranslateContentInput = z.infer<typeof TranslateContentInputSchema>;

const TranslateContentOutputSchema = z.object({
  translatedText: z.string().describe('The translated content in the target language.'),
});
export type TranslateContentOutput = z.infer<typeof TranslateContentOutputSchema>;

export async function translateContent(input: TranslateContentInput): Promise<TranslateContentOutput> {
  return translateContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateContentPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: TranslateContentInputSchema},
  output: {schema: TranslateContentOutputSchema},
  prompt: `You are a translation expert.
Translate the following text from {{{sourceLanguage}}} to {{{targetLanguage}}}:

{{{textContent}}}

Provide only the translated text.`,
});

const translateContentFlow = ai.defineFlow(
  {
    name: 'translateContentFlow',
    inputSchema: TranslateContentInputSchema,
    outputSchema: TranslateContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get a response from the AI model for translation.');
    }
    return output;
  }
);
