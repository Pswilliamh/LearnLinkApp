import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { firebase } from '@genkit-ai/firebase'; // Example if using Firebase plugin

export const ai = genkit({
  plugins: [
    googleAI(),
    // firebase() // If you plan to use Firebase for Genkit features (e.g., flow state, traces)
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
  flowStateStore: 'firebase', // Example: using Firestore for flow state
  traceStore: 'firebase', // Example: using Firestore for traces
});
