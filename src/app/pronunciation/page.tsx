
// src/app/pronunciation/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2, Mic, PlayCircle, Loader2, X, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { evaluateSpeech, EvaluateSpeechOutput } from '@/ai/flows/evaluate-speech-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PhoneticSound {
  sound: string;
  symbol: string;
  exampleWord: string;
  exampleSentence: string; 
  description: string;
}

const commonSounds: PhoneticSound[] = [
  { sound: "Short 'a'", symbol: "/æ/", exampleWord: "cat", exampleSentence: "The black cat sat on the mat.", description: "As in 'apple' or 'bat'." },
  { sound: "Long 'e'", symbol: "/iː/", exampleWord: "see", exampleSentence: "We see the green tree.", description: "As in 'meet' or 'sleep'." },
  { sound: "Short 'i'", symbol: "/ɪ/", exampleWord: "sit", exampleSentence: "He will sit in the big ship.", description: "As in 'ship' or 'live'." },
  { sound: "Consonant 'th' (voiced)", symbol: "/ð/", exampleWord: "this", exampleSentence: "This is their mother.", description: "As in 'that' or 'mother'." },
  { sound: "Consonant 'sh'", symbol: "/ʃ/", exampleWord: "ship", exampleSentence: "She sells sea shells.", description: "As in 'shoe' or 'fish'." },
];

export default function PronunciationPage() {
  const [activeSentenceKey, setActiveSentenceKey] = useState<string | null>(null);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState<number | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [practiceTarget, setPracticeTarget] = useState<PhoneticSound | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluateSpeechOutput | null>(null);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);
  const [userTranscript, setUserTranscript] = useState<string | null>(null);
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);

  const cancelSpeech = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    if (utteranceRef.current) {
      utteranceRef.current.onboundary = null;
      utteranceRef.current.onend = null;
      utteranceRef.current.onerror = null;
      utteranceRef.current = null;
    }
    setHighlightedWordIndex(null);
    setActiveSentenceKey(null);
  };
  
  useEffect(() => {
    // Setup SpeechRecognition
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setUserTranscript(transcript);
            if (practiceTarget) {
                handleEvaluate(transcript, practiceTarget.exampleSentence);
            }
        };

        recognitionRef.current.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            toast({ variant: "destructive", title: "Recognition Error", description: `Could not recognize speech: ${event.error}` });
            setIsListening(false);
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
        };
    }

    return () => {
      cancelSpeech();
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [practiceTarget]); // Rerun effect if practiceTarget changes

  const speakAndHighlight = (sentenceText: string, sentenceKey: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      toast({ variant: "destructive", title: "Unsupported Browser", description: "Speech synthesis is not supported in your browser."});
      return;
    }
    cancelSpeech(); 
    setActiveSentenceKey(sentenceKey);
    setHighlightedWordIndex(-1); 

    const utterance = new SpeechSynthesisUtterance(sentenceText);
    utterance.lang = 'en-US';
    utteranceRef.current = utterance;

    const words = sentenceText.split(' ');
    let charCounter = 0;
    const wordBoundaries = words.map(word => {
        const start = charCounter;
        charCounter += word.length + 1;
        return { word, start, end: charCounter - 1 };
    });

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const currentWordIdx = wordBoundaries.findIndex(boundary => event.charIndex >= boundary.start && event.charIndex < boundary.end);
        setHighlightedWordIndex(currentWordIdx);
      }
    };
    utterance.onend = () => {
        setHighlightedWordIndex(null);
        setActiveSentenceKey(null);
        utteranceRef.current = null;
    };
    utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event.error);
        setHighlightedWordIndex(null);
        setActiveSentenceKey(null);
        utteranceRef.current = null;
    };
    
    window.speechSynthesis.speak(utterance);
  };
  
  const handleStartPractice = (item: PhoneticSound) => {
    if (!recognitionRef.current) {
        toast({ variant: "destructive", title: "Unsupported Browser", description: "Speech recognition is not available in your browser." });
        return;
    }
    cancelSpeech(); // Stop any text-to-speech
    setPracticeTarget(item);
    setEvaluationResult(null);
    setEvaluationError(null);
    setUserTranscript(null);
    setIsListening(true);
    recognitionRef.current.start();
  };

  const handleEvaluate = async (userAttempt: string, targetPhrase: string) => {
      setIsEvaluating(true);
      setEvaluationError(null);
      setEvaluationResult(null);

      toast({
        title: "Evaluating Your Speech...",
        description: `You said: "${userAttempt}"`
      });

      try {
        const result = await evaluateSpeech({ userAttempt, targetPhrase });
        setEvaluationResult(result);
        toast({
          title: "Feedback Ready!",
          description: "Guru Bahasa has reviewed your sentence.",
        });
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : "An unknown error occurred.";
        setEvaluationError(errorMsg);
        toast({
          variant: "destructive",
          title: "Evaluation Failed",
          description: errorMsg,
        });
      } finally {
        setIsEvaluating(false);
      }
  };

  const closeFeedback = () => {
    setPracticeTarget(null);
    setEvaluationResult(null);
    setEvaluationError(null);
    setUserTranscript(null);
    setIsListening(false);
    setIsEvaluating(false);
  }
  
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary flex items-center gap-2">
            <Volume2 className="h-8 w-8" /> Pronunciation Guide
          </CardTitle>
          <CardDescription>Learn common English sounds. Click "Read Sentence" to hear and see words highlighted. Then, click "Practice" to get AI feedback on your speech.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {commonSounds.map((item) => (
          <Card key={item.sound} className="hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl text-primary">{item.sound} - <span className="font-mono text-accent">{item.symbol}</span></CardTitle>
              <CardDescription>Example Word: <span className="font-semibold">{item.exampleWord}</span></CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground mb-2">{item.description}</p>
              <div className="mb-4 p-3 border rounded-md bg-secondary min-h-[60px]">
                <p className="text-lg text-secondary-foreground">
                  {activeSentenceKey === item.sound && highlightedWordIndex !== null
                    ? item.exampleSentence.split(' ').map((word, index) => (
                        <span key={index} className={index === highlightedWordIndex ? 'bg-yellow-300 text-black rounded px-1' : ''}>
                          {word}{' '}
                        </span>
                      ))
                    : item.exampleSentence}
                </p>
              </div>
              <div className="flex gap-2">
                 <Button 
                    onClick={() => speakAndHighlight(item.exampleSentence, item.sound)} 
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    aria-label={`Read sentence for ${item.sound}: ${item.exampleSentence}`}
                    disabled={isListening}
                  >
                    <PlayCircle className="mr-2 h-4 w-4" /> Read
                  </Button>
                  <Button
                    onClick={() => handleStartPractice(item)}
                    disabled={isListening || isEvaluating}
                    className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                    aria-label={`Practice sentence for ${item.sound}`}
                  >
                    <Mic className="mr-2 h-4 w-4" /> Practice
                  </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {practiceTarget && (
         <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-7 w-7 text-accent"/> Feedback from Guru Bahasa
                </div>
                <Button variant="ghost" size="icon" onClick={closeFeedback}>
                  <X className="h-5 w-5"/>
                  <span className="sr-only">Close Feedback</span>
                </Button>
              </CardTitle>
              <CardDescription>Reviewing your attempt for the sentence: "{practiceTarget.exampleSentence}"</CardDescription>
            </CardHeader>
            <CardContent>
              {isListening && (
                <div className="text-center p-6">
                  <Mic className="h-12 w-12 text-red-500 animate-pulse mx-auto" />
                  <p className="mt-4 text-lg text-muted-foreground">Listening... Speak now!</p>
                </div>
              )}
               {isEvaluating && (
                <div className="text-center p-6">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                  <p className="mt-4 text-lg text-muted-foreground">Guru Bahasa is thinking...</p>
                  {userTranscript && <p className="text-sm text-muted-foreground">You said: "{userTranscript}"</p>}
                </div>
              )}
              {evaluationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Evaluation Error</AlertTitle>
                  <AlertDescription>{evaluationError}</AlertDescription>
                </Alert>
              )}
              {evaluationResult && !isEvaluating && (
                 <Alert variant={evaluationResult.isCorrect ? "default" : "destructive"}>
                  {evaluationResult.isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <AlertTitle>{evaluationResult.isCorrect ? "Excellent Work!" : "Here's some feedback:"}</AlertTitle>
                  <AlertDescription className="whitespace-pre-wrap text-base mt-2">{evaluationResult.feedback}</AlertDescription>
                </Alert>
              )}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
