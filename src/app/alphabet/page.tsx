
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
  sound: string; // The phonetic sound (e.g., "ah")
}

const alphabetData: AlphabetInfo[] = [
  { letter: 'A', name: 'Ay', sound: 'ah' }, { letter: 'B', name: 'Bee', sound: 'buh' },
  { letter: 'C', name: 'Cee', sound: 'kuh' }, { letter: 'D', name: 'Dee', sound: 'duh' },
  { letter: 'E', name: 'Ee', sound: 'eh' }, { letter: 'F', name: 'Eff', sound: 'fuh' },
  { letter: 'G', name: 'Gee', sound: 'guh' }, { letter: 'H', name: 'Aitch', sound: 'huh' },
  { letter: 'I', name: 'Eye', sound: 'ih' }, { letter: 'J', name: 'Jay', sound: 'juh' },
  { letter: 'K', name: 'Kay', sound: 'kuh' }, { letter: 'L', name: 'El', sound: 'luh' },
  { letter: 'M', name: 'Em', sound: 'muh' }, { letter: 'N', name: 'En', sound: 'nuh' },
  { letter: 'O', name: 'Oh', sound: 'aw' }, { letter: 'P', name: 'Pee', sound: 'puh' },
  { letter: 'Q', name: 'Queue', sound: 'kwuh' }, { letter: 'R', name: 'Ar', sound: 'ruh' },
  { letter: 'S', name: 'Ess', sound: 'sss' }, { letter: 'T', name: 'Tee', sound: 'tuh' },
  { letter: 'U', name: 'You', sound: 'uh' }, { letter: 'V', name: 'Vee', sound: 'vuh' },
  { letter: 'W', name: 'Double-you', sound: 'wuh' }, { letter: 'X', name: 'Ex', sound: 'ks' },
  { letter: 'Y', name: 'Why', sound: 'yuh' }, { letter: 'Z', name: 'Zee', sound: 'zuh' },
];

export default function AlphabetPage() {
  const [selectedLetterInfo, setSelectedLetterInfo] = useState<AlphabetInfo | null>(null);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [translatedWord, setTranslatedWord] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  const { toast } = useToast();
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speakText = useCallback((text: string, options: { lang?: string, pitch?: number, rate?: number, onEnd?: () => void } = {}) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (typeof text !== 'string' || text.trim() === '') return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || 'en-US';
    utterance.pitch = options.pitch || 1;
    utterance.rate = options.rate || 1;
    
    utteranceRef.current = utterance;
    setIsSpeaking(true);

    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
      if (options.onEnd) {
        options.onEnd();
      }
    };
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
      toast({ variant: "destructive", title: "Pronunciation Error", description: "Could not play audio." });
      setIsSpeaking(false);
      utteranceRef.current = null;
    };
    
    window.speechSynthesis.speak(utterance);
  }, [toast]);
  
  const handleLetterClick = (letterInfo: AlphabetInfo) => {
    if (isSpeaking) return;
    
    setSelectedLetterInfo(letterInfo);
    setCurrentWord(prevWord => prevWord + letterInfo.letter);
    
    // Speak letter name, then sound
    speakText(letterInfo.name, {
      pitch: 1.2, rate: 0.9,
      onEnd: () => {
        // Use a short delay before speaking the sound
        setTimeout(() => {
          speakText(letterInfo.sound, { pitch: 1, rate: 1.1 });
        }, 100);
      }
    });
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
    }
  };
  
  useEffect(() => {
    // Cleanup speech on unmount
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
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
            Click a letter to hear its name and sound, and to add it to the word speller.
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
                aria-label={`Letter ${info.letter}, name ${info.name}, sound ${info.sound}`}
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
              Letter Name Pronunciation: <span className="font-bold text-primary">{selectedLetterInfo.name}</span>
            </p>
            <p className="text-muted-foreground">
              Phonetic Sound: <span className="font-bold text-primary">{selectedLetterInfo.sound}</span>
            </p>
            <Button 
              onClick={() => {
                if(isSpeaking) return;
                speakText(selectedLetterInfo.name, {
                  pitch: 1.2, rate: 0.9,
                  onEnd: () => {
                    setTimeout(() => {
                      speakText(selectedLetterInfo.sound, { pitch: 1, rate: 1.1 });
                    }, 100);
                  }
                });
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              aria-label={`Pronounce letter ${selectedLetterInfo.letter} and sound ${selectedLetterInfo.sound} again`}
              disabled={isSpeaking}
            >
              <Volume2 className="mr-2 h-5 w-5" /> Hear Letter & Sound Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
