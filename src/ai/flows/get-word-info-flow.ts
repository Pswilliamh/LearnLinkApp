
'use server';
/**
 * @fileOverview An AI agent for providing detailed information about an English word.
 *
 * - getWordInfo - A function that provides the English definition, an example sentence,
 *   and their Bahasa Indonesia translations for a given English word.
 * - GetWordInfoInput - The input type for the getWordInfo function.
 * - GetWordInfoOutput - The return type for the getWordInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetWordInfoInputSchema = z.object({
  word: z.string().describe('The English word to get information for.'),
});
export type GetWordInfoInput = z.infer<typeof GetWordInfoInputSchema>;

const GetWordInfoOutputSchema = z.object({
  originalWord: z.string().describe('The original English word provided.'),
  englishDefinition: z.string().describe('A concise definition of the word in English.'),
  englishExample: z.string().describe('An example sentence using the word in English.'),
  bahasaTranslationWord: z.string().describe('The Bahasa Indonesia translation of the word.'),
  bahasaDefinition: z.string().describe('The Bahasa Indonesia translation of the English definition.'),
  bahasaExample: z.string().describe('The Bahasa Indonesia translation of the English example sentence.'),
});
export type GetWordInfoOutput = z.infer<typeof GetWordInfoOutputSchema>;

export async function getWordInfo(input: GetWordInfoInput): Promise<GetWordInfoOutput> {
  return getWordInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getWordInfoPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: GetWordInfoInputSchema},
  output: {schema: GetWordInfoOutputSchema},
  prompt: `You are an expert linguist and English-to-Bahasa Indonesia translator.
For the given English word: {{{word}}}

1.  Provide the original English word.
2.  Provide a concise definition for this word in English.
3.  Provide one distinct and grammatically correct example sentence in English using the word.
4.  Translate the original English word into Bahasa Indonesia.
5.  Translate the English definition from step 2 into Bahasa Indonesia.
6.  Translate the English example sentence from step 3 into Bahasa Indonesia.

Ensure the translations are accurate and natural-sounding.
Provide the output in the specified JSON format.
`,
});

const getWordInfoFlow = ai.defineFlow(
  {
    name: 'getWordInfoFlow',
    inputSchema: GetWordInfoInputSchema,
    outputSchema: GetWordInfoOutputSchema,
  },
  async (input) => {
    const {output} = await prompt({word: input.word});
    if (!output) {
      throw new Error('Failed to get a response from the AI model for word information.');
    }
    // Ensure the original word is part of the output, even if the model omits it.
    return {
        ...output,
        originalWord: input.word 
    };
  }
);

    