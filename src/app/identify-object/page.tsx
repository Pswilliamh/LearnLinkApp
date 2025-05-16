
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ImageUp, Wand2, Loader2, AlertCircle, Languages, Volume2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { identifyObject, IdentifyObjectOutput } from '@/ai/flows/identify-object-flow';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';


export default function IdentifyObjectPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IdentifyObjectOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setError(null);
      setResult(null); // Clear previous results
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdentifyObject = async () => {
    if (!imageFile || !imagePreview) {
      setError('Please select an image file first.');
      toast({
        variant: "destructive",
        title: "No Image Selected",
        description: "Please select an image file to identify.",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await identifyObject({ photoDataUri: imagePreview });
      setResult(response);
      toast({
        title: "Object Identified!",
        description: `Identified: ${response.objectName}`,
      });
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to identify object: ${errorMessage}`);
      toast({
        variant: "destructive",
        title: "Identification Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePronounceObjectName = (textToSpeak: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'en-US';
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
    // For example, could be used to reset state if the component unmounts/remounts under certain conditions
  }, []);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary flex items-center gap-2">
            <ImageUp className="h-8 w-8" /> Object Identifier
          </CardTitle>
          <CardDescription>Upload an image and let our AI identify the object, provide its definition, example sentences, and translations to Bahasa Indonesia.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
              id="file-upload"
              aria-label="Upload image file"
            />
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full md:w-auto">
              <ImageUp className="mr-2 h-4 w-4" /> Select Image
            </Button>
          </div>

          {imagePreview && (
            <div className="mt-4 border-2 border-dashed border-muted-foreground/50 rounded-lg p-4 flex justify-center items-center bg-card">
              <Image
                src={imagePreview}
                alt="Selected preview"
                width={400}
                height={300}
                className="rounded-md object-contain max-h-[300px] w-auto"
              />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleIdentifyObject} disabled={isLoading || !imageFile} className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Identifying...' : 'Identify Object'}
          </Button>
        </CardFooter>
      </Card>

      {isLoading && !result && ( 
        <Card className="shadow-md">
          <CardContent className="p-6 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Identifying object, please wait...</p>
          </CardContent>
        </Card>
      )}

      {result && !isLoading && (
        <Card className="shadow-md mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-primary">
                Identification Result: <span className="text-accent">{result.objectName}</span>
              </CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handlePronounceObjectName(result.objectName)}
                aria-label={`Pronounce ${result.objectName}`}
                className="text-primary hover:text-accent"
              >
                <Volume2 className="h-6 w-6" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Definition (English)</h3>
              <p className="text-muted-foreground mt-1">{result.definition}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Example Sentences (English):</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground mt-1">
                {result.exampleSentences.map((sentence, index) => (
                  <li key={`en-${index}`}>{sentence}</li>
                ))}
              </ul>
            </div>

            <Separator className="my-6" />

            <div>
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Languages className="h-5 w-5 text-primary" /> Definition (Bahasa Indonesia)
              </h3>
              <p className="text-muted-foreground mt-1">{result.bahasaDefinition}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Languages className="h-5 w-5 text-primary" /> Example Sentences (Bahasa Indonesia):
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground mt-1">
                {result.bahasaExampleSentences.map((sentence, index) => (
                  <li key={`id-${index}`}>{sentence}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
