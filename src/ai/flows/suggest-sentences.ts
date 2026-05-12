'use server';
/**
 * @fileOverview A vocabulary word sentence suggestion AI agent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSentencesInputSchema = z.object({
  word: z.string().describe('The vocabulary word to use in sentences.'),
});
export type SuggestSentencesInput = z.infer<typeof SuggestSentencesInputSchema>;

const SuggestSentencesOutputSchema = z.object({
  sentences: z.array(z.string()),
});
export type SuggestSentencesOutput = z.infer<typeof SuggestSentencesOutputSchema>;

const prompt = ai.definePrompt({
  name: 'suggestSentencesPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: SuggestSentencesInputSchema},
  output: {schema: SuggestSentencesOutputSchema},
  system: "Generate natural, useful English sentences for students using the provided vocabulary word.",
  prompt: `Generate 3 diverse example sentences for the word: "{{{word}}}".`,
});

export async function suggestSentences(input: SuggestSentencesInput): Promise<SuggestSentencesOutput> {
  try {
    const {output} = await prompt(input);
    if (!output || !output.sentences) {
      throw new Error('No valid sentences returned from model.');
    }
    return output;
  } catch (error: any) {
    console.error('Suggest Sentences Error:', error.message || error);
    return {
      sentences: [
        `I am practicing the word "${input.word}".`,
        `Can you help me use "${input.word}" correctly?`,
        `Learning "${input.word}" is part of my 2026 mastery.`
      ]
    };
  }
}
