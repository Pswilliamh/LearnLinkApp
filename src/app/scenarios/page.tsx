
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScenarioLesson, scenarioLessons, ScenarioSlide } from '@/lib/scenario-lessons';
import { ChevronLeft, ChevronRight, Volume2, Info, MapPin, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

export default function ScenariosPage() {
  const [activeLesson, setActiveLesson] = useState<ScenarioLesson | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { toast } = useToast();

  const handleStartLesson = (lesson: ScenarioLesson) => {
    setActiveLesson(lesson);
    setCurrentSlideIndex(0);
  };

  const handleNextSlide = () => {
    if (activeLesson && currentSlideIndex < activeLesson.slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

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

  if (!activeLesson) {
    return (
      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-primary flex items-center gap-2">
              <MapPin className="h-8 w-8" /> Scenario-Based Lessons
            </CardTitle>
            <CardDescription>
              Immerse yourself in real-world situations with our interactive modular lessons.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarioLessons.map((lesson) => (
            <Card key={lesson.lesson_id} className="hover:shadow-xl transition-all cursor-pointer border-t-4 border-accent" onClick={() => handleStartLesson(lesson)}>
              <CardHeader>
                <CardTitle className="text-xl text-primary">{lesson.theme}</CardTitle>
                <CardDescription>{lesson.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-accent" />
                  {lesson.slides.length} Interactive Slides
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Start Lesson <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const currentSlide = activeLesson.slides[currentSlideIndex];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => setActiveLesson(null)} className="text-primary">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Lessons
        </Button>
        <div className="text-lg font-bold text-accent">
          {activeLesson.theme}: Slide {currentSlideIndex + 1} of {activeLesson.slides.length}
        </div>
      </div>

      <Card className="overflow-hidden shadow-2xl border-4 border-primary">
        <div className="relative aspect-video w-full bg-secondary overflow-hidden">
          <Image
            src={currentSlide.image_url}
            alt="Scenario Visual"
            fill
            className="object-cover"
            data-ai-hint={currentSlide.image_hint}
          />
          
          {/* Focus Zones Overlays */}
          {currentSlide.focus_zones.map((zone, idx) => (
            <div
              key={idx}
              className={`absolute border-4 rounded-lg flex items-center justify-center cursor-help transition-all hover:scale-105 group
                ${zone.type === 'pink' ? 'border-pink-500 bg-pink-500/20' : 'border-green-500 bg-green-500/20'}`}
              style={{
                top: `${zone.top}%`,
                left: `${zone.left}%`,
                width: `${zone.width}%`,
                height: `${zone.height}%`,
              }}
              onClick={() => toast({ title: zone.label, description: zone.type === 'pink' ? "This is a challenge or problem area." : "This is a solution or key area." })}
            >
              <div className={`absolute -top-8 px-2 py-1 rounded text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap
                ${zone.type === 'pink' ? 'bg-pink-600' : 'bg-green-600'}`}>
                {zone.type === 'pink' ? <AlertCircle className="inline h-3 w-3 mr-1" /> : <CheckCircle className="inline h-3 w-3 mr-1" />}
                {zone.label}
              </div>
            </div>
          ))}
        </div>

        <CardContent className="p-8 space-y-6 bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-accent">English</h3>
                <Button variant="ghost" size="icon" onClick={() => speakText(currentSlide.dialogue.english)} className="text-primary hover:text-accent">
                  <Volume2 className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-2xl font-semibold leading-relaxed text-foreground">
                {currentSlide.dialogue.english}
              </p>
            </div>

            <div className="space-y-4 border-l-0 md:border-l pl-0 md:pl-8">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-accent">Bahasa Indonesia</h3>
                <Button variant="ghost" size="icon" onClick={() => speakText(currentSlide.dialogue.indonesian, 'id-ID')} className="text-primary hover:text-accent">
                  <Volume2 className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-2xl font-semibold leading-relaxed text-muted-foreground">
                {currentSlide.dialogue.indonesian}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between p-6 bg-secondary/50 border-t">
          <Button onClick={handlePrevSlide} disabled={currentSlideIndex === 0} variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous Slide
          </Button>
          <Button onClick={handleNextSlide} disabled={currentSlideIndex === activeLesson.slides.length - 1} className="bg-primary text-primary-foreground">
            Next Slide <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground italic">
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-pink-500 rounded"></div> Problem (Pink)</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded"></div> Solution (Green)</div>
        <span>• Tap the highlights on the image to learn more.</span>
      </div>
    </div>
  );
}
