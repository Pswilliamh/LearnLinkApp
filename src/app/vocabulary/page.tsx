// src/app/vocabulary/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenText, Volume2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

type VocabularyItem = {
  word: string;
  translation: string; // Bahasa Indonesia
  imageSrc: string;
  imageHint: string;
  exampleSentence: string;
};

const vocabularyList: VocabularyItem[] = [
  { word: 'Apple', translation: 'Apel', imageSrc: 'https://placehold.co/300x200.png', imageHint: 'red apple', exampleSentence: 'I eat an apple every day.' },
  { word: 'Book', translation: 'Buku', imageSrc: 'https://placehold.co/300x200.png', imageHint: 'open book', exampleSentence: 'This is an interesting book.' },
  { word: 'Cat', translation: 'Kucing', imageSrc: 'https://placehold.co/300x200.png', imageHint: 'cute cat', exampleSentence: 'The cat is sleeping on the mat.' },
  { word: 'Dog', translation: 'Anjing', imageSrc: 'https://placehold.co/300x200.png', imageHint: 'friendly dog', exampleSentence: 'My dog loves to play fetch.' },
  { word: 'House', translation: 'Rumah', imageSrc: 'https://placehold.co/300x200.png', imageHint: 'cozy house', exampleSentence: 'This is our new house.' },
  { word: 'School', translation: 'Sekolah', imageSrc: 'https://placehold.co/300x200.png', imageHint: 'school building', exampleSentence: 'Children go to school to learn.' },
];

export default function VocabularyPage() {
  const [showTranslation, setShowTranslation] = useState<Record<string, boolean>>({});

  const handlePronunciation = (word: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleTranslation = (word: string) => {
    setShowTranslation(prev => ({ ...prev, [word]: !prev[word] }));
  };
  
  useEffect(() => {
    // Placeholder for any client-side specific logic on mount
  }, []);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary flex items-center gap-2">
            <BookOpenText className="h-8 w-8" /> Vocabulary Builder
          </CardTitle>
          <CardDescription>Learn new English words with pictures and examples.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vocabularyList.map((item) => (
          <Card key={item.word} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <Image 
              src={item.imageSrc} 
              alt={item.word} 
              data-ai-hint={item.imageHint}
              width={300} 
              height={200} 
              className="w-full h-48 object-cover"
              unoptimized={true}
            />
            <CardHeader className="flex-grow">
              <CardTitle className="text-2xl text-primary">{item.word}</CardTitle>
              {showTranslation[item.word] && (
                <p className="text-lg text-accent">{item.translation}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">{item.exampleSentence}</p>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button onClick={() => handlePronunciation(item.word)} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                <Volume2 className="mr-2 h-4 w-4" /> Pronounce
              </Button>
              <Button onClick={() => toggleTranslation(item.word)} variant="outline" className="flex-1">
                {showTranslation[item.word] ? 'Hide' : 'Show'} Translation
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
