
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpenText, CaseSensitive, Languages, SpellCheck, Volume2, ScanSearch, GraduationCap } from 'lucide-react';
import Image from 'next/image';

const learningSections = [
  { title: 'Learn the Alphabet', description: 'Master all the letters from A to Z.', href: '/alphabet', icon: SpellCheck, image: 'https://placehold.co/600x400/E6F2FF/3B5998?text=A+B+C', imageHint: 'alphabet blocks' },
  { title: 'Build Your Vocabulary', description: 'Discover new words and their meanings.', href: '/vocabulary', icon: BookOpenText, image: 'https://placehold.co/600x400/E6F2FF/3B5998?text=Words', imageHint: 'picture book' },
  { title: 'Form Sentences', description: 'Learn how to construct sentences correctly.', href: '/sentences', icon: CaseSensitive, image: 'https://placehold.co/600x400/E6F2FF/3B5998?text=Sentences', imageHint: 'building blocks' },
  { title: 'Practice Pronunciation', description: 'Improve how you say English words.', href: '/pronunciation', icon: Volume2, image: 'https://placehold.co/600x400/E6F2FF/3B5998?text=Audio', imageHint: 'sound waves' },
  { title: 'Translate & Understand', description: 'Translate between English and Bahasa Indonesia.', href: '/translation', icon: Languages, image: 'https://placehold.co/600x400/E6F2FF/3B5998?text=Translate', imageHint: 'global communication' },
  { title: 'Identify Objects', description: 'Upload a picture to identify objects in it.', href: '/identify-object', icon: ScanSearch, image: 'https://placehold.co/600x400/FFC107/3B5998?text=Identify', imageHint: 'magnifying glass' },
  { title: 'Advanced Learner', description: 'Dialogues, quizzes, and word exploration.', href: '/advanced-learner', icon: GraduationCap, image: 'https://placehold.co/600x400/3B5998/FFC107?text=Advanced', imageHint: 'graduation cap' },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-card rounded-lg shadow-lg">
        <h1 className="text-5xl font-bold text-primary mb-4">Welcome to LearnLink!</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Your fun and engaging journey to mastering English starts here. Explore letters, words, sentences, and more!
        </p>
        <Image 
          src="https://placehold.co/800x300/3B5998/FFC107?text=Learn+English+Fun!" 
          alt="Happy students learning English"
          data-ai-hint="children learning"
          width={800} 
          height={300} 
          className="rounded-lg mx-auto shadow-md" 
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {learningSections.map((section) => (
          <Card key={section.title} className="hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <section.icon className="h-10 w-10 text-accent" />
                <CardTitle className="text-2xl text-primary">{section.title}</CardTitle>
              </div>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Image 
                src={section.image} 
                alt={section.title} 
                data-ai-hint={section.imageHint}
                width={600} 
                height={400} 
                className="rounded-md object-cover aspect-video" 
              />
              <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href={section.href}>
                  Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

    