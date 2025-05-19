
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

interface HowToUseSection {
  title: string;
  englishDescription: string;
  bahasaDescription: string;
}

const sectionsInfo: HowToUseSection[] = [
  {
    title: 'Learn the Alphabet',
    englishDescription: "This section helps you learn all the letters of the English alphabet from A to Z. Click on any letter to hear its pronunciation.",
    bahasaDescription: "Bagian ini membantu Anda mempelajari semua huruf alfabet Inggris dari A hingga Z. Klik huruf mana saja untuk mendengar pengucapannya."
  },
  {
    title: 'Build Your Vocabulary',
    englishDescription: "Build your vocabulary with categorized word lists. Explore topics like travel, animals, and food. Tap a phrase to hear it in English and click 'Show Translation' to see its Bahasa Indonesia equivalent.",
    bahasaDescription: "Perkaya kosakata Anda dengan daftar kata yang dikategorikan. Jelajahi topik seperti perjalanan, hewan, dan makanan. Ketuk frasa untuk mendengarnya dalam bahasa Inggris dan klik 'Tampilkan Terjemahan' untuk melihat padanannya dalam Bahasa Indonesia."
  },
  {
    title: 'Form Sentences',
    englishDescription: "Learn to form sentences correctly. Get AI-powered suggestions for topics you enter, or write your own sentences and receive feedback on spelling and grammar.",
    bahasaDescription: "Belajar membentuk kalimat dengan benar. Dapatkan saran kalimat berbasis AI untuk topik yang Anda masukkan, atau tulis kalimat Anda sendiri dan terima umpan balik tentang ejaan dan tata bahasa."
  },
  {
    title: 'Practice Pronunciation',
    englishDescription: "Improve how you say English words. Listen to common English sounds and example sentences. See words highlighted as they are spoken.",
    bahasaDescription: "Tingkatkan cara Anda mengucapkan kata-kata bahasa Inggris. Dengarkan bunyi umum bahasa Inggris dan contoh kalimat. Lihat kata-kata disorot saat diucapkan."
  },
  {
    title: 'Translate & Understand',
    englishDescription: "Translate text between English and Bahasa Indonesia. Type or paste your text, choose the languages, and get an instant translation.",
    bahasaDescription: "Terjemahkan teks antara bahasa Inggris dan Bahasa Indonesia. Ketik atau tempel teks Anda, pilih bahasa, dan dapatkan terjemahan instan."
  },
  {
    title: 'Identify Objects',
    englishDescription: "Upload a picture to identify objects within it. The AI will tell you the object's name, definition, and example sentences in both English and Bahasa Indonesia.",
    bahasaDescription: "Unggah gambar untuk mengidentifikasi objek di dalamnya. AI akan memberi tahu Anda nama objek, definisi, dan contoh kalimat dalam bahasa Inggris dan Bahasa Indonesia."
  },
  {
    title: 'Word Match Game',
    englishDescription: "Play a fun game to test your vocabulary! Drag the correct English word to its matching picture or emoji cue.",
    bahasaDescription: "Mainkan permainan seru untuk menguji kosakata Anda! Seret kata bahasa Inggris yang benar ke gambar atau emoji yang cocok."
  },
  {
    title: 'Interactive Flipbook',
    englishDescription: "Flip through digital pages to learn new words. Each page shows an item with its picture. Tap the image to hear its name pronounced in English.",
    bahasaDescription: "Balik halaman digital untuk mempelajari kata-kata baru. Setiap halaman menampilkan item beserta gambarnya. Ketuk gambar untuk mendengar namanya diucapkan dalam bahasa Inggris."
  },
  {
    title: 'Advanced Learner',
    englishDescription: "Challenge yourself with more advanced content! This section (password protected) includes dialogue stories, quizzes, and a word explorer for in-depth study.",
    bahasaDescription: "Tantang diri Anda dengan konten yang lebih lanjut! Bagian ini (dilindungi kata sandi) mencakup cerita dialog, kuis, dan penjelajah kata untuk studi mendalam."
  }
];

export default function HowToUsePage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary flex items-center gap-2">
            <HelpCircle className="h-8 w-8" /> How to Use LearnLink
          </CardTitle>
          <CardDescription>
            Welcome to LearnLink! Here’s a guide to help you get the most out of each section.
          </CardDescription>
        </CardHeader>
      </Card>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {sectionsInfo.map((section, index) => (
          <AccordionItem value={`section-${index}`} key={index} className="border bg-card rounded-lg shadow-md">
            <AccordionTrigger className="text-xl hover:text-accent px-6 py-4 text-primary">
              {section.title}
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 pt-0 space-y-3">
              <div className="p-3 border rounded-md bg-secondary shadow-sm">
                <h3 className="font-semibold text-lg text-secondary-foreground mb-1">English Guide:</h3>
                <p className="text-secondary-foreground">{section.englishDescription}</p>
              </div>
              <div className="p-3 border rounded-md bg-secondary shadow-sm">
                <h3 className="font-semibold text-lg text-secondary-foreground mb-1">Panduan Bahasa Indonesia:</h3>
                <p className="text-secondary-foreground">{section.bahasaDescription}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
