'use server';
/**
 * @fileOverview An AI agent for providing detailed feedback on a user's spoken phrase.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateSpeechInputSchema = z.object({
  userAttempt: z.string().describe("The user's spoken phrase, transcribed to text."),
  targetPhrase: z.string().describe('The intended target phrase the user was trying to say.'),
});
export type EvaluateSpeechInput = z.infer<typeof EvaluateSpeechInputSchema>;

const EvaluateSpeechOutputSchema = z.object({
  feedback: z.string().describe("The AI tutor's constructive feedback on the user's attempt."),
  isCorrect: z.boolean().describe('A simple true/false whether the attempt was close enough to the target.'),
});
export type EvaluateSpeechOutput = z.infer<typeof EvaluateSpeechOutputSchema>;

const TUTOR_PROMPT = `
You are 'Guru Bahasa' (Language Teacher), an expert, friendly, and patient English and Indonesian language tutor for the LearnLink app. Your primary goal is to help the user achieve native-like fluency in English.

**GUIDELINES:**
1.  **Mode:** You are in 'Pronunciation and Sentence Correction Mode'.
2.  **Task:** Compare the User's Attempt (the transcribed speech) to the Target Phrase. 
    Provide specific, actionable, and gentle corrections on pronunciation, vocabulary, OR grammar.
3.  **Correction Logic:**
    - If the attempt is perfect or very close (e.g., minor transcription errors), congratulate the user and confirm it's correct. Set isCorrect to true.
    - If there are mistakes, clearly but gently point them out. For pronunciation, suggest how to form the sound. For grammar, explain the rule briefly.
4.  **Next Step:** After the correction, provide a new, short, related conversational question to continue the lesson.
5.  **Format:** Your entire response must be professional, encouraging, and delivered **in English**.

User's Data:
User's Attempt (Transcribed): "{{userAttempt}}"
Target Phrase: "{{targetPhrase}}"
`;

export async function evaluateSpeech(input: EvaluateSpeechInput): Promise<EvaluateSpeechOutput> {
  return evaluateSpeechFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evaluateSpeechPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: EvaluateSpeechInputSchema},
  output: {schema: EvaluateSpeechOutputSchema},
  prompt: TUTOR_PROMPT,
  config: {
    temperature: 0.5,
  }
});

const evaluateSpeechFlow = ai.defineFlow(
  {
    name: 'evaluateSpeechFlow',
    inputSchema: EvaluateSpeechInputSchema,
    outputSchema: EvaluateSpeechOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      return {
        feedback: "I couldn't hear that very clearly. Could you try saying it one more time?",
        isCorrect: false
      };
    }
    return output;
  }
);
