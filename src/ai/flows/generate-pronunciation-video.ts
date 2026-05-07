
'use server';
/**
 * @fileOverview An AI agent for generating pronunciation visual aids using Veo.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'genkit';

const GenerateVideoInputSchema = z.object({
  word: z.string().describe('The English word to generate a pronunciation video for.'),
});
export type GenerateVideoInput = z.infer<typeof GenerateVideoInputSchema>;

const GenerateVideoOutputSchema = z.object({
  videoUrl: z.string().optional().describe('The URL of the generated video (data URI).'),
  operationId: z.string().optional().describe('The ID of the video generation operation.'),
  status: z.enum(['pending', 'completed', 'failed']).describe('The current status of the generation.'),
  error: z.string().optional(),
});
export type GenerateVideoOutput = z.infer<typeof GenerateVideoOutputSchema>;

export async function startVideoGeneration(input: GenerateVideoInput): Promise<GenerateVideoOutput> {
  const { operation } = await ai.generate({
    model: googleAI.model('veo-2.0-generate-001'),
    prompt: `A close-up high-definition shot of a professional language tutor clearly pronouncing the word: "${input.word}". Focus on natural mouth movement and articulation against a professional studio background.`,
    config: {
      durationSeconds: 5,
      aspectRatio: '16:9',
    },
  });

  if (!operation) {
    return { status: 'failed', error: 'Failed to initiate video generation.' };
  }

  return { operationId: operation.name, status: 'pending' };
}

export async function checkVideoStatus(operationId: string): Promise<GenerateVideoOutput> {
  let operation = await ai.checkOperation({ name: operationId });
  
  if (operation.done) {
    if (operation.error) {
      return { status: 'failed', error: operation.error.message };
    }
    
    const video = operation.output?.message?.content.find((p) => !!p.media);
    if (!video) {
       return { status: 'failed', error: 'Generated video data not found.' };
    }

    // In a real production app, we would download and proxy this. 
    // For the prototype, we return the temporary URL.
    return { 
      videoUrl: `${video.media!.url}&key=${process.env.GEMINI_API_KEY}`, 
      status: 'completed' 
    };
  }

  return { operationId, status: 'pending' };
}
