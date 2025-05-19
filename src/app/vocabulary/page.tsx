
// src/app/vocabulary/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpenText, Volume2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface VocabularyPhrase {
  english: string;
  bahasa: string;
}

interface VocabularyCategory {
  categoryTitle: string;
  items: VocabularyPhrase[];
}

const categorizedVocabulary: VocabularyCategory[] = [
  {
    categoryTitle: "Travel Essentials",
    items: [
      { english: "Where is the toilet?", bahasa: "Di mana toilet?" },
      { english: "How much is this?", bahasa: "Berapa harganya ini?" },
      { english: "I would like to order coffee.", bahasa: "Saya ingin memesan kopi." },
      { english: "Can you help me?", bahasa: "Bisakah Anda membantu saya?" },
      { english: "Where is the ATM?", bahasa: "Di mana ATM?" },
    ],
  },
  {
    categoryTitle: "Common Animals",
    items: [
      { english: "Dog", bahasa: "Anjing" },
      { english: "Cat", bahasa: "Kucing" },
      { english: "Bird", bahasa: "Burung" },
      { english: "Elephant", bahasa: "Gajah" },
      { english: "Parrot", bahasa: "Burung Beo" },
      { english: "Fish", bahasa: "Ikan"},
      { english: "Monkey", bahasa: "Monyet"},
    ],
  },
  {
    categoryTitle: "Vegetables",
    items: [
      { english: "Carrot", bahasa: "Wortel" },
      { english: "Broccoli", bahasa: "Brokoli" },
      { english: "Spinach", bahasa: "Bayam" },
      { english: "Potato", bahasa: "Kentang" },
      { english: "Tomato", bahasa: "Tomat"},
    ],
  },
  {
    categoryTitle: "Nature",
    items: [
      { english: "Mountain", bahasa: "Gunung" },
      { english: "River", bahasa: "Sungai" },
      { english: "Forest", bahasa: "Hutan" },
      { english: "Beach", bahasa: "Pantai" },
      { english: "Flower", bahasa: "Bunga"},
    ],
  },
  {
    categoryTitle: "Food & Dining",
    items: [
      { english: "Water", bahasa: "Air" },
      { english: "Rice", bahasa: "Nasi" },
      { english: "Chicken", bahasa: "Ayam" },
      { english: "Fruit", bahasa: "Buah" },
      { english: "Restaurant", bahasa: "Restoran"},
    ],
  },
];

export default function VocabularyPage() {
  const [revealedTranslations, setRevealedTranslations] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handlePronunciation = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        variant: "destructive",
        title: "Pronunciation Failed",
        description: "Speech synthesis is not supported in your browser.",
      });
    }
  };

  const toggleTranslationReveal = (key: string) => {
    setRevealedTranslations(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  useEffect(() => {
    // Placeholder for any client-side specific logic on mount
  }, []);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary flex items-center gap-2">
            <BookOpenText className="h-8 w-8" /> Categorized Vocabulary
          </CardTitle>
          <CardDescription>
            Explore English words and phrases by category. Tap "Show Translation" to see the Bahasa Indonesia equivalent.
          </CardDescription>
        </CardHeader>
      </Card>

      {categorizedVocabulary.length > 0 ? (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {categorizedVocabulary.map((category, catIndex) => (
            <AccordionItem value={`category-${catIndex}`} key={catIndex} className="border bg-card rounded-lg shadow-md">
              <AccordionTrigger className="text-xl hover:text-accent px-6 py-4 text-primary">
                {category.categoryTitle}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 pt-0 space-y-3">
                {category.items.map((item, itemIndex) => {
                  const translationKey = `${catIndex}-${itemIndex}`;
                  return (
                    <Card key={itemIndex} className="p-4 bg-secondary shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-lg font-medium text-secondary-foreground">{item.english}</p>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handlePronunciation(item.english)}
                          className="text-accent hover:text-accent/80"
                          aria-label={`Pronounce ${item.english}`}
                        >
                          <Volume2 className="h-5 w-5" />
                        </Button>
                      </div>
                      {revealedTranslations[translationKey] ? (
                        <p className="text-md text-accent">{item.bahasa}</p>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => toggleTranslationReveal(translationKey)}
                        >
                          Show Translation
                        </Button>
                      )}
                    </Card>
                  );
                })}
                 {category.items.length === 0 && (
                   <p className="text-muted-foreground">No items in this category yet.</p>
                 )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Card>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              No vocabulary categories available yet. Add some to get started!
            </p>
          </CardContent>
        </Card>
      )}
      {categorizedVocabulary.length > 0 && categorizedVocabulary.length < 10 && (
        <p className="text-muted-foreground text-center py-4">
          You can add many more categories and items to the <code>categorizedVocabulary</code> list in this file!
        </p>
      )}
    </div>
  );
}
