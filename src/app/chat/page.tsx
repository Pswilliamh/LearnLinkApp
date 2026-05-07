'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Loader2, User, Bot, Volume2, Sparkles, Languages, RotateCcw } from 'lucide-react';
import { bilingualChat, BilingualChatOutput } from '@/ai/flows/bilingual-chat-flow';
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  englishText?: string;
  bahasaText?: string;
  text?: string; // For user messages
  suggestions?: string[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      englishText: "Hello! I am Guru Bahasa, your 2026 Precision AI Tutor. How can I help you with English today?",
      bahasaText: "Halo! Saya Guru Bahasa, Tutor AI Presisi 2026 Anda. Bagaimana saya bisa membantu Anda belajar Bahasa Inggris hari ini?",
      suggestions: ["How do I say 'Happy Birthday'?", "Explain the word 'Explore'", "Help me with a sentence"]
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSend = async (textOverride?: string) => {
    const query = textOverride || input;
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        text: m.role === 'user' ? (m.text || '') : `${m.englishText}\n${m.bahasaText}`
      }));

      const response: BilingualChatOutput = await bilingualChat({ 
        userQuery: query,
        history 
      });

      const modelMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        englishText: response.englishResponse,
        bahasaText: response.bahasaResponse,
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Chat Error",
        description: "Guru Bahasa is temporarily unavailable. Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string, lang: 'en-US' | 'id-ID' = 'en-US') => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col gap-4">
      <Card className="flex-grow flex flex-col shadow-2xl border-2 border-accent overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="bg-primary text-primary-foreground py-4 flex flex-row items-center justify-between border-b-4 border-accent">
          <div className="flex items-center gap-3">
            <div className="bg-accent p-2 rounded-full">
              <Bot className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl">Guru Bahasa AI Chat</CardTitle>
              <CardDescription className="text-primary-foreground/70 text-xs uppercase tracking-widest font-bold">2026 Precision Tutor</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMessages([messages[0]])} title="Reset Conversation" className="text-white hover:bg-white/10">
            <RotateCcw className="h-5 w-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-grow p-0 overflow-hidden relative">
          <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`mt-1 p-2 rounded-full h-fit ${msg.role === 'user' ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'}`}>
                      {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    
                    <div className="space-y-2">
                      <div className={`p-4 rounded-2xl shadow-md ${msg.role === 'user' ? 'bg-accent text-accent-foreground rounded-tr-none' : 'bg-card border-2 border-primary/20 rounded-tl-none'}`}>
                        {msg.role === 'user' ? (
                          <p className="text-base font-medium">{msg.text}</p>
                        ) : (
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between gap-2 border-b border-primary/10 pb-1 mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">English</span>
                                <Button variant="ghost" size="icon" className="h-5 w-5 opacity-50 hover:opacity-100" onClick={() => speakText(msg.englishText!, 'en-US')}>
                                  <Volume2 className="h-3 w-3" />
                                </Button>
                              </div>
                              <p className="text-foreground leading-relaxed">{msg.englishText}</p>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center justify-between gap-2 border-b border-primary/10 pb-1 mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Bahasa Indonesia</span>
                                <Button variant="ghost" size="icon" className="h-5 w-5 opacity-50 hover:opacity-100" onClick={() => speakText(msg.bahasaText!, 'id-ID')}>
                                  <Volume2 className="h-3 w-3" />
                                </Button>
                              </div>
                              <p className="text-muted-foreground italic leading-relaxed">{msg.bahasaText}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {msg.role === 'model' && msg.suggestions && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {msg.suggestions.map((s, i) => (
                            <Button key={i} variant="outline" size="sm" className="text-[10px] h-auto py-1 px-3 bg-white/50 hover:bg-accent hover:text-accent-foreground" onClick={() => handleSend(s)}>
                              {s}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] flex gap-3">
                    <div className="mt-1 p-2 rounded-full h-fit bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4 animate-pulse" />
                    </div>
                    <div className="p-4 rounded-2xl bg-card border-2 border-primary/20 rounded-tl-none shadow-md">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-accent" />
                        <span className="text-sm text-muted-foreground font-medium italic">Guru Bahasa is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-6 bg-secondary/30 border-t-2 border-primary/10">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="w-full flex gap-3"
          >
            <Input 
              placeholder="Ask anything in English or Bahasa Indonesia..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-grow h-12 bg-card border-2 border-primary/10 focus-visible:ring-accent"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="h-12 w-12 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </CardFooter>
      </Card>
      
      <div className="flex justify-center items-center gap-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-secondary/50 py-2 rounded-lg border border-primary/10">
        <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-accent" /> High-Dimensional Logic</span>
        <span className="flex items-center gap-1"><Languages className="h-3 w-3 text-accent" /> Bilingual Mastery</span>
        <span className="flex items-center gap-1"><Bot className="h-3 w-3 text-accent" /> Guru Bahasa AI</span>
      </div>
    </div>
  );
}
