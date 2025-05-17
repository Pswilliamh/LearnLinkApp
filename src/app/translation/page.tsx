// src/app/translation/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Languages, ArrowRightLeft, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { translateContent, TranslateContentOutput } from '@/ai/flows/translate-content';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function TranslationPage() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sourceLang, setSourceLang] = useState<'en' | 'id'>('en');
  const { toast } = useToast();

  const getLanguageName = (langCode: 'en' | 'id'): string => {
    return langCode === 'en' ? 'English' : 'Bahasa Indonesia';
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to translate.');
      toast({ variant: "destructive", title: "Input Error", description: "Please enter text to translate." });
      return;
    }
    setIsLoading(true);
    setError(null);
    setTranslatedText('');

    const currentSourceLanguageName = getLanguageName(sourceLang);
    const currentTargetLanguageName = getLanguageName(sourceLang === 'en' ? 'id' : 'en');

    try {
      const result: TranslateContentOutput = await translateContent({ 
        textContent: inputText, 
        sourceLanguage: currentSourceLanguageName, 
        targetLanguage: currentTargetLanguageName
      });
      setTranslatedText(result.translatedText);
      toast({ title: "Translation Successful!", description: `Text translated from ${currentSourceLanguageName} to ${currentTargetLanguageName}.` });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during translation.";
      setError(`Failed to translate: ${errorMessage}`);
      toast({ variant: "destructive", title: "Translation Failed", description: errorMessage });
      console.error(e);
    }
    
    setIsLoading(false);
  };

  const swapLanguages = () => {
    setSourceLang(prev => prev === 'en' ? 'id' : 'en');
    // Swap texts
    const currentInput = inputText;
    const currentTranslated = translatedText;
    setInputText(currentTranslated); 
    setTranslatedText(currentInput);
    setError(null); // Clear any previous errors
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
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-x-4 gap-y-2 items-center">
            <div className="font-semibold text-lg text-center md:text-right text-foreground">
              {getLanguageName(sourceLang)}
            </div>
            <Button variant="ghost" onClick={swapLanguages} className="text-primary hover:text-accent justify-self-center">
              <ArrowRightLeft className="h-6 w-6" />
               <span className="sr-only">Swap Languages</span>
            </Button>
            <div className="font-semibold text-lg text-center md:text-left text-foreground">
              {getLanguageName(sourceLang === 'en' ? 'id' : 'en')}
            </div>
          </div>

          <Textarea 
            value={inputText}
            onChange={(e) => { setInputText(e.target.value); setError(null); }}
            placeholder={`Enter text in ${getLanguageName(sourceLang)}...`}
            className="min-h-[150px] text-base"
            aria-label={`Input text in ${getLanguageName(sourceLang)}`}
          />
          <Button onClick={handleTranslate} disabled={isLoading || !inputText.trim()} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-3">
            {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Languages className="mr-2 h-5 w-5" />}
            {isLoading ? 'Translating...' : `Translate to ${getLanguageName(sourceLang === 'en' ? 'id' : 'en')}`}
          </Button>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {isLoading && !translatedText && (
            <div className="text-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              <p className="mt-2 text-muted-foreground">Translating, please wait...</p>
            </div>
          )}
          {translatedText && !isLoading && (
            <Card className="mt-4 bg-secondary shadow-inner">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-xl text-primary">
                  Translation ({getLanguageName(sourceLang === 'en' ? 'id' : 'en')}):
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-secondary-foreground text-base whitespace-pre-wrap">{translatedText}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
