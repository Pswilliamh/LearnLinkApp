
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Lightbulb, Volume2, Languages } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface InfoItem {
  english: string;
  bahasa: string;
  englishExample?: string;
  bahasaExample?: string;
  englishBetter?: string;
  bahasaBetter?: string;
}

interface InfoCategory {
  title: string;
  description: string;
  imageSrc?: string;
  imageHint?: string;
  items: InfoItem[];
}

const culturalInfoData: InfoCategory[] = [
  {
    title: "Vocabulary in Context",
    description: "Understanding the small differences between similar words.",
    imageSrc: "/images/infographic-dislike-hate.png",
    imageHint: "Educational infographic about word choice",
    items: [
      { 
        english: "Hate vs. Dislike", 
        bahasa: "Benci vs. Tidak Suka",
        englishExample: "I hate broccoli.",
        bahasaExample: "Saya benci brokoli.",
        englishBetter: "I don't like broccoli.",
        bahasaBetter: "Saya kurang suka brokoli."
      },
      { 
        english: "Big vs. Huge vs. Massive", 
        bahasa: "Besar vs. Sangat Besar vs. Raksasa",
        englishExample: "That is a big house.",
        bahasaExample: "Itu adalah rumah yang besar."
      }
    ]
  },
  {
    title: "Common Grammar Mistakes",
    description: "Learning to use words that sound the same but have different meanings.",
    items: [
      { english: "Their / There / They’re", bahasa: "Milik mereka / Di sana / Mereka adalah" }
    ]
  },
  {
    title: "Everyday Politeness in English",
    description: "Knowing which polite phrase to use in different situations.",
    items: [
      { english: "Excuse me vs. Sorry", bahasa: "Permisi vs. Maaf" }
    ]
  },
  {
    title: "Useful Phrases for School & Life",
    description: "Essential phrases for daily communication.",
    items: [
      { english: "Asking for Help", bahasa: "Meminta Bantuan" }
    ]
  },
  {
    title: "Emotional Expression",
    description: "How to express feelings in a clear and appropriate way.",
    items: [
      { english: "How to express sadness politely", bahasa: "Cara mengungkapkan kesedihan dengan sopan" }
    ]
  },
  {
    title: "English Idioms & Sayings",
    description: "Common expressions that don't mean exactly what they say.",
    items: [
      { english: "Break the ice", bahasa: "Mencairkan suasana" },
      { english: "Spill the beans", bahasa: "Membocorkan rahasia" }
    ]
  },
  {
    title: "False Friends (Words that confuse Indonesians)",
    description: "Words that look similar in English and Bahasa Indonesia but have different meanings.",
    items: [
      { english: "Actual vs. Real", bahasa: "Sebenarnya vs. Nyata" }
    ]
  },
  {
    title: "Cultural Etiquette in English",
    description: "Important social rules for polite conversation.",
    items: [
      { english: "Don’t interrupt / Wait your turn", bahasa: "Jangan memotong pembicaraan / Tunggu giliranmu" }
    ]
  },
  {
    title: "Conversation Starters",
    description: "Simple ways to start a conversation with someone.",
    items: [
      { english: "Talking about the weather", bahasa: "Berbicara tentang cuaca" }
    ]
  },
  {
    title: "Positive Communication Habits",
    description: "Ways to make conversations more friendly and positive.",
    items: [
      { english: "Speak with kindness", bahasa: "Berbicara dengan kebaikan" },
      { english: "Give compliments", bahasa: "Memberikan pujian" }
    ]
  }
];

export default function InfographicsPage() {
  const { toast } = useToast();

  const speakText = (text: string, lang: 'en-US' | 'id-ID' = 'en-US') => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
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

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary flex items-center gap-2">
            <Lightbulb className="h-8 w-8" /> Cultural & Language Guides
          </CardTitle>
          <CardDescription>
            Learn about important language and cultural nuances through these interactive guides. Click each category to explore.
          </CardDescription>
        </CardHeader>
      </Card>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {culturalInfoData.map((category, index) => (
          <AccordionItem value={`category-${index}`} key={index} className="border bg-card rounded-lg shadow-md">
            <AccordionTrigger className="text-xl hover:text-accent px-6 py-4 text-primary text-left">
              {category.title}
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 pt-0 space-y-4">
              <p className="text-muted-foreground italic mt-2">{category.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {category.imageSrc && (
                  <div className="relative w-full h-auto aspect-[4/3] rounded-lg overflow-hidden shadow-md order-first md:order-last">
                    <Image
                      src={category.imageSrc}
                      alt={category.title}
                      layout="fill"
                      objectFit="contain"
                      data-ai-hint={category.imageHint}
                      className="bg-secondary"
                    />
                  </div>
                )}
                
                <div className={`space-y-4 ${category.imageSrc ? 'md:col-span-1' : 'md:col-span-2'}`}>
                  {category.items.map((item, itemIndex) => (
                    <Card key={itemIndex} className="p-4 bg-secondary shadow-sm">
                      <div className="space-y-3">
                        <div className="font-semibold text-lg text-secondary-foreground">{item.english}</div>
                        <div className="flex items-center gap-2 text-md text-muted-foreground">
                          <Languages className="h-4 w-4 text-accent" />
                          <span>{item.bahasa}</span>
                        </div>
                        
                        {item.englishExample && item.englishBetter && (
                           <div className="space-y-2 pt-2">
                             <div className="p-2 border rounded-md bg-red-100 dark:bg-red-900/30">
                               <p className="text-sm font-semibold text-red-800 dark:text-red-200">Instead of:</p>
                               <div className="flex justify-between items-center">
                                 <span className="italic text-red-700 dark:text-red-300">"{item.englishExample}"</span>
                                 <Button variant="ghost" size="icon" onClick={() => speakText(item.englishExample, 'en-US')} className="h-6 w-6 text-red-600 hover:text-red-500"><Volume2 className="h-4 w-4" /></Button>
                               </div>
                               <span className="italic text-sm text-red-600 dark:text-red-400">{item.bahasaExample}</span>
                             </div>
                             <div className="p-2 border rounded-md bg-green-100 dark:bg-green-900/30">
                               <p className="text-sm font-semibold text-green-800 dark:text-green-200">Better to say:</p>
                               <div className="flex justify-between items-center">
                                 <span className="italic text-green-700 dark:text-green-300">"{item.englishBetter}"</span>
                                 <Button variant="ghost" size="icon" onClick={() => speakText(item.englishBetter, 'en-US')} className="h-6 w-6 text-green-600 hover:text-green-500"><Volume2 className="h-4 w-4" /></Button>
                               </div>
                               <span className="italic text-sm text-green-600 dark:text-green-400">{item.bahasaBetter}</span>
                             </div>
                           </div>
                        )}

                        {item.englishExample && !item.englishBetter && (
                          <div className="p-2 border-l-4 border-accent bg-background/50 rounded-r-md mt-2">
                            <p className="text-sm text-muted-foreground">Example:</p>
                             <div className="flex justify-between items-center">
                                <span className="italic text-foreground">"{item.englishExample}"</span>
                                <Button variant="ghost" size="icon" onClick={() => speakText(item.englishExample, 'en-US')} className="h-6 w-6 text-primary hover:text-accent"><Volume2 className="h-4 w-4" /></Button>
                             </div>
                             <span className="italic text-sm text-muted-foreground">{item.bahasaExample}</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                  {category.items.length === 0 && (
                    <p className="text-muted-foreground">Examples for this category are coming soon!</p>
                  )}
                </div>
              </div>

            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

    