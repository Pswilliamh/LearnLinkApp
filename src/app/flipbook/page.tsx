
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Volume2, LanguagesIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FlipbookPageItem {
  id: number;
  title: string; // Category title for the page
  itemName: string;
  bahasaName: string;
  imageSrc: string;
  imageHint: string;
}

// Updated to use existing images from the project
const flipbookPagesData: FlipbookPageItem[] = [
  { id: 1, title: "Household Items", itemName: "Table", bahasaName: "Meja", imageSrc: "/images/section-sentences.png", imageHint: "Children happily arranging large colorful word blocks" },
  { id: 2, title: "Furniture", itemName: "Chair", bahasaName: "Kursi", imageSrc: "/images/section-vocabulary.png", imageHint: "open illustrated children book" },
  { id: 3, title: "Living Room", itemName: "Lamp", bahasaName: "Lampu", imageSrc: "/images/infographic-dislike-hate.png", imageHint: "Educational infographic about word choice" },
  { id: 4, title: "Bedroom", itemName: "Bed", bahasaName: "Tempat Tidur", imageSrc: "/images/section-advanced-learner.png", imageHint: "stack books graduation cap" },
  { id: 5, title: "Electronics", itemName: "Television", bahasaName: "Televisi", imageSrc: "/images/section-identify-object.png", imageHint: "child looking through magnifying glass" },
  { id: 6, title: "Kitchenware", itemName: "Plate", bahasaName: "Piring", imageSrc: "/images/section-alphabet.png", imageHint: "Colorful friendly alphabet blocks" },
  { id: 7, title: "Appliances", itemName: "Refrigerator", bahasaName: "Kulkas", imageSrc: "/images/section-how-to-use.png", imageHint: "friendly question mark icon" },
  { id: 8, title: "Office Supplies", itemName: "Pen", bahasaName: "Pena", imageSrc: "/images/section-pronunciation.png", imageHint: "Stylized sound waves" },
  { id: 9, title: "Clothing", itemName: "Shirt", bahasaName: "Kemeja", imageSrc: "/images/section-match-game.png", imageHint: "Colorful puzzle pieces" },
  { id: 10, title: "Bathroom Items", itemName: "Towel", bahasaName: "Handuk", imageSrc: "/images/section-translation.png", imageHint: "Two speech bubbles with flags" },
];

export default function FlipbookPage() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isEnglishNameVisible, setIsEnglishNameVisible] = useState(false);
  const [isBahasaNameVisible, setIsBahasaNameVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Reset visibility states when the page changes
    setIsEnglishNameVisible(false);
    setIsBahasaNameVisible(false);
  }, [currentPageIndex]);

  const handleNextPage = () => {
    if (currentPageIndex < flipbookPagesData.length - 1) {
      setCurrentPageIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleImageTap = () => {
    setIsEnglishNameVisible(true);
  };

  const handleShowTranslation = () => {
    setIsBahasaNameVisible(true);
  };

  const speakWord = (word: string, lang: 'en-US' | 'id-ID' = 'en-US') => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = lang;
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        variant: "destructive",
        title: "Pronunciation Failed",
        description: "Speech synthesis is not supported in your browser.",
      });
    }
  };

  const currentPageData = flipbookPagesData[currentPageIndex];

  return (
    <div className="space-y-8 flex flex-col items-center">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary text-center">Interactive Vocabulary Flipbook</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Flip through pages. Tap the image to reveal the item's name, then see its translation.
          </CardDescription>
        </CardHeader>
      </Card>

      <div
        className="w-full max-w-[600px] h-auto min-h-[500px] md:min-h-[450px] mx-auto relative bg-card text-card-foreground rounded-xl shadow-2xl border-4 border-primary/50 p-2 overflow-hidden flex flex-col"
        style={{ boxShadow: '0 10px 20px rgba(0,0,0,0.1), 0 6px 6px rgba(0,0,0,0.15)' }}
        aria-live="polite"
        aria-atomic="true"
        role="region"
        aria-roledescription="flipbook"
      >
        {currentPageData ? (
          <>
            <div className="flex-grow w-full flex flex-col items-center justify-start p-6 text-center space-y-4">
              <h2 className="text-2xl font-semibold text-primary mb-3">{currentPageData.title}</h2>

              <div
                onClick={!isEnglishNameVisible ? handleImageTap : undefined}
                className={`my-3 transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg shadow-md overflow-hidden border-2 border-secondary ${!isEnglishNameVisible ? 'cursor-pointer' : ''}`}
                tabIndex={!isEnglishNameVisible ? 0 : -1}
                onKeyPress={(e) => { if (!isEnglishNameVisible && (e.key === 'Enter' || e.key === ' ')) handleImageTap(); }}
                role={!isEnglishNameVisible ? "button" : undefined}
                aria-label={!isEnglishNameVisible ? `Reveal name for ${currentPageData.itemName}` : undefined}
              >
                <Image
                  src={currentPageData.imageSrc}
                  alt={currentPageData.itemName}
                  data-ai-hint={currentPageData.imageHint}
                  width={250} 
                  height={180}
                  className="rounded-md object-contain bg-secondary/30"
                />
              </div>

              {!isEnglishNameVisible && (
                <p className="text-md text-muted-foreground italic">Tap the image to reveal the name.</p>
              )}

              {isEnglishNameVisible && (
                <div className="space-y-3 text-center animate-in fade-in duration-500">
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-3xl font-bold text-accent">{currentPageData.itemName}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => speakWord(currentPageData.itemName, 'en-US')}
                      aria-label={`Pronounce ${currentPageData.itemName}`}
                      className="h-9 w-9 text-primary hover:text-accent"
                    >
                      <Volume2 className="h-6 w-6" />
                    </Button>
                  </div>

                  {!isBahasaNameVisible && (
                    <Button onClick={handleShowTranslation} variant="outline" size="sm" className="bg-secondary hover:bg-secondary/80 text-secondary-foreground">
                      <LanguagesIcon className="mr-2 h-4 w-4" /> Show Translation
                    </Button>
                  )}
                </div>
              )}

              {isEnglishNameVisible && isBahasaNameVisible && (
                <div className="space-y-2 text-center mt-3 animate-in fade-in duration-500">
                   <div className="flex items-center justify-center gap-2">
                    <p className="text-2xl font-medium text-secondary-foreground">{currentPageData.bahasaName}</p>
                     <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => speakWord(currentPageData.bahasaName, 'id-ID')}
                      aria-label={`Pronounce ${currentPageData.bahasaName} in Bahasa Indonesia`}
                      className="h-8 w-8 text-primary hover:text-accent"
                    >
                      <Volume2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full flex justify-between items-center p-4 border-t border-border mt-auto bg-background/50 rounded-b-lg">
              <Button
                onClick={handlePrevPage}
                disabled={currentPageIndex === 0}
                variant="outline"
                className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm"
                aria-label="Previous page"
              >
                <ChevronLeft className="mr-2 h-5 w-5" /> Previous
              </Button>
              <p className="text-sm text-muted-foreground font-medium">
                Page {currentPageIndex + 1} of {flipbookPagesData.length}
              </p>
              <Button
                onClick={handleNextPage}
                disabled={currentPageIndex === flipbookPagesData.length - 1}
                variant="outline"
                className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm"
                aria-label="Next page"
              >
                Next <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
            <p>No flipbook pages available. Add some items to start!</p>
          </div>
        )}
      </div>
    </div>
  );
}
