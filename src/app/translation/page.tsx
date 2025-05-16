// src/app/translation/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Languages, ArrowRightLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
// In a real scenario, this would import your Genkit flow
// import { translateContent } from '@/ai/flows/translation-aid'; 

export default function TranslationPage() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sourceLang, setSourceLang] = useState<'en' | 'id'>('en');

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to translate.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setTranslatedText('');

    // Placeholder for Genkit AI call
    // In a real scenario, you would call your Genkit flow here:
    // try {
    //   const result = await translateContent({ 
    //     text: inputText, 
    //     sourceLanguage: sourceLang, 
    //     targetLanguage: sourceLang === 'en' ? 'id' : 'en' 
    //   });
    //   setTranslatedText(result.translatedText); // Assuming this structure
    // } catch (e) {
    //   setError('Failed to translate. Please try again.');
    //   console.error(e);
    // }

    // Mock AI response for now
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (sourceLang === 'en') {
      setTranslatedText(`(Terjemahan Bahasa Indonesia) ${inputText}`);
    } else {
      setTranslatedText(`(English Translation) ${inputText}`);
    }
    
    setIsLoading(false);
  };

  const swapLanguages = () => {
    setSourceLang(prev => prev === 'en' ? 'id' : 'en');
    setInputText(translatedText);
    setTranslatedText(inputText);
  };
  
  useEffect(() => {
    // Placeholder for any client-side specific logic on mount
  }, []);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary flex items-center gap-2">
            <Languages className="h-8 w-8" /> Translation Tool
          </CardTitle>
          <CardDescription>Translate text between English and Bahasa Indonesia.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="font-semibold text-lg text-center md:text-right">
              {sourceLang === 'en' ? 'English' : 'Bahasa Indonesia'}
            </div>
            <Button variant="ghost" onClick={swapLanguages} className="md:hidden text-primary hover:text-accent">
              <ArrowRightLeft className="h-5 w-5 mr-2" /> Swap
            </Button>
            <Button variant="ghost" onClick={swapLanguages} className="hidden md:block text-primary hover:text-accent justify-self-center">
              <ArrowRightLeft className="h-6 w-6" />
            </Button>
            <div className="font-semibold text-lg text-center md:text-left">
              {sourceLang === 'en' ? 'Bahasa Indonesia' : 'English'}
            </div>
          </div>

          <Textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Enter text in ${sourceLang === 'en' ? 'English' : 'Bahasa Indonesia'}...`}
            className="min-h-[150px]"
          />
          <Button onClick={handleTranslate} disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            {isLoading ? 'Translating...' : 'Translate'}
          </Button>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {translatedText && (
            <div className="mt-4 p-4 border rounded-md bg-secondary">
              <h3 className="font-semibold text-lg text-primary mb-2">Translation:</h3>
              <p className="text-muted-foreground text-lg">{translatedText}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
