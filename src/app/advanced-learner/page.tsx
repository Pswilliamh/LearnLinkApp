
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { BookMarked, MessageSquareQuote, Brain, Loader2, AlertCircle, Search, Languages, Volume2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getWordInfo, GetWordInfoOutput } from '@/ai/flows/get-word-info-flow';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

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
    type: 'find-word', // This type will need more specific UI/logic for "finding"
    sentence: "She quickly reads the book.",
    options: ["She", "quickly", "reads", "book"], // Simulating as MC for now
    correctAnswer: "reads",
  },
];


export default function AdvancedLearnerPage() {
  const [wordToExplore, setWordToExplore] = useState('');
  const [wordInfo, setWordInfo] = useState<GetWordInfoOutput | null>(null);
  const [isExploring, setIsExploring] = useState(false);
  const [exploreError, setExploreError] = useState<string | null>(null);
  const { toast } = useToast();
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizScores, setQuizScores] = useState<Record<string, boolean | null>>({});

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
    setQuizScores(prev => ({ ...prev, [questionId]: null })); // Reset score for this question
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
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        variant: "destructive",
        title: "Pronunciation Failed",
        description: "Speech synthesis is not supported in your browser.",
      });
    }
  };
  
  useEffect(() => {
    // Placeholder for client-side initializations
  }, []);

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

      {/* Dialogue Stories Section */}
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
                <AccordionContent className="space-y-3">
                  {dialogue.turns.map((turn, turnIndex) => (
                    <div key={turnIndex} className="p-3 border rounded-md bg-secondary/50">
                      <p className="font-semibold text-primary">{turn.speaker}:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                        <div>
                          <p className="text-sm font-medium text-foreground">English:</p>
                          <p className="text-muted-foreground">{turn.english}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Bahasa Indonesia:</p>
                          <p className="text-muted-foreground">{turn.bahasa}</p>
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

      {/* Vocabulary Quiz Section */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center gap-2">
            <BookMarked className="h-7 w-7" /> Vocabulary Quiz
          </CardTitle>
          <CardDescription>Test your knowledge. (More questions coming soon!)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {sampleQuizQuestions.map((question) => (
            <div key={question.id} className="p-4 border rounded-md">
              <p className="font-semibold text-foreground mb-2">{question.questionText}</p>
              {question.sentence && <p className="italic text-muted-foreground mb-2">Sentence: "{question.sentence}"</p>}
              {question.type === 'multiple-choice' && question.options && (
                <RadioGroup 
                  onValueChange={(value) => handleQuizAnswerChange(question.id, value)}
                  value={quizAnswers[question.id] || ""}
                  className="space-y-1"
                >
                  {question.options.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                      <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              {/* Simplified 'find-word' as multiple choice for now */}
              {question.type === 'find-word' && question.options && (
                 <RadioGroup 
                  onValueChange={(value) => handleQuizAnswerChange(question.id, value)}
                  value={quizAnswers[question.id] || ""}
                  className="space-y-1"
                >
                  {question.options.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                      <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              <Button onClick={() => checkQuizAnswer(question.id)} className="mt-3 text-xs" size="sm" variant="outline" disabled={!quizAnswers[question.id]}>
                Check Answer
              </Button>
              {quizScores[question.id] !== null && (
                <p className={`mt-2 text-sm font-medium ${quizScores[question.id] ? 'text-green-600' : 'text-red-600'}`}>
                  {quizScores[question.id] ? 'Correct!' : `Incorrect. The answer is ${question.correctAnswer}.`}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Word Explorer Section */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center gap-2">
            <Search className="h-7 w-7" /> Word Explorer
          </CardTitle>
          <CardDescription>Type an English word to get its definition, example sentence, and Bahasa Indonesia translations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input 
              type="text"
              value={wordToExplore}
              onChange={(e) => setWordToExplore(e.target.value)}
              placeholder="Enter an English word..."
              className="flex-grow"
              aria-label="Word to explore"
            />
            <Button onClick={handleExploreWord} disabled={isExploring} className="bg-accent text-accent-foreground hover:bg-accent/90">
              {isExploring ? <Loader2 className="animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              {isExploring ? 'Exploring...' : 'Explore'}
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
            <div className="text-center p-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
              <p className="mt-3 text-muted-foreground">Exploring word details...</p>
            </div>
          </CardContent>
        )}

        {wordInfo && !isExploring && (
          <CardContent className="space-y-6 pt-4">
            <h3 className="text-xl font-semibold text-accent">{wordInfo.originalWord}</h3>
            
            <div>
              <h4 className="font-semibold text-foreground flex items-center">
                Definition (English)
                <Button variant="ghost" size="icon" onClick={() => speakText(wordInfo.englishDefinition)} className="ml-2 h-6 w-6 text-primary hover:text-accent">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </h4>
              <p className="text-muted-foreground mt-1">{wordInfo.englishDefinition}</p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground flex items-center">
                Example (English)
                <Button variant="ghost" size="icon" onClick={() => speakText(wordInfo.englishExample)} className="ml-2 h-6 w-6 text-primary hover:text-accent">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </h4>
              <p className="text-muted-foreground mt-1 italic">"{wordInfo.englishExample}"</p>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold text-foreground flex items-center">
                <Languages className="h-5 w-5 mr-2 text-primary" /> Translation (Bahasa Indonesia): <span className="ml-1 font-bold text-primary">{wordInfo.bahasaTranslationWord}</span>
                <Button variant="ghost" size="icon" onClick={() => speakText(wordInfo.bahasaTranslationWord, 'id-ID')} className="ml-2 h-6 w-6 text-primary hover:text-accent">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </h4>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground flex items-center">
                <Languages className="h-5 w-5 mr-2 text-primary" /> Definition (Bahasa Indonesia)
                 <Button variant="ghost" size="icon" onClick={() => speakText(wordInfo.bahasaDefinition, 'id-ID')} className="ml-2 h-6 w-6 text-primary hover:text-accent">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </h4>
              <p className="text-muted-foreground mt-1">{wordInfo.bahasaDefinition}</p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground flex items-center">
                <Languages className="h-5 w-5 mr-2 text-primary" /> Example (Bahasa Indonesia)
                <Button variant="ghost" size="icon" onClick={() => speakText(wordInfo.bahasaExample, 'id-ID')} className="ml-2 h-6 w-6 text-primary hover:text-accent">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </h4>
              <p className="text-muted-foreground mt-1 italic">"{wordInfo.bahasaExample}"</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

    