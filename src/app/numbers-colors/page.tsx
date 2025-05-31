
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2, Palette, Hash } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface LearningItem {
  id: string | number;
  englishName: string;
  bahasaName: string;
  visual?: string; // For colors, this could be a hex code or Tailwind class
  symbol?: string; // For numbers, the numeral itself
}

const numbersData: LearningItem[] = [
  { id: 1, symbol: '1', englishName: 'One', bahasaName: 'Satu' },
  { id: 2, symbol: '2', englishName: 'Two', bahasaName: 'Dua' },
  { id: 3, symbol: '3', englishName: 'Three', bahasaName: 'Tiga' },
  { id: 4, symbol: '4', englishName: 'Four', bahasaName: 'Empat' },
  { id: 5, symbol: '5', englishName: 'Five', bahasaName: 'Lima' },
  { id: 6, symbol: '6', englishName: 'Six', bahasaName: 'Enam' },
  { id: 7, symbol: '7', englishName: 'Seven', bahasaName: 'Tujuh' },
  { id: 8, symbol: '8', englishName: 'Eight', bahasaName: 'Delapan' },
  { id: 9, symbol: '9', englishName: 'Nine', bahasaName: 'Sembilan' },
  { id: 10, symbol: '10', englishName: 'Ten', bahasaName: 'Sepuluh' },
];

const colorsData: LearningItem[] = [
  { id: 'red', visual: 'bg-red-500', englishName: 'Red', bahasaName: 'Merah' },
  { id: 'blue', visual: 'bg-blue-500', englishName: 'Blue', bahasaName: 'Biru' },
  { id: 'green', visual: 'bg-green-500', englishName: 'Green', bahasaName: 'Hijau' },
  { id: 'yellow', visual: 'bg-yellow-400', englishName: 'Yellow', bahasaName: 'Kuning' },
  { id: 'black', visual: 'bg-black', englishName: 'Black', bahasaName: 'Hitam' },
  { id: 'white', visual: 'bg-white border border-gray-300', englishName: 'White', bahasaName: 'Putih' },
  { id: 'purple', visual: 'bg-purple-500', englishName: 'Purple', bahasaName: 'Ungu' },
  { id: 'orange', visual: 'bg-orange-500', englishName: 'Orange', bahasaName: 'Oranye' },
];

export default function NumbersColorsPage() {
  const { toast } = useToast();

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

  return (
    <div className="space-y-12">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary flex items-center gap-2">
            <Hash className="h-8 w-8" /> Learn Numbers <Palette className="h-8 w-8 ml-2" /> & Colors
          </CardTitle>
          <CardDescription>
            Discover numbers and colors in English and Bahasa Indonesia. Click the speaker icon to hear them!
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center gap-2">
            <Hash className="h-7 w-7" /> Numbers (Angka)
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {numbersData.map((item) => (
            <Card key={item.id} className="p-4 flex flex-col items-center justify-between space-y-3 bg-secondary shadow-sm hover:shadow-md transition-shadow">
              <div className="text-6xl font-bold text-accent">{item.symbol}</div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <p className="text-lg font-semibold text-secondary-foreground">{item.englishName}</p>
                  <Button variant="ghost" size="icon" onClick={() => speakText(item.englishName, 'en-US')} className="h-7 w-7 text-primary hover:text-accent">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <p className="text-md text-muted-foreground">{item.bahasaName}</p>
                  <Button variant="ghost" size="icon" onClick={() => speakText(item.bahasaName, 'id-ID')} className="h-7 w-7 text-primary hover:text-accent">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center gap-2">
            <Palette className="h-7 w-7" /> Colors (Warna)
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {colorsData.map((item) => (
            <Card key={item.id} className="p-4 flex flex-col items-center justify-between space-y-3 bg-secondary shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-20 h-20 rounded-full ${item.visual} shadow-inner flex items-center justify-center`}>
                {item.englishName === 'White' && <span className="text-xs text-gray-400">White</span>}
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <p className="text-lg font-semibold text-secondary-foreground">{item.englishName}</p>
                  <Button variant="ghost" size="icon" onClick={() => speakText(item.englishName, 'en-US')} className="h-7 w-7 text-primary hover:text-accent">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <p className="text-md text-muted-foreground">{item.bahasaName}</p>
                  <Button variant="ghost" size="icon" onClick={() => speakText(item.bahasaName, 'id-ID')} className="h-7 w-7 text-primary hover:text-accent">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
