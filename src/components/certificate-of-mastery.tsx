
'use client';

import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Share2, Globe, Trophy, UserCheck, ShieldCheck, Zap } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import placeholderImages from '@/app/lib/placeholder-images.json';

interface CertificateProps {
  lessonName: string;
  certifiedBy: string;
  onClose: () => void;
}

export function CertificateOfMastery({ lessonName, certifiedBy, onClose }: CertificateProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    const shareData = {
      title: 'LearnLink Linguistic Mastery',
      text: `I just achieved Mastery in "${lessonName}" using the LearnLink Precision Protocol!`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text + " " + shareData.url);
        toast({ title: "Copied to clipboard!", description: "Share your achievement with your friends!" });
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md animate-in fade-in duration-300">
      <Card className="relative w-full max-w-5xl overflow-hidden border-8 border-primary bg-gradient-to-br from-card to-secondary/30 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="relative p-8 md:p-12 flex flex-col md:flex-row gap-8">
          {/* Left Visual */}
          <div className="hidden md:flex flex-col items-center justify-center w-1/4 border-4 border-green-500/50 rounded-2xl bg-green-500/10 p-6">
            <h2 className="text-4xl font-bold text-green-500 tracking-widest uppercase [writing-mode:vertical-lr] rotate-180">Mastery</h2>
          </div>

          {/* Main Content */}
          <div className="flex-grow space-y-8">
            <div className="text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2 text-accent">
                <Trophy className="h-6 w-6" />
                <span className="text-xl font-medium italic">Certificate of Linguistic Mastery</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">LearnLink Precision Protocol</h1>
              <p className="text-lg text-muted-foreground pt-4">This certifies that the student has successfully completed the module:</p>
              <div className="text-3xl md:text-4xl font-extrabold text-accent py-4">
                [{lessonName}]
              </div>
            </div>

            {/* Verification Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-y border-border/50">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/20 text-accent">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-foreground uppercase tracking-tight text-sm">Methodology:</p>
                  <p className="text-muted-foreground">Human Verified Precision Logic</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/20 text-accent">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-foreground uppercase tracking-tight text-sm">Status:</p>
                  <p className="text-muted-foreground">NON-AI CREATED CONTENT</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/20 text-accent">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-foreground uppercase tracking-tight text-sm">Logic Engine:</p>
                  <p className="text-muted-foreground">Three-Color Visual Syntax</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/20 text-accent">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-foreground uppercase tracking-tight text-sm">Certified By:</p>
                  <p className="text-muted-foreground">William H (Jakarta | 2026)</p>
                </div>
              </div>
            </div>

            <p className="text-center italic text-muted-foreground pt-6 border-t border-border/20">
              "Language is not a code to be translated, but a nature to be lived."
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
              <p className="text-sm font-bold text-accent">LearnLink Precision Hub</p>
              <div className="flex gap-3">
                <Button onClick={handleShare} className="bg-white text-black hover:bg-white/90 font-bold px-8 shadow-lg">
                  <Share2 className="mr-2 h-5 w-5" /> SHARE Mastery
                </Button>
                <Button variant="outline" onClick={onClose} className="border-primary text-primary hover:bg-primary/10">
                  Close
                </Button>
              </div>
            </div>
          </div>

          {/* Right Visual (Official Seal) */}
          <div className="flex flex-col items-center justify-start md:w-1/4 space-y-4">
             <div className="relative w-56 h-56">
               <Image 
                src={placeholderImages.verified_seal.url} 
                alt="LearnLink Human Verified Seal" 
                fill 
                className="object-contain"
               />
             </div>
             <div className="text-center space-y-1 pt-4 border-t-2 border-primary/50 w-full">
                <p className="text-xs font-bold uppercase text-accent tracking-tighter">Verified By</p>
                <p className="text-sm font-bold text-foreground">WILLIAM H,</p>
                <p className="text-xs font-medium text-muted-foreground">LEARNLINK ADVISOR</p>
                <p className="text-xs font-medium text-muted-foreground">(JAKARTA | 2026)</p>
             </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
