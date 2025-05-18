
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FlipbookPageItem {
  id: number;
  title: string;
  itemName: string;
  imageSrc: string;
  imageHint: string;
}

const flipbookPagesData: FlipbookPageItem[] = [
  { id: 1, title: "Household Items", itemName: "Table", imageSrc: "/images/flipbook-table.png", imageHint: "dining room table" },
  { id: 2, title: "Living Room", itemName: "Lamp", imageSrc: "/images/flipbook-lamp.png", imageHint: "floor lamp" },
  { id: 3, title: "Furniture", itemName: "Chair", imageSrc: "/images/flipbook-chair.png", imageHint: "wooden kitchen chair" },
  { id: 4, title: "Bedroom", itemName: "Bed", imageSrc: "/images/flipbook-bed.png", imageHint: "comfortable double bed" },
  { id: 5, title: "Electronics", itemName: "Television", imageSrc: "/images/flipbook-television.png", imageHint: "modern flat screen tv" },
];

export default function FlipbookPage() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const { toast } = useToast();

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

  const speakWord = (word: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      // Cancel any ongoing speech before speaking anew
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

  // Effect to handle potential client-side only initial state if needed
  useEffect(() => {
    // For now, no specific client-side only setup needed for initial page index.
  }, []);

  const currentPageData = flipbookPagesData[currentPageIndex];

  return (
    <div className="space-y-8 flex flex-col items-center">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary text-center">Interactive Vocabulary Flipbook</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Flip through pages to learn household items. Tap the image to hear its name.
          </CardDescription>
        </CardHeader>
      </Card>

      <div 
        className="w-full max-w-[600px] h-[400px] mx-auto relative bg-card text-card-foreground rounded-xl shadow-2xl border-2 border-primary p-1 overflow-hidden"
        aria-live="polite"
        aria-atomic="true"
        role="region"
        aria-roledescription="flipbook"
      >
        {currentPageData && (
          <div className="w-full h-full flex flex-col items-center justify-between p-6 text-center ">
            <h2 className="text-2xl font-semibold text-primary">{currentPageData.title}</h2>
            
            <div 
              onClick={() => speakWord(currentPageData.itemName)} 
              className="my-4 cursor-pointer transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') speakWord(currentPageData.itemName); }}
              role="button"
              aria-label={`Pronounce ${currentPageData.itemName}`}
            >
              <Image
                src={currentPageData.imageSrc}
                alt={currentPageData.itemName}
                data-ai-hint={currentPageData.imageHint}
                width={200}
                height={150} 
                className="rounded-md object-contain"
              />
              <p className="mt-2 text-xl font-medium text-accent">{currentPageData.itemName}</p>
            </div>

            <div className="w-full flex justify-between items-center">
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
          </div>
        )}
      </div>
    </div>
  );
}
