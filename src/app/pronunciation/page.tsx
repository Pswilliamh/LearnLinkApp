// src/app/pronunciation/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2, Mic } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PhoneticSound {
  sound: string;
  symbol: string;
  exampleWord: string;
  description: string;
}

const commonSounds: PhoneticSound[] = [
  { sound: "Short 'a'", symbol: "/æ/", exampleWord: "cat", description: "As in 'apple' or 'bat'." },
  { sound: "Long 'e'", symbol: "/iː/", exampleWord: "see", description: "As in 'meet' or 'sleep'." },
  { sound: "Short 'i'", symbol: "/ɪ/", exampleWord: "sit", description: "As in 'ship' or 'live'." },
  { sound: "Consonant 'th' (voiced)", symbol: "/ð/", exampleWord: "this", description: "As in 'that' or 'mother'." },
  { sound: "Consonant 'sh'", symbol: "/ʃ/", exampleWord: "ship", description: "As in 'shoe' or 'fish'." },
];

export default function PronunciationPage() {
  const [isListening, setIsListening] = useState(false);

  const handlePlaySound = (textToSpeak: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
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
  
  useEffect(() => {
    // Placeholder for any client-side specific logic on mount
  }, []);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary flex items-center gap-2">
            <Volume2 className="h-8 w-8" /> Pronunciation Guide
          </CardTitle>
          <CardDescription>Learn and practice common English sounds.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {commonSounds.map((item) => (
          <Card key={item.sound} className="hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-xl text-primary">{item.sound} - <span className="font-mono text-accent">{item.symbol}</span></CardTitle>
              <CardDescription>Example: <span className="font-semibold">{item.exampleWord}</span></CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{item.description}</p>
              <Button 
                onClick={() => handlePlaySound(item.exampleWord)} 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                aria-label={`Pronounce ${item.exampleWord}`}
              >
                <Volume2 className="mr-2 h-4 w-4" /> Hear Example
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
