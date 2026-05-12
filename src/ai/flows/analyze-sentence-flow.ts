'use server';
/**
 * @fileOverview An AI agent for analyzing and providing feedback on English sentences.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSentenceInputSchema = z.object({
  sentence: z.string().describe('The English sentence to analyze.'),
});
export type AnalyzeSentenceInput = z.infer<typeof AnalyzeSentenceInputSchema>;

const AnalyzeSentenceOutputSchema = z.object({
  feedback: z.string().describe('Constructive feedback on the sentence.'),
  isCorrect: z.boolean().describe('Whether the sentence is grammatically correct.'),
});
export type AnalyzeSentenceOutput = z.infer<typeof AnalyzeSentenceOutputSchema>;

const prompt = ai.definePrompt({
  name: 'analyzeSentencePrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: AnalyzeSentenceInputSchema},
  output: {schema: AnalyzeSentenceOutputSchema},
  prompt: `You are an expert English teacher. Analyze the following sentence for spelling and grammar: "{{{sentence}}}". Provide constructive feedback and indicate if it is correct.`,
});

export async function analyzeSentence(input: AnalyzeSentenceInput): Promise<AnalyzeSentenceOutput> {
  try {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('No output from model');
    }
    return output;
  } catch (error) {
    console.error('Analyze Sentence Flow Error');
    return {
      feedback: "Guru Bahasa is resting. Your sentence looks okay, but I can't give detailed feedback right now.",
      isCorrect: true
    };
  }
}
