
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlayCircle, Video, Loader2, Sparkles, Wand2, Volume2, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { startVideoGeneration, checkVideoStatus, GenerateVideoOutput } from '@/ai/flows/generate-pronunciation-video';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface VideoLesson {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  description: string;
}

const prebuiltLessons: VideoLesson[] = [
  {
    id: 'v1',
    title: "Mastering the 'TH' Sound",
    url: "https://www.w3schools.com/html/mov_bbb.mp4", // Placeholder
    thumbnail: "https://picsum.photos/seed/mouth1/400/225",
    description: "Learn how to position your tongue for 'this' and 'that'."
  },
  {
    id: 'v2',
    title: "The Silent 'K' Challenge",
    url: "https://www.w3schools.com/html/movie.mp4", // Placeholder
    thumbnail: "https://picsum.photos/seed/mouth2/400/225",
    description: "Common mistakes with 'Knife', 'Knee', and 'Know'."
  }
];

export default function VideoMasteryPage() {
  const [activeVideo, setActiveVideo] = useState<VideoLesson | null>(null);
  const [genWord, setGenWord] = useState('');
  const [genStatus, setGenStatus] = useState<GenerateVideoOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!genWord.trim()) return;
    setIsGenerating(true);
    setGenStatus(null);
    
    try {
      const start = await startVideoGeneration({ word: genWord });
      setGenStatus(start);
      
      if (start.operationId) {
        const pollInterval = setInterval(async () => {
          const status = await checkVideoStatus(start.operationId!);
          setGenStatus(status);
          if (status.status !== 'pending') {
            clearInterval(pollInterval);
            setIsGenerating(false);
            if (status.status === 'completed') {
              toast({ title: "AI Visual Ready!", description: `Generated visual aid for "${genWord}".` });
            }
          }
        }, 5000);
      }
    } catch (e) {
      setIsGenerating(false);
      const errorMsg = "Veo rate limit reached or service is busy. Please try again in a few minutes.";
      setGenStatus({ status: 'failed', error: errorMsg });
      toast({ variant: "destructive", title: "Generation Error", description: errorMsg });
    }
  };

  return (
    <div className="space-y-12">
      <Card className="shadow-lg border-b-4 border-primary">
        <CardHeader>
          <CardTitle className="text-3xl text-primary flex items-center gap-2">
            <Video className="h-8 w-8 text-accent" /> Pronunciation Video Mastery
          </CardTitle>
          <CardDescription>
            Visual linguistic scaffolding for non-native speakers. Watch and replicate precision mouth movements.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <PlayCircle className="h-6 w-6" /> Lesson Library
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prebuiltLessons.map((lesson) => (
              <Card key={lesson.id} className="overflow-hidden cursor-pointer hover:border-accent transition-all group" onClick={() => setActiveVideo(lesson)}>
                <div className="relative aspect-video bg-muted">
                   <img src={lesson.thumbnail} alt={lesson.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                   <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                     <PlayCircle className="h-12 w-12 text-white" />
                   </div>
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{lesson.title}</CardTitle>
                  <CardDescription className="text-xs">{lesson.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          {activeVideo && (
            <Card className="mt-8 shadow-2xl border-2 border-primary overflow-hidden">
               <CardHeader className="bg-primary text-primary-foreground py-3">
                 <CardTitle className="text-lg flex justify-between items-center">
                   Currently Playing: {activeVideo.title}
                   <Button variant="ghost" size="sm" onClick={() => setActiveVideo(null)} className="h-7 hover:bg-white/10">Close</Button>
                 </CardTitle>
               </CardHeader>
               <div className="aspect-video bg-black">
                 <video src={activeVideo.url} controls className="w-full h-full" autoPlay />
               </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent" /> AI Visual Lab (Veo)
          </h2>
          <Card className="bg-secondary/20 border-accent/30 border-2">
            <CardHeader>
              <CardTitle className="text-lg">Generate Custom Visual Aid</CardTitle>
              <CardDescription>Enter a difficult word to generate a 5-second pronunciation guide.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-accent/10 border-accent/50 text-accent-foreground py-2">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-[10px] leading-tight">
                  Veo AI has a global rate limit. If generation fails, please wait 5 minutes before trying again.
                </AlertDescription>
              </Alert>

              <Input 
                placeholder="Enter word (e.g., 'Thorough')" 
                value={genWord} 
                onChange={(e) => setGenWord(e.target.value)} 
                className="bg-card"
              />
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !genWord.trim()}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {isGenerating ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Wand2 className="mr-2 h-4 w-4" />}
                {isGenerating ? 'Generating Video...' : 'Generate AI Visual'}
              </Button>

              {genStatus?.status === 'pending' && (
                <div className="p-4 bg-primary/10 rounded-lg text-center space-y-3">
                  <Loader2 className="animate-spin h-10 w-10 mx-auto text-accent" />
                  <p className="text-xs font-medium text-muted-foreground">Veo AI is painting your video... This takes about 30-60 seconds.</p>
                </div>
              )}

              {genStatus?.status === 'failed' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Generation Failed</AlertTitle>
                  <AlertDescription className="text-xs">{genStatus.error}</AlertDescription>
                </Alert>
              )}

              {genStatus?.status === 'completed' && genStatus.videoUrl && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <video src={genStatus.videoUrl} controls className="w-full rounded-lg border-2 border-accent" />
                  <Alert className="bg-green-100 border-green-500">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Visual Complete</AlertTitle>
                    <AlertDescription className="text-green-700 text-xs">
                      Study the tutor's lip position for "{genWord}".
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
            <CardFooter className="text-[10px] text-muted-foreground flex justify-center">
               <ShieldCheck className="h-3 w-3 mr-1" /> Powered by Gemini & Veo 2.0
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
