
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { BookMarked, MessageSquareQuote, Brain, Loader2, AlertCircle, Search, Languages, Volume2, RotateCcw, CheckSquare, Lock, ShieldCheck } from 'lucide-react';
import { useState, useMemo } from 'react';
import { getWordInfo, GetWordInfoOutput } from '@/ai/flows/get-word-info-flow';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  {
    title: "California Beach Adventure",
    characters: ["Alex", "Sam"],
    turns: [
      { speaker: "Alex", english: "Hey, have you heard about that new beach in California? I heard it's beautiful.", bahasa: "Hei, sudahkah kamu mendengar tentang pantai baru di California? Saya dengar itu indah." },
      { speaker: "Sam", english: "Yeah, I heard about it too. I've been dying to go check it out.", bahasa: "Ya, saya juga mendengar tentang itu. Saya benar-benar ingin pergi mengeceknya." },
      { speaker: "Alex", english: "Me too! I heard the sand is really soft and the water is crystal clear.", bahasa: "Saya juga! Saya dengar pasirnya sangat lembut dan airnya bening seperti kristal." },
      { speaker: "Sam", english: "I heard that too! And the sunsets are supposed to be amazing. I've always wanted to see a California sunset on the beach.", bahasa: "Saya juga mendengar itu! Dan matahari terbenamnya diharapkan menakjubkan. Saya selalu ingin melihat matahari terbenam di pantai California." },
      { speaker: "Alex", english: "That sounds perfect. Let's plan a trip there soon!", bahasa: "Itu terdengar sempurna. Mari kita rencanakan perjalanan ke sana segera!" },
      { speaker: "Sam", english: "Definitely, let's do it! I can't wait to see the dolphins and sea lions that live there.", bahasa: "Pasti, mari kita lakukan! Saya tidak sabar ingin melihat lumba-lumba dan singa laut yang hidup di sana." }
    ]
  }
];

interface QuizQuestion {
  id: string;
  questionText: string;
  type: 'multiple-choice' | 'find-word';
  options?: string[];
  sentence?: string;
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
  }
];


export default function AdvancedLearnerPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [wordToExplore, setWordToExplore] = useState('');
  const [wordInfo, setWordInfo] = useState<GetWordInfoOutput | null>(null);
  const [isExploring, setIsExploring] = useState(false);
  const [exploreError, setExploreError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizScores, setQuizScores] = useState<Record<string, boolean | null>>({});

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '2026') {
      setIsAuthenticated(true);
      toast({ title: "Access Granted", description: "Welcome to the Advanced Learner Hub." });
    } else {
      toast({ variant: "destructive", title: "Access Denied", description: "Incorrect password. Please use '2026'." });
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

  const quizSummary = useMemo(() => {
    const totalQuestions = sampleQuizQuestions.length;
    const attempted = Object.values(quizScores).filter(score => score !== null).length;
    const correct = Object.values(quizScores).filter(score => score === true).length;
    return { totalQuestions, attempted, correct };
  }, [quizScores]);

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizScores({});
    toast({ title: "Quiz Reset", description: "You can try the quiz again!" });
  };

  const speakText = (text: string, lang: 'en-US' | 'id-ID' = 'en-US') => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md shadow-2xl border-2 border-accent">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Lock className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="text-2xl">Premium Access Required</CardTitle>
            <CardDescription>Enter the password to access advanced lessons and the word explorer.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input 
                type="password" 
                placeholder="Enter access code..." 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="text-center text-lg"
              />
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Unlock Hub
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-xs text-muted-foreground flex justify-center">
             <ShieldCheck className="h-3 w-3 mr-1" /> Secure 2026 Protocol
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
          <CardDescription>Practice conversations with parallel English and Bahasa Indonesia text.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {sampleDialogues.map((dialogue, index) => (
              <AccordionItem value={`dialogue-${index}`} key={dialogue.title}>
                <AccordionTrigger className="text-xl hover:text-accent">{dialogue.title}</AccordionTrigger>
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
          </Accordion>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center gap-2">
            <BookMarked className="h-7 w-7" /> Vocabulary Quiz
          </CardTitle>
          <CardDescription>Test your knowledge with multiple choice and word identification.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {sampleQuizQuestions.map((question) => (
            <div key={question.id} className="p-4 border rounded-md bg-card shadow-sm">
              <p className="font-semibold text-foreground mb-2">{question.questionText}</p>
              {question.sentence && <p className="italic text-muted-foreground mb-3">Sentence: "{question.sentence}"</p>}
              <RadioGroup 
                onValueChange={(value) => handleQuizAnswerChange(question.id, value)}
                value={quizAnswers[question.id] || ""}
                className="space-y-2"
              >
                {question.options?.map((option) => (
                  <div key={option} className="flex items-center space-x-3 p-2 rounded-md hover:bg-secondary transition-colors">
                    <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                    <Label htmlFor={`${question.id}-${option}`} className="cursor-pointer flex-grow">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
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
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-2 p-6 border-t">
            <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                <CheckSquare className="h-6 w-6"/>
                <span>Quiz Summary</span>
            </div>
            <p className="text-muted-foreground">Correct: <span className="font-bold text-green-600">{quizSummary.correct}</span> / {quizSummary.attempted}</p>
            <Button onClick={resetQuiz} variant="outline" size="sm" className="mt-2">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset Quiz
            </Button>
        </CardFooter>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center gap-2">
            <Search className="h-7 w-7" /> Word Explorer
          </CardTitle>
          <CardDescription>Type an English word to get its definition, example sentence, and Bahasa Indonesia translations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input 
              type="text"
              value={wordToExplore}
              onChange={(e) => { setWordToExplore(e.target.value); setExploreError(null);}}
              placeholder="Enter an English word..."
              className="flex-grow h-11"
            />
            <Button onClick={handleExploreWord} disabled={isExploring || !wordToExplore.trim()} className="bg-accent text-accent-foreground hover:bg-accent/90 h-11">
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
        
        {wordInfo && (
          <CardContent className="space-y-6 pt-4">
            <h3 className="text-2xl font-semibold text-accent flex items-center justify-between">
              {wordInfo.originalWord}
              <Button variant="ghost" size="icon" onClick={() => speakText(wordInfo.originalWord)} className="text-primary hover:text-accent">
                <Volume2 className="h-6 w-6" />
              </Button>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-md bg-card">
                <h4 className="font-semibold text-lg">English</h4>
                <p className="text-muted-foreground mt-2">{wordInfo.englishDefinition}</p>
                <p className="text-muted-foreground italic mt-2">"{wordInfo.englishExample}"</p>
              </div>
              <div className="p-4 border rounded-md bg-secondary">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Languages className="h-5 w-5 text-primary" /> Bahasa Indonesia
                </h4>
                <p className="text-primary font-bold mt-2">{wordInfo.bahasaTranslationWord}</p>
                <p className="text-muted-foreground mt-2">{wordInfo.bahasaDefinition}</p>
                <p className="text-muted-foreground italic mt-2">"{wordInfo.bahasaExample}"</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
