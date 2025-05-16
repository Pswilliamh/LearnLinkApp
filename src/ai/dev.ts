import { config } from 'dotenv';
config(); // Load .env file

// Import your AI flows here as you create them
// e.g., import '@/ai/flows/sentence-suggester';
// e.g., import '@/ai/flows/translation-aid';

// This ensures Genkit tools can find your flows during development.
// Make sure to create these flow files when you implement the AI features.
console.log('Genkit development server starting... Import AI flows above.');
