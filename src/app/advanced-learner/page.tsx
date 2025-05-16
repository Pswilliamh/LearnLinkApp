
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { BookMarked, MessageSquareQuote, Brain, Loader2, AlertCircle, Search, Languages, Volume2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getWordInfo, GetWordInfoOutput } from '@/ai/flows/get-word-info-flow';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { verifyPassword } from './actions';

interface DialogueTurn {
  speaker: string;
  english: string;
  bahasa: string;
}

interface DialogueStory {
  title: string;
  characters: string[];
  turns: DialogueTurn[];
}

const sampleDialogues: DialogueStory[] = [
  {
    title: "At the Market",
    characters: ["Seller", "Buyer"],
    turns: [
      { speaker: "Seller", english: "Good morning! What can I get for you today?", bahasa: "Selamat pagi! Ada yang bisa saya bantu hari ini?" },
      { speaker: "Buyer", english: "Good morning! I'm looking for some fresh apples.", bahasa: "Selamat pagi! Saya mencari apel segar." },
      { speaker: "Seller", english: "These apples are very sweet. How many would you like?", bahasa: "Apel ini sangat manis. Mau berapa banyak?" },
      { speaker: "Buyer", english: "I'll take one kilogram, please.", bahasa: "Saya ambil satu kilogram, ya." },
    ],
  },
  // Add more dialogues here by transcribing from your PDFs
];

interface QuizQuestion {
  id: string;
  questionText: string;
  type: 'multiple-choice' | 'find-word';
  options?: string[];
  sentence?: string; // For find-word type
  correctAnswer: string;
}

const sampleQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    questionText: "Choose the correct word: The cat is ______ the table.",
    type: 'multiple-choice',
    options: ["on", "in", "under", "with"],
    correctAnswer: "on",
  },
  {
    id: 'q2',
    questionText: "Identify the verb in the sentence: 'She quickly reads the book.'",
    type: 'find-word', 
    sentence: "She quickly reads the book.",
    options: ["She", "quickly", "reads", "book"], 
    correctAnswer: "reads",
  },
  // Add more quiz questions here
];


export default function AdvancedLearnerPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const [wordToExplore, setWordToExplore] = useState('');
  const [wordInfo, setWordInfo] = useState<GetWordInfoOutput | null>(null);
  const [isExploring, setIsExploring] = useState(false);
  const [exploreError, setExploreError] = useState<string | null>(null);
  const { toast } = useToast();
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizScores, setQuizScores] = useState<Record<string, boolean | null>>({});

  useEffect(() => {
    if (sessionStorage.getItem('advancedLearnerUnlocked') === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  const handleUnlock = async () => {
    setIsVerifying(true);
    setUnlockError(null);
    try {
      const success = await verifyPassword(enteredPassword);
      if (success) {
        setIsUnlocked(true);
        sessionStorage.setItem('advancedLearnerUnlocked', 'true');
        toast({ title: "Advanced Section Unlocked!", description: "You can now access the advanced content." });
      } else {
        setUnlockError('Incorrect password. Please try again or contact an administrator.');
        toast({ variant: "destructive", title: "Unlock Failed", description: "Incorrect password." });
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "An unknown server error occurred.";
      setUnlockError(errorMsg);
      toast({ variant: "destructive", title: "Unlock Error", description: errorMsg });
      console.error("Unlock error:", e);
    } finally {
      setIsVerifying(false);
      setEnteredPassword(''); 
    }
  };


  const handleExploreWord = async () => {
    if (!wordToExplore.trim()) {
      setExploreError('Please enter a word to explore.');
      toast({ variant: "destructive", title: "Input Error", description: "Please enter a word."});
      return;
    }
    setIsExploring(true);
    setExploreError(null);
    setWordInfo(null);

    try {
      const result = await getWordInfo({ word: wordToExplore });
      setWordInfo(result);
      toast({ title: "Word Explored!", description: `Showing information for "${wordToExplore}".`});
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "An unknown error occurred.";
      setExploreError(`Failed to explore word: ${errorMsg}`);
      toast({ variant: "destructive", title: "Exploration Failed", description: errorMsg });
      console.error(e);
    } finally {
      setIsExploring(false);
    }
  };

  const handleQuizAnswerChange = (questionId: string, answer: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answer }));
    setQuizScores(prev => ({ ...prev, [questionId]: null }));
  };

  const checkQuizAnswer = (questionId: string) => {
    const question = sampleQuizQuestions.find(q => q.id === questionId);
    if (question && quizAnswers[questionId]) {
      const isCorrect = quizAnswers[questionId] === question.correctAnswer;
      setQuizScores(prev => ({ ...prev, [questionId]: isCorrect }));
      toast({
        title: isCorrect ? "Correct!" : "Incorrect",
        description: isCorrect ? "Great job!" : `The correct answer was: ${question.correctAnswer}`,
        variant: isCorrect ? "default" : "destructive",
      });
    }
  };

  const speakText = (text: string, lang: 'en-US' | 'id-ID' = 'en-US') => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
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

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-20rem)] py-12">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-primary flex items-center justify-center gap-2">
              <ShieldCheck className="h-8 w-8" /> Advanced Learner Access
            </CardTitle>
            <CardDescription className="mt-2">
              This section is password protected. Please enter the password provided by your administrator.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-6 py-8">
            <Input
              type="password"
              value={enteredPassword}
              onChange={(e) => setEnteredPassword(e.target.value)}
              placeholder="Enter password"
              className="text-lg h-12"
              onKeyPress={(e) => { if (e.key === 'Enter' && !isVerifying) handleUnlock(); }}
              aria-label="Password for Advanced Learner Section"
            />
            {unlockError && (
              <Alert variant="destructive">
                <ShieldAlert className="h-5 w-5" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>{unlockError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="px-6 pb-6">
            <Button 
              onClick={handleUnlock} 
              disabled={isVerifying} 
              className="w-full text-lg py-6 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isVerifying ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <ShieldCheck className="mr-2 h-5 w-5" />}
              {isVerifying ? 'Verifying...' : 'Unlock Section'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary flex items-center gap-2">
            <Brain className="h-8 w-8" /> Advanced Learner Hub
          </CardTitle>
          <CardDescription>Challenge yourself with dialogues, quizzes, and in-depth word exploration.</CardDescription>
        </CardHeader>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center gap-2">
            <MessageSquareQuote className="h-7 w-7" /> Dialogue Stories
          </CardTitle>
          <CardDescription>Practice conversations with parallel English and Bahasa Indonesia text. (More stories coming soon!)</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {sampleDialogues.map((dialogue, index) => (
              <AccordionItem value={`dialogue-${index}`} key={dialogue.title}>
                <AccordionTrigger className="text-xl hover:text-accent">{dialogue.title} (Characters: {dialogue.characters.join(', ')})</AccordionTrigger>
                <AccordionContent className="space-y-3 p-4 bg-background rounded-md">
                  {dialogue.turns.map((turn, turnIndex) => (
                    <div key={turnIndex} className="p-3 border rounded-md bg-card shadow-sm">
                      <p className="font-semibold text-primary">{turn.speaker}:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        <div className="space-y-1">
                           <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-foreground">English:</p>
                            <Button variant="ghost" size="icon" onClick={() => speakText(turn.english, 'en-US')} className="h-6 w-6 text-primary hover:text-accent">
                              <Volume2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-muted-foreground pl-1">{turn.english}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-foreground">Bahasa Indonesia:</p>
                             <Button variant="ghost" size="icon" onClick={() => speakText(turn.bahasa, 'id-ID')} className="h-6 w-6 text-primary hover:text-accent">
                              <Volume2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-muted-foreground pl-1">{turn.bahasa}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
             {sampleDialogues.length === 0 && <p className="text-muted-foreground">No dialogue stories available yet. Check back soon!</p>}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center gap-2">
            <BookMarked className="h-7 w-7" /> Vocabulary Quiz
          </CardTitle>
          <CardDescription>Test your knowledge. (More questions coming soon!)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {sampleQuizQuestions.map((question) => (
            <div key={question.id} className="p-4 border rounded-md bg-card shadow-sm">
              <p className="font-semibold text-foreground mb-2">{question.questionText}</p>
              {question.sentence && <p className="italic text-muted-foreground mb-3">Sentence: "{question.sentence}"</p>}
              {(question.type === 'multiple-choice' || question.type === 'find-word') && question.options && (
                <RadioGroup 
                  onValueChange={(value) => handleQuizAnswerChange(question.id, value)}
                  value={quizAnswers[question.id] || ""}
                  className="space-y-2"
                >
                  {question.options.map((option) => (
                    <div key={option} className="flex items-center space-x-3 p-2 rounded-md hover:bg-secondary transition-colors">
                      <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                      <Label htmlFor={`${question.id}-${option}`} className="cursor-pointer flex-grow">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              <Button onClick={() => checkQuizAnswer(question.id)} className="mt-4 text-xs" size="sm" variant="outline" disabled={!quizAnswers[question.id]}>
                Check Answer
              </Button>
              {quizScores[question.id] !== null && (
                <p className={`mt-2 text-sm font-medium ${quizScores[question.id] ? 'text-green-600' : 'text-red-600'}`}>
                  {quizScores[question.id] ? 'Correct! Well done!' : `Not quite. The correct answer is: ${question.correctAnswer}.`}
                </p>
              )}
            </div>
          ))}
          {sampleQuizQuestions.length === 0 && <p className="text-muted-foreground">No quiz questions available yet. Check back soon!</p>}
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center gap-2">
            <Search className="h-7 w-7" /> Word Explorer
          </CardTitle>
          <CardDescription>Type an English word to get its definition, example sentence, and Bahasa Indonesia translations. Also, hear how they are pronounced!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input 
              type="text"
              value={wordToExplore}
              onChange={(e) => { setWordToExplore(e.target.value); setExploreError(null);}}
              placeholder="Enter an English word..."
              className="flex-grow h-11 text-base"
              aria-label="Word to explore"
            />
            <Button onClick={handleExploreWord} disabled={isExploring || !wordToExplore.trim()} className="bg-accent text-accent-foreground hover:bg-accent/90 h-11 text-base">
              {isExploring ? <Loader2 className="animate-spin mr-2" /> : <Search className="mr-2 h-4 w-4" />}
              {isExploring ? 'Exploring...' : 'Explore Word'}
            </Button>
          </div>
          {exploreError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{exploreError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        
        {isExploring && !wordInfo && (
          <CardContent>
            <div className="text-center p-6">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="mt-4 text-lg text-muted-foreground">Exploring word details, please wait...</p>
            </div>
          </CardContent>
        )}

        {wordInfo && !isExploring && (
          <CardContent className="space-y-6 pt-4">
            <h3 className="text-2xl font-semibold text-accent flex items-center justify-between">
              {wordInfo.originalWord}
              <Button variant="ghost" size="icon" onClick={() => speakText(wordInfo.originalWord)} className="text-primary hover:text-accent">
                <Volume2 className="h-6 w-6" />
              </Button>
            </h3>
            
            <div className="p-4 border rounded-md bg-card shadow-sm">
              <h4 className="font-semibold text-lg text-foreground flex items-center justify-between">
                Definition (English)
                <Button variant="ghost" size="icon" onClick={() => speakText(wordInfo.englishDefinition)} className="ml-2 h-7 w-7 text-primary hover:text-accent">
                  <Volume2 className="h-5 w-5" />
                </Button>
              </h4>
              <p className="text-muted-foreground mt-1 text-base">{wordInfo.englishDefinition}</p>
            </div>

            <div className="p-4 border rounded-md bg-card shadow-sm">
              <h4 className="font-semibold text-lg text-foreground flex items-center justify-between">
                Example (English)
                <Button variant="ghost" size="icon" onClick={() => speakText(wordInfo.englishExample)} className="ml-2 h-7 w-7 text-primary hover:text-accent">
                  <Volume2 className="h-5 w-5" />
                </Button>
              </h4>
              <p className="text-muted-foreground mt-1 italic text-base">"{wordInfo.englishExample}"</p>
            </div>

            <Separator className="my-6"/>

            <div className="p-4 border rounded-md bg-card shadow-sm">
              <h4 className="font-semibold text-lg text-foreground flex items-center">
                <Languages className="h-5 w-5 mr-2 text-primary" /> Translation (Bahasa Indonesia): 
                <span className="ml-2 font-bold text-primary">{wordInfo.bahasaTranslationWord}</span>
                <Button variant="ghost" size="icon" onClick={() => speakText(wordInfo.bahasaTranslationWord, 'id-ID')} className="ml-auto h-7 w-7 text-primary hover:text-accent">
                  <Volume2 className="h-5 w-5" />
                </Button>
              </h4>
            </div>
            
            <div className="p-4 border rounded-md bg-card shadow-sm">
              <h4 className="font-semibold text-lg text-foreground flex items-center justify-between">
                <Languages className="h-5 w-5 mr-2 text-primary" /> Definition (Bahasa Indonesia)
                 <Button variant="ghost" size="icon" onClick={() => speakText(wordInfo.bahasaDefinition, 'id-ID')} className="ml-2 h-7 w-7 text-primary hover:text-accent">
                  <Volume2 className="h-5 w-5" />
                </Button>
              </h4>
              <p className="text-muted-foreground mt-1 text-base">{wordInfo.bahasaDefinition}</p>
            </div>

            <div className="p-4 border rounded-md bg-card shadow-sm">
              <h4 className="font-semibold text-lg text-foreground flex items-center justify-between">
                <Languages className="h-5 w-5 mr-2 text-primary" /> Example (Bahasa Indonesia)
                <Button variant="ghost" size="icon" onClick={() => speakText(wordInfo.bahasaExample, 'id-ID')} className="ml-2 h-7 w-7 text-primary hover:text-accent">
                  <Volume2 className="h-5 w-5" />
                </Button>
              </h4>
              <p className="text-muted-foreground mt-1 italic text-base">"{wordInfo.bahasaExample}"</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
