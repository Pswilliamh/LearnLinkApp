
import { config } from 'dotenv';
config(); // Load .env file

// Import your AI flows here as you create them
import '@/ai/flows/identify-object-flow';
import '@/ai/flows/suggest-sentences';
import '@/ai/flows/translate-content';
import '@/ai/flows/get-word-info-flow';
import '@/ai/flows/analyze-sentence-flow';
import '@/ai/flows/evaluate-speech-flow';
import '@/ai/flows/generate-pronunciation-video';


// This ensures Genkit tools can find your flows during development.
console.log('Genkit development server starting... Imported AI flows.');
