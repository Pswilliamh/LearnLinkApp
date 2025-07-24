
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import Image from 'next/image';

interface Infographic {
  title: string;
  description: string;
  imageSrc: string;
  imageHint: string;
}

const infographicData: Infographic[] = [
  {
    title: "Choose Words Wisely: Dislike vs. Hate",
    description: "This infographic explains the important difference between the words 'dislike' and 'hate', and why choosing the right word matters for clear and kind communication.",
    imageSrc: "/images/infographic-dislike-hate.png",
    imageHint: "Educational infographic about word choice dislike versus hate",
  }
  // You can add more infographic objects here in the future
];

export default function InfographicsPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary flex items-center gap-2">
            <Lightbulb className="h-8 w-8" /> Cultural & Educational Infographics
          </CardTitle>
          <CardDescription>
            Learn about important language and cultural nuances through these visual guides.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-10">
        {infographicData.map((infographic) => (
          <Card key={infographic.title} className="shadow-md overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl text-accent">{infographic.title}</CardTitle>
              <CardDescription>{infographic.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-muted/50 rounded-lg p-2 bg-secondary/30">
                <Image
                  src={infographic.imageSrc}
                  alt={infographic.title}
                  data-ai-hint={infographic.imageHint}
                  width={800}
                  height={1200}
                  className="rounded-md w-full h-auto object-contain"
                />
              </div>
            </CardContent>
          </Card>
        ))}
         {infographicData.length === 0 && (
            <Card>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                        No infographics available yet. Check back soon!
                    </p>
                </CardContent>
            </Card>
         )}
      </div>
    </div>
  );
}
