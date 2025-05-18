
'use client';

import { useState, DragEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Puzzle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MatchItem {
  id: string;
  word: string;
  cue: string; // Emoji or simple text cue
  isMatched: boolean;
}

interface DraggableWord {
  id: string; // Should correspond to a MatchItem id
  text: string;
  isUsed: boolean;
}

const initialTargetItems: MatchItem[] = [
  { id: 'apple', word: 'Apple', cue: '🍎', isMatched: false },
  { id: 'dog', word: 'Dog', cue: '🐶', isMatched: false },
  { id: 'car', word: 'Car', cue: '🚗', isMatched: false },
  { id: 'book', word: 'Book', cue: '📚', isMatched: false },
];

// Function to shuffle an array (Fisher-Yates shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const initialDraggableWords: () => DraggableWord[] = () => shuffleArray(
  initialTargetItems.map(item => ({ id: item.id, text: item.word, isUsed: false }))
);


export default function MatchGamePage() {
  const [targetItems, setTargetItems] = useState<MatchItem[]>(initialTargetItems);
  const [draggableWords, setDraggableWords] = useState<DraggableWord[]>(initialDraggableWords());
  const [draggedWordId, setDraggedWordId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDragStart = (event: DragEvent<HTMLDivElement>, wordId: string) => {
    setDraggedWordId(wordId);
    event.dataTransfer.setData('text/plain', wordId); // Necessary for Firefox
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Allow drop
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, targetItemId: string) => {
    event.preventDefault();
    if (!draggedWordId) return;

    const targetItem = targetItems.find(item => item.id === targetItemId);
    const draggedWord = draggableWords.find(word => word.id === draggedWordId);

    if (targetItem && draggedWord && targetItem.id === draggedWord.id && !targetItem.isMatched) {
      setTargetItems(prevItems =>
        prevItems.map(item =>
          item.id === targetItemId ? { ...item, isMatched: true } : item
        )
      );
      setDraggableWords(prevWords =>
        prevWords.map(word =>
          word.id === draggedWordId ? { ...word, isUsed: true } : word
        )
      );
      toast({ title: "Correct!", description: `You matched "${draggedWord.text}"!` });
    } else if (targetItem && targetItem.isMatched) {
      toast({ variant: "destructive", title: "Already Matched!", description: "This spot is already correctly matched." });
    }
    else {
      toast({ variant: "destructive", title: "Incorrect Match", description: "Try a different word or spot." });
    }
    setDraggedWordId(null); // Reset after drop attempt
  };

  const resetGame = () => {
    setTargetItems(initialTargetItems.map(item => ({ ...item, isMatched: false })));
    setDraggableWords(initialDraggableWords());
    setDraggedWordId(null);
    toast({ title: "Game Reset", description: "The game has been reset." });
  };
  
  const allMatched = targetItems.every(item => item.isMatched);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary flex items-center gap-2">
            <Puzzle className="h-8 w-8" /> Word Match Game
          </CardTitle>
          <CardDescription>Drag the correct word to its matching picture cue.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-8">
          
          {/* Drop Zones */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-2xl">
            {targetItems.map(item => (
              <div
                key={item.id}
                data-id={item.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, item.id)}
                className={`w-full aspect-square border-2 border-dashed border-primary rounded-lg flex items-center justify-center text-4xl md:text-5xl
                            transition-all duration-200
                            ${item.isMatched ? 'bg-green-100 border-green-500' : 'bg-secondary hover:bg-muted'}
                            ${!item.isMatched && draggedWordId === item.id ? 'ring-4 ring-accent ring-offset-2' : ''} 
                            `}
              >
                {item.isMatched ? item.word : item.cue}
              </div>
            ))}
          </div>

          {/* Draggable Words */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 p-4 bg-card rounded-lg shadow max-w-2xl w-full">
            {draggableWords.map(word =>
              !word.isUsed ? (
                <div
                  key={word.id}
                  id={word.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, word.id)}
                  className="p-3 md:p-4 bg-accent text-accent-foreground rounded-md shadow-md cursor-grab text-lg md:text-xl font-semibold hover:scale-105 active:cursor-grabbing transition-transform"
                >
                  {word.text}
                </div>
              ) : (
                 <div key={word.id} className="p-3 md:p-4 bg-muted text-muted-foreground rounded-md shadow-inner text-lg md:text-xl line-through">
                  {word.text}
                </div>
              )
            )}
            {draggableWords.every(w => w.isUsed) && !allMatched && (
                 <p className="text-muted-foreground">Some words might be mismatched. Try resetting.</p>
            )}
          </div>
          
          {allMatched && (
            <div className="text-center p-6 bg-green-100 border-2 border-green-500 rounded-lg shadow-xl">
              <h2 className="text-3xl font-bold text-green-700 mb-3">Congratulations!</h2>
              <p className="text-xl text-green-600">You've matched all the words correctly!</p>
            </div>
          )}

          <Button onClick={resetGame} variant="outline" className="mt-6 text-lg py-3 px-6">
            Reset Game
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}
