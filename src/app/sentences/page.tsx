
// src/app/sentences/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CaseSensitive, Wand2, Send, Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { suggestSentences, SuggestSentencesOutput } from '@/ai/flows/suggest-sentences'; 
import { analyzeSentence, AnalyzeSentenceOutput } from '@/ai/flows/analyze-sentence-flow';

export default function SentencesPage() {
  const [topic, setTopic] = useState('');
  const [suggestedSentences, setSuggestedSentences] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);
  
  const [practiceSentence, setPracticeSentence] = useState('');
  const [isAnalyzingSentence, setIsAnalyzingSentence] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeSentenceOutput | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  const { toast } = useToast();

  const handleSuggestSentences = async () => {
    if (!topic.trim()) {
      setSuggestionsError('Please enter a topic or word.');
      toast({ variant: "destructive", title: "Input Error", description: "Please enter a topic or word." });
      return;
    }
    setIsLoadingSuggestions(true);
    setSuggestionsError(null);
    setSuggestedSentences([]);

    try {
      const result = await suggestSentences({ word: topic });
      setSuggestedSentences(result.sentences);
      toast({ title: "Sentences Suggested!", description: `Showing suggestions for "${topic}".` });
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "An unknown error occurred.";
      setSuggestionsError(`Failed to suggest sentences: ${errorMsg}`);
      toast({ variant: "destructive", title: "Suggestion Failed", description: errorMsg });
      console.error(e);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handlePracticeSubmit = async () => {
    if (!practiceSentence.trim()) {
      toast({ variant: "destructive", title: "Empty Submission", description: "Please write a sentence before submitting." });
      return;
    }
    setIsAnalyzingSentence(true);
    setAnalysisResult(null);
    setAnalysisError(null);
    
    try {
      const result = await analyzeSentence({ sentence: practiceSentence });
      setAnalysisResult(result);
      toast({ title: "Sentence Analyzed!", description: "Check the feedback below." });
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "An unknown error occurred.";
      setAnalysisError(`Failed to analyze sentence: ${errorMsg}`);
      toast({ variant: "destructive", title: "Analysis Failed", description: errorMsg });
      console.error(e);
    } finally {
      setIsAnalyzingSentence(false);
    }
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
                onChange={(e) => { setTopic(e.target.value); setSuggestionsError(null); }}
                placeholder="Type a topic here..."
                className="max-w-md"
              />
            </div>
            <Button onClick={handleSuggestSentences} disabled={isLoadingSuggestions || !topic.trim()} className="bg-accent text-accent-foreground hover:bg-accent/90">
              {isLoadingSuggestions ? <Loader2 className="animate-spin mr-2" /> : <Wand2 className="mr-2 h-4 w-4" /> }
              {isLoadingSuggestions ? 'Suggesting...' : 'Suggest Sentences'}
            </Button>
            {suggestionsError && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Suggestion Error</AlertTitle>
                <AlertDescription>{suggestionsError}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {suggestedSentences.length > 0 && !isLoadingSuggestions && (
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
            <CardTitle className="text-2xl text-primary flex items-center gap-2">
              <Sparkles className="h-7 w-7"/> Practice Writing & Get Feedback
            </CardTitle>
            <CardDescription>Try writing your own sentences below and get AI feedback on spelling and grammar.</CardDescription>
        </CardHeader>
        <CardContent>
            <Textarea 
              placeholder="Write your English sentence here..." 
              className="min-h-[100px]" // Reduced height a bit
              value={practiceSentence}
              onChange={(e) => {setPracticeSentence(e.target.value); setAnalysisResult(null); setAnalysisError(null);}} 
            />
            <Button onClick={handlePracticeSubmit} disabled={isAnalyzingSentence || !practiceSentence.trim()} className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
              {isAnalyzingSentence ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 h-4 w-4" /> }
              {isAnalyzingSentence ? 'Analyzing...' : 'Submit for Feedback'}
            </Button>
            
            {isAnalyzingSentence && !analysisResult && !analysisError && (
              <div className="text-center p-4 mt-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="mt-2 text-muted-foreground">Analyzing your sentence...</p>
              </div>
            )}

            {analysisError && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Analysis Error</AlertTitle>
                <AlertDescription>{analysisError}</AlertDescription>
              </Alert>
            )}

            {analysisResult && !isAnalyzingSentence && (
              <Alert variant={analysisResult.isCorrect ? "default" : "destructive"} className="mt-4">
                {analysisResult.isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{analysisResult.isCorrect ? "Great Job!" : "Feedback"}</AlertTitle>
                <AlertDescription className="whitespace-pre-wrap">{analysisResult.feedback}</AlertDescription>
              </Alert>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
