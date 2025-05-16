import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpenText, CaseSensitive, Languages, SpellCheck, Volume2, Rocket } from 'lucide-react';

const navItems = [
  { href: '/alphabet', label: 'Alphabet', icon: SpellCheck },
  { href: '/vocabulary', label: 'Vocabulary', icon: BookOpenText },
  { href: '/sentences', label: 'Sentences', icon: CaseSensitive },
  { href: '/pronunciation', label: 'Pronunciation', icon: Volume2 },
  { href: '/translation', label: 'Translation', icon: Languages },
];

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2 hover:text-accent transition-colors">
          <Rocket className="h-8 w-8 text-accent" />
          <span>LearnLink</span>
        </Link>
        <nav className="flex items-center space-x-2">
          {navItems.map((item) => (
            <Button key={item.label} variant="ghost" asChild className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-accent">
              <Link href={item.href} className="flex items-center gap-2">
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
