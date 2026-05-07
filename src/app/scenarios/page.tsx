
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScenarioLesson, scenarioLessons } from '@/lib/scenario-lessons';
import { ChevronLeft, ChevronRight, Volume2, MapPin, Sparkles, AlertCircle, Eye, Mic, Loader2, CheckCircle2, FileText, Lock, ShieldCheck, ExternalLink, Download, Gift } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { evaluateSpeech } from '@/ai/flows/evaluate-speech-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CertificateOfMastery } from '@/components/certificate-of-mastery';

const PAYPAL_DONATION_URL = "https://www.paypal.com/donate/?hosted_button_id=FP4RM3ZNGZP7Y";

export default function ScenariosPage() {
  const [accessLevel, setAccessLevel] = useState<'none' | 'preview' | 'full'>('none');
  const [passwordInput, setPasswordInput] = useState('');
  const [activeLesson, setActiveLesson] = useState<ScenarioLesson | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [learningPhase, setLearningPhase] = useState<'intro' | 'practice' | 'mastery'>('intro');
  const [revealIndonesian, setRevealIndonesian] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  
  const [isListening, setIsListening] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [userTranscript, setUserTranscript] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = passwordInput.trim().toUpperCase();
    if (input === '2026') {
      setAccessLevel('full');
      toast({ title: "Full Access Granted", description: "Welcome to the Complete Scenario Hub." });
    } else if (input === 'PREVIEW') {
      setAccessLevel('preview');
      toast({ title: "Preview Access Granted", description: "Enjoy your free Precision Protocol sample." });
    } else {
      toast({ variant: "destructive", title: "Access Denied", description: "Incorrect password. Use 'PREVIEW' for a free sample or '2026' for full access." });
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setUserTranscript(transcript);
            if (activeLesson) {
                handleEvaluate(transcript, activeLesson.slides[currentSlideIndex].dialogue.english);
            }
        };

        recognitionRef.current.onerror = (event: any) => {
            setIsListening(false);
            toast({ variant: "destructive", title: "Recognition Error", description: event.error });
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
        };
    }
  }, [activeLesson, currentSlideIndex, toast]);

  const handleStartLesson = (lesson: ScenarioLesson) => {
    setActiveLesson(lesson);
    setCurrentSlideIndex(0);
    setLearningPhase('intro');
    setRevealIndonesian(false);
    setEvaluationResult(null);
    setShowCertificate(false);
  };

  const handleNextSlide = () => {
    if (activeLesson) {
      if (currentSlideIndex < activeLesson.slides.length - 1) {
        setCurrentSlideIndex(prev => prev + 1);
        setRevealIndonesian(false);
        setEvaluationResult(null);
      } else {
        setShowCertificate(true);
      }
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
      setRevealIndonesian(false);
      setEvaluationResult(null);
    }
  };

  const speakText = (text: string, lang: 'en-US' | 'id-ID' = 'en-US') => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartPractice = () => {
    if (!recognitionRef.current) {
        toast({ variant: "destructive", title: "Unsupported Browser", description: "Speech recognition is not available." });
        return;
    }
    setEvaluationResult(null);
    setUserTranscript(null);
    setIsListening(true);
    recognitionRef.current.start();
  };

  const handleEvaluate = async (userAttempt: string, targetPhrase: string) => {
      setIsEvaluating(true);
      try {
        const result = await evaluateSpeech({ userAttempt, targetPhrase });
        setEvaluationResult(result);
        if (result.isCorrect) {
          toast({ title: "Mastery Level Achieved!", description: "Visual trigger association verified." });
        }
      } catch (e) {
        toast({ variant: "destructive", title: "Evaluation Failed", description: "Could not connect to AI." });
      } finally {
        setIsEvaluating(false);
      }
  };

  if (accessLevel === 'none') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
        <Card className="w-full max-w-md shadow-2xl border-2 border-accent">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Lock className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="text-2xl">Secure Entry Point</CardTitle>
            <CardDescription>Enter 'PREVIEW' for a free module or '2026' for full access.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input 
                type="text" 
                placeholder="Enter access code..." 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="text-center text-lg uppercase"
              />
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Verify Credentials
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-xs text-muted-foreground flex justify-center">
             <ShieldCheck className="h-3 w-3 mr-1" /> Precision Protocol V2026
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!activeLesson) {
    const visibleLessons = accessLevel === 'full' 
      ? scenarioLessons 
      : scenarioLessons.filter(l => l.is_preview);

    return (
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Card className="flex-grow shadow-lg border-l-8 border-accent">
            <CardHeader>
              <CardTitle className="text-3xl text-primary flex items-center gap-2">
                <MapPin className="h-8 w-8 text-accent" /> 
                {accessLevel === 'full' ? 'Master Scenario Hub' : 'Free Preview: Precision Lessons'}
              </CardTitle>
              <CardDescription>
                High-dimensional immersive training for Jakarta's top-tier linguistic mastery.
              </CardDescription>
            </CardHeader>
          </Card>
          {accessLevel === 'preview' && (
            <Alert className="max-w-xs bg-accent text-accent-foreground">
              <Gift className="h-4 w-4" />
              <AlertTitle className="font-bold">Free Sample Active</AlertTitle>
              <AlertDescription className="text-xs">Donate for full curriculum access.</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleLessons.map((lesson) => (
            <Card key={lesson.lesson_id} className="hover:shadow-xl transition-all border-t-4 border-accent relative flex flex-col overflow-hidden group">
               <div className="absolute top-2 right-2 z-10 w-20 h-20 opacity-90 group-hover:opacity-100 transition-opacity">
                 <Image 
                  src="/images/human-verified-seal.png" 
                  alt="LearnLink Human Verified Seal" 
                  width={80} 
                  height={80} 
                  className="object-contain drop-shadow"
                 />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-primary">{lesson.theme}</CardTitle>
                  {lesson.is_preview && <Badge className="bg-green-600">FREE PREVIEW</Badge>}
                </div>
                <CardDescription className="line-clamp-2">{lesson.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Sparkles className="h-4 w-4 text-accent" />
                  {lesson.slides.length} Interactive Slides
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                {lesson.pdf_url && (
                  <Button variant="outline" className="flex-1 text-xs" asChild>
                    <a href={lesson.pdf_url} download>
                      <Download className="h-3 w-3 mr-1" /> PDF Plan
                    </a>
                  </Button>
                )}
                <Button onClick={() => handleStartLesson(lesson)} className="flex-[2] bg-accent text-accent-foreground hover:bg-accent/90">
                  Enter Lesson
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {accessLevel === 'full' && (
          <Card className="bg-secondary/20 border-2 border-dashed border-primary/30">
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl text-primary flex items-center gap-2">
                    <FileText className="h-7 w-7 text-accent" /> Teacher Resource Hub
                  </CardTitle>
                  <CardDescription className="text-foreground font-bold text-lg">
                    High-dimensional methodology guides (Verified Assets).
                  </CardDescription>
                </div>
                <div className="bg-primary/40 p-4 rounded-lg border border-accent/50 flex flex-col items-center gap-4 max-w-sm">
                  <div className="relative w-32 h-32 shrink-0">
                    <Image 
                      src="/images/teacher-scenerio.png" 
                      alt="Teacher Scenario Logo" 
                      fill 
                      className="object-contain drop-shadow"
                    />
                  </div>
                  <div className="text-center px-2">
                      <p className="text-accent font-extrabold text-xs leading-snug uppercase tracking-tight">
                          Human verified not AI created content.
                      </p>
                      <p className="text-secondary-foreground text-[10px] font-medium opacity-90 mt-1 leading-tight">
                          Slide Decks or AI formated content verified.
                      </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-accent/10 border-accent/50">
                <AlertCircle className="h-4 w-4 text-accent" />
                <AlertTitle className="text-accent font-bold">Donation Required for Full Downloads</AlertTitle>
                <AlertDescription>
                  Access our complete 2026 classroom suite with a donation to our mission.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {[
                   { name: "Three Color Sentence Logic", sub: "Precision Visual Syntax Guide", file: "Three_Color_Sentence_Logic.pdf" },
                   { name: "Visual Bilingual English Action", sub: "Direct Association Workbook", file: "Visual_Bilingual_English_Action.pdf" },
                   { name: "Visual English Action Guide", sub: "Zero-Second Response Manual", file: "Visual_English_Action_Guide.pdf" },
                   { name: "Visual Logic Language Systems", sub: "High-Dimensional Linguistic Theory", file: "Visual_Logic_Language_Systems.pdf" },
                   { name: "Visual Travel Syntax Guide", sub: "Survival Dialogues for Jakarta", file: "Visual_Travel_Syntax_Guide.pdf" },
                   { name: "English Class April 2026 Visual Slide", sub: "Official Class Presentation Deck", file: "English Class April2026 visual slide .pdf" }
                 ].map((resource, i) => (
                   <div key={i} className="p-4 bg-card rounded-lg border shadow-sm flex items-center justify-between group hover:border-accent transition-colors">
                      <div className="max-w-[150px]">
                        <p className="font-bold text-foreground text-sm leading-tight">{resource.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{resource.sub}</p>
                      </div>
                      <Button variant="ghost" size="sm" asChild className="text-accent hover:text-accent hover:bg-accent/10 h-auto py-2">
                        <a href={PAYPAL_DONATION_URL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
                           <span className="text-[10px] font-bold">Donate</span>
                           <Download className="h-3 w-3 mt-1" />
                        </a>
                      </Button>
                   </div>
                 ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  const currentSlide = activeLesson.slides[currentSlideIndex];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {showCertificate && (
        <CertificateOfMastery 
          lessonName={activeLesson.theme}
          certifiedBy={activeLesson.verification.verified_by}
          onClose={() => setShowCertificate(false)}
        />
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Button variant="ghost" onClick={() => setActiveLesson(null)} className="text-primary">
          <ChevronLeft className="mr-2 h-4 w-4" /> Exit Lesson
        </Button>
        
        <div className="flex bg-secondary p-1 rounded-lg shadow-inner">
          {['intro', 'practice', 'mastery'].map((phase) => (
            <Button 
              key={phase}
              variant={learningPhase === phase ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => {
                setLearningPhase(phase as any);
                setEvaluationResult(null);
                setRevealIndonesian(false);
              }}
              className="text-xs capitalize"
            >
              {phase === 'intro' ? 'Intro' : phase === 'practice' ? 'Recall' : 'Mastery'}
            </Button>
          ))}
        </div>

        <div className="text-lg font-bold text-accent">
          Slide {currentSlideIndex + 1} / {activeLesson.slides.length}
        </div>
      </div>

      <Card className="overflow-hidden shadow-2xl border-4 border-primary relative">
        {activeLesson.verification.status === 'Verified' && (
          <div className="absolute top-4 right-4 z-20 pointer-events-none w-28 h-28">
             <Image 
              src="/images/human-verified-seal.png" 
              alt="Official LearnLink Human Verified Seal" 
              width={112} 
              height={112} 
              className="object-contain drop-shadow-2xl transform rotate-12 transition-transform"
             />
          </div>
        )}

        <div className="relative aspect-video w-full bg-secondary overflow-hidden">
          <Image
            src={currentSlide.image_url}
            alt="Scenario Visual"
            fill
            className="object-cover"
          />
          
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
              onClick={() => toast({ title: zone.label, description: zone.type === 'pink' ? "Focus area: Challenge/Problem" : "Focus area: Solution/Object" })}
            >
              <div className={`absolute -top-8 px-2 py-1 rounded text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap
                ${zone.type === 'pink' ? 'bg-pink-600' : 'bg-green-600'}`}>
                {zone.type === 'pink' ? <AlertCircle className="inline h-3 w-3 mr-1" /> : <CheckCircle2 className="inline h-3 w-3 mr-1" />}
                {zone.label}
              </div>
            </div>
          ))}
        </div>

        <CardContent className="p-8 space-y-6 bg-card min-h-[200px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`space-y-4 transition-opacity duration-500 ${learningPhase === 'mastery' ? 'opacity-0 select-none' : 'opacity-100'}`}>
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

            <div className={`space-y-4 border-l-0 md:border-l pl-0 md:pl-8 transition-all duration-500 
              ${learningPhase === 'mastery' ? 'opacity-0 select-none' : 'opacity-100'}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-accent">Bahasa Indonesia</h3>
                {learningPhase === 'practice' && !revealIndonesian ? (
                  <Button variant="outline" size="sm" onClick={() => setRevealIndonesian(true)} className="h-7 text-xs">
                    <Eye className="h-3 w-3 mr-1" /> Reveal
                  </Button>
                ) : (
                   <Button variant="ghost" size="icon" onClick={() => speakText(currentSlide.dialogue.indonesian, 'id-ID')} className="text-primary hover:text-accent">
                    <Volume2 className="h-5 w-5" />
                  </Button>
                )}
              </div>
              
              <div className="relative">
                <p className={`text-2xl font-semibold leading-relaxed transition-all duration-300
                  ${learningPhase === 'practice' && !revealIndonesian ? 'blur-md grayscale opacity-30 select-none cursor-pointer' : 'text-muted-foreground'}`}
                  onClick={() => learningPhase === 'practice' && setRevealIndonesian(true)}
                >
                  {currentSlide.dialogue.indonesian}
                </p>
                {learningPhase === 'practice' && !revealIndonesian && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <p className="text-xs font-bold text-accent uppercase tracking-widest bg-card px-2">Recall Practice</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {learningPhase === 'mastery' && (
            <div className="absolute inset-0 z-30 bg-card/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
               <div className="text-center space-y-6 max-w-md">
                 <h3 className="text-3xl font-bold text-accent">Mastery Mode</h3>
                 <p className="text-muted-foreground">The scaffolding is gone. Look at the visual cues and say the phrase in English!</p>
                 
                 {!evaluationResult ? (
                   <div className="flex flex-col items-center gap-4">
                     <Button 
                      size="lg" 
                      onClick={handleStartPractice}
                      disabled={isListening || isEvaluating}
                      className="w-48 h-20 rounded-full bg-primary text-primary-foreground text-xl shadow-2xl hover:scale-105 transition-transform"
                     >
                       {isListening ? <Loader2 className="animate-spin h-8 w-8" /> : <Mic className="h-8 w-8 mr-2" />}
                       {isListening ? 'Listening...' : 'Speak Now'}
                     </Button>
                     {isEvaluating && (
                       <div className="flex items-center gap-2 text-accent animate-pulse">
                         <Loader2 className="animate-spin h-4 w-4" /> Guru Bahasa is thinking...
                       </div>
                     )}
                   </div>
                 ) : (
                   <Alert variant={evaluationResult.isCorrect ? "default" : "destructive"} className="text-left">
                     {evaluationResult.isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                     <AlertTitle>{evaluationResult.isCorrect ? "Mastery Achieved!" : "Keep Practicing"}</AlertTitle>
                     <AlertDescription className="mt-2 text-base">
                       {evaluationResult.feedback}
                       <Button variant="link" size="sm" onClick={() => setEvaluationResult(null)} className="p-0 h-auto block mt-2 text-accent">
                         Try Again
                       </Button>
                     </AlertDescription>
                   </Alert>
                 )}
                 
                 <Button variant="outline" size="sm" onClick={() => setLearningPhase('intro')}>
                   Go Back to Study
                 </Button>
               </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between p-6 bg-secondary/50 border-t">
          <Button onClick={handlePrevSlide} disabled={currentSlideIndex === 0} variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <div className="hidden md:flex gap-2">
            <Badge variant="outline" className="bg-card">Verified: {activeLesson.verification.verified_by}</Badge>
          </div>
          <Button onClick={handleNextSlide} className="bg-primary text-primary-foreground shadow-lg transform hover:scale-105 transition-transform">
            {currentSlideIndex === activeLesson.slides.length - 1 ? 'Finish & Certify' : 'Next Slide'} <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
