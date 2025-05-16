// src/app/sentences/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CaseSensitive, Wand2 } from 'lucide-react';
import { useState, useEffect } from 'react';
// In a real scenario, this would import your Genkit flow
// import { suggestSentences } from '@/ai/flows/sentence-suggester'; 

export default function SentencesPage() {
  const [topic, setTopic] = useState('');
  const [suggestedSentences, setSuggestedSentences] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuggestSentences = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic or word.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuggestedSentences([]);

    // Placeholder for Genkit AI call
    // In a real scenario, you would call your Genkit flow here:
    // try {
    //   const result = await suggestSentences({ topic: topic }); // Assuming your flow takes a topic
    //   setSuggestedSentences(result.sentences);
    // } catch (e) {
    //   setError('Failed to suggest sentences. Please try again.');
    //   console.error(e);
    // }
    
    // Mock AI response for now
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSuggestedSentences([
      `This is a sentence about ${topic}.`,
      `${topic} can be very interesting.`,
      `Let's learn more about ${topic}.`,
    ]);

    setIsLoading(false);
  };
  
  useEffect(() => {
    // Placeholder for any client-side specific logic on mount
  }, []);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary flex items-center gap-2">
            <CaseSensitive className="h-8 w-8" /> Sentence Builder & Suggester
          </CardTitle>
          <CardDescription>Learn to form English sentences and get AI-powered suggestions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="topic-input" className="block text-sm font-medium text-foreground mb-1">
                Enter a topic or word (e.g., "family", "school", "cat"):
              </label>
              <Input 
                id="topic-input"
                type="text" 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Type a topic here..."
                className="max-w-md"
              />
            </div>
            <Button onClick={handleSuggestSentences} disabled={isLoading} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Wand2 className="mr-2 h-4 w-4" /> 
              {isLoading ? 'Suggesting...' : 'Suggest Sentences'}
            </Button>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </CardContent>
      </Card>

      {suggestedSentences.length > 0 && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Suggested Sentences for "{topic}"</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              {suggestedSentences.map((sentence, index) => (
                <li key={index} className="text-lg">{sentence}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-md">
        <CardHeader>
            <CardTitle className="text-2xl text-primary">Practice Writing</CardTitle>
            <CardDescription>Try writing your own sentences below.</CardDescription>
        </CardHeader>
        <CardContent>
            <Textarea placeholder="Write your sentences here..." className="min-h-[150px]" />
            <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">Submit Practice (Not Implemented)</Button>
        </CardContent>
      </Card>
    </div>
  );
}
