'use server';
/**
 * @fileOverview A vocabulary word sentence suggestion AI agent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSentencesInputSchema = z.object({
  word: z.string().describe('The vocabulary word.'),
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
  prompt: `Generate 3 example sentences for the word: "{{{word}}}".`,
});

export async function suggestSentences(input: SuggestSentencesInput): Promise<SuggestSentencesOutput> {
  try {
    const {output} = await prompt(input);
    if (!output || !output.sentences) {
      return {
        sentences: [
          `I want to learn more about ${input.word}.`,
          `Can you use ${input.word} in a sentence?`,
          `${input.word} is a useful word.`
        ]
      };
    }
    return output;
  } catch (error) {
    console.error('Suggest Sentences Flow Error');
    return {
      sentences: [
        `System is currently busy, but ${input.word} is a great word!`,
        `Let's try again in a moment.`,
        `Practice makes perfect with ${input.word}.`
      ]
    };
  }
}
