
'use server';
/**
 * @fileOverview A vocabulary word sentence suggestion AI agent.
 *
 * - suggestSentences - A function that suggests example sentences for a given vocabulary word.
 * - SuggestSentencesInput - The input type for the suggestSentences function.
 * - SuggestSentencesOutput - The return type for the suggestSentences function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSentencesInputSchema = z.object({
  word: z.string().describe('The vocabulary word to generate example sentences for.'),
});
export type SuggestSentencesInput = z.infer<typeof SuggestSentencesInputSchema>;

const SuggestSentencesOutputSchema = z.object({
  sentences: z
    .array(z.string())
    .describe('An array of example sentences for the vocabulary word.'),
});
export type SuggestSentencesOutput = z.infer<typeof SuggestSentencesOutputSchema>;

export async function suggestSentences(input: SuggestSentencesInput): Promise<SuggestSentencesOutput> {
  return suggestSentencesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSentencesPrompt',
  model: 'googleai/gemini-1.5-flash-latest', // Added model
  input: {schema: SuggestSentencesInputSchema},
  output: {schema: SuggestSentencesOutputSchema},
  prompt: `You are an expert English teacher specializing in teaching English to non-native speakers.

You will generate 3 example sentences for the given vocabulary word that are:

*   grammatically correct
*   contextually relevant
*   easy to understand

Word: {{{word}}}
Sentences:`,
});

const suggestSentencesFlow = ai.defineFlow(
  {
    name: 'suggestSentencesFlow',
    inputSchema: SuggestSentencesInputSchema,
    outputSchema: SuggestSentencesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

