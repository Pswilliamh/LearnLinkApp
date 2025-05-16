'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const alphabetLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function AlphabetPage() {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
    // Placeholder for pronunciation or further interaction
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(letter);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };
  
  // useEffect to handle client-side only logic if needed, for now, speech is triggered on click.
  useEffect(() => {
    // Potential future client-side enhancements
  }, []);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary">The English Alphabet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground mb-6">
            Click on a letter to hear its pronunciation and see examples.
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-9 gap-4">
            {alphabetLetters.map((letter) => (
              <Button
                key={letter}
                variant="outline"
                className="p-4 h-auto text-2xl font-bold aspect-square flex flex-col items-center justify-center
                           hover:bg-accent hover:text-accent-foreground transition-all duration-200 transform hover:scale-105
                           focus:ring-2 focus:ring-accent focus:ring-offset-2"
                onClick={() => handleLetterClick(letter)}
                aria-label={`Letter ${letter}`}
              >
                {letter}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedLetter && (
        <Card className="mt-8 shadow-md">
          <CardHeader>
            <CardTitle className="text-4xl text-accent text-center">{selectedLetter}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Examples and more information about the letter <span className="font-bold text-primary">{selectedLetter}</span> will appear here.
            </p>
            <Button 
              onClick={() => handleLetterClick(selectedLetter)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              aria-label={`Pronounce letter ${selectedLetter} again`}
            >
              <Volume2 className="mr-2 h-5 w-5" /> Hear Pronunciation
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
