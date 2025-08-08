
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Speaker, XCircle, Volume2, Languages, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { translateContent, TranslateContentOutput } from '@/ai/flows/translate-content';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AlphabetInfo {
  letter: string;
  name: string; // How the letter name is pronounced (e.g., "Ay")
  exampleWord: string; // The example word (e.g., "Apple")
}

const alphabetData: AlphabetInfo[] = [
  { letter: 'A', name: 'Ay', exampleWord: 'Apple' }, { letter: 'B', name: 'Bee', exampleWord: 'Ball' },
  { letter: 'C', name: 'Cee', exampleWord: 'Cat' }, { letter: 'D', name: 'Dee', exampleWord: 'Dog' },
  { letter: 'E', name: 'Ee', exampleWord: 'Elephant' }, { letter: 'F', name: 'Eff', exampleWord: 'Fish' },
  { letter: 'G', name: 'Gee', exampleWord: 'Goat' }, { letter: 'H', name: 'Aitch', exampleWord: 'Hat' },
  { letter: 'I', name: 'Eye', exampleWord: 'Igloo' }, { letter: 'J', name: 'Jay', exampleWord: 'Jam' },
  { letter: 'K', name: 'Kay', exampleWord: 'Kite' }, { letter: 'L', name: 'El', exampleWord: 'Lion' },
  { letter: 'M', name: 'Em', exampleWord: 'Monkey' }, { letter: 'N', name: 'En', exampleWord: 'Net' },
  { letter: 'O', name: 'Oh', exampleWord: 'Octopus' }, { letter: 'P', name: 'Pee', exampleWord: 'Pig' },
  { letter: 'Q', name: 'Queue', exampleWord: 'Queen' }, { letter: 'R', name: 'Ar', exampleWord: 'Rabbit' },
  { letter: 'S', name: 'Ess', exampleWord: 'Sun' }, { letter: 'T', name: 'Tee', exampleWord: 'Tiger' },
  { letter: 'U', name: 'You', exampleWord: 'Umbrella' }, { letter: 'V', name: 'Vee', exampleWord: 'Violin' },
  { letter: 'W', name: 'Double-you', exampleWord: 'Watch' }, { letter: 'X', name: 'Ex', exampleWord: 'X-ray' },
  { letter: 'Y', name: 'Why', exampleWord: 'Yoyo' }, { letter: 'Z', name: 'Zee', exampleWord: 'Zebra' },
];

export default function AlphabetPage() {
  const [selectedLetterInfo, setSelectedLetterInfo] = useState<AlphabetInfo | null>(null);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [translatedWord, setTranslatedWord] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  const { toast } = useToast();
  
  // Ref to hold the utterance queue
  const speechQueueRef = useRef<SpeechSynthesisUtterance[]>([]);
  
  const processSpeechQueue = useCallback(() => {
    if (speechQueueRef.current.length > 0 && !window.speechSynthesis.speaking) {
      const utterance = speechQueueRef.current.shift();
      if (utterance) {
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  }, []);

  const speakText = useCallback((text: string, options: { lang?: string, pitch?: number, rate?: number, onEnd?: () => void } = {}) => {
      if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang || 'en-US';
      utterance.pitch = options.pitch || 1;
      utterance.rate = options.rate || 1;
      
      utterance.onend = () => {
        setIsSpeaking(false);
        if (options.onEnd) {
          options.onEnd();
        }
        processSpeechQueue(); 
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event.error);
        toast({ variant: "destructive", title: "Pronunciation Error", description: "Could not play audio." });
        setIsSpeaking(false);
        speechQueueRef.current = []; // Clear queue on error
      };
      
      speechQueueRef.current.push(utterance);
      if (!window.speechSynthesis.speaking) {
        processSpeechQueue();
      }
  }, [toast, processSpeechQueue]);
  

  const handleLetterClick = (letterInfo: AlphabetInfo) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
    }
    
    setSelectedLetterInfo(letterInfo);
    setCurrentWord(prevWord => prevWord + letterInfo.letter);
    
    // Speak letter name, then the example word
    speakText(letterInfo.name, { pitch: 1.2, rate: 0.9 });
    speakText(letterInfo.exampleWord, { pitch: 1, rate: 1.0 });
  };

  const handlePronounceWord = () => {
    if (!currentWord || isSpeaking) return;
    speakText(currentWord, { rate: 0.9 });
  };
  
  const handleTranslateWord = async () => {
    if (!currentWord || isTranslating) return;

    setIsTranslating(true);
    setTranslationError(null);
    setTranslatedWord(null);

    try {
      const result: TranslateContentOutput = await translateContent({
        textContent: currentWord,
        sourceLanguage: "English",
        targetLanguage: "Bahasa Indonesia"
      });
      setTranslatedWord(result.translatedText);
      toast({ title: "Translation Successful!", description: `"${currentWord}" translated.` });
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "An unknown error occurred.";
      setTranslationError(errorMsg);
      toast({ variant: "destructive", title: "Translation Failed", description: errorMsg });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleClearWord = () => {
    setCurrentWord('');
    setSelectedLetterInfo(null);
    setTranslatedWord(null);
    setTranslationError(null);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      speechQueueRef.current = [];
    }
  };
  
  useEffect(() => {
    const speech = window.speechSynthesis;
    const onSpeakingChange = () => {
      if (!speech.speaking && speechQueueRef.current.length === 0) {
        setIsSpeaking(false);
      }
    };
    speech.addEventListener('speakingchange', onSpeakingChange);

    return () => {
      speech.cancel();
      speech.removeEventListener('speakingchange', onSpeakingChange);
    };
  }, []);


  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary">The English Alphabet & Word Speller</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground mb-6">
            Click a letter to hear its name and an example word (e.g., "A... Apple").
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-9 gap-3">
            {alphabetData.map((info) => (
              <Button
                key={info.letter}
                variant="outline"
                className="p-2 h-auto text-xl font-bold aspect-square flex flex-col items-center justify-center
                           hover:bg-accent hover:text-accent-foreground transition-all duration-200 transform hover:scale-105
                           focus:ring-2 focus:ring-accent focus:ring-offset-2"
                onClick={() => handleLetterClick(info)}
                aria-label={`Letter ${info.letter}, example ${info.exampleWord}`}
                disabled={isSpeaking}
              >
                {info.letter}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Word Speller & Translator</CardTitle>
          <CardDescription>The word you spell will appear here. You can then pronounce it or translate it.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            type="text" 
            readOnly 
            value={currentWord} 
            placeholder="Click letters above to spell a word..."
            className="text-2xl h-14 tracking-widest font-mono bg-secondary text-secondary-foreground text-center"
            aria-label="Currently spelled word"
          />
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button 
              onClick={handlePronounceWord} 
              disabled={!currentWord || isSpeaking || isTranslating}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex-grow"
            >
              <Speaker className="mr-2 h-5 w-5" /> Pronounce Word
            </Button>
             <Button 
              onClick={handleTranslateWord} 
              disabled={!currentWord || isSpeaking || isTranslating}
              className="bg-accent text-accent-foreground hover:bg-accent/90 flex-grow"
            >
              {isTranslating ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> : <Languages className="mr-2 h-5 w-5" />}
              {isTranslating ? 'Translating...' : 'Translate to Bahasa'}
            </Button>
            <Button 
              onClick={handleClearWord} 
              variant="destructive"
              disabled={!currentWord}
              className="flex-grow"
            >
              <XCircle className="mr-2 h-5 w-5" /> Clear
            </Button>
          </div>
          {translationError && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Translation Error</AlertTitle>
                <AlertDescription>{translationError}</AlertDescription>
              </Alert>
          )}
          {translatedWord && (
            <div className="text-center p-4 mt-2 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Bahasa Indonesia Translation:</p>
                <p className="text-2xl font-bold text-accent">{translatedWord}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedLetterInfo && (
        <Card className="mt-8 shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl text-accent">{selectedLetterInfo.letter}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-3">
             <p className="text-muted-foreground">
              Letter Name: <span className="font-bold text-primary">{selectedLetterInfo.name}</span>
            </p>
            <p className="text-muted-foreground">
              Example Word: <span className="font-bold text-primary">{selectedLetterInfo.exampleWord}</span>
            </p>
            <Button 
              onClick={() => {
                if(isSpeaking) window.speechSynthesis.cancel();
                speakText(selectedLetterInfo.name, { pitch: 1.2, rate: 0.9 });
                speakText(selectedLetterInfo.exampleWord, { pitch: 1, rate: 1.0 });
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              aria-label={`Pronounce letter ${selectedLetterInfo.letter} and example ${selectedLetterInfo.exampleWord} again`}
              disabled={isSpeaking}
            >
              <Volume2 className="mr-2 h-5 w-5" /> Hear Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
