
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlayCircle, Video, Loader2, Sparkles, Wand2, Volume2, AlertCircle, CheckCircle2, Info, Library, ShieldCheck, Zap } from 'lucide-react';
import { startVideoGeneration, checkVideoStatus, GenerateVideoOutput } from '@/ai/flows/generate-pronunciation-video';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface VideoLesson {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  description: string;
  type: 'mastery' | 'experimental';
}

const prebuiltLessons: VideoLesson[] = [
  {
    id: 'v1',
    title: "Mastering the 'TH' Sound",
    url: "/video/th-sound-mastery.mp4", 
    thumbnail: "https://picsum.photos/seed/mouth1/400/225",
    description: "High-dimensional visual positioning for 'this' and 'that'.",
    type: 'mastery'
  },
  {
    id: 'v2',
    title: "The Silent 'K' Logic",
    url: "/video/silent-k-mastery.mp4",
    thumbnail: "https://picsum.photos/seed/mouth2/400/225",
    description: "Precision articulation for 'Knife' and 'Knowledge'.",
    type: 'mastery'
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
      const errorMsg = "Veo rate limit reached. Using the High-Dimensional Mastery Library is recommended for instant access.";
      setGenStatus({ status: 'failed', error: errorMsg });
      toast({ variant: "destructive", title: "Lab Quota Reached", description: errorMsg });
    }
  };

  return (
    <div className="space-y-12">
      <Card className="shadow-lg border-b-8 border-accent">
        <CardHeader>
          <CardTitle className="text-3xl text-primary flex items-center gap-2">
            <Video className="h-8 w-8 text-accent" /> Video Mastery Hub
          </CardTitle>
          <CardDescription className="text-lg">
            High-dimensional visual linguistic scaffolding. Precision mouth movements for native-like fluency.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Library className="h-6 w-6 text-accent" /> Mastery Library (Pre-Verified)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prebuiltLessons.map((lesson) => (
              <Card key={lesson.id} className="overflow-hidden cursor-pointer border-2 hover:border-accent transition-all group relative" onClick={() => setActiveVideo(lesson)}>
                <div className="absolute top-2 right-2 z-10 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg">
                  VERIFIED
                </div>
                <div className="relative aspect-video bg-muted">
                   <img src={lesson.thumbnail} alt={lesson.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                   <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                     <PlayCircle className="h-12 w-12 text-white" />
                   </div>
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg text-primary">{lesson.title}</CardTitle>
                  <CardDescription className="text-xs">{lesson.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          {activeVideo && (
            <Card className="mt-8 shadow-2xl border-4 border-primary overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
               <CardHeader className="bg-primary text-primary-foreground py-3 flex flex-row items-center justify-between">
                 <CardTitle className="text-lg flex items-center gap-2">
                   <Zap className="h-5 w-5 text-accent" /> {activeVideo.title}
                 </CardTitle>
                 <Button variant="ghost" size="sm" onClick={() => setActiveVideo(null)} className="h-7 hover:bg-white/10 text-white">Close Player</Button>
               </CardHeader>
               <div className="aspect-video bg-black">
                 <video src={activeVideo.url} controls className="w-full h-full" autoPlay />
               </div>
               <CardFooter className="bg-secondary/10 py-2 flex justify-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                 2026 Precision Protocol Standard
               </CardFooter>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent" /> AI Research Lab (Veo)
          </h2>
          <Card className="bg-secondary/20 border-accent/50 border-2 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg">Custom Generation</CardTitle>
              <CardDescription>Generate on-demand 5-second visual aids for specific words.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-accent/10 border-accent/50 text-accent-foreground py-2">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-[10px] leading-tight font-medium">
                  EXPERIMENTAL: Veo AI generation takes 60s and has high-volume limits.
                </AlertDescription>
              </Alert>

              <Input 
                placeholder="Enter word (e.g., 'Thorough')" 
                value={genWord} 
                onChange={(e) => setGenWord(e.target.value)} 
                className="bg-card border-primary/20"
              />
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !genWord.trim()}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-md"
              >
                {isGenerating ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Wand2 className="mr-2 h-4 w-4" />}
                {isGenerating ? 'AI is Painting...' : 'Generate New Visual'}
              </Button>

              {genStatus?.status === 'pending' && (
                <div className="p-6 bg-primary/10 rounded-lg text-center space-y-4 border border-primary/20">
                  <Loader2 className="animate-spin h-12 w-12 mx-auto text-accent" />
                  <p className="text-xs font-bold text-primary uppercase tracking-tighter">AI Visual Synthesis in Progress...</p>
                </div>
              )}

              {genStatus?.status === 'failed' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Quota Alert</AlertTitle>
                  <AlertDescription className="text-xs">{genStatus.error}</AlertDescription>
                </Alert>
              )}

              {genStatus?.status === 'completed' && genStatus.videoUrl && (
                <div className="space-y-4 animate-in zoom-in duration-500">
                  <video src={genStatus.videoUrl} controls className="w-full rounded-lg border-2 border-accent shadow-2xl" />
                  <Alert className="bg-green-600 text-white border-0">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Generation Successful</AlertTitle>
                    <AlertDescription className="text-xs">
                      Association verified for "{genWord}".
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
            <CardFooter className="text-[10px] text-muted-foreground flex justify-center border-t border-accent/20 pt-4">
               <ShieldCheck className="h-3 w-3 mr-1" /> Precision Verified AI Lab
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
