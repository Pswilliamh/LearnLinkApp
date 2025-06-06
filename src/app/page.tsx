
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowRight,
  BookOpenText,
  CaseSensitive,
  Languages,
  SpellCheck,
  Volume2,
  ScanSearch,
  GraduationCap,
  Puzzle,
  CalendarDays,
  Lightbulb,
  Info,
  BookCopy,
  HelpCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

const learningSections = [
  { title: 'Learn the Alphabet', description: 'Master all the letters from A to Z.', href: '/alphabet', icon: SpellCheck, image: '/images/section-alphabet.png', imageHint: 'Colorful friendly alphabet blocks arranged playfully educational illustration style' },
  { title: 'Build Your Vocabulary', description: 'Discover new words and their meanings.', href: '/vocabulary', icon: BookOpenText, image: '/images/section-vocabulary.png', imageHint: 'open illustrated children book showing vibrant pictures of common objects animals bright engaging' },
  { title: 'Form Sentences', description: 'Learn how to construct sentences correctly.', href: '/sentences', icon: CaseSensitive, image: '/images/section-sentences.png', imageHint: 'Children happily arranging large colorful word blocks form simple sentence sunny illustrative scene' },
  { title: 'Practice Pronunciation', description: 'Improve how you say English words.', href: '/pronunciation', icon: Volume2, image: '/images/section-pronunciation.png', imageHint: 'Stylized sound waves emanating friendly cartoon mouth musical notes clear modern educational graphic' },
  { title: 'Translate & Understand', description: 'Translate between English and Bahasa Indonesia.', href: '/translation', icon: Languages, image: '/images/section-translation.png', imageHint: 'Two speech bubbles one English flag one Indonesian flag connected friendly arrow global communication concept' },
  { title: 'Identify Objects', description: 'Upload a picture to identify objects in it.', href: '/identify-object', icon: ScanSearch, image: '/images/section-identify-object.png', imageHint: 'curious child looking through magnifying glass common household object like apple bright illustrative educational style' },
  { title: 'Word Match Game', description: 'Drag words to their matching pictures.', href: '/match-game', icon: Puzzle, image: '/images/section-match-game.png', imageHint: 'Colorful puzzle pieces with simple icons like apple dog car being assembled by children hands educational game concept' },
  { title: 'Interactive Flipbook', description: 'Flip through pages of household items.', href: '/flipbook', icon: BookCopy, image: '/images/section-flipbook.png', imageHint: 'Animated flipbook icon showing pages turning interactive learning symbol' },
  { title: 'Advanced Learner', description: 'Dialogues, quizzes, and word exploration.', href: '/advanced-learner', icon: GraduationCap, image: '/images/section-advanced-learner.png', imageHint: 'stack books graduation cap top against inspiring subtly patterned background academic achievement theme' },
  { title: 'How to Use LearnLink', description: 'Get help on how to use each section of the app.', href: '/how-to-use', icon: HelpCircle, image: '/images/section-how-to-use.png', imageHint: 'friendly question mark icon with gears and cogs learning process symbol' },
  { title: 'Contact Us', description: 'Spiritual Sciences Researcher William Hardrick', href: 'https://sites.google.com/view/kohe-embassy-gov/home', icon: Info, image: '/images/section-contact-us.png', imageHint: 'Clean professional icon representing official contact point embassy trustworthy clear graphic', external: true, buttonText: 'Visit Website' },
];

interface WordOfTheDayItem {
  word: string;
  definition: string;
  exampleSentence: string;
  translationBahasa: string;
}

const dailyWordsList: WordOfTheDayItem[] = [
  { word: 'Kindness', definition: 'The quality of being friendly, generous, and considerate.', exampleSentence: 'Show kindness to everyone you meet.', translationBahasa: 'Kebaikan' },
  { word: 'Explore', definition: 'To travel through an unfamiliar area in order to learn about it.', exampleSentence: 'They decided to explore the new island.', translationBahasa: 'Menjelajahi' },
  { word: 'Curious', definition: 'Eager to know or learn something.', exampleSentence: 'The cat was curious about the open box.', translationBahasa: 'Penasaran' },
  { word: 'Courage', definition: 'The ability to do something that frightens one; bravery.', exampleSentence: 'She showed great courage in a difficult situation.', translationBahasa: 'Keberanian' },
  { word: 'Imagine', definition: 'To form a mental image or concept of.', exampleSentence: 'Imagine a world full of peace and joy.', translationBahasa: 'Membayangkan' },
  { word: 'Gratitude', definition: 'The quality of being thankful; readiness to show appreciation for and to return kindness.', exampleSentence: 'He expressed his gratitude for their help.', translationBahasa: 'Rasa Syukur' },
  { word: 'Knowledge', definition: 'Facts, information, and skills acquired through experience or education.', exampleSentence: 'Knowledge is power.', translationBahasa: 'Pengetahuan' },
];

export default function HomePage() {
  const [wordOfTheDay, setWordOfTheDay] = useState<WordOfTheDayItem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    setWordOfTheDay(dailyWordsList[dayOfYear % dailyWordsList.length]);
  }, []);

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
    <div className="space-y-12">
      <Card className="py-8 bg-card rounded-lg shadow-lg">
        <CardHeader className="text-center pb-2">
            <h1 className="text-5xl font-bold text-card-foreground mb-3">Welcome to LearnLink!</h1>
            <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            Your fun and engaging journey to mastering English starts here. Explore letters, words, sentences, and more!
            </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col md:flex-row items-center justify-center md:gap-6 gap-8 mt-6 max-w-6xl mx-auto p-4">
            <div className="flex-shrink-0">
              <Image
                src="/images/sight-logo.png"
                alt="LearnLink Sight Logo"
                width={300} 
                height={300} 
                className="rounded-full shadow-lg object-contain"
              />
            </div>

            <div className="w-full md:w-auto">
              {wordOfTheDay && (
                <Card className="w-full md:max-w-lg bg-secondary shadow-xl border-2 border-accent">
                    <CardHeader className="pb-3 pt-4 text-center">
                      <CardTitle className="text-3xl text-accent flex items-center justify-center gap-3">
                          <CalendarDays className="h-8 w-8" /> Word of the Day! <Lightbulb className="h-8 w-8" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-left space-y-3 p-5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-4xl font-bold text-secondary-foreground">{wordOfTheDay.word}</h3>
                        <Button variant="ghost" size="icon" onClick={() => speakText(wordOfTheDay.word)} className="text-accent hover:text-accent/80">
                        <Volume2 className="h-7 w-7" />
                        </Button>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-accent">Definition (English):</p>
                        <p className="text-secondary-foreground text-lg">{wordOfTheDay.definition}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-accent">Example Sentence (English):</p>
                        <p className="text-secondary-foreground italic text-lg">"{wordOfTheDay.exampleSentence}"</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-accent">Translation (Bahasa Indonesia):</p>
                        <p className="text-secondary-foreground text-lg">{wordOfTheDay.translationBahasa}</p>
                    </div>
                    </CardContent>
                </Card>
              )}
              {!wordOfTheDay && (
                <Card className="w-full md:max-w-lg bg-secondary shadow-xl border-2 border-accent p-5 text-center">
                  <p className="text-secondary-foreground text-lg">Loading Word of the Day...</p>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {learningSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <Card key={section.title} className="hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1 bg-card text-card-foreground">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {IconComponent && <IconComponent className="h-10 w-10 text-accent" />}
                  <CardTitle className="text-2xl text-card-foreground">{section.title}</CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground">{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Image
                  src={section.image}
                  alt={section.title}
                  data-ai-hint={section.imageHint}
                  width={600}
                  height={400}
                  className="rounded-md object-cover w-full h-auto aspect-[600/400]"
                />
                {section.external ? (
                  <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    <a href={section.href} target="_blank" rel="noopener noreferrer">
                      {section.buttonText || 'Learn More'} <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href={section.href}>
                      Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
