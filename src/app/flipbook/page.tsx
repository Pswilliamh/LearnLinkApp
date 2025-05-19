
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Volume2, LanguagesIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FlipbookPageItem {
  id: number;
  title: string;
  itemName: string;
  bahasaName: string; // Added Bahasa Indonesia name
  imageSrc: string;
  imageHint: string;
}

const flipbookPagesData: FlipbookPageItem[] = [
  { id: 1, title: "Household Items", itemName: "Table", bahasaName: "Meja", imageSrc: "/images/flipbook-table.png", imageHint: "Wooden dining room table in a bright kitchen" },
  { id: 2, title: "Living Room", itemName: "Lamp", bahasaName: "Lampu", imageSrc: "/images/flipbook-lamp.png", imageHint: "Modern floor lamp standing beside a sofa" },
  { id: 3, title: "Furniture", itemName: "Chair", bahasaName: "Kursi", imageSrc: "/images/flipbook-chair.png", imageHint: "Comfortable armchair with a cushion in a cozy living room" },
  { id: 4, title: "Bedroom", itemName: "Bed", bahasaName: "Tempat Tidur", imageSrc: "/images/flipbook-bed.png", imageHint: "Neatly made double bed with pillows in a sunlit bedroom" },
  { id: 5, title: "Electronics", itemName: "Television", bahasaName: "Televisi", imageSrc: "/images/flipbook-television.png", imageHint: "Flat screen television mounted on a wall displaying a nature scene" },
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
        className="w-full max-w-[600px] h-auto min-h-[450px] md:min-h-[400px] mx-auto relative bg-card text-card-foreground rounded-xl shadow-2xl border-2 border-primary p-1 overflow-hidden flex flex-col"
        aria-live="polite"
        aria-atomic="true"
        role="region"
        aria-roledescription="flipbook"
      >
        {currentPageData ? (
          <>
            <div className="flex-grow w-full flex flex-col items-center justify-start p-6 text-center space-y-3">
              <h2 className="text-2xl font-semibold text-primary">{currentPageData.title}</h2>

              <div
                onClick={!isEnglishNameVisible ? handleImageTap : undefined}
                className={`my-2 transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md ${!isEnglishNameVisible ? 'cursor-pointer' : ''}`}
                tabIndex={!isEnglishNameVisible ? 0 : -1}
                onKeyPress={(e) => { if (!isEnglishNameVisible && (e.key === 'Enter' || e.key === ' ')) handleImageTap(); }}
                role={!isEnglishNameVisible ? "button" : undefined}
                aria-label={!isEnglishNameVisible ? `Reveal name for ${currentPageData.itemName}` : undefined}
              >
                <Image
                  src={currentPageData.imageSrc}
                  alt={currentPageData.itemName}
                  data-ai-hint={currentPageData.imageHint}
                  width={200}
                  height={150}
                  className="rounded-md object-contain"
                />
              </div>

              {!isEnglishNameVisible && (
                <p className="text-sm text-muted-foreground italic">Tap the image to reveal the name.</p>
              )}

              {isEnglishNameVisible && (
                <div className="space-y-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-2xl font-bold text-accent">{currentPageData.itemName}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => speakWord(currentPageData.itemName, 'en-US')}
                      aria-label={`Pronounce ${currentPageData.itemName}`}
                      className="h-8 w-8 text-primary hover:text-accent"
                    >
                      <Volume2 className="h-5 w-5" />
                    </Button>
                  </div>

                  {!isBahasaNameVisible && (
                    <Button onClick={handleShowTranslation} variant="outline" size="sm">
                      <LanguagesIcon className="mr-2 h-4 w-4" /> Show Translation
                    </Button>
                  )}
                </div>
              )}

              {isEnglishNameVisible && isBahasaNameVisible && (
                <div className="space-y-1 text-center mt-2">
                   <div className="flex items-center justify-center gap-2">
                    <p className="text-xl font-medium text-secondary-foreground">{currentPageData.bahasaName}</p>
                     <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => speakWord(currentPageData.bahasaName, 'id-ID')}
                      aria-label={`Pronounce ${currentPageData.bahasaName} in Bahasa Indonesia`}
                      className="h-7 w-7 text-primary hover:text-accent"
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full flex justify-between items-center p-4 border-t border-border mt-auto">
              <Button
                onClick={handlePrevPage}
                disabled={currentPageIndex === 0}
                variant="outline"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                aria-label="Previous page"
              >
                <ChevronLeft className="mr-2 h-5 w-5" /> Previous
              </Button>
              <p className="text-sm text-muted-foreground">
                Page {currentPageIndex + 1} of {flipbookPagesData.length}
              </p>
              <Button
                onClick={handleNextPage}
                disabled={currentPageIndex === flipbookPagesData.length - 1}
                variant="outline"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
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
