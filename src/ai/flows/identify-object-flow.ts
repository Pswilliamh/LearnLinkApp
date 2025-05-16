
'use server';
/**
 * @fileOverview An AI agent for identifying objects in images.
 *
 * - identifyObject - A function that identifies an object in a photo, provides its definition, and example sentences.
 * - IdentifyObjectInput - The input type for the identifyObject function.
 * - IdentifyObjectOutput - The return type for the identifyObject function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyObjectInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo containing an object, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyObjectInput = z.infer<typeof IdentifyObjectInputSchema>;

const IdentifyObjectOutputSchema = z.object({
  objectName: z.string().describe('The name of the primary object identified in the photo.'),
  definition: z.string().describe('A concise definition of the identified object.'),
  exampleSentences: z
    .array(z.string())
    .describe('Three example sentences using the name of the identified object.'),
});
export type IdentifyObjectOutput = z.infer<typeof IdentifyObjectOutputSchema>;

export async function identifyObject(input: IdentifyObjectInput): Promise<IdentifyObjectOutput> {
  return identifyObjectFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyObjectPrompt',
  model: 'googleai/gemini-1.5-flash-latest', // Added model here
  input: {schema: IdentifyObjectInputSchema},
  output: {schema: IdentifyObjectOutputSchema},
  prompt: `You are an expert object identifier. Analyze the provided image.
Identify the primary object in the image.
Provide a concise definition for this object.
Provide three distinct and grammatically correct example sentences using the object's name.

Image: {{media url=photoDataUri}}`,
});

const identifyObjectFlow = ai.defineFlow(
  {
    name: 'identifyObjectFlow',
    inputSchema: IdentifyObjectInputSchema,
    outputSchema: IdentifyObjectOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get a response from the AI model.');
    }
    return output;
  }
);

