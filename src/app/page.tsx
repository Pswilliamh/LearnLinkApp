
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
  Hash,
  Palette,
  Download,
  BookMarked,
  MapPin,
  ShieldCheck,
  Lock,
  HeartHandshake,
} from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import placeholderImages from '@/app/lib/placeholder-images.json';

const PAYPAL_DONATION_URL = "https://www.paypal.com/donate/?hosted_button_id=FP4RM3ZNGZP7Y";

const learningSections = [
  { title: 'Learn the Alphabet', description: 'Master all the letters from A to Z.', href: '/alphabet', icon: SpellCheck, image: placeholderImages.alphabet.url, imageHint: placeholderImages.alphabet.hint },
  { title: 'Numbers & Colors', description: 'Learn numbers and basic colors.', href: '/numbers-colors', icon: Hash, image: placeholderImages.numbers_colors.url, imageHint: placeholderImages.numbers_colors.hint },
  { title: 'Build Your Vocabulary', description: 'Discover new words and their meanings.', href: '/vocabulary', icon: BookOpenText, image: placeholderImages.vocabulary.url, imageHint: placeholderImages.vocabulary.hint },
  { title: 'Scenario Lessons', description: 'Mastery-verified real-world scenario training.', href: '/scenarios', icon: MapPin, image: placeholderImages.scenarios.url, imageHint: placeholderImages.scenarios.hint, certified: true, premium: true },
  { title: 'Form Sentences', description: 'Learn how to construct sentences correctly.', href: '/sentences', icon: CaseSensitive, image: placeholderImages.sentences.url, imageHint: placeholderImages.sentences.hint },
  { title: 'Practice Pronunciation', description: 'Improve how you say English words.', href: '/pronunciation', icon: Volume2, image: placeholderImages.pronunciation.url, imageHint: placeholderImages.pronunciation.hint },
  { title: 'Translate & Understand', description: 'Translate between English and Bahasa Indonesia.', href: '/translation', icon: Languages, image: placeholderImages.translation.url, imageHint: placeholderImages.translation.hint },
  { title: 'Identify Objects', description: 'Upload a picture to identify objects in it.', href: '/identify-object', icon: ScanSearch, image: placeholderImages.identify_object.url, imageHint: placeholderImages.identify_object.hint },
  { title: 'Word Match Game', description: 'Drag words to their matching pictures.', href: '/match-game', icon: Puzzle, image: placeholderImages.match_game.url, imageHint: placeholderImages.match_game.hint },
  { title: 'Interactive Flipbook', description: 'Flip through pages of household items.', href: '/flipbook', icon: BookCopy, image: placeholderImages.flipbook.url, imageHint: placeholderImages.flipbook.hint },
  { title: 'Cultural & Language Guides', description: 'Learn important cultural nuances.', href: '/infographics', icon: Lightbulb, image: placeholderImages.advanced.url, imageHint: placeholderImages.advanced.hint, buttonText: "View Guides" },
  { title: 'Advanced Learner', description: 'Dialogues, quizzes, and word exploration.', href: '/advanced-learner', icon: GraduationCap, image: placeholderImages.advanced.url, imageHint: placeholderImages.advanced.hint, premium: true },
  { title: 'How to Use LearnLink', description: 'Get help on how to use each section of the app.', href: '/how-to-use', icon: HelpCircle, image: placeholderImages.how_to_use.url, imageHint: placeholderImages.how_to_use.hint },
  { title: 'Contact Us', description: 'Spiritual Sciences Researcher William Hardrick', href: 'https://sites.google.com/view/kohe-embassy-gov/home', icon: Info, image: placeholderImages.contact_us.url, imageHint: placeholderImages.contact_us.hint, external: true, buttonText: 'Visit Website' },
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
  { word: 'Courage', definition: 'The ability to do something that frightens one; bravery.', exampleSentence: 'She showed great courage in a difficult situation.', translationBahasa: 'Kebaranian' },
  { word: 'Imagine', definition: 'To form a mental image or concept of.', exampleSentence: 'Imagine a world full of peace and joy.', translationBahasa: 'Membayangkan' },
  { word: 'Gratitude', definition: 'The quality of being thankful; readiness to show appreciation for and to return kindness.', exampleSentence: 'He expressed his gratitude for their help.', translationBahasa: 'Rasa Syukur' },
  { word: 'Knowledge', definition: 'Facts, information, and skills acquired through experience or education.', exampleSentence: 'Knowledge is power.', translationBahasa: 'Pengetahuan' },
];

export default function HomePage() {
  const [wordOfTheDay, setWordOfTheDay] = useState<WordOfTheDayItem | null>(null);

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
    }
  };

  return (
    <div className="space-y-12">
      <Card className="py-8 bg-card rounded-lg shadow-lg">
        <CardHeader className="text-center pb-2">
            <h1 className="text-5xl font-bold text-card-foreground mb-3">Welcome to LearnLink!</h1>
            <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            Your fun and engaging journey to mastering English starts here. Explore 2026 standard verified interactive lessons.
            </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center gap-8 mt-6 max-w-6xl mx-auto p-4">
            <div className="flex-shrink-0">
              <Image
                src={placeholderImages.logo.url}
                alt="LearnLink Sight Logo"
                width={300} 
                height={300} 
                data-ai-hint={placeholderImages.logo.hint}
                className="rounded-full shadow-lg object-contain"
                onError={(e) => {
                   const target = e.target as HTMLImageElement;
                   target.src = "https://picsum.photos/seed/logo/300/300";
                }}
              />
            </div>

            <div className="w-full flex flex-col md:flex-row gap-4 justify-center">
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
                    <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-4">
                        <Link href="/advanced-learner">
                            <BookMarked className="mr-2 h-4 w-4" /> Look Up a Word
                        </Link>
                    </Button>
                    </CardContent>
                </Card>
              )}
               <Card className="w-full md:max-w-lg bg-secondary shadow-xl border-2 border-accent">
                    <CardHeader className="pb-3 pt-4 text-center">
                        <CardTitle className="text-3xl text-accent flex items-center justify-center gap-3">
                            <Download className="h-8 w-8" /> Teacher Resources
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center p-5 space-y-4">
                        <p className="text-secondary-foreground text-lg">Access verified lesson plans and methodology guides (Donation-Based).</p>
                        <div className="flex flex-col space-y-2">
                           <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                                <a href={PAYPAL_DONATION_URL} target="_blank" rel="noopener noreferrer">
                                    <HeartHandshake className="mr-2 h-4 w-4" /> Support & Access Lessons
                                </a>
                            </Button>
                             <Button asChild variant="outline" className="w-full border-accent text-accent hover:bg-accent/10">
                                <a href={PAYPAL_DONATION_URL} target="_blank" rel="noopener noreferrer">
                                    <Download className="mr-2 h-4 w-4" /> Donate for Curriculum
                                </a>
                            </Button>
                        </div>
                    </CardContent>
               </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {learningSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <Card key={section.title} className="hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1 bg-card text-card-foreground relative group overflow-hidden">
              {section.certified && (
                <div className="absolute top-2 right-2 z-10 w-20 h-20 pointer-events-none group-hover:rotate-12 transition-transform">
                   <Image 
                    src="/images/human-verified-seal.png" 
                    alt="LearnLink Human Verified Seal" 
                    width={80} 
                    height={80} 
                    className="object-contain drop-shadow-lg"
                    onError={(e) => { (e.target as any).src = "https://picsum.photos/seed/seal/80/80"; }}
                   />
                </div>
              )}
              {section.premium && (
                <div className="absolute top-0 left-0 bg-accent text-accent-foreground px-3 py-1 text-xs font-bold rounded-br-lg z-10 flex items-center gap-1">
                  <Lock className="h-3 w-3" /> PREMIUM
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {IconComponent && <IconComponent className="h-10 w-10 text-accent" />}
                  <CardTitle className="text-2xl text-card-foreground">{section.title}</CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground">{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative aspect-[600/400] w-full overflow-hidden rounded-md bg-secondary/30">
                  <Image
                    src={section.image}
                    alt={section.title}
                    data-ai-hint={section.imageHint}
                    fill
                    className="object-cover"
                    onError={(e) => { (e.target as any).src = `https://picsum.photos/seed/${section.title}/600/400`; }}
                  />
                </div>
                {section.external ? (
                  <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    <a href={section.href} target="_blank" rel="noopener noreferrer">
                      {section.buttonText || 'Learn More'} <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href={section.href}>
                      {section.buttonText || (section.premium ? 'Unlock & Start' : 'Start Learning')} <ArrowRight className="ml-2 h-4 w-4" />
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
