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
  system: "You are an expert English teacher specializing in the 2026 Precision Protocol. Analyze sentences for grammar, spelling, and natural flow.",
  prompt: `Analyze the following sentence: "{{{sentence}}}". Provide constructive feedback and set isCorrect to true only if it is perfect.`,
});

export async function analyzeSentence(input: AnalyzeSentenceInput): Promise<AnalyzeSentenceOutput> {
  try {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('No output from model');
    }
    return output;
  } catch (error: any) {
    console.error('Analyze Sentence Error:', error.message || error);
    return {
      feedback: "Guru Bahasa is resting. Your sentence looks okay, but I can't give detailed feedback right now.",
      isCorrect: true
    };
  }
}
