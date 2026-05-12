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
  isCorrect: z.boolean().describe('Whether the attempt was close enough to the target.'),
});
export type EvaluateSpeechOutput = z.infer<typeof EvaluateSpeechOutputSchema>;

const prompt = ai.definePrompt({
  name: 'evaluateSpeechPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: EvaluateSpeechInputSchema},
  output: {schema: EvaluateSpeechOutputSchema},
  system: "You are a pronunciation coach. Compare the user's spoken attempt to the target phrase and provide encouraging, precise feedback.",
  prompt: `Compare User Attempt: "{{userAttempt}}" to Target: "{{targetPhrase}}". Was it accurate? Provide feedback.`,
});

export async function evaluateSpeech(input: EvaluateSpeechInput): Promise<EvaluateSpeechOutput> {
  try {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('No output from model');
    }
    return output;
  } catch (error: any) {
    console.error('Evaluate Speech Error:', error.message || error);
    return {
      feedback: "I heard you, but I can't analyze the precision right now. Good effort!",
      isCorrect: true
    };
  }
}
