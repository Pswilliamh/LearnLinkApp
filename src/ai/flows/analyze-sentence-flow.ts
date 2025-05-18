
'use server';
/**
 * @fileOverview An AI agent for analyzing and providing feedback on English sentences.
 *
 * - analyzeSentence - A function that checks a sentence for spelling and grammar errors and provides feedback.
 * - AnalyzeSentenceInput - The input type for the analyzeSentence function.
 * - AnalyzeSentenceOutput - The return type for the analyzeSentence function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSentenceInputSchema = z.object({
  sentence: z.string().describe('The English sentence to analyze.'),
});
export type AnalyzeSentenceInput = z.infer<typeof AnalyzeSentenceInputSchema>;

const AnalyzeSentenceOutputSchema = z.object({
  feedback: z.string().describe('Constructive feedback on the sentence, highlighting any spelling or grammar issues and suggesting improvements. If the sentence is perfect, it should say so.'),
  isCorrect: z.boolean().describe('Whether the sentence is grammatically correct and has no spelling errors.'),
});
export type AnalyzeSentenceOutput = z.infer<typeof AnalyzeSentenceOutputSchema>;

export async function analyzeSentence(input: AnalyzeSentenceInput): Promise<AnalyzeSentenceOutput> {
  return analyzeSentenceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSentencePrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: AnalyzeSentenceInputSchema},
  output: {schema: AnalyzeSentenceOutputSchema},
  prompt: `You are an expert English teacher reviewing a student's sentence.
The student is learning English.
Analyze the following sentence for spelling errors and grammatical correctness:
"{{{sentence}}}"

Provide constructive feedback.
If there are errors, clearly point them out and suggest corrections.
If the sentence is perfectly correct, congratulate the student.
Indicate if the sentence isCorrect (true/false).
Keep your feedback concise and encouraging.
`,
});

const analyzeSentenceFlow = ai.defineFlow(
  {
    name: 'analyzeSentenceFlow',
    inputSchema: AnalyzeSentenceInputSchema,
    outputSchema: AnalyzeSentenceOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get a response from the AI model for sentence analysis.');
    }
    return output;
  }
);
