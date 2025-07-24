
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Lightbulb, Volume2, Languages } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';

interface InfoItem {
  english: string;
  bahasa: string;
}

interface InfoCategory {
  title: string;
  description: string;
  items: InfoItem[];
}

const culturalInfoData: InfoCategory[] = [
  {
    title: "Vocabulary in Context",
    description: "Understanding the small differences between similar words.",
    items: [
      { english: "Hate vs. Dislike", bahasa: "Benci vs. Tidak Suka" },
      { english: "Big vs. Huge vs. Massive", bahasa: "Besar vs. Sangat Besar vs. Raksasa" }
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
              {category.items.map((item, itemIndex) => (
                <Card key={itemIndex} className="p-4 bg-secondary shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="font-semibold text-lg text-secondary-foreground">{item.english}</div>
                      <div className="flex items-center gap-2 text-md text-muted-foreground">
                        <Languages className="h-4 w-4 text-accent" />
                        <span>{item.bahasa}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => speakText(item.english, 'en-US')}
                        className="text-accent hover:text-accent/80 h-8 w-18"
                        aria-label={`Pronounce ${item.english} in English`}
                      >
                        <Volume2 className="h-4 w-4 mr-1" /> English
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => speakText(item.bahasa, 'id-ID')}
                        className="text-accent hover:text-accent/80 h-8 w-18"
                        aria-label={`Pronounce ${item.bahasa} in Bahasa Indonesia`}
                      >
                        <Volume2 className="h-4 w-4 mr-1" /> Bahasa
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {category.items.length === 0 && (
                <p className="text-muted-foreground">Examples for this category are coming soon!</p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
