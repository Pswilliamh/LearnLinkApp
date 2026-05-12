'use server';
/**
 * @fileOverview An AI agent for providing detailed feedback on a user's spoken phrase.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateSpeechInputSchema = z.object({
  userAttempt: z.string().describe("The user's spoken phrase."),
  targetPhrase: z.string().describe('The intended target phrase.'),
});
export type EvaluateSpeechInput = z.infer<typeof EvaluateSpeechInputSchema>;

const EvaluateSpeechOutputSchema = z.object({
  feedback: z.string().describe("The AI tutor's feedback."),
  isCorrect: z.boolean().describe('Whether the attempt was close enough.'),
});
export type EvaluateSpeechOutput = z.infer<typeof EvaluateSpeechOutputSchema>;

const prompt = ai.definePrompt({
  name: 'evaluateSpeechPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: EvaluateSpeechInputSchema},
  output: {schema: EvaluateSpeechOutputSchema},
  prompt: `Compare User Attempt: "{{userAttempt}}" to Target: "{{targetPhrase}}". Provide feedback in English.`,
});

export async function evaluateSpeech(input: EvaluateSpeechInput): Promise<EvaluateSpeechOutput> {
  try {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('No output from model');
    }
    return output;
  } catch (error) {
    console.error('Evaluate Speech Flow Error');
    return {
      feedback: "I heard you, but I can't analyze it right now. Good effort!",
      isCorrect: true
    };
  }
}
