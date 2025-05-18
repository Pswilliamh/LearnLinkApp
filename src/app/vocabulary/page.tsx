
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
  { word: 'Apple', translation: 'Apel', imageSrc: '/images/vocab-apple.png', imageHint: "A shiny red apple, simple and iconic, on a clean white background, clear educational illustration.", exampleSentence: 'I eat an apple every day.' },
  { word: 'Book', translation: 'Buku', imageSrc: '/images/vocab-book.png', imageHint: "A colorful, closed children's storybook with an engaging cover illustration, inviting to read, educational style.", exampleSentence: 'This is an interesting book.' },
  { word: 'Cat', translation: 'Kucing', imageSrc: '/images/vocab-cat.png', imageHint: "A cute, friendly cartoon cat sitting attentively, appealing to children, simple background, educational illustration.", exampleSentence: 'The cat is sleeping on the mat.' },
  { word: 'Dog', translation: 'Anjing', imageSrc: '/images/vocab-dog.png', imageHint: "A happy, playful cartoon dog wagging its tail, friendly and approachable for kids, simple background, educational illustration.", exampleSentence: 'My dog loves to play fetch.' },
  { word: 'House', translation: 'Rumah', imageSrc: '/images/vocab-house.png', imageHint: "A simple, cozy cartoon house with a door and windows, welcoming and cheerful, illustrative educational style.", exampleSentence: 'This is our new house.' },
  { word: 'School', translation: 'Sekolah', imageSrc: '/images/vocab-school.png', imageHint: "A friendly-looking cartoon school building with a welcoming entrance, bright colors, educational setting illustration.", exampleSentence: 'Children go to school to learn.' },
  { word: 'Parrot', translation: 'Burung Beo', imageSrc: '/images/vocab-parrot.png', imageHint: "A colorful parrot perched on a branch, vibrant feathers, tropical bird illustration.", exampleSentence: 'The parrot can mimic human speech.' },
];

export default function VocabularyPage() {
  const [revealedItems, setRevealedItems] = useState<Record<string, boolean>>({});

  const handlePronunciation = (word: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      // Cancel any ongoing speech before speaking anew
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleRevealItem = (word: string) => {
    setRevealedItems(prev => ({ ...prev, [word]: !prev[word] }));
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
          <CardDescription>
            Learn new English words. Tap an image to reveal the word and its translation! (More words can be added here!)
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vocabularyList.map((item) => (
          <Card 
            key={item.word} 
            className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => toggleRevealItem(item.word)}
          >
            <div className="relative w-full h-48"> {/* Ensure images have a consistent aspect ratio container */}
              <Image 
                src={item.imageSrc} 
                alt={item.word} 
                data-ai-hint={item.imageHint}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-t-md"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <CardHeader className="flex-grow pt-4 pb-2">
              {revealedItems[item.word] ? (
                <>
                  <CardTitle className="text-2xl text-primary">{item.word}</CardTitle>
                  <p className="text-lg text-accent">{item.translation}</p>
                </>
              ) : (
                <CardTitle className="text-2xl text-primary h-14">Tap to reveal</CardTitle> // Placeholder height
              )}
            </CardHeader>
            <CardContent className="pt-2 pb-4">
              {revealedItems[item.word] && (
                <p className="text-sm text-muted-foreground mt-1">{item.exampleSentence}</p>
              )}
              <Button 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card's onClick from firing
                  handlePronunciation(item.word);
                }} 
                className="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
                aria-label={`Pronounce ${item.word}`}
              >
                <Volume2 className="mr-2 h-4 w-4" /> Pronounce
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
       {vocabularyList.length === 0 && <p className="text-muted-foreground text-center py-4">No vocabulary items available yet. Add some to the list!</p>}
       {vocabularyList.length > 0 && vocabularyList.length < 10 && (
        <p className="text-muted-foreground text-center py-4">
          You can add many more words to the <code>vocabularyList</code> in this file!
        </p>
      )}
    </div>
  );
}
