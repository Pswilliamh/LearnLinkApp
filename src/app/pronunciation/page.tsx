
// src/app/pronunciation/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2, Mic, PlayCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface PhoneticSound {
  sound: string;
  symbol: string;
  exampleWord: string;
  exampleSentence: string; // Added example sentence
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
  const [isListening, setIsListening] = useState(false);
  const [activeSentenceKey, setActiveSentenceKey] = useState<string | null>(null);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState<number | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Function to cancel any ongoing speech
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
    // Cleanup speech synthesis on component unmount
    return () => {
      cancelSpeech();
    };
  }, []);

  const speakAndHighlight = (sentenceText: string, sentenceKey: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert("Speech synthesis is not supported in your browser.");
      return;
    }

    // If this sentence is already playing, or another is, cancel it.
    cancelSpeech(); 
    
    // If the same sentence button is clicked again while it was active (but speech finished),
    // this allows it to replay. If it was already playing, cancelSpeech above handles it.
    // If it's a new sentence, this ensures states are fresh.
    setActiveSentenceKey(sentenceKey);
    setHighlightedWordIndex(-1); // Reset to pre-highlight state

    const words = sentenceText.split(/(\s+)/).filter(word => word.trim().length > 0); // Split by space, keeping spaces for char count but filter out empty strings
    
    const utterance = new SpeechSynthesisUtterance(sentenceText);
    utterance.lang = 'en-US';
    utteranceRef.current = utterance;

    let charCounter = 0;
    const wordBoundaries: { word: string, start: number, end: number }[] = [];
    sentenceText.split(' ').forEach(word => {
      if (word.length > 0) {
        wordBoundaries.push({ word, start: charCounter, end: charCounter + word.length });
      }
      charCounter += word.length + 1; // +1 for the space
    });


    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        let currentWordIdx = -1;
        for(let i=0; i < wordBoundaries.length; i++) {
          // Check if the character index of the event is within the boundaries of the current word
          if (event.charIndex >= wordBoundaries[i].start && event.charIndex < wordBoundaries[i].end) {
            currentWordIdx = i;
            break;
          }
          // A simpler check if charLength is available and accurate for the word
          // if (event.charIndex === wordBoundaries[i].start) {
          //   currentWordIdx = i;
          //   break;
          // }
        }
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
      alert(`Speech error: ${event.error}`);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Placeholder for actual speech recognition integration
    if (!isListening) {
      alert("Speech recognition practice would start here (not implemented).");
    } else {
      alert("Speech recognition practice would stop here (not implemented).");
    }
  };
  
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary flex items-center gap-2">
            <Volume2 className="h-8 w-8" /> Pronunciation Guide
          </CardTitle>
          <CardDescription>Learn common English sounds. Click "Read Sentence" to hear and see words highlighted.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {commonSounds.map((item) => (
          <Card key={item.sound} className="hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-xl text-primary">{item.sound} - <span className="font-mono text-accent">{item.symbol}</span></CardTitle>
              <CardDescription>Example Word: <span className="font-semibold">{item.exampleWord}</span></CardDescription>
            </CardHeader>
            <CardContent>
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
              <Button 
                onClick={() => speakAndHighlight(item.exampleSentence, item.sound)} 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                aria-label={`Read sentence for ${item.sound}: ${item.exampleSentence}`}
              >
                <PlayCircle className="mr-2 h-4 w-4" /> Read Sentence & Highlight
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Practice Speaking</CardTitle>
          <CardDescription>Try saying some words and get feedback (feature coming soon!).</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            onClick={toggleListening} 
            className={`w-1/2 ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-accent text-accent-foreground hover:bg-accent/90'}`}
            aria-label={isListening ? "Stop listening" : "Start listening practice"}
          >
            <Mic className="mr-2 h-5 w-5" /> {isListening ? 'Stop Listening' : 'Start Practice'}
          </Button>
          {isListening && <p className="mt-2 text-sm text-muted-foreground animate-pulse">Listening...</p>}
        </CardContent>
      </Card>
    </div>
  );
}

