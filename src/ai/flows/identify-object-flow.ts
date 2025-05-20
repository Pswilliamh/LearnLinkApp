
'use server';
/**
 * @fileOverview An AI agent for identifying objects in images.
 *
 * - identifyObject - A function that identifies an object in a photo, provides its definition, example sentences, and their Bahasa Indonesia translations.
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
  definition: z.string().describe('A concise definition of the identified object in English.'),
  exampleSentences: z
    .array(z.string())
    .describe('Three example sentences using the name of the identified object in English.'),
  bahasaDefinition: z.string().describe('The concise definition of the identified object, translated into Bahasa Indonesia.'),
  bahasaExampleSentences: z
    .array(z.string())
    .describe('The three example sentences, translated into Bahasa Indonesia.'),
});
export type IdentifyObjectOutput = z.infer<typeof IdentifyObjectOutputSchema>;

export async function identifyObject(input: IdentifyObjectInput): Promise<IdentifyObjectOutput> {
  return identifyObjectFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyObjectPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: IdentifyObjectInputSchema},
  output: {schema: IdentifyObjectOutputSchema},
  prompt: `You are an expert object identifier and English-to-Bahasa Indonesia translator.
Analyze the provided image.
1. Identify the primary object in the image. Store this as 'objectName'.
2. Provide a concise definition for this object in English. Store this as 'definition'.
3. Provide exactly three distinct and grammatically correct example sentences in English using the object's name. Store these as an array of strings in 'exampleSentences'.
4. Translate the English definition from step 2 into Bahasa Indonesia. Store this as 'bahasaDefinition'.
5. Translate the three English example sentences from step 3 into Bahasa Indonesia. Store these as an array of strings in 'bahasaExampleSentences'.

Image: {{media url=photoDataUri}}

Provide your response as a JSON object strictly matching this schema:
{
  "objectName": "string (The name of the primary object identified in the photo.)",
  "definition": "string (A concise definition of the identified object in English.)",
  "exampleSentences": ["string (Example sentence 1)", "string (Example sentence 2)", "string (Example sentence 3)"],
  "bahasaDefinition": "string (The concise definition of the identified object, translated into Bahasa Indonesia.)",
  "bahasaExampleSentences": ["string (Translated example sentence 1)", "string (Translated example sentence 2)", "string (Translated example sentence 3)"]
}
Do not include any other text or explanations outside of this JSON object.`,
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
      throw new Error('Failed to get a valid response from the AI model for object identification.');
    }
    return output;
  }
);

