'use server';
/**
 * @fileOverview An AI agent for providing detailed information about an English word.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetWordInfoInputSchema = z.object({
  word: z.string().describe('The English word.'),
});
export type GetWordInfoInput = z.infer<typeof GetWordInfoInputSchema>;

const GetWordInfoOutputSchema = z.object({
  originalWord: z.string(),
  englishDefinition: z.string(),
  englishExample: z.string(),
  bahasaTranslationWord: z.string(),
  bahasaDefinition: z.string(),
  bahasaExample: z.string(),
});
export type GetWordInfoOutput = z.infer<typeof GetWordInfoOutputSchema>;

const prompt = ai.definePrompt({
  name: 'getWordInfoPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: GetWordInfoInputSchema},
  output: {schema: GetWordInfoOutputSchema},
  prompt: `Provide info for word: "{{{word}}}". Include definition, example, and Bahasa translations.`,
});

export async function getWordInfo(input: GetWordInfoInput): Promise<GetWordInfoOutput> {
  try {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('No output from model');
    }
    return output;
  } catch (error) {
    console.error('Get Word Info Flow Error:', error);
    return {
      originalWord: input.word,
      englishDefinition: "Definition currently unavailable.",
      englishExample: "Example currently unavailable.",
      bahasaTranslationWord: "Terjemahan tidak tersedia.",
      bahasaDefinition: "Definisi tidak tersedia.",
      bahasaExample: "Contoh tidak tersedia."
    };
  }
}
