
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Speaker, XCircle, Volume2 } from 'lucide-react'; // Added Volume2
import { useState, useEffect, useCallback, useRef } from 'react';

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

  const speechQueue = useRef<(() => Promise<void>)[]>([]);
  const isProcessingQueue = useRef(false);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);


  const speakText = useCallback((text: string, lang: 'en-US' = 'en-US', pitch = 1, rate = 1): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        // Ensure text is a non-empty string
        if (typeof text !== 'string' || text.trim() === '') {
          console.warn('speakText called with invalid text:', text);
          resolve(); // Resolve to allow queue to continue if one item is bad
          return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        currentUtterance.current = utterance;
        utterance.lang = lang;
        utterance.pitch = pitch;
        utterance.rate = rate;
        
        utterance.onend = () => {
          currentUtterance.current = null;
          resolve();
        };
        utterance.onerror = (event) => {
          console.error("Speech synthesis error for text '"+ text +"':", event.error);
          currentUtterance.current = null;
          reject(event.error); 
        };
        
        window.speechSynthesis.speak(utterance);
      } else {
        console.warn("Speech synthesis not supported.");
        resolve(); 
      }
    });
  }, []);
  
  const add_to_speech_queue = useCallback((text: string, lang?: 'en-US', pitch?: number, rate?: number) => {
    speechQueue.current.push(() => speakText(text, lang, pitch, rate));
  }, [speakText]);

  const processSpeechQueue = useCallback(async () => {
    if (isProcessingQueue.current || speechQueue.current.length === 0) {
      if (speechQueue.current.length === 0) { // Ensure speaking is false if queue becomes empty
        setIsSpeaking(false);
        isProcessingQueue.current = false;
      }
      return;
    }
    isProcessingQueue.current = true;
    setIsSpeaking(true);
    
    while (speechQueue.current.length > 0) {
      const speechTask = speechQueue.current.shift();
      if (speechTask) {
        try {
          await speechTask();
        } catch (error) {
          console.error("Error processing a speech task in queue:", error);
          // If a task fails, we still want to ensure the queue processing eventually terminates correctly.
        }
      }
    }
    
    setIsSpeaking(false);
    isProcessingQueue.current = false;
  }, [/* speakText is memoized, add_to_speech_queue is memoized */]);

  const cancelCurrentSpeechAndClearQueue = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (currentUtterance.current) {
        // Attempt to stop specific utterance if possible, though cancel() is global
        currentUtterance.current.onend = null; // Prevent onend from firing after manual stop
        currentUtterance.current.onerror = null;
      }
      window.speechSynthesis.cancel(); // This stops all speech
    }
    speechQueue.current = []; 
    isProcessingQueue.current = false; 
    currentUtterance.current = null;
    setIsSpeaking(false); // Explicitly set speaking to false
  }, []);


  const handleLetterClick = (letterInfo: AlphabetInfo) => {
    setSelectedLetterInfo(letterInfo);
    setCurrentWord(prevWord => prevWord + letterInfo.letter);

    cancelCurrentSpeechAndClearQueue();

    if (typeof letterInfo.name === 'string' && letterInfo.name.trim() !== '') {
      add_to_speech_queue(letterInfo.name, 'en-US', 1.2, 0.9);
    } else {
      console.warn("Invalid letter name for:", letterInfo.letter);
    }
    
    speechQueue.current.push(() => new Promise(resolve => setTimeout(resolve, 150))); 
    
    if (typeof letterInfo.sound === 'string' && letterInfo.sound.trim() !== '') {
      add_to_speech_queue(letterInfo.sound, 'en-US', 1, 1.1);
    } else {
      console.warn("Invalid letter sound for:", letterInfo.letter);
    }
    
    processSpeechQueue();
  };

  const handlePronounceWord = async () => {
    if (!currentWord || isSpeaking) return;

    cancelCurrentSpeechAndClearQueue();

    for (const char of currentWord) {
      const letterInfo = alphabetData.find(l => l.letter === char.toUpperCase());
      if (letterInfo) {
        if (typeof letterInfo.name === 'string' && letterInfo.name.trim() !== '') {
          add_to_speech_queue(letterInfo.name, 'en-US', 1.2, 0.9);
          speechQueue.current.push(() => new Promise(resolve => setTimeout(resolve, 50)));
        } else {
          console.warn("Invalid letter name for spelling:", letterInfo.letter);
        }
      }
    }
    speechQueue.current.push(() => new Promise(resolve => setTimeout(resolve, 300)));
    if (typeof currentWord === 'string' && currentWord.trim() !== '') {
      add_to_speech_queue(currentWord, 'en-US', 1, 1);
    } else {
      console.warn("Invalid word for pronunciation:", currentWord);
    }
    processSpeechQueue();
  };

  const handleClearWord = () => {
    setCurrentWord('');
    setSelectedLetterInfo(null);
    cancelCurrentSpeechAndClearQueue();
  };
  
  useEffect(() => {
    return () => {
      cancelCurrentSpeechAndClearQueue();
    };
  }, [cancelCurrentSpeechAndClearQueue]);


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
          <CardTitle className="text-2xl text-primary">Word Speller</CardTitle>
          <CardDescription>The word you spell will appear here. Click "Pronounce Spelled Word" to hear it.</CardDescription>
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
              disabled={!currentWord || isSpeaking}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex-grow"
            >
              <Speaker className="mr-2 h-5 w-5" /> Pronounce Spelled Word
            </Button>
            <Button 
              onClick={handleClearWord} 
              variant="destructive"
              disabled={!currentWord && !selectedLetterInfo && !isSpeaking && speechQueue.current.length === 0}
              className="flex-grow"
            >
              <XCircle className="mr-2 h-5 w-5" /> Clear Word
            </Button>
          </div>
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
                cancelCurrentSpeechAndClearQueue();
                if (typeof selectedLetterInfo.name === 'string' && selectedLetterInfo.name.trim() !== '') {
                    add_to_speech_queue(selectedLetterInfo.name, 'en-US', 1.2, 0.9);
                }
                speechQueue.current.push(() => new Promise(resolve => setTimeout(resolve, 150)));
                if (typeof selectedLetterInfo.sound === 'string' && selectedLetterInfo.sound.trim() !== '') {
                    add_to_speech_queue(selectedLetterInfo.sound, 'en-US', 1, 1.1);
                }
                processSpeechQueue();
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
