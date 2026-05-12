'use server';
/**
 * @fileOverview An AI agent for identifying objects in images.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyObjectInputSchema = z.object({
  photoDataUri: z.string(),
});
export type IdentifyObjectInput = z.infer<typeof IdentifyObjectInputSchema>;

const IdentifyObjectOutputSchema = z.object({
  objectName: z.string(),
  definition: z.string(),
  exampleSentences: z.array(z.string()),
  bahasaDefinition: z.string(),
  bahasaExampleSentences: z.array(z.string()),
});
export type IdentifyObjectOutput = z.infer<typeof IdentifyObjectOutputSchema>;

const prompt = ai.definePrompt({
  name: 'identifyObjectPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: IdentifyObjectInputSchema},
  output: {schema: IdentifyObjectOutputSchema},
  prompt: `Identify the object in this image: {{media url=photoDataUri}}. Provide definition and examples in English and Bahasa.`,
});

export async function identifyObject(input: IdentifyObjectInput): Promise<IdentifyObjectOutput> {
  try {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('No output from model');
    }
    return output;
  } catch (error) {
    console.error('Identify Object Flow Error');
    return {
      objectName: "Unknown Object",
      definition: "I could not identify this object right now.",
      exampleSentences: ["The object is in the picture."],
      bahasaDefinition: "Saya tidak dapat mengidentifikasi objek ini saat ini.",
      bahasaExampleSentences: ["Objek ada di dalam gambar."]
    };
  }
}
