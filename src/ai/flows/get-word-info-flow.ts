'use server';
/**
 * @fileOverview An AI agent for providing detailed information about an English word.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetWordInfoInputSchema = z.object({
  word: z.string().describe('The English word to explore.'),
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
  system: "You are a bilingual lexicographer. Provide detailed definitions and examples in both English and Bahasa Indonesia.",
  prompt: `Provide high-dimensional linguistic info for the word: "{{{word}}}".`,
});

export async function getWordInfo(input: GetWordInfoInput): Promise<GetWordInfoOutput> {
  try {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('No output from model');
    }
    return output;
  } catch (error: any) {
    console.error('Get Word Info Error:', error.message || error);
    return {
      originalWord: input.word,
      englishDefinition: "Information is temporarily unavailable in the logic engine.",
      englishExample: "Example currently unavailable.",
      bahasaTranslationWord: "Terjemahan tidak tersedia.",
      bahasaDefinition: "Informasi tidak tersedia saat ini.",
      bahasaExample: "Contoh tidak tersedia."
    };
  }
}
